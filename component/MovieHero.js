import Image from "next/image";
import { Play, Share2, Star, Clock, Calendar } from "lucide-react";
import WatchlistButton from "./WatchlistButton";

export const MovieHero = ({ movie }) => {
  return (
    <section className="relative w-full h-[66vh] sm:h-[74vh] md:h-screen overflow-hidden">
      {/* Backdrop */}
      {movie?.backdrop ? (
        <>
          <Image
            src={movie.backdrop}
            alt={movie.title || movie.name}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-[#38cff0] to-[#039aec]" />
      )}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex items-center">
            <div className="max-w-2xl">
              <div className="hidden md:block shrink-0 w-48 md:w-56 lg:w-64">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  {movie?.poster ? (
                    <Image src={movie.poster} alt={movie.title || movie.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#38cff0] to-[#039aec] flex items-center justify-center">
                      <Play size={60} className="text-white/50" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 drop-shadow-lg">
                  {movie?.title || movie?.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mb-4 text-white/90 text-sm">
                  {movie?.rating && (
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <Star size={18} fill="gold" color="gold" />
                      <span className="font-semibold text-lg">{movie.rating}</span>
                    </div>
                  )}
                  {(movie?.release_date || movie?.first_air_date) && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(movie.release_date || movie.first_air_date).getFullYear()}</span>
                    </div>
                  )}
                  {(movie?.runtime || movie?.number_of_seasons) && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{movie.runtime ? `${movie.runtime} min` : `${movie.number_of_seasons} seasons`}</span>
                    </div>
                  )}
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {movie?.type === "tv" ? "TV Show" : movie?.type || "Movie"}
                  </span>
                </div>

                {movie?.tagline && (
                  <p className="text-sm md:text-base text-white/80 italic mb-4 font-light line-clamp-2">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button className="btn-color btn-hover text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center gap-2 sm:gap-3 transition-all transform hover:scale-105 text-sm sm:text-base">
                    <Play size={18} fill="white" />
                    <span>Play Now</span>
                  </button>
                  <div>
                    <WatchlistButton movieId={movie?.id} />
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 sm:p-4 rounded-lg transition-all w-12 h-12 flex items-center justify-center" aria-label="Share">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile poster thumbnail */}
      {movie?.poster && (
        <div className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 w-24 h-32 rounded-md overflow-hidden shadow-lg">
          <Image src={movie.poster} alt={movie.title || movie.name} fill className="object-cover" />
        </div>
      )}
    </section>
  );
};