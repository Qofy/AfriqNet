  import { getAllMovies } from "@/lib/db.server";

  // Use the DB-backed movies list to build demo lists used in the UI.
  const _movies = getAllMovies();

  // Build a small continue-watching list from the top movies (deterministic values)
  const defaultProgress = [65, 30, 80, 15];
  const defaultTimeLeft = ["45 min", "1h 50min", "20 min", "2h 5min"];

  export const continueWatchingList = _movies.slice(0, 4).map((m, i) => ({
    id: `cw${i + 1}`,
    title: m.title || m.name,
    backdrop: m.backdrop || m.poster || "",
    progress: defaultProgress[i] ?? Math.min(95, Math.max(5, Math.floor((m.rating || 5) * 10))),
    year: (m.release_date || m.first_air_date || "").split("-")[0] || null,
    timeLeft: defaultTimeLeft[i] || "45 min"
  }));

  // Get different categories
  export const trendingMovies = _movies.slice(0, 6);
  export const actionMovies = _movies.filter(m => (m.genre_ids || []).includes(28)).slice(0, 6);
  export const sciFiMovies = _movies.filter(m => (m.genre_ids || []).includes(878)).slice(0, 6);
  export const newReleases = _movies.slice(10, 16);
