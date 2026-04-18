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
    profile_image TEXT,
    created_at INTEGER NOT NULL
  );
`);

// Ensure older DBs get the new column if it was added later
try {
  const cols = db.prepare("PRAGMA table_info('users')").all();
  const hasProfile = cols.some(c => c.name === 'profile_image');
  if (!hasProfile) {
    db.exec("ALTER TABLE users ADD COLUMN profile_image TEXT;");
  }
} catch {
  // Non-fatal: PRAGMA may behave differently across runtimes
}

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
      ['m1', "Quantum Nexus", 'Movie', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80', 8.5, '2024-01-15', "In a world where quantum computing has unlocked parallel dimensions, a brilliant physicist must prevent a catastrophic collision between realities.", '878,53,28', 142, 'Reality is just the beginning'],
      ['m2', "The Last Horizon", 'Movie', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80', 7.8, '2023-11-20', "A gripping tale of survival as humanity's last spaceship searches for a new home among the stars.", '878,12,18', 156, 'Our journey ends where hope begins'],
      ['m3', "Shadow Protocol", 'Movie', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80', 8.2, '2024-02-10', "An elite spy must uncover a global conspiracy before it's too late.", '28,53,80', 128, 'Trust no one'],
      ['m4', 'Accra Hustler', 'Action', '/images/accraHustler.png', '/images/accraHustler.png', 9.1, '2023-12-05', 'A masterful exploration of time, memory, and human connection in the bustling streets of Accra.', '18,878,9648', 138, 'Some memories are worth reliving'],
      ['m5', 'King Of Lagos', 'Adventure', '/images/kingOfLagos.png', '/images/kingOfLagos.png', 7.5, '2024-03-22', 'An action-packed adventure through the vibrant streets of Lagos.', '28,12,53', 134, 'Dive into the unknown'],
      ['m6', 'Laughter in Paradise', 'Movie', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80', 7.2, '2023-08-15', 'A hilarious comedy about a dysfunctional family who inherits a tropical resort. Chaos ensues as they try to keep the business afloat while dealing with eccentric guests and their own personal dramas.', '35,10751', 105, 'Family vacations just got complicated'],
      ['m7', 'The Midnight Garden', 'Movie', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80', 8.7, '2023-10-31', 'A haunting and beautiful fantasy where a young girl discovers a magical garden that only appears at midnight. An enchanting tale of wonder, loss, and the power of imagination.', '14,18,10751', 118, 'Magic blooms in the darkness'],
      ['m8', 'Velocity', 'Movie', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80', 7.9, '2024-04-18', 'High-octane racing action meets street-level drama in this adrenaline-fueled ride. A young driver must race against time and rival gangs to save everything he holds dear.', '28,80,53', 122, 'Speed is survival'],
      ['m9', 'Hearts in Harmony', 'Movie', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&q=80', 7.0, '2023-07-14', 'A touching romantic drama about two musicians from different worlds who find love through their shared passion for music. Beautiful performances and an unforgettable soundtrack.', '10749,18,10402', 112, 'Love finds its rhythm'],
      ['m10', 'The Silent Witness', 'Movie', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&q=80', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&q=80', 8.4, '2024-01-28', 'A gripping mystery thriller about a detective who must solve a series of murders with only one witness - who hasn\'t spoken in years. Atmospheric and deeply suspenseful.', '9648,53,80', 145, 'Some secrets refuse to stay buried'],
      ['m11', "Dragon's Peak", 'Movie', 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&q=80', 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=1920&q=80', 8.0, '2023-09-08', "An epic fantasy adventure following a young warrior's quest to find the legendary Dragon's Peak and unite the kingdoms.", '14,12,28', 165, 'Legends awaken'],
      ['m12', 'Code Black', 'Movie', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80', 7.6, '2024-02-25', 'A tech thriller about a cybersecurity expert who uncovers a virus that could bring down the world\'s infrastructure. Tense, timely, and terrifyingly plausible.', '53,80,18', 119, 'The system is compromised'],
      ['m13', 'Summer Nights', 'Movie', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80', 6.8, '2023-06-20', 'A lighthearted coming-of-age story about teenagers spending one unforgettable summer together before going their separate ways. Nostalgic, funny, and surprisingly poignant.', '35,18,10749', 98, 'The best nights are never planned'],
      ['m14', "Titan's Fall", 'Movie', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', 8.8, '2023-11-10', 'A monumental sci-fi epic spanning centuries as humanity faces extinction from an alien force. Visually stunning with profound themes about survival and sacrifice.', '878,28,12', 178, 'The end is just the beginning'],
      ['m15', 'The Art of Deception', 'Movie', 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&q=80', 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920&q=80', 7.7, '2024-03-05', 'A sophisticated heist film about master thieves pulling off an impossible art museum robbery. Clever, stylish, and full of unexpected twists.', '80,53,9648', 130, 'The greatest heist ever told']
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
      ['tv3', 'Detective Bureau', 'tv', 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=500&q=80', 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1920&q=80', 8.5, '2023-01-10', 'A gritty crime procedural following an elite detective unit.', '80,9648,18', 2, 'Returning Series'],
      ['tv4', 'Laugh Track', 'tv', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1920&q=80', 7.8, '2022-08-05', 'A hilarious sitcom about aspiring comedians trying to make it in the cutthroat world of stand-up comedy.', '35', 3, 'Returning Series'],
      ['tv5', 'The Experiment', 'tv', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80', 8.7, '2023-05-12', 'A psychological thriller about participants in a mysterious social experiment.', '9648,10765,18', 2, 'Returning Series'],
      ['tv6', 'Culinary Wars', 'tv', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80', 7.5, '2022-11-18', 'Top chefs compete in culinary challenges that test their skills, creativity, and resilience.', '10764', 4, 'Returning Series'],
      ['tv7', 'Bloodline Legacy', 'tv', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80', 8.3, '2021-10-22', 'A vampire drama that reinvents the genre with fresh mythology and compelling characters.', '10765,18', 3, 'Returning Series'],
      ['tv8', 'Tech Titans', 'tv', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80', 8.0, '2023-02-08', 'A drama about Silicon Valley startups, tech innovation, and the price of success.', '18', 1, 'Returning Series'],
      ['tv9', 'Family Bonds', 'tv', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80', 7.2, '2022-04-15', 'A heartwarming family drama that explores multiple generations navigating life\'s challenges together.', '18,10751', 2, 'Returning Series'],
      ['tv10', 'The Underground', 'tv', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&q=80', 8.6, '2023-06-30', 'A music-driven drama about underground artists fighting for recognition in the hip-hop scene.', '18', 1, 'Returning Series'],
      ['tv11', 'Wildlands', 'tv', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', 8.8, '2022-07-20', "A nature documentary series showcasing Earth's most breathtaking wilderness areas and the animals that inhabit them.", '99', 2, 'Returning Series'],
      ['tv12', 'Lost Signals', 'tv', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80', 8.1, '2023-09-15', 'A sci-fi mystery about strange radio signals from deep space and the team trying to decode them.', '10765,9648', 1, 'Returning Series'],
      ['tv13', 'Comedy Central Stage', 'tv', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80', 7.6, '2022-05-10', 'Stand-up specials from the hottest comedians on the circuit. Fresh voices and bold comedy that pushes boundaries.', '35', 3, 'Returning Series'],
      ['tv14', 'Shadow Games', 'tv', 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&q=80', 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&q=80', 9.0, '2021-11-05', 'An espionage thriller with international intrigue, double-crosses, and high-stakes missions.', '10759,18', 3, 'Returning Series'],
      ['tv15', 'Time Loops', 'tv', 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500&q=80', 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1920&q=80', 8.4, '2023-04-01', 'A sci-fi anthology series exploring different time travel scenarios. Each episode is a standalone story with innovative concepts and emotional depth.', '10765,18', 1, 'Returning Series']
    ];

    tvShows.forEach(show => tvInsert.run(...show));

    // Insert music videos
    const musicInsert = db.prepare(`
      INSERT INTO music_videos (id, title, artist, type, poster, backdrop, rating, release_date, overview, genre_ids, duration, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const musicVideos = [
      ['mv1', 'Lagos Nights', 'Wizkid', 'Music Video', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80', 9.2, '2024-03-15', 'An energetic Afrobeats anthem celebrating the vibrant nightlife of Lagos. Stunning visuals showcase the city\'s culture and energy.', '1,9', '3:45', '15.2M'],
      ['mv2', 'African Queen', 'Burna Boy', 'Music Video', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80', 9.5, '2024-02-20', 'A powerful fusion of traditional African sounds and modern production. The video features breathtaking cinematography across various African landscapes.', '1,8', '4:12', '22.8M'],
      ['mv3', 'Ghana Vibes', 'Sarkodie ft. King Promise', 'Music Video', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80', 8.8, '2024-01-10', 'A celebration of Ghanaian culture with infectious beats and colorful visuals. The collaboration brings together two of Ghana\'s finest artists.', '2,5', '3:28', '18.5M'],
      ['mv4', 'Amapiano Fever', 'DJ Maphorisa & Kabza De Small', 'Music Video', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80', 9.0, '2023-12-28', 'The kings of Amapiano deliver another hit with hypnotic rhythms and smooth production. Shot in the heart of Johannesburg\'s music scene.', '6', '4:35', '25.1M'],
      ['mv5', 'Soulful Journey', 'Asa', 'Music Video', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500&q=80', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=1920&q=80', 8.7, '2024-02-05', 'An intimate and soulful performance that showcases Asa\'s incredible vocal range and emotional depth. Minimalist visuals that let the music speak.', '3,10', '3:52', '12.3M'],
      ['mv6', 'Blessed', 'Nathaniel Bassey', 'Music Video', 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=500&q=80', 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1920&q=80', 9.3, '2024-01-01', 'An uplifting gospel anthem with powerful vocals and inspiring visuals. Perfect for worship and meditation.', '4', '5:20', '30.5M'],
      ['mv7', 'Island Rhythm', 'Stonebwoy', 'Music Video', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80', 8.9, '2023-11-15', 'A reggae-dancehall fusion that brings Caribbean vibes to West Africa. Shot on beautiful tropical beaches with stunning sunset scenes.', '7,8', '3:35', '16.7M'],
      ['mv8', 'Street Symphony', 'Olamide', 'Music Video', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&q=80', 8.6, '2024-03-01', 'Raw and authentic hip-hop from the streets of Lagos. Olamide delivers hard-hitting bars over a trap-influenced beat.', '2', '3:15', '20.2M'],
      ['mv9', 'Love & Light', 'Tiwa Savage', 'Music Video', 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=500&q=80', 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1920&q=80', 9.1, '2024-02-14', 'A romantic R&B ballad with elegant choreography and luxurious visuals. Tiwa Savage at her finest.', '3,9', '4:05', '19.8M'],
      ['mv10', 'Heritage', 'M.anifest', 'Music Video', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80', 8.5, '2023-10-20', 'A thoughtful exploration of African heritage through hip-hop. Features traditional instruments blended with modern production.', '2,5', '4:28', '11.4M']
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
  const stmt = db.prepare("SELECT id, name, email, password, profile_image, created_at FROM users WHERE email = ?");
  const row = stmt.get(email) || null;
  if (!row) return null;
  return {
    ...row,
    profileImage: row.profile_image || null
  };
}

export function getUserById(id) {
  const stmt = db.prepare("SELECT id, name, email, password, profile_image, created_at FROM users WHERE id = ?");
  const row = stmt.get(id) || null;
  if (!row) return null;
  return {
    ...row,
    profileImage: row.profile_image || null
  };
}

export function updateUserProfileImage(userId, url) {
  const stmt = db.prepare("UPDATE users SET profile_image = ? WHERE id = ?");
  const info = stmt.run(url, userId);
  if (info.changes > 0) {
    return getUserById(userId);
  }
  return null;
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
