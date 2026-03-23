"use client";

import { useEffect, useState } from "react";
import { Plus, Check } from "lucide-react";

export default function WatchlistButton({ movieId }) {
  const [inList, setInList] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("watchlist");
      const list = raw ? JSON.parse(raw) : [];
      setInList(list.includes(movieId));
    } catch (e) {
      setInList(false);
    }
  }, [movieId]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem("watchlist");
      const list = raw ? JSON.parse(raw) : [];
      let next;
      if (list.includes(movieId)) {
        next = list.filter((id) => id !== movieId);
        setInList(false);
      } else {
        next = [...list, movieId];
        setInList(true);
      }
      localStorage.setItem("watchlist", JSON.stringify(next));
    } catch (e) {
      console.error("watchlist toggle error", e);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`${
        inList ? "bg-white/30" : "bg-white/10"
      } hover:bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all`}
      aria-pressed={inList}
    >
      {inList ? <Check size={20} /> : <Plus size={20} />}
      <span>{inList ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
}
