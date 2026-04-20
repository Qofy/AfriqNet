"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Info, Star } from "lucide-react";
import { sampleMovies } from "@/component/data/sampleData";
import PlayButton from "./PlayButton.client";
export default function MovieSlider({ movies = sampleMovies }) {
  // Use a deterministic initial index for SSR (avoids hydration mismatch).
  // Pick a random slide only on the client after mount.
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // On client mount, choose a random initial slide once to avoid
  // server/client markup differences that cause hydration errors.
  useEffect(() => {
    if (movies.length === 0) return;
    // Choose a random index different from the current (0) when possible
    const idx = getRandomIndex(currentIndex);
    if (idx !== currentIndex) setCurrentIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="relative w-full h-100 md:h-250 overflow-hidden group">
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
              sizes="20"
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
      <div className="relative h-100 md:h-220 flex items-center mt-8 md:mt-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div
            className={`max-w-2xl md:max-w-3xl lg:max-w-4xl transition-all duration-500 ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 drop-shadow-lg">
              {currentMovie?.title || "Untitled"}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-2 mb-2 text-white/90 text-sm md:text-base">
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
              <p className="text-lg md:text-2xl text-white/80 italic mb-2">
                &ldquo;{currentMovie.tagline}&rdquo;
              </p>
            )}

            {/* Overview */}
            {currentMovie?.overview && (
              <p className="text-white/90 text-base md:text-lg lg:text-xl mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                {currentMovie.overview}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-row flex-wrap gap-3 items-center justify-start">
              <PlayButton
                movieId={currentMovie?.id}
                className="btn-color btn-hover text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center gap-2 justify-center transition-all transform hover:scale-105 text-base md:text-lg"
              />
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center gap-2 justify-center transition-all">
                <Info size={18} />
                <span className="text-base md:text-lg">More Info</span>
              </button>

              {/* Autoplay toggle (inline, visible on all sizes) */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                aria-label="Toggle autoplay"
                title={isAutoPlay ? 'Autoplay on' : 'Autoplay off'}
                className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-white transition-colors ${isAutoPlay ? 'bg-green-500' : 'bg-black/50 hover:bg-black/70'} md:ml-2`}
              >
                <Play size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="hidden md:block md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 md:bg-black/50 md:hover:bg-black/70 md:text-white md:p-3 md:rounded-full md:transition-all md:opacity-0 md:group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="hidden md:block md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 md:bg-black/50 md:hover:bg-black/70 md:text-white md:p-3 md:rounded-full md:transition-all md:opacity-0 md:group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* mobile autoplay toggle was moved inline with action buttons */}

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
    </div>

  );
}
