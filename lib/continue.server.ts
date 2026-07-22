import { getAllMovies } from "./db.server";

interface Movie {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  poster?: string;
  backdrop?: string;
  rating?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  genre_ids?: number[];
  runtime?: number;
  tagline?: string;
  video_stram?: string;
  trailer?: string;
  stream?: string | null;
  [key: string]: unknown;
}

interface WatchingItem {
  id: string;
  title: string | undefined;
  backdrop: string;
  progress: number;
  year: number | undefined;
  timeLeft: string;
}

// Build lists from DB-backed movies. Server-only module.
export function getContinueWatchingList(): WatchingItem[] {
  const _movies = getAllMovies();
  const defaultProgress = [65, 30, 80, 15];
  const defaultTimeLeft = ["45 min", "1h 50min", "20 min", "2h 5min"];

  return _movies.slice(0, 4).map((m, i) => {
    const yearStr = ((m.release_date as string) || (m.first_air_date as string) || "").split("-")[0];
    const year = yearStr ? parseInt(yearStr, 10) : undefined;

    return {
      id: `cw${i + 1}`,
      title: (m.title as string | undefined) || (m.name as string | undefined),
      backdrop: (m.backdrop as string) || (m.poster as string) || "",
      progress: defaultProgress[i] ?? Math.min(95, Math.max(5, Math.floor(((m.rating as number) || 5) * 10))),
      year,
      timeLeft: defaultTimeLeft[i] || "45 min"
    };
  });
}

export function getTrendingMovies(limit: number = 6): Movie[] {
  return getAllMovies().slice(0, limit) as Movie[];
}

export function getActionMovies(limit: number = 6): Movie[] {
  return getAllMovies().filter(m => ((m.genre_ids as number[]) || []).includes(28)).slice(0, limit) as Movie[];
}

export function getSciFiMovies(limit: number = 6): Movie[] {
  return getAllMovies().filter(m => ((m.genre_ids as number[]) || []).includes(878)).slice(0, limit) as Movie[];
}

export function getNewReleases(): Movie[] {
  return getAllMovies().slice(10, 16) as Movie[];
}
