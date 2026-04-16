import { getAllMovies } from "./db.server";

// Build lists from DB-backed movies. Server-only module.
export function getContinueWatchingList() {
  const _movies = getAllMovies();
  const defaultProgress = [65, 30, 80, 15];
  const defaultTimeLeft = ["45 min", "1h 50min", "20 min", "2h 5min"];

  return _movies.slice(0, 4).map((m, i) => ({
    id: `cw${i + 1}`,
    title: m.title || m.name,
    backdrop: m.backdrop || m.poster || "",
    progress: defaultProgress[i] ?? Math.min(95, Math.max(5, Math.floor((m.rating || 5) * 10))),
    year: (m.release_date || m.first_air_date || "").split("-")[0] || null,
    timeLeft: defaultTimeLeft[i] || "45 min"
  }));
}

export function getTrendingMovies(limit = 6) {
  return getAllMovies().slice(0, limit);
}

export function getActionMovies(limit = 6) {
  return getAllMovies().filter(m => (m.genre_ids || []).includes(28)).slice(0, limit);
}

export function getSciFiMovies(limit = 6) {
  return getAllMovies().filter(m => (m.genre_ids || []).includes(878)).slice(0, limit);
}

export function getNewReleases() {
  return getAllMovies().slice(10, 16);
}
