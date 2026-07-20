"use client";

import { useWatchlist } from "../features/watchlistSlice";

// Renders nothing — just triggers the React Query fetch that hydrates Redux.
// Mount once in app/(movieContent)/layout.jsx so every page shares the data.
export default function WatchlistLoader() {
  useWatchlist();
  return null;
}
