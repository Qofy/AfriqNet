"use client";

import { useState, useRef, useEffect, FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clapperboard } from "lucide-react";

interface Movie {
  id: string | number;
  title?: string;
  name?: string;
  poster?: string;
  trailer?: string;
  stream?: string | null;
  rating?: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  tagline?: string;
  overview?: string;
  [key: string]: unknown;
}

interface MovieGridCardProps {
  movie: Movie;
}

const MovieGridCard: FC<MovieGridCardProps> = ({ movie }) => {
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (movie.trailer || movie.stream) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowVideo(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (showVideo && video) {
      video.play().catch(() => {});
    } else if (!showVideo && video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [showVideo]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const videoSrc = movie.trailer || movie.stream;

  return (
    <Link
      href={`/detail?id=${movie.id}`}
      className="group cursor-pointer rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-105 block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster */}
      <div className="relative h-64 bg-black">
        {/* Poster Image */}
        {movie.poster && !showVideo && (
          <Image
            src={movie.poster}
            alt={movie.title || movie.name || "Movie"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover object-center"
          />
        )}

        {/* Video (trailer or stream) */}
        {showVideo && videoSrc && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Fallback */}
        {!movie.poster && !showVideo && (
          <div className="flex items-center justify-center h-full">
            <Clapperboard className="text-white" size={40} />
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-[#006eeb]/90 backdrop-blur-sm rounded px-2 py-0.5 flex items-center gap-1 z-10">
          <Star size={11} color="gold" fill="gold" />
          <span className="text-white text-xs font-medium">{movie.rating}</span>
        </div>

        {/* Video indicator */}
        {videoSrc && (
          <div className="absolute bottom-2 left-2 bg-red-600/90 backdrop-blur-sm rounded px-2 py-0.5 z-10">
            {/* <span className="text-white text-xs font-bold">
              {movie.trailer ? 'TRAILER' : 'STREAM'}
            </span> */}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
          {movie.title || movie.name}
        </h3>
        <p className="text-[#a2cbf9] text-xs">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : movie.first_air_date
            ? new Date(movie.first_air_date).getFullYear()
            : "N/A"} {" "}
          · {movie.runtime || movie.number_of_seasons || "-"} {movie.runtime ? "min" : "seasons"}
        </p>
        <p className="text-[#a2cbf9]/60 text-xs mt-1 italic line-clamp-1">
          {movie.tagline || movie.overview}
        </p>
      </div>
    </Link>
  );
};

interface MoviesGridProps {
  movies?: Movie[];
}

const MoviesGrid: FC<MoviesGridProps> = ({ movies = [] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {movies.map((movie) => (
        <MovieGridCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MoviesGrid;
