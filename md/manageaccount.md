**Manage Profile — Implementation Notes**

This document explains how the `Manage Profile` page works in the AfriqNet project and what files and APIs were added or updated to implement it. Use this as a quick reference for testing, debugging, or extending profile functionality.

Overview
- Route: `/manageProfile` (server page) renders a client-side `ManageProfile` component that provides UI for updating profile picture, name, email, password, and deleting the account.
- Auth: the page is protected via `verifyAuth()` (Lucia). Unauthenticated visitors are redirected to `/login`.

Files added/modified
- `app/(movieContent)/manageProfile/page.js`
	- Server page that calls `verifyAuth()` and `getUserById()` then renders the client component `ManageProfile.client` with the user object.

- `component/ManageProfile.client.js`
	- Client-side React component that implements the full manage profile UI and behavior:
		- Profile image upload and preview
		- Update personal information (name, email)
		- Change password (requires current password)
		- Account information view (user id, member since)
		- Danger zone: delete account (with confirmation)
	- Uses existing `/api/upload/profile` to upload images and `/api/user/profile` to persist profile image URL.
	- Makes authenticated requests to `/api/user/update`, `/api/user/password`, and `/api/user/delete` which were added as server API routes.

- `app/api/user/update/route.js`
	- PATCH: validate name & email, prevent duplicate email for another user, update the `users` row in SQLite.

- `app/api/user/password/route.js`
	- PATCH: verifies `currentPassword`, validates `newPassword`, hashes with Argon2 and updates the `users.password` field.

- `app/api/user/delete/route.js`
	- DELETE: deletes user sessions, watch_progress entries, and user record; invalidates the Lucia session cookie.

- `component/GeneralHeader.client.js` (modified)
	- The header's dropdown link now points to `/manageProfile` so users can reach the new page.

Database interactions
- `lib/db.server.js` exposes helper functions used by the server pages and API routes. Relevant behaviors:
	- `getUserById(id)` returns `{ id, name, email, profileImage, createdAt }`.
	- `updateUserProfileImage(userId, url)` updates the `profile_image` column.
	- The database schema includes `profile_image` on the `users` table. The code ensures legacy DBs get the new column via `PRAGMA table_info` check and `ALTER TABLE` if needed.

Upload & persistence flow
1. User picks an image in the client UI (file input).
2. `ManageProfile.client.js` sends the file to `/api/upload/profile` (existing upload route) using `FormData`.
3. Upload route returns a hosted `url` (Cloudinary or configured provider).
4. Client updates local preview and sends `PATCH /api/user/profile` (existing route) with `{ profileUrl }` to persist the URL on the user record.

Profile update flow
1. User edits `name` and/or `email` and clicks Save.
2. Client sends PATCH to `/api/user/update` with `{ name, email }`.
3. Server validates input, checks for existing email collisions, and updates the `users` row.
4. Client shows feedback and refreshes to reflect persisted data.

Password change
1. User submits `currentPassword`, `newPassword`, and `confirmPassword`.
2. Client validates match and minimum length before sending to `/api/user/password`.
3. Server checks the current password against the hashed password in DB, then hashes the new password (Argon2) and updates the `users.password` value.

Account deletion
1. Client presents a confirmation prompt.
2. If confirmed, client calls `DELETE /api/user/delete`.
3. Server deletes sessions, watch progress rows, and the user row; it invalidates the session cookie and returns success.

Client UX details
- The `ManageProfile.client.js` component provides instant feedback:
	- Success and error banners
	- Loading states for long-running actions (uploading, saving, deleting)
	- Preview of the uploaded avatar
	- Live refresh (using `router.refresh()` after successful updates)

Testing & verification
- Manual steps:
	1. Start dev server: `bun run dev`
	2. Sign in to a test account.
	3. Visit: `http://localhost:3000/manageProfile`
	4. Test the following:
		 - Upload a new avatar; confirm preview and that `profile_image` column updated in DB.
		 - Change name and email; confirm responses and DB persisted values.
		 - Change password with correct & incorrect current password.
		 - Delete account on a disposable/test account and confirm session is removed and user row deleted.

Notes and recommended improvements
- Security: Ensure upload route validates file type and size and that Cloudinary (or provider) is configured with restricted credentials.
- UX: Consider adding a small confirmation modal instead of `window.confirm` for account deletion.
- Accessibility: Add ARIA labels and keyboard focus states on interactive elements.
- Tests: Add integration tests that exercise the profile API routes and DB changes. A smoke test can programmatically create a user, sign in, call the API endpoints, and validate DB state.

If you want, I can:
- Add a dedicated confirmation modal component for delete flow.
- Harden the upload API (size/type limits and an explicit allowed list).
- Add an end-to-end test script for the profile flows.

---

Last updated: April 21, 2026

