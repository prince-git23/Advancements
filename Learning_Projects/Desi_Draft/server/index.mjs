/**
 * Desi Draft — enquiry backend.
 *
 * A single Node HTTP service, no dependencies:
 *
 *   POST /api/enquiries   the public contact form posts here
 *   GET  /api/enquiries   the studio's inbox (Bearer ENQUIRY_ADMIN_TOKEN)
 *   GET  /api/health      liveness + where enquiries are stored
 *
 * It also serves `dist/` when a build exists, so one process can run the whole
 * site in production. In development Vite proxies /api here (see vite.config.ts).
 *
 * Rules that matter: the form is same-origin only, the body is capped, every
 * field is validated and trimmed, a honeypot silently absorbs bots, and one
 * address cannot flood the inbox. Nothing is ever echoed back unescaped — the
 * response is JSON status, and React prints the text it already holds.
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { addEnquiry, listEnquiries, storagePath, closeStore } from './db.mjs';
import { notifyWebhook } from './notify.mjs';

const PORT = Number(process.env.PORT) || 8787;
const HOST = process.env.HOST || '127.0.0.1';
const DIST = resolve(process.cwd(), 'dist');
const BODY_LIMIT = 32 * 1024;

/** Six enquiries per address per fifteen minutes. */
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 6;
const hits = new Map();

const PROJECTS = new Set([
  'content production',
  'creative strategy',
  'digital experiences',
  'visual communication',
  'creative spaces',
  'something else',
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const json = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolveBody, rejectBody) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > BODY_LIMIT) {
        rejectBody(Object.assign(new Error('too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')));
    req.on('error', rejectBody);
  });

const clean = (value, max) =>
  typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0, max) : '';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body) {
  const name = clean(body.name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const rawProject = clean(body.project, 40).toLowerCase();
  const project = PROJECTS.has(rawProject) ? rawProject : 'something else';
  const timeline = clean(body.timeline, 80);
  const message = clean(body.message, 4000);
  const source = clean(body.source, 120);

  const fields = {};
  if (name.length < 2) fields.name = 'Please add your name.';
  if (!EMAIL.test(email)) fields.email = 'That email address does not look right.';
  if (message.length < 10) fields.message = 'Tell us a little more — at least a sentence.';

  return { fields, values: { name, email, project, timeline, message, source } };
}

function rateLimited(ip) {
  const now = Date.now();
  if (hits.size > 500) {
    for (const [key, entry] of hits) if (entry.reset < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  // No Origin header: a native form post or curl. The host check plus the
  // honeypot still applies; browsers always send the Origin on fetch POSTs.
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function authorised(req) {
  const expected = process.env.ENQUIRY_ADMIN_TOKEN;
  if (!expected) return 'unconfigured';
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return 'denied';
  return timingSafeEqual(a, b) ? 'ok' : 'denied';
}

function clientIp(req) {
  return req.socket.remoteAddress ?? 'unknown';
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/health') {
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'method not allowed' });
    return json(res, 200, {
      ok: true,
      storage: storagePath,
      webhook: Boolean(process.env.ENQUIRY_WEBHOOK_URL),
      admin: Boolean(process.env.ENQUIRY_ADMIN_TOKEN),
    });
  }

  if (pathname !== '/api/enquiries') return json(res, 404, { error: 'not found' });

  if (req.method === 'POST') {
    if (!sameOrigin(req)) return json(res, 403, { error: 'cross-origin request refused' });
    if (rateLimited(clientIp(req))) {
      return json(res, 429, { error: 'Too many messages from this connection. Try again shortly.' });
    }

    let body;
    try {
      const raw = await readBody(req);
      body = raw ? JSON.parse(raw) : {};
    } catch (error) {
      const status = error && error.status === 413 ? 413 : 400;
      return json(res, status, { error: status === 413 ? 'That message is too long.' : 'invalid JSON' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json(res, 400, { error: 'invalid body' });
    }

    // A bot fills every field it finds. This one is hidden from people.
    if (clean(body.website, 200)) {
      return json(res, 201, { ok: true, id: randomUUID() });
    }

    const { fields, values } = validate(body);
    if (Object.keys(fields).length) return json(res, 400, { error: 'Please check the form.', fields });

    const record = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...values,
      userAgent: clean(req.headers['user-agent'], 200),
    };

    addEnquiry(record);
    void notifyWebhook(record).then((result) => {
      if (!result.sent && result.reason) console.log(`[enquiry] webhook skipped: ${result.reason}`);
    });

    return json(res, 201, { ok: true, id: record.id });
  }

  if (req.method === 'GET') {
    const access = authorised(req);
    if (access === 'unconfigured') {
      return json(res, 503, { error: 'Admin access is not configured (ENQUIRY_ADMIN_TOKEN).' });
    }
    if (access !== 'ok') return json(res, 401, { error: 'unauthorised' });
    return json(res, 200, { enquiries: listEnquiries(100) });
  }

  return json(res, 405, { error: 'method not allowed' });
}

function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return json(res, 405, { error: 'method not allowed' });
  }
  if (!existsSync(join(DIST, 'index.html'))) {
    return json(res, 404, { error: 'No build found. Run `npm run build`, or use `npm run dev` for Vite.' });
  }

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return json(res, 400, { error: 'bad path' });
  }

  let file = resolve(DIST, `.${decoded}`);
  if (file !== DIST && !file.startsWith(DIST + sep)) return json(res, 403, { error: 'forbidden' });

  if (!existsSync(file) || statSync(file).isDirectory()) {
    // A missing asset stays a 404; a missing page falls back to the SPA shell.
    if (extname(decoded)) return json(res, 404, { error: 'not found' });
    file = join(DIST, 'index.html');
  }

  const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
  const asset = decoded.startsWith('/assets/');
  res.writeHead(200, {
    'content-type': type,
    'content-length': statSync(file).size,
    'cache-control': asset ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  const started = Date.now();
  let pathname = '/';
  try {
    pathname = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`).pathname;
  } catch {
    return json(res, 400, { error: 'bad request' });
  }

  try {
    if (pathname.startsWith('/api/') || pathname === '/api') {
      await handleApi(req, res, pathname);
      console.log(`${req.method} ${pathname} ${res.statusCode} ${Date.now() - started}ms`);
    } else {
      serveStatic(req, res, pathname);
    }
  } catch (error) {
    console.error('[server]', error instanceof Error ? error.message : error);
    if (!res.headersSent) json(res, 500, { error: 'Something went wrong. Please email us instead.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`enquiry backend · http://${HOST}:${PORT}`);
  console.log(`storage · ${storagePath}`);
  console.log(
    `notifications · ${process.env.ENQUIRY_WEBHOOK_URL ? 'webhook configured' : 'saved only (no ENQUIRY_WEBHOOK_URL)'}`
  );
  console.log(
    `inbox · ${process.env.ENQUIRY_ADMIN_TOKEN ? 'GET /api/enquiries with your token' : 'set ENQUIRY_ADMIN_TOKEN to read /api/enquiries'}`
  );
});

const shutdown = () => {
  server.close(() => {
    closeStore();
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 3000).unref();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
