import TVShowsClient from "../../../component/TvShowsClient";
import { getAllGenres, getAllTVShows } from "../../../lib/db.server";

interface Genre {
  id: number;
  name: string;
}

interface GenresMap {
  movie: Genre[];
  tv: Genre[];
  music: Genre[];
}

export default function TvShowsPage() {
  const genresRows = getAllGenres();
  if (!genresRows) {
    throw new Error("Something went wrong, unable to load genres");
  }

  const genres = genresRows.reduce<GenresMap>(
    (acc, g) => {
      const t = (g.type || "tv") as keyof GenresMap;
      if (!acc[t]) acc[t] = [];
      acc[t].push({
        id: typeof g.id === 'number' ? g.id : parseInt(String(g.id), 10),
        name: String(g.name)
      });
      return acc;
    },
    { movie: [], tv: [], music: [] }
  );

  const shows = getAllTVShows();
  if (!shows) {
    throw new Error("Loading TV shows failed. Please try again later.");
  }

  return <TVShowsClient initialShows={shows} genres={{ tv: genres.tv }} />;
}