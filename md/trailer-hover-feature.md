# Trailer Hover Preview Feature

## Overview
Movies now display trailer previews when users hover over movie cards in sliders, grids, and rows.

## Implementation Details

### Database Changes
- Added `trailer` column to the `movies` table in `lib/db.server.js`
- Updated seed data with trailer file paths from `/public/trailer/` folder
- Modified `getAllMovies()` and `getMovieById()` to return trailer field

### Available Trailers
The following trailers are available in `/public/trailer/`:
- `All-the-devils-are-there.mp4`
- `Greeland-2.mp4`
- `Under-the-stars.mp4`
- `WAR-MACHINE-Official-Trailer-Netflix.mp4`
- `chief-of-war.mp4`
- `runningMan.mp4`

### Components Updated

#### 1. MovieCardWithTrailer.client.js
New client component that handles trailer hover functionality:
- Shows poster image by default
- On hover (300ms delay), plays the trailer if available
- Includes zoom effect and overlay on hover
- Shows a "TRAILER" badge if trailer is available
- Automatically pauses and resets when hover ends

#### 2. MoviesGrid.js
Updated to include inline MovieGridCard component with trailer hover:
- Used in Movies, TV Shows, and Music Videos pages
- Same hover behavior as MovieCardWithTrailer
- Optimized for grid layout

#### 3. movieRow.js
Updated to use the new `MovieCardWithTrailer` component:
- Used for horizontal scrolling movie rows
- Seamless trailer preview on hover

## How It Works

### User Experience
1. User hovers over a movie card
2. After 300ms delay, the trailer starts playing (if available)
3. Trailer plays in a loop, muted
4. Video scales up slightly with smooth transition
5. When user moves mouse away, trailer stops and poster returns

### Technical Implementation
- Uses React hooks (`useState`, `useRef`, `useEffect`)
- Implements 300ms delay to avoid flickering on quick hovers
- Video plays with `muted` and `playsInline` attributes for better browser compatibility
- Gracefully handles autoplay failures
- Cleans up timeouts on unmount to prevent memory leaks

## Adding New Trailers

1. Add the trailer video file to `/public/trailer/`
2. Update the movie seed data in `lib/db.server.js`:
   ```javascript
   ['movieId', 'Title', 'Movie', 'poster_url', 'backdrop_url', rating, 'date', 
    'description', 'genre_ids', runtime, 'tagline', 'video_stream', '/trailer/your-trailer.mp4']
   ```
3. Restart the dev server to apply DB changes

## Browser Compatibility
- Works in all modern browsers
- Falls back gracefully if autoplay is blocked
- Uses `playsInline` for mobile Safari compatibility

## Performance Considerations
- Trailers only load when hovering (lazy loading)
- 300ms delay prevents unnecessary loads on quick hovers
- Videos are muted to bypass autoplay restrictions
- Videos pause and reset immediately when hover ends
