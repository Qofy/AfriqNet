**Streaming / Watching Implementation**

This document explains what we built to support streaming local movie files, a watching page with a custom client player, and server-side persistent watch progress. It lists the files changed, the high-level flow, DB schema changes, API behavior, client responsibilities, how to test locally, and suggested next improvements.

**Overview**

- Purpose: stream local MP4 files with HTTP Range support, provide a SPA watching experience with custom controls, and persist per-user watch progress so playback can resume.
- Key features implemented:
	- A server streaming route that supports byte-range requests for seeking and partial content.
	- A `watching` server page that loads movie metadata and renders a client `VideoPlayer` component.
	- A client-only `VideoPlayer` with custom controls, seek bar, fullscreen, autoplay attempt, and periodic saving of watch progress.
	- A server API to GET and POST per-user watch progress (authenticated via Lucia).
	- DB schema and helper functions to store progress and movie metadata (including a field referencing the local file path).

**High-level Flow**

- User clicks Play (client SPA navigation) which pushes `/watching?id=<movieId>&autoplay=1`.
- The server `app/watching/page.js` verifies authentication, loads movie metadata from SQLite, and renders the client `VideoPlayer` with `src=/api/stream/<movieId>`.
- The `<video>` element in `VideoPlayer.client.js` requests ranges from `/api/stream/<movieId>` when seeking or when starting playback.
- The streaming route reads the movie's file (seeded path like `/movies/THE_CHEF_AND_I.mp4`), replies with `206 Partial Content` and appropriate `Content-Range`/`Accept-Ranges` headers for byte-range requests.
- On mount, the player GETs `/api/progress?contentId=<movieId>` to fetch last saved position and seeks to it.
- While playing, the player periodically POSTs position/duration to `/api/progress` (and uses `navigator.sendBeacon` on unload for reliability).

**Key Files Changed / Added**

- `app/api/stream/[id]/route.js` — Server streaming route. Resolves movie by id, opens the local file, handles `Range` header, and responds with `206`/`200` with correct headers.
- `app/watching/page.js` — Server page for the watching experience. Verifies auth with `verifyAuth()`, loads movie metadata via `getMovieById()`, builds stream URL, and renders `VideoPlayer` client component with `contentId` and `autoplay` props.
- `component/VideoPlayer.client.js` — Client player (React): custom overlay, seek bar, bottom-centered controls on mobile, fullscreen toggle, periodic progress POSTing, GET last progress on mount, resume indication.
- `component/PlayButton.client.js` — Simple SPA navigation from movie hero to `/watching?id=...&autoplay=1`.
- `app/api/progress/route.js` — GET and POST endpoints to fetch/update per-user watch progress. Requires authenticated user via `verifyAuth()`.
- `lib/db.server.js` — Database initialization and helpers; added `watch_progress` table and helper functions `upsertWatchProgress` and `getWatchProgress`. The `movies` seed includes `video_stram` (local file path) for streaming.

**Database Changes**

- New table: `watch_progress`

	- Columns: `id`, `user_id`, `content_id`, `position` (seconds), `duration` (seconds), `updated_at`
	- Constraint: unique on `(user_id, content_id)` to keep one row per user+content.

- `movies` table: existing metadata; we added a `video_stram` column (seeded with paths like `/movies/THE_CHEF_AND_I.mp4`). Note: this was kept as `video_stram` in the seed; renaming to `video_stream` is recommended later.

**Server Helpers (in `lib/db.server.js`)**

- `getMovieById(id)` — returns movie metadata including the `video_stram` path.
- `getAllMovies()` — list movies (includes video path field).
- `upsertWatchProgress({ userId, contentId, position, duration })` — inserts or updates a user's progress record.
- `getWatchProgress(userId, contentId)` — returns saved progress (position/duration) if present.

**Streaming Route Details (`app/api/stream/[id]/route.js`)**

- Purpose: Serve the MP4 file referenced by a movie row with correct range semantics so the browser can seek, buffer, and resume.
- Behavior:
	- Lookup movie by id and get its `video_stram` path.
	- Resolve the file path on disk (ensure seeds point to an accessible path — e.g., inside `public/movies` or another project directory). The current seed uses a path like `/movies/THE_CHEF_AND_I.mp4`.
	- Read `Range` header from request. If present, compute `start` and `end`, set `206 Partial Content` and `Content-Range` header and return the requested byte slice.
	- If `Range` is missing, return full file with `200` and `Content-Length`.
	- Always include `Accept-Ranges: bytes` to tell clients the server supports seeking.

**Progress API (`app/api/progress/route.js`)**

- GET `/api/progress?contentId=<id>`: Returns `{ position, duration, updated_at }` for the authenticated user and content.
- POST `/api/progress` with JSON `{ contentId, position, duration }`: Calls `upsertWatchProgress()` for the authenticated user and stores position/duration with timestamp.
- Authentication: both endpoints call `verifyAuth()` (Lucia) server-side and return `401` if there's no session.

**Client: `VideoPlayer.client.js` Responsibilities**

- Render a `<video>` element with `src` pointing to the streaming route and with controls suppressed (we provide custom controls).
- Autoplay attempt: tries `video.play()` on mount if the `autoplay` prop is set; if blocked by browser autopolicy, fallback to showing a tappable overlay Play button.
- Resume-on-load: GET saved progress and seek to it; show a small "Resumed to X:XX" notice briefly.
- Periodic progress saving: every ~5 seconds the player POSTs current `position` and `duration` to `/api/progress` using `fetch`. On `pagehide`/`beforeunload`, it uses `navigator.sendBeacon` if available for reliability.
- Seek bar: range input bound to currentTime/duration; pointer events handle dragging vs live updates.
- Mobile UX: controls centered on bottom for small viewports, larger touch targets, reduced badge size.
- Fullscreen: toggles Fullscreen API on a container `ref` to expand the player.

**Play Button (`component/PlayButton.client.js`)**

- Simple client component that uses Next router to `push('/watching?id=' + movieId + '&autoplay=1')` for SPA navigation and avoids server Link for immediate client transition.

**How to Test Locally**

1. Ensure your seed includes a valid local path for a movie (e.g., `video_stram: '/movies/THE_CHEF_AND_I.mp4'`). Put the MP4 at that path relative to the project root or `public/` depending on how the streaming route resolves files.

2. Start the dev server (example with Bun):

```bash
bun run dev
```

3. Sign in (Lucia) or ensure `verifyAuth()` finds a session cookie, then open the watching page for the seeded movie:

http://localhost:3000/watching?id=m16&autoplay=1

4. In DevTools Network tab, confirm requests:
	- `GET /api/stream/m16` (video) should respond with `206` for range requests or `200` for full content.
	- `GET /api/progress?contentId=m16` should return saved position (if previously saved).
	- Periodic `POST /api/progress` calls appear while watching (or `sendBeacon` on tab close).

5. Inspect the DB content (SQLite) to confirm `watch_progress` rows:

```sql
SELECT user_id, content_id, position, duration, updated_at FROM watch_progress WHERE content_id = 'm16';
```

**Troubleshooting / Common Issues**

- Browser autoplay blocked: the player attempts autoplay; if blocked, show overlay Play button. This is normal browser behavior — encourage user interaction for autoplay.
- File path resolution: ensure the seeded `video_stram` path points to a readable file and the streaming route resolves it correctly. Consider moving videos to `public/movies/` for simpler resolution.
- Authentication: `GET /api/progress` and `POST /api/progress` require a valid session cookie — verify Lucia/session setup.
- Range handling: if seeking fails, confirm the streaming route correctly parses `Range` and uses the right byte offsets and content-length calculations.

**Next Improvements / TODOs**

- Rename `video_stram` → `video_stream` in DB schema (migration) for clarity.
- Add adaptive bitrate / transcoding for production (serve HLS/DASH rather than raw MP4s).
- Improve buffer visualization and show buffered ranges on the progress bar.
- Add accessible keyboard controls and larger visual affordances for low-vision users.
- Consider storing videos on object storage (S3/Cloud) and using signed URLs instead of local file serving.

---

If you want, I can also:

- Move the seeded MP4 into `public/movies/` and update the seed to guarantee path resolution.
- Add a small end-to-end smoke test that starts the server and verifies `206` responses and progress writes.

Let me know which follow-up you'd like and I will add it to the repo.

