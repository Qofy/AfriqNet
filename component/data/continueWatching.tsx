  // This module is intentionally client-safe and no longer performs server DB imports.
  // Server components should use `lib/continue.server.js` to fetch DB-backed lists
  // and pass them down to client components as props.

  export const continueWatchingList = [];
  export const trendingMovies = [];
  export const actionMovies = [];
  export const sciFiMovies = [];
  export const newReleases = [];
