import MoviesClient from "@/component/MoviesClient";
import { getAllGenres, getAllMovies } from "../../../lib/db.server";

export default function MoviesPage() {
  const genresRows = getAllGenres();
  if (!genresRows) {
    throw new Error("Something went wrong, unable to load genres");
  }

  // Transform genres rows into grouped object
  const genres = genresRows.reduce(
    (acc, g) => {
      const t = g.type || "movie";
      if (!acc[t]) acc[t] = [];
      acc[t].push({ id: g.id, name: g.name });
      return acc;
    },
    { movie: [], tv: [], music: [] }
  );

  const movies = getAllMovies();
  if (!movies) {
    throw new Error("Loading movies failed. Please try again later.");
  }

  return <MoviesClient initialMovies={movies} genres={genres} />;
}
