## Sample Data Seeded:
Movies: Including your "Accra Hustler" and "King Of Lagos" movies
TV Shows: Sci-fi, drama, and crime series
Music Videos: Afrobeats, hip-hop, R&B, and other African music genres
Genres: Complete genre lists for movies, TV shows, and music videos
## Helper Functions Added:
getAllMovies() - Get all movies sorted by rating
getAllTVShows() - Get all TV shows sorted by rating
getAllMusicVideos() - Get all music videos sorted by rating
getMovieById(id) - Get specific movie details
getTVShowById(id) - Get specific TV show details
getMusicVideoById(id) - Get specific music video details
getGenresByType(type) - Get genres for specific content type
getAllGenres() - Get all genres
searchContent(query, contentType) - Search across all content types

## Added server-only helpers:
continue.server.js — builds continue-watching and category lists from the DB.
Removed server imports from client bundles:
Converted page.js into a server component that calls getAllMovies() / getAllGenres() and renders a new client UI component.
Added MoviesClient.js (a client component) that receives initialMovies and genres as props and contains the interactive search/filter UI.
Replaced continueWatching.js with a client-safe stub (exports empty arrays). Server code now uses continue.server.js instead.
Kept page.js as a server component and changed it to use continue.server.js for continue/trending/action lists.