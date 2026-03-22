"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clapperboard, SlidersHorizontal } from "lucide-react";
import SearchBar from "@/component/Search";
import { sampleMovies, genres } from "@/component/data/sampleData";

const movieGenres = genres.movie;

export default function MoviesPage() {
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState(null);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((movie) => (
              <Link
                key={movie.id}
                href={`/detail?id=${movie.id}`}
                className="group cursor-pointer rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-105 block"
              >
                {/* Poster */}
                <div className="relative h-64 bg-linear-to-br from-[#38cff0] to-[#039aec]">
                  {movie.poster ? (
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Clapperboard className="text-white" size={40} />
                    </div>
                  )}
                  {/* Rating badge */}
                  <div className="absolute top-2 right-2 bg-[#006eeb]/90 backdrop-blur-sm rounded px-2 py-0.5 flex items-center gap-1">
                    <Star size={11} color="gold" fill="gold" />
                    <span className="text-white text-xs font-medium">
                      {movie.rating}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-[#a2cbf9] text-xs">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}{" "}
                    · {movie.runtime} min
                  </p>
                  <p className="text-[#a2cbf9]/60 text-xs mt-1 italic line-clamp-1">
                    {movie.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
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
