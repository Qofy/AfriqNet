"use client";

import { Plus, Check, Loader2 } from "lucide-react";
import { FC } from "react";
import { useToggleWatchlist } from "../features/watchlistSlice";

interface WatchlistButtonProps {
  movieId?: string | number;
}

const WatchlistButton: FC<WatchlistButtonProps> = ({ movieId }) => {
  if (!movieId) return null;
  const { inList, toggle, isLoading } = useToggleWatchlist(String(movieId));

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      aria-pressed={inList}
      className={`${
        inList ? "bg-white/30" : "bg-white/10"
      } hover:bg-white/20 disabled:opacity-60 backdrop-blur-sm text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all`}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : inList ? (
        <Check size={20} />
      ) : (
        <Plus size={20} />
      )}
      <span>{inList ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
};

export default WatchlistButton;
