import MusicVideosClient from "@/component/MusicVideosClient";
import { getAllGenres, getAllMusicVideos } from "../../../lib/db.server";

export default function MusicVideosPage() {
  const genresRows = getAllGenres();
  if (!genresRows) {
    throw new Error("Something went wrong, unable to load genres");
  }

  // Transform genres rows into grouped object
  const genres = genresRows.reduce(
    (acc, g) => {
      const t = g.type || "music";
      if (!acc[t]) acc[t] = [];
      acc[t].push({ id: g.id, name: g.name });
      return acc;
    },
    { movie: [], tv: [], music: [] }
  );

  const videos = getAllMusicVideos();
  if (!videos) {
    throw new Error("Loading music videos failed. Please try again later.");
  }

  return <MusicVideosClient initialVideos={videos} genres={genres} />;
}
