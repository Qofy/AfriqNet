import path from "path";
import fs from "fs";
import BetterSqlite3 from "better-sqlite3";

// Use Bun builtin sqlite when available, otherwise fall back to better-sqlite3
let db;

const DB_FILE = process.env.DB_PATH || path.resolve(process.cwd(), "./db/session.db");

// Ensure folder exists
const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

try {
  if (typeof Bun !== "undefined" && Bun?.Database) {
    // Running under Bun; use Bun's Database
    db = new Bun.Database(DB_FILE);
  } else {
    // Node / other: use better-sqlite3
    db = new BetterSqlite3(DB_FILE);
  }
} catch (err) {
  console.error("Failed to initialize sqlite database:", err);
  throw err;
}

// Create tables matching signup/login forms
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

// Optional sample trainings table (keeps parity with earlier example)
db.exec(`
  CREATE TABLE IF NOT EXISTS trainings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    description TEXT
  );
`);

// Seed trainings if empty
try {
  const row = db.prepare("SELECT COUNT(*) as count FROM trainings").get();
  const count = row?.count ?? (row && Object.values(row)[0]) ?? 0;
  if (count === 0) {
    db.exec(`
      INSERT INTO trainings (title, image, description) VALUES
      ('Yoga', '/yoga.jpg', 'A gentle way to improve flexibility and balance.'),
      ('Boxing', '/boxing.jpg', 'A high-energy workout that improves strength and speed.'),
      ('Running', '/running.jpg', 'A great way to improve cardiovascular health and endurance.'),
      ('Weightlifting', '/weightlifting.jpg', 'A strength-building workout that helps tone muscles.'),
      ('Cycling', '/cycling.jpg', 'A low-impact workout that improves cardiovascular health and endurance.'),
      ('Gaming', '/gaming.jpg', 'A fun way to improve hand-eye coordination and reflexes.'),
      ('Sailing', '/sailing.jpg', 'A relaxing way to enjoy the outdoors and improve balance.');
    `);
  }
} catch (err) {
  // ignore seed errors (e.g., permissions or concurrency during dev)
  console.warn("Seed trainings skipped:", err?.message || err);
}

// Helper functions for auth
export function createUser({ name, email, passwordHash }) {
  const now = Date.now();
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(name || null, email, passwordHash, now);
  return { id: info.lastInsertRowid, name, email, created_at: now };
}

export function getUserByEmail(email) {
  const stmt = db.prepare("SELECT id, name, email, password, created_at FROM users WHERE email = ?");
  return stmt.get(email) || null;
}

export function getUserById(id) {
  const stmt = db.prepare("SELECT id, name, email, password, created_at FROM users WHERE id = ?");
  return stmt.get(id) || null;
}

export function createSession({ id, userId, expiresAt }) {
  const now = Date.now();
  const stmt = db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  );
  stmt.run(id, userId, expiresAt, now);
  return { id, userId, expiresAt, created_at: now };
}

export function getSession(id) {
  const stmt = db.prepare("SELECT id, user_id as userId, expires_at as expiresAt, created_at FROM sessions WHERE id = ?");
  return stmt.get(id) || null;
}

export function deleteSession(id) {
  const stmt = db.prepare("DELETE FROM sessions WHERE id = ?");
  return stmt.run(id);
}

export default db;
