"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, Plus, Info } from "lucide-react";

export default function MovieCardWithTrailer({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (movie.trailer) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowTrailer(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowTrailer(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (showTrailer && video) {
      video.play().catch(() => {
        // Autoplay failed, silently ignore
      });
    } else if (!showTrailer && video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [showTrailer]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Link 
      href={`/detail?id=${movie.id}`} 
      className="group cursor-pointer block w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-linear-to-br from-[#38cff0] to-[#039aec] transition-all transform group-hover:scale-105 group-hover:shadow-2xl duration-300">
        {/* Poster Image */}
        {movie.poster && !showTrailer && (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            className="object-cover object-center"
          />
        )}

        {/* Trailer Video - shows on hover if available */}
        {showTrailer && movie.trailer && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
          >
            <source src={movie.trailer} type="video/mp4" />
          </video>
        )}

        {/* Fallback when no poster */}
        {!movie.poster && !showTrailer && (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={40} className="text-white/50" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-10">
          <button className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform">
            <Play size={20} fill="black" />
          </button>
          <div className="flex gap-2">
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all">
              <Plus size={18} />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all">
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1 z-10">
            <Star size={12} fill="gold" color="gold" />
            <span className="text-white text-xs font-medium">{movie.rating}</span>
          </div>
        )}

        {/* Trailer indicator badge */}
        {/* {movie.trailer && (
          <div className="absolute bottom-2 left-2 bg-red-600/90 backdrop-blur-sm rounded px-2 py-1 z-10">
            <span className="text-white text-xs font-bold">TRAILER</span>
          </div>
        )} */}
      </div>
      
      <div className="mt-2">
        <h3 className="text-white font-semibold text-sm line-clamp-1">{movie.title}</h3>
        <p className="text-[#a2cbf9] text-xs mt-1">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
        </p>
      </div>
    </Link>
  );
}
