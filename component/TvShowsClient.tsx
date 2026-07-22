"use client";

import { useState, useMemo, FC } from "react";
import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
import { Star, SlidersHorizontal } from "lucide-react";
import SearchBar from "@/component/Search";
import MoviesGrid from "@/component/MoviesGrid";
import { useTvShows } from "@/features/contentBrowserSlice";

interface Show {
  id: string | number;
  name?: string;
  genre_ids?: number[];
  [key: string]: unknown;
}

interface Genre {
  id: number;
  name: string;
}

interface TVShowsClientProps {
  initialShows?: Show[];
  genres?: {
    tv: Genre[];
  };
}

const TVShowsClient: FC<TVShowsClientProps> = ({ initialShows = [], genres = { tv: [] } }) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const initialGenre = useMemo(() => {
    const genreParam = searchParams.get("genre");
    return genreParam ? parseInt(genreParam) : null;
  }, [searchParams]);

  const [activeGenre, setActiveGenre] = useState(initialGenre);

  const { data: showsData = [], isLoading, error } = useTvShows(page);
  const shows = showsData.length > 0 ? (showsData as Show[]) : initialShows;
  const errorMessage = error ? (typeof error === 'string' ? error : typeof error === 'object' && error !== null && 'message' in error ? String((error as Record<string, unknown>).message) : 'An error occurred') : null;

  const filtered = shows.filter((show: Show) => {
    const matchesSearch = (show.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesGenre = activeGenre === null || (show.genre_ids || []).includes(activeGenre);
    return matchesSearch && matchesGenre;
  });

  const tvGenres = genres.tv || [];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="bg-var(--background) py-18 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-2">TV Shows</h1>
          <p className="text-[#a2cbf9]">
            {isLoading ? "Loading..." : `${shows.length} shows available`}
          </p>
          {errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}

          <SearchBar value={search} onChange={(v) => setSearch(v)} />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <SlidersHorizontal size={18} className="text-[#a2cbf9] shrink-0" />
          <button
            onClick={() => setActiveGenre(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeGenre === null ? "btn-color text-white" : "bg-[#a2cbf9]/10 text-[#a2cbf9] hover:bg-[#a2cbf9]/20"
            }`}
          >
            All
          </button>
          {tvGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(activeGenre === g.id ? null : g.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeGenre === g.id ? "btn-color text-white" : "bg-[#a2cbf9]/10 text-[#a2cbf9] hover:bg-[#a2cbf9]/20"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        <p className="text-[#a2cbf9] text-sm mb-6">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
          {activeGenre && ` in ${tvGenres.find((g) => g.id === activeGenre)?.name}`}
          {search && ` for "${search}"`}
        </p>

        {isLoading ? (
          <div className="text-center py-24">
            <p className="text-[#a2cbf9] text-lg">Loading shows...</p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <MoviesGrid movies={filtered} />
            {page > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-lg bg-[#006eeb] text-white hover:bg-[#005bc4] transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-[#a2cbf9]">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-lg bg-[#006eeb] text-white hover:bg-[#005bc4] transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <Star size={48} className="text-[#fd536a]/50 mx-auto mb-4" />
            <p className="text-[#a2cbf9] text-lg">No shows found</p>
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
};

export default TVShowsClient;
