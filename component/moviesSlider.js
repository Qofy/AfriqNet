"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Info, Star } from "lucide-react";
import { sampleMovies } from "@/component/data/sampleData";

export default function MovieSlider({ movies = sampleMovies }) {
  const [currentIndex, setCurrentIndex] = useState(() => 
    movies.length > 0 ? Math.floor(Math.random() * movies.length) : 0
  );
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [fade, setFade] = useState(true);

  // Get random movie from the array
  const getRandomIndex = useCallback((excludeIndex) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * movies.length);
    } while (randomIndex === excludeIndex && movies.length > 1);
    return randomIndex;
  }, [movies.length]);

  // Auto-play with random selection every 10 seconds
  useEffect(() => {
    if (!isAutoPlay || movies.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => getRandomIndex(prev));
        setFade(true);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlay, movies.length, getRandomIndex]);

  const goToNext = () => {
    setIsAutoPlay(false);
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => getRandomIndex(prev));
      setFade(true);
    }, 300);
  };

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => getRandomIndex(prev));
      setFade(true);
    }, 300);
  };

  const goToSlide = (index) => {
    setIsAutoPlay(false);
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300);
  };

  if (movies.length === 0) {
    return (
      <div className="relative w-full h-125 md:h-150 bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <p className="text-white text-xl">No movies available</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-200  md:h-190 overflow-hidden group">
      {/* Background Image with Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentMovie?.backdrop || currentMovie?.poster ? (
          <>
            <Image
              src={currentMovie.backdrop || currentMovie.poster}
              alt={currentMovie.title || "Movie backdrop"}
              fill
              priority
              className="object-cover object-center"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#38cff0] to-[#039aec]"></div>
        )}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div
            className={`max-w-2xl transition-all duration-500 ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {currentMovie?.title || "Untitled"}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-white/90">
              {currentMovie?.rating && (
                <div className="flex items-center gap-1">
                  <Star size={16} fill="gold" color="gold" />
                  <span className="font-semibold">{currentMovie.rating}</span>
                </div>
              )}
              {currentMovie?.release_date && (
                <span>{new Date(currentMovie.release_date).getFullYear()}</span>
              )}
              {currentMovie?.runtime && <span>{currentMovie.runtime} min</span>}
            </div>

            {/* Tagline */}
            {currentMovie?.tagline && (
              <p className="text-xl text-white/80 italic mb-4">
                &ldquo;{currentMovie.tagline}&rdquo;
              </p>
            )}

            {/* Overview */}
            {currentMovie?.overview && (
              <p className="text-white/90 text-lg mb-6 line-clamp-3 leading-relaxed">
                {currentMovie.overview}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="btn-color btn-hover text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105">
                <Play size={20} fill="white" />
                Play Now
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all">
                <Info size={20} />
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.slice(0, Math.min(movies.length, 10)).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentIndex
                ? "w-8 h-2 btn-color"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Auto-play indicator */}
      <div className="absolute top-160 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm transition-all"
        >
          {isAutoPlay ? "Auto-play ON" : "Auto-play OFF"}
        </button>
      </div>
    </div>

  );
}
