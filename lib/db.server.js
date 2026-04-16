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

// Create content tables for movies, TV shows, and music videos
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    poster TEXT,
    backdrop TEXT,
    rating REAL,
    release_date TEXT,
    overview TEXT,
    genre_ids TEXT,
    runtime INTEGER,
    tagline TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tv_shows (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    poster TEXT,
    backdrop TEXT,
    rating REAL,
    first_air_date TEXT,
    overview TEXT,
    genre_ids TEXT,
    number_of_seasons INTEGER,
    status TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS music_videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    type TEXT NOT NULL,
    poster TEXT,
    backdrop TEXT,
    rating REAL,
    release_date TEXT,
    overview TEXT,
    genre_ids TEXT,
    duration TEXT,
    views TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS cast_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    character TEXT,
    profile_path TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    rating INTEGER,
    content TEXT,
    created_at TEXT,
    content_id TEXT,
    content_type TEXT
  );
`);

// Seed data if tables are empty
try {
  // Check if movies table is empty
  const movieRow = db.prepare("SELECT COUNT(*) as count FROM movies").get();
  const movieCount = movieRow?.count ?? (movieRow && Object.values(movieRow)[0]) ?? 0;
  
  if (movieCount === 0) {
    // Insert sample movies
    const movieInsert = db.prepare(`
      INSERT INTO movies (id, title, type, poster, backdrop, rating, release_date, overview, genre_ids, runtime, tagline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const movies = [
      ['m1', 'Quantum Nexus', 'Movie', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80', 8.5, '2024-01-15', 'In a world where quantum computing has unlocked parallel dimensions, a brilliant physicist must prevent a catastrophic collision between realities.', '878,53,28', 142, 'Reality is just the beginning'],
      ['m2', 'The Last Horizon', 'Movie', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80', 7.8, '2023-11-20', 'A gripping tale of survival as humanity\'s last spaceship searches for a new home among the stars.', '878,12,18', 156, 'Our journey ends where hope begins'],
      ['m3', 'Shadow Protocol', 'Movie', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80', 8.2, '2024-02-10', 'An elite spy must uncover a global conspiracy before it\'s too late.', '28,53,80', 128, 'Trust no one'],
      ['m4', 'Accra Hustler', 'Action', '/images/accraHustler.png', '/images/accraHustler.png', 9.1, '2023-12-05', 'A masterful exploration of time, memory, and human connection in the bustling streets of Accra.', '18,878,9648', 138, 'Some memories are worth reliving'],
      ['m5', 'King Of Lagos', 'Adventure', '/images/kingOfLagos.png', '/images/kingOfLagos.png', 7.5, '2024-03-22', 'An action-packed adventure through the vibrant streets of Lagos.', '28,12,53', 134, 'Dive into the unknown']
    ];

    movies.forEach(movie => movieInsert.run(...movie));

    // Insert TV shows
    const tvInsert = db.prepare(`
      INSERT INTO tv_shows (id, name, type, poster, backdrop, rating, first_air_date, overview, genre_ids, number_of_seasons, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tvShows = [
      ['tv1', 'Nebula Station', 'tv', 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=500&q=80', 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&q=80', 9.2, '2022-03-15', 'A groundbreaking sci-fi series set on a space station at the edge of explored space.', '10765,18', 3, 'Returning Series'],
      ['tv2', 'Crown of Thorns', 'tv', 'https://images.unsplash.com/photo-1532103054090-3491f1a05d0d?w=500&q=80', 'https://images.unsplash.com/photo-1532103054090-3491f1a05d0d?w=1920&q=80', 8.9, '2021-09-20', 'A historical drama chronicling the rise and fall of a medieval dynasty.', '18,10768', 4, 'Returning Series'],
      ['tv3', 'Detective Bureau', 'tv', 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=500&q=80', 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1920&q=80', 8.5, '2023-01-10', 'A gritty crime procedural following an elite detective unit.', '80,9648,18', 2, 'Returning Series']
    ];

    tvShows.forEach(show => tvInsert.run(...show));

    // Insert music videos
    const musicInsert = db.prepare(`
      INSERT INTO music_videos (id, title, artist, type, poster, backdrop, rating, release_date, overview, genre_ids, duration, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const musicVideos = [
      ['mv1', 'Lagos Nights', 'Wizkid', 'Music Video', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80', 9.2, '2024-03-15', 'An energetic Afrobeats anthem celebrating the vibrant nightlife of Lagos.', '1,9', '3:45', '15.2M'],
      ['mv2', 'African Queen', 'Burna Boy', 'Music Video', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80', 9.5, '2024-02-20', 'A powerful fusion of traditional African sounds and modern production.', '1,8', '4:12', '22.8M'],
      ['mv3', 'Ghana Vibes', 'Sarkodie ft. King Promise', 'Music Video', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80', 8.8, '2024-01-10', 'A celebration of Ghanaian culture with infectious beats.', '2,5', '3:28', '18.5M']
    ];

    musicVideos.forEach(video => musicInsert.run(...video));

    // Insert genres
    const genreInsert = db.prepare(`
      INSERT INTO genres (id, name, type) VALUES (?, ?, ?)
    `);

    const genres = [
      // Movie genres
      [28, 'Action', 'movie'],
      [12, 'Adventure', 'movie'],
      [16, 'Animation', 'movie'],
      [35, 'Comedy', 'movie'],
      [80, 'Crime', 'movie'],
      [99, 'Documentary', 'movie'],
      [18, 'Drama', 'movie'],
      [14, 'Fantasy', 'movie'],
      [27, 'Horror', 'movie'],
      [9648, 'Mystery', 'movie'],
      [10749, 'Romance', 'movie'],
      [878, 'Sci-Fi', 'movie'],
      [53, 'Thriller', 'movie'],
      // TV genres
      [10759, 'Action & Adventure', 'tv'],
      [10765, 'Sci-Fi & Fantasy', 'tv'],
      [10768, 'War & Politics', 'tv'],
      // Music genres
      [1, 'Afrobeats', 'music'],
      [2, 'Hip Hop', 'music'],
      [3, 'R&B', 'music'],
      [4, 'Gospel', 'music'],
      [5, 'Highlife', 'music'],
      [6, 'Amapiano', 'music'],
      [7, 'Dancehall', 'music'],
      [8, 'Reggae', 'music'],
      [9, 'Pop', 'music'],
      [10, 'Soul', 'music']
    ];

    genres.forEach(genre => genreInsert.run(...genre));
  }
} catch (err) {
  console.warn("Seed data skipped:", err?.message || err);
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

// Content helper functions
export function getAllMovies() {
  const stmt = db.prepare(`
    SELECT id, title, type, poster, backdrop, rating, release_date, overview, 
           genre_ids, runtime, tagline FROM movies ORDER BY rating DESC
  `);
  return stmt.all().map(movie => ({
    ...movie,
    genre_ids: movie.genre_ids ? movie.genre_ids.split(',').map(Number) : []
  }));
}

export function getAllTVShows() {
  const stmt = db.prepare(`
    SELECT id, name, type, poster, backdrop, rating, first_air_date, overview, 
           genre_ids, number_of_seasons, status FROM tv_shows ORDER BY rating DESC
  `);
  return stmt.all().map(show => ({
    ...show,
    genre_ids: show.genre_ids ? show.genre_ids.split(',').map(Number) : []
  }));
}

export function getAllMusicVideos() {
  const stmt = db.prepare(`
    SELECT id, title, artist, type, poster, backdrop, rating, release_date, 
           overview, genre_ids, duration, views FROM music_videos ORDER BY rating DESC
  `);
  return stmt.all().map(video => ({
    ...video,
    genre_ids: video.genre_ids ? video.genre_ids.split(',').map(Number) : []
  }));
}

export function getMovieById(id) {
  const stmt = db.prepare(`
    SELECT id, title, type, poster, backdrop, rating, release_date, overview, 
           genre_ids, runtime, tagline FROM movies WHERE id = ?
  `);
  const movie = stmt.get(id);
  if (movie) {
    return {
      ...movie,
      genre_ids: movie.genre_ids ? movie.genre_ids.split(',').map(Number) : []
    };
  }
  return null;
}

export function getTVShowById(id) {
  const stmt = db.prepare(`
    SELECT id, name, type, poster, backdrop, rating, first_air_date, overview, 
           genre_ids, number_of_seasons, status FROM tv_shows WHERE id = ?
  `);
  const show = stmt.get(id);
  if (show) {
    return {
      ...show,
      genre_ids: show.genre_ids ? show.genre_ids.split(',').map(Number) : []
    };
  }
  return null;
}

export function getMusicVideoById(id) {
  const stmt = db.prepare(`
    SELECT id, title, artist, type, poster, backdrop, rating, release_date, 
           overview, genre_ids, duration, views FROM music_videos WHERE id = ?
  `);
  const video = stmt.get(id);
  if (video) {
    return {
      ...video,
      genre_ids: video.genre_ids ? video.genre_ids.split(',').map(Number) : []
    };
  }
  return null;
}

export function getGenresByType(type) {
  const stmt = db.prepare("SELECT id, name FROM genres WHERE type = ? ORDER BY name");
  return stmt.all(type);
}

export function getAllGenres() {
  const stmt = db.prepare("SELECT id, name, type FROM genres ORDER BY type, name");
  return stmt.all();
}

export function searchContent(query, contentType = null) {
  let sql = `
    SELECT 'movie' as content_type, id, title as name, type, poster, backdrop, 
           rating, release_date as date, overview FROM movies 
    WHERE title LIKE ? OR overview LIKE ?
  `;
  
  if (contentType !== 'movie') {
    sql += `
      UNION ALL
      SELECT 'tv' as content_type, id, name, type, poster, backdrop, 
             rating, first_air_date as date, overview FROM tv_shows 
      WHERE name LIKE ? OR overview LIKE ?
    `;
  }
  
  if (contentType !== 'tv') {
    sql += `
      UNION ALL
      SELECT 'music' as content_type, id, title as name, type, poster, backdrop, 
             rating, release_date as date, overview FROM music_videos 
      WHERE title LIKE ? OR artist LIKE ? OR overview LIKE ?
    `;
  }
  
  sql += ` ORDER BY rating DESC LIMIT 20`;
  
  const searchTerm = `%${query}%`;
  let params;
  
  if (contentType === 'movie') {
    params = [searchTerm, searchTerm];
  } else if (contentType === 'tv') {
    params = [searchTerm, searchTerm, searchTerm, searchTerm];
  } else if (contentType === 'music') {
    params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
  } else {
    params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
  }
  
  const stmt = db.prepare(sql);
  return stmt.all(...params);
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
