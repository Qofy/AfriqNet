"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ContinueWatching({ watchingList = [] }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);

  const handleScroll = (direction) => {
    const container = document.getElementById("continue-watching-scroll");
    if (!container) return;

    const scrollAmount = 400;
    const newPosition =
      direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    // You can implement actual removal logic here
    console.log("Remove item:", id);
  };

  if (!watchingList || watchingList.length === 0) {
    return null;
  }

  return (
    <div className="relative py-8 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Continue Watching
          </h2>
          <button className="text-[#a2cbf9] hover:text-white text-sm font-medium transition-colors">
            See All
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="relative group">
          {/* Left Arrow */}
          {scrollPosition > 0 && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          {/* Items Container */}
          <div
            id="continue-watching-scroll"
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {watchingList.map((item) => (
              <div
                key={item.id}
                className="relative shrink-0 w-80 cursor-pointer group/item"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thumbnail Container */}
                <div className="relative w-full h-44 rounded-lg overflow-hidden bg-linear-to-br from-[#38cff0] to-[#039aec]">
                  {item.backdrop || item.poster ? (
                    <Image
                      src={item.backdrop || item.poster}
                      alt={item.title || "Movie thumbnail"}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play size={40} className="text-white/50" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full btn-color transition-all"
                      style={{ width: `${item.progress || 0}%` }}
                    ></div>
                  </div>

                  {/* Play Button Overlay (on hover) */}
                  {hoveredId === item.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all">
                        <Play size={32} fill="white" className="text-white" />
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(item.id, e)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-all"
                    aria-label="Remove from continue watching"
                  >
                    <X size={16} />
                  </button>

                  {/* Duration/Time Left Badge */}
                  {item.timeLeft && (
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                      {item.timeLeft} left
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="mt-3">
                  <h3 className="text-white font-semibold text-base line-clamp-1 mb-1">
                    {item.title || "Untitled"}
                  </h3>
                  <div className="flex items-center gap-2 text-[#a2cbf9] text-sm">
                    {item.episode && (
                      <span>S{item.season} E{item.episode}</span>
                    )}
                    {item.episode && item.episodeTitle && <span>•</span>}
                    {item.episodeTitle && (
                      <span className="line-clamp-1">{item.episodeTitle}</span>
                    )}
                    {!item.episode && item.year && <span>{item.year}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
