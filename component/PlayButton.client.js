"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

export default function PlayButton({
  movieId,
  className =
    "btn-color cursor-pointer btn-hover text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold flex items-center gap-2 sm:gap-3 transition-all transform hover:scale-105 text-sm sm:text-base",
}) {
  const router = useRouter();

  function handleClick(e) {
    e?.preventDefault();
    if (!movieId) return;
    // SPA navigate to watching page with autoplay flag
    router.push(`/watching?id=${movieId}&autoplay=1`);
  }

  return (
    <button onClick={handleClick} className={className} aria-label="Play">
      <Play size={18} fill="white" />
      <span>Play Now</span>
    </button>
  );
}
