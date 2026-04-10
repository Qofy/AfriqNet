"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Tv, Music } from "lucide-react";
import { genres, musicVideoGenres } from "@/component/data/sampleData";

export default function GenresPage() {
  const [activeTab, setActiveTab] = useState("movies");

  const tabs = [
    { id: "movies", label: "Movies", icon: Film },
    { id: "tv", label: "TV Shows", icon: Tv },
    { id: "music", label: "Music Videos", icon: Music },
  ];

  const getGenreList = () => {
    switch (activeTab) {
      case "movies":
        return genres.movie;
      case "tv":
        return genres.tv;
      case "music":
        return musicVideoGenres;
      default:
        return [];
    }
  };

  const getGenreLink = (genreId) => {
    switch (activeTab) {
      case "movies":
        return `/movies?genre=${genreId}`;
      case "tv":
        return `/tvShows?genre=${genreId}`;
      case "music":
        return `/musicVideos?genre=${genreId}`;
      default:
        return "/";
    }
  };

  const genreColors = [
    "from-red-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-indigo-500",
    "from-orange-500 to-yellow-500",
    "from-teal-500 to-blue-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-purple-500",
    "from-cyan-500 to-teal-500",
    "from-yellow-500 to-orange-500",
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Browse by Genre
          </h1>
          <p className="text-gray-400 text-lg">
            Explore content by your favorite genres
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#006eeb] text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {getGenreList().map((genre, index) => (
            <Link
              key={genre.id}
              href={getGenreLink(genre.id)}
              className="group"
            >
              <div
                className={`relative h-32 rounded-lg bg-linear-to-br ${
                  genreColors[index % genreColors.length]
                } overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                
                {/* Genre name */}
                <div className="relative h-full flex items-center justify-center p-4">
                  <h3 className="text-white text-lg md:text-xl font-bold text-center drop-shadow-lg">
                    {genre.name}
                  </h3>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {getGenreList().length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No genres available</p>
          </div>
        )}
      </div>
    </div>
  );
}
