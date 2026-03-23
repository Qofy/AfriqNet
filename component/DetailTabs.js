"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export default function DetailTabs({ movie, episodes = [], cast = [] }) {
  const [active, setActive] = useState("overview");

  return (
    <div>
      <div className="border-b border-white/10 mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActive("overview")}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              active === "overview" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            Overview
            {active === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 btn-color"></div>
            )}
          </button>

          <button
            onClick={() => setActive("episodes")}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              active === "episodes" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            Episodes
            {active === "episodes" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 btn-color"></div>
            )}
          </button>

          <button
            onClick={() => setActive("cast")}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              active === "cast" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            Cast & Crew
            {active === "cast" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 btn-color"></div>
            )}
          </button>
        </div>
      </div>

      <div>
        {active === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-white/80 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre_ids && movie.genre_ids.map((id, index) => (
                  <span key={index} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors">
                    Genre {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === "episodes" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Episodes - Season 1</h2>
            <div className="space-y-4">
              {episodes.map((ep) => (
                <div key={ep.id} className="flex gap-4 bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all group">
                  <div className="relative w-40 h-24 shrink-0 rounded overflow-hidden">
                    <Image src={ep.thumbnail} alt={ep.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={32} fill="white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{`S${ep.season}E${ep.episode} · ${ep.title}`}</h3>
                        <p className="text-white/60 text-sm">{ep.duration}</p>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2">{ep.description || 'No description available.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "cast" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cast.map((person) => (
                <div key={person.id} className="text-center group cursor-pointer">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 bg-white/10">
                    <Image src={person.image} alt={person.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-semibold text-white">{person.name}</h3>
                  <p className="text-white/60 text-sm">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
