/**
 * Enquiry storage — one SQLite file, no server to install.
 *
 * `node:sqlite` ships with Node, so the studio's inbox is a real database
 * without adding a dependency or a hosted service. The file lives in
 * `server/data/` and is gitignored: enquiries are people's names and email
 * addresses, never something to commit.
 */

import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const file = process.env.ENQUIRY_DB
  ? resolve(process.cwd(), process.env.ENQUIRY_DB)
  : resolve(here, 'data/enquiries.db');

mkdirSync(dirname(file), { recursive: true });

const db = new DatabaseSync(file);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 4000;

  CREATE TABLE IF NOT EXISTS enquiries (
    id          TEXT PRIMARY KEY,
    created_at  TEXT NOT NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    project     TEXT NOT NULL,
    timeline    TEXT,
    message     TEXT NOT NULL,
    source      TEXT,
    user_agent  TEXT,
    status      TEXT NOT NULL DEFAULT 'new'
  );

  CREATE INDEX IF NOT EXISTS enquiries_created_at
    ON enquiries (created_at DESC);
`);

const insert = db.prepare(`
  INSERT INTO enquiries
    (id, created_at, name, email, project, timeline, message, source, user_agent)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const list = db.prepare(`
  SELECT id, created_at, name, email, project, timeline, message, source, status
  FROM enquiries
  ORDER BY created_at DESC
  LIMIT ?
`);

export const storagePath = file;

export function addEnquiry(record) {
  insert.run(
    record.id,
    record.createdAt,
    record.name,
    record.email,
    record.project,
    record.timeline,
    record.message,
    record.source,
    record.userAgent
  );
  return record.id;
}

export function listEnquiries(limit = 100) {
  return list.all(limit);
}

export function closeStore() {
  try {
    db.close();
  } catch {
    /* already closed */
  }
}
