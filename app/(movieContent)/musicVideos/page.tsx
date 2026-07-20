import MusicVideosClient from "@/component/MusicVideosClient";
import { getAllGenres, getAllMusicVideos } from "../../../lib/db.server";

interface Genre {
  id: number;
  name: string;
}

interface GenresMap {
  movie: Genre[];
  tv: Genre[];
  music: Genre[];
}

export default function MusicVideosPage() {
  const genresRows = getAllGenres();
  if (!genresRows) {
    throw new Error("Something went wrong, unable to load genres");
  }

  // Transform genres rows into grouped object
  const genres = genresRows.reduce<GenresMap>(
    (acc, g) => {
      const t = (g.type || "music") as keyof GenresMap;
      if (!acc[t]) acc[t] = [];
      acc[t].push({
        id: typeof g.id === 'number' ? g.id : parseInt(String(g.id), 10),
        name: String(g.name)
      });
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
