import TVShowsClient from "../../../component/TvShowsClient";
import { getAllGenres, getAllTVShows } from "../../../lib/db.server";

export default function TvShowsPage() {
  const genresRows = getAllGenres();
  if (!genresRows) {
    throw new Error("Something went wrong, unable to load genres");
  }

  const genres = genresRows.reduce((acc, g) => {
    const t = g.type || "tv";
    if (!acc[t]) acc[t] = [];
    acc[t].push({ id: g.id, name: g.name });
    return acc;
  }, { movie: [], tv: [], music: [] });

  const shows = getAllTVShows();
  if (!shows) {
    throw new Error("Loading TV shows failed. Please try again later.");
  }

  return <TVShowsClient initialShows={shows} genres={genres} />;
}