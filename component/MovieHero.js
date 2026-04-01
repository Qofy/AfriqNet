import Image from "next/image";
import { Play, Share2, Star, Clock, Calendar } from "lucide-react";
import WatchlistButton from "./WatchlistButton";

export const MovieHero = ({ movie }) => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full">
      {movie.backdrop ? (
        <>
          <Image
            src={movie.backdrop}
            alt={movie.title || movie.name}
            fill
            priority
            className="object-cover object-center"
      
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-[#38cff0] to-[#039aec]"></div>
      )}

      {/* Content Over Hero */}
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-6 pb-12 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <div className="shrink-0 w-48 md:w-56 lg:w-64 hidden md:block">
              <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
                {movie.poster ? (
                  <Image
                    src={movie.poster}
                    alt={movie.title||movie.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-[#38cff0] to-[#039aec] flex items-center justify-center">
                    <Play size={60} className="text-white/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Title and Actions */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                {movie.title || movie.name}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90">
                {movie.rating && (
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Star size={18} fill="gold" color="gold" />
                    <span className="font-semibold text-lg">{movie.rating}</span>
                  </div>
                )}
                {(movie.release_date || movie.first_air_date) && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(movie.release_date || movie.first_air_date).getFullYear()}</span>
                  </div>
                )}
                {(movie.runtime || movie.number_of_seasons) && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{movie.runtime ? `${movie.runtime} min` : `${movie.number_of_seasons} seasons`}</span>
                  </div>
                )}
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {movie.type === 'tv' ? 'TV Show' : movie.type || 'Movie'}
                </span>
              </div>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-xl text-white/80 italic mb-6 font-light">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="btn-color btn-hover text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all transform hover:scale-105 text-lg">
                  <Play size={24} fill="white" />
                  Play Now
                </button>
                <WatchlistButton movieId={movie.id} />
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-lg transition-all" aria-label="Share">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};