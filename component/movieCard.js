import Image from "next/image";
import Link from "next/link";
import { Star, Play, Plus, Info } from "lucide-react";
import { sampleMovies } from "@/component/data/sampleData";


export const MovieCard = ({ movie }) => (
  <Link href={`/detail?id=${movie.id}`} className="shrink-0 w-48 group cursor-pointer block">
    <div className="relative h-72 rounded-lg overflow-hidden bg-linear-to-br from-[#38cff0] to-[#039aec] transition-all transform group-hover:scale-105">
      {movie.poster ? (
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover object-center"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Play size={40} className="text-white/50" />
        </div>
      )}
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
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
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
          <Star size={12} fill="gold" color="gold" />
          <span className="text-white text-xs font-medium">{movie.rating}</span>
        </div>
      )}
    </div>
    
    <div className="mt-2">
      <h3 className="text-white font-semibold text-sm line-clamp-1">{movie.title}</h3>
      <p className="text-[#a2cbf9] text-xs mt-1">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
      </p>
    </div>
  </Link>
);
