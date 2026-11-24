/**
 * Post-build SEO/hosting files.
 *
 *   SITE_URL=https://desidraft.com npm run build
 *
 * With an origin set, this absolutises the Open Graph image and URL, adds the
 * canonical link to dist/index.html, and writes robots.txt + sitemap.xml for
 * every real route. Without one it still writes robots.txt, but leaves the
 * canonical out and skips the sitemap: a canonical or Sitemap: line pointing at
 * a domain nobody owns is worse than none at all.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const raw = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').trim();
const origin = raw ? raw.replace(/\/+$/, '') : '';

const source = await fs.readFile(path.resolve('src/data/portfolio.ts'), 'utf8');
const slugs = [...source.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
const routes = ['/', '/work', ...slugs.map((slug) => `/work/${slug}`)];

if (origin) {
  let html = await fs.readFile(indexPath, 'utf8');
  html = html
    .replace(
      /<meta property="og:image" content="(\/[^"]+)"/,
      (_m, src) => `<meta property="og:image" content="${origin}${src}"`
    )
    .replace(
      /<meta name="twitter:image" content="(\/[^"]+)"/,
      (_m, src) => `<meta name="twitter:image" content="${origin}${src}"`
    );

  const canonical = `    <link rel="canonical" href="${origin}/" />\n`;
  if (!html.includes('rel="canonical"')) html = html.replace('</head>', `${canonical}  </head>`);
  html = html.replace('</head>', `    <meta property="og:url" content="${origin}/" />\n  </head>`);
  await fs.writeFile(indexPath, html);

  const urls = routes
    .map((route) => `  <url>\n    <loc>${origin}${route}</loc>\n  </url>`)
    .join('\n');
  await fs.writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
}

await fs.writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`
);

console.log(
  origin
    ? `seo: canonical + sitemap for ${origin} (${routes.length} routes), robots.txt written`
    : 'seo: no SITE_URL set — canonical and sitemap skipped, robots.txt written'
);
