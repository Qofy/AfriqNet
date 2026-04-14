"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Clapperboard, SlidersHorizontal } from "lucide-react";
import SearchBar from "@/component/Search";
import { sampleMovies, genres } from "@/component/data/sampleData";
import MoviesGrid from "@/component/MoviesGrid";

const movieGenres = genres.movie;

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  
  // Get initial genre from URL query parameter
  const initialGenre = useMemo(() => {
    const genreParam = searchParams.get('genre');
    return genreParam ? parseInt(genreParam) : null;
  }, [searchParams]);
  
  const [activeGenre, setActiveGenre] = useState(initialGenre);

  const filtered = sampleMovies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesGenre =
      activeGenre === null || movie.genre_ids.includes(activeGenre);
    return matchesSearch && matchesGenre;
  });


  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Page Header */}
      <div className="bg-var(--background) py-18 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
          <p className="text-[#a2cbf9]">
            {sampleMovies.length} titles available
          </p>

          {/* Search */}
          <SearchBar value={search} onChange={(v) => setSearch(v)} />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Genre Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <SlidersHorizontal size={18} className="text-[#a2cbf9] shrink-0" />
          <button
            onClick={() => setActiveGenre(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeGenre === null
                ? "btn-color text-white"
                : "bg-[#a2cbf9]/10 text-[#a2cbf9] hover:bg-[#a2cbf9]/20"
            }`}
          >
            All
          </button>
          {movieGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(activeGenre === g.id ? null : g.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeGenre === g.id
                  ? "btn-color text-white"
                  : "bg-[#a2cbf9]/10 text-[#a2cbf9] hover:bg-[#a2cbf9]/20"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-[#a2cbf9] text-sm mb-6">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
          {activeGenre &&
            ` in ${movieGenres.find((g) => g.id === activeGenre)?.name}`}
          {search && ` for "${search}"`}
        </p>

        {/* Movie Grid */}
        {filtered.length > 0 ? (
          <MoviesGrid movies={filtered} />
        ) : (
          <div className="text-center py-24">
            <Clapperboard size={48} className="text-[#fd536a]/50 mx-auto mb-4" />
            <p className="text-[#a2cbf9] text-lg">No movies found</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveGenre(null);
              }}
              className="mt-4 text-[#006eeb] hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
