"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Search from "@/component/Search";
import MoviesGrid from "@/component/MoviesGrid";
import { sampleMusicVideos, musicVideoGenres } from "@/component/data/sampleData";

export default function MusicVideosPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get initial genre from URL query parameter
  const initialGenre = useMemo(() => {
    const genreParam = searchParams.get('genre');
    return genreParam || "all";
  }, [searchParams]);
  
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);

  // Filter music videos based on search and genre
  const filteredVideos = sampleMusicVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || video.genre_ids.includes(parseInt(selectedGenre));
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Music Videos
          </h1>
          <p className="text-gray-400 text-lg">
            Discover the hottest African music videos
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Genre Filter */}
        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedGenre("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedGenre === "all"
                ? "btn-color text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All Genres
          </button>
          {musicVideoGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id.toString())}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedGenre === genre.id.toString()
                  ? "btn-color text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-400">
            {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"} found
          </p>
        </div>

        {/* Music Videos Grid */}
        {filteredVideos.length > 0 ? (
          <MoviesGrid movies={filteredVideos} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-2">No music videos found</p>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
