# Migration: better-sqlite3 → Firebase Firestore

**Date:** May 1, 2026  
**Reason:** `better-sqlite3` native module fails to build on Netlify/Vercel Linux environments  
**Solution:** Migrate to Firebase Firestore Admin SDK (pure JavaScript, platform-agnostic)

---

## Architecture Decision

### What Changed
- **Static content** (movies, TV shows, music videos, genres) — remain as hardcoded data, synchronous, no database queries
- **Dynamic data** (users, sessions, watch progress) — migrated to Firebase Firestore, async functions
- **Auth system** — Lucia authentication now uses custom Firestore adapter instead of `BetterSqlite3Adapter`
- **Removed dependencies** — `better-sqlite3`, `@lucia-auth/adapter-sqlite`
- **Added dependencies** — `firebase-admin`

### Why This Approach
1. **Static content as hardcoded arrays** — Movies, TV shows, music videos, and genres are seeded data that never changes at runtime. Keeping them hardcoded avoids unnecessary database queries and keeps sync code simple in page components.

2. **Firestore for dynamic data** — User accounts, sessions, and watch progress need persistent storage. Firestore scales automatically and works seamlessly on serverless platforms (Vercel, Netlify).

3. **Custom Lucia adapter** — Instead of replacing Lucia entirely, we implemented a minimal Firestore adapter that satisfies Lucia's SessionAdapter interface. This preserves existing auth logic while swapping the storage backend.

---

## Files Modified

### 1. `package.json`
**Changes:**
- ❌ Removed: `@lucia-auth/adapter-sqlite@^3.0.2`
- ❌ Removed: `better-sqlite3@^12.8.0`
- ✅ Added: `firebase-admin@^12.0.0`

**Reasoning:** Firebase Admin SDK replaces all SQLite functionality without native binding issues.

---

### 2. `lib/firebase.server.js` (NEW FILE)
**Purpose:** Firebase Admin SDK initialization and Firestore instance export

**Key Features:**
- Graceful initialization: only throws in production if `FIREBASE_SERVICE_ACCOUNT` env var is missing
- Allows build to succeed locally without Firebase credentials
- Fails safely at runtime if credentials aren't provided in production

**Code:**
```javascript
// Initializes Firebase Admin SDK once per process
// Exports `firestoreDb` for use throughout the app
if (!getApps().length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
```

---

### 3. `lib/db.server.js` (COMPLETE REWRITE)
**Sections:**

#### A. Static Content (Synchronous)
All hardcoded data moved to module-level arrays:
- `staticMovies` — 7 movie objects
- `staticTVShows` — 15 TV show objects
- `staticMusicVideos` — 10 music video objects
- `staticGenres` — 27 genre entries

**Functions:**
- `getAllMovies()` → returns mapped static array
- `getAllTVShows()` → returns mapped static array
- `getAllMusicVideos()` → returns mapped static array
- `getMovieById(id)` → finds and returns single movie
- `getTVShowById(id)` → finds and returns single TV show
- `getMusicVideoById(id)` → finds and returns single music video
- `getGenresByType(type)` → filters genres by type (movie, tv, music)
- `getAllGenres()` → returns all genres
- `searchContent(query, contentType)` → searches across all content

**Why Synchronous?** Page components call these at render time without async/await. Since the data is static and in memory, synchronous is cleaner.

#### B. Dynamic Data (Asynchronous / Firestore)
All user-related operations now async:

**User Management:**
- `createUser({ name, email, passwordHash })` → Creates doc in `users` collection
- `getUserByEmail(email)` → Queries for user by email
- `getUserById(id)` → Gets user by Firestore doc ID
- `updateUser(userId, fields)` → Updates name, email, password, or profile_image
- `updateUserProfileImage(userId, url)` → Updates profile_image field
- `updateUserPassword(userId, passwordHash)` → Updates password field
- `deleteUser(userId)` → Deletes user document

**Session Management:**
- `createSession({ id, userId, expiresAt })` → Creates session doc (managed by Lucia)
- `getSession(id)` → Gets session by ID
- `deleteSession(id)` → Deletes session
- `deleteUserSessions(userId)` → Bulk deletes all sessions for a user
- `deleteExpiredSessions()` → Cleans up expired sessions (can be run periodically)

**Watch Progress:**
- `upsertWatchProgress({ userId, contentId, position, duration })` → Create or update watch position
- `getWatchProgress(userId, contentId)` → Get watch progress for a specific content item
- `deleteWatchProgressForUser(userId)` → Bulk delete all watch progress for a user

**Firestore Collections:**
```
users/{userId}
  ├─ name: string
  ├─ email: string (unique)
  ├─ password: string (hashed)
  ├─ profile_image: string | null
  └─ created_at: number (timestamp)

sessions/{sessionId}
  ├─ user_id: string (references users doc)
  ├─ expires_at: number (timestamp)
  └─ created_at: number (timestamp)

watch_progress/{userId}_{contentId}
  ├─ user_id: string
  ├─ content_id: string
  ├─ position: number (seconds)
  ├─ duration: number | null (seconds)
  └─ updated_at: number (timestamp)
```

---

### 4. `lib/auth.js` (UPDATED)
**Changes:**
- ❌ Removed: `import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite"`
- ❌ Removed: `import db from "./db.server"`
- ✅ Added: `import { firestoreDb } from "./firebase.server"`
- ✅ Replaced: SQLite adapter → Custom Firestore adapter

**Custom Lucia Adapter Implementation:**
Implements 7 methods required by Lucia's `SessionAdapter` interface:

```javascript
const adapter = {
  async getSessionAndUser(sessionId) { ... },
  async getUserSessions(userId) { ... },
  async setSession(session) { ... },
  async updateSessionExpiration(sessionId, expiresAt) { ... },
  async deleteSession(sessionId) { ... },
  async deleteUserSessions(userId) { ... },
  async deleteExpiredSessions() { ... }
}
```

**Why Custom Adapter?** Lucia doesn't provide an official Firestore adapter, but the adapter interface is simple enough to implement directly. This keeps the auth system intact while switching backends.

---

### 5. `app/api/user/password/route.js` (UPDATED)
**Changes:**
- ❌ Removed: `import { getDatabase } from '@/lib/db.server'`
- ❌ Removed: Raw SQL query: `db.prepare('SELECT password FROM users WHERE id = ?').get(...)`
- ✅ Added: `import { getUserById, updateUserPassword } from '@/lib/db.server'`
- ✅ Changed: `const user = await getUserById(session.userId)`
- ✅ Changed: `await updateUserPassword(session.userId, passwordHash)`

**What It Does:** Allows users to change their password with current password verification.

---

### 6. `app/api/user/update/route.js` (UPDATED)
**Changes:**
- ❌ Removed: `import { getDatabase } from '@/lib/db.server'`
- ❌ Removed: Raw SQL email duplicate check and UPDATE
- ✅ Added: `import { getUserByEmail, updateUser } from '@/lib/db.server'`
- ✅ Changed: `const existingUser = await getUserByEmail(email)`
- ✅ Changed: `await updateUser(session.userId, { name, email })`

**What It Does:** Updates user's name and email with duplicate email validation.

---

### 7. `app/api/user/profile/route.js` (UPDATED)
**Changes:**
- ❌ Removed: `import { getDatabase } from '@/lib/db.server'`
- ❌ Removed: Raw SQL query and UPDATE
- ✅ Added: `import { getUserByEmail, updateUser } from '@/lib/db.server'`
- ✅ Changed: Dynamic SQL UPDATE → `await updateUser(auth.user.id, updates)`

**What It Does:** Updates user profile (name, email, profile image) with email duplicate validation.

---

### 8. `app/api/user/delete/route.js` (UPDATED)
**Changes:**
- ❌ Removed: `import { getDatabase } from '@/lib/db.server'`
- ❌ Removed: Raw SQL DELETE statements
- ✅ Added: `import { deleteUser, deleteWatchProgressForUser } from '@/lib/db.server'`
- ✅ Changed: `await lucia.invalidateAllUserSessions(session.userId)` (Lucia built-in)
- ✅ Changed: `await deleteWatchProgressForUser(session.userId)`
- ✅ Changed: `await deleteUser(session.userId)`

**What It Does:** Permanently deletes user account, all sessions, and watch history.

---

## Setup & Deployment

### Local Development (Optional Firebase)
The app builds successfully without `FIREBASE_SERVICE_ACCOUNT` set locally. Firebase functions gracefully degrade if the env var is missing. You can develop without Firebase if you only test static content.

### Before Deploying to Vercel/Netlify

#### Step 1: Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project" → name it "africannet" or similar
3. Enable Google Analytics (optional)
4. Click "Create project"

#### Step 2: Enable Firestore
1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode" (you can set security rules later)
4. Choose a region (default is fine)
5. Click "Create"

#### Step 3: Create Service Account
1. Go to Project Settings → Service Accounts tab
2. Click "Generate New Private Key" → "Generate Key"
3. A JSON file downloads automatically
4. **Keep this file secure** — it contains your Firebase credentials

#### Step 4: Add to Environment Variables

**For Vercel:**
1. Go to your Vercel project → Settings → Environment Variables
2. Click "Add"
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Paste the entire JSON file content (one line, no line breaks)
   - **Environments:** Production, Preview, Development
3. Click "Save"

**For Netlify:**
1. Go to your Netlify site → Site Settings → Environment
2. Click "New variable"
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Paste the entire JSON file content
3. Click "Save"

#### Step 5: Deploy
- Push to Git (Vercel auto-deploys on push)
- Or manually redeploy from dashboard
- Build should now pass without native binding errors ✅

---

## Testing Checklist

After deploying, verify:

- [ ] **Signup** — New user appears in Firestore `users` collection
- [ ] **Login** — Session doc created in `sessions` collection with correct `user_id`
- [ ] **Change password** — Password updates in user doc (hashed with argon2)
- [ ] **Update profile** — Name and email update in user doc
- [ ] **Watch progress** — Playing a video and closing browser → refresh → position/progress restores
- [ ] **Logout** — Session doc deleted from Firestore
- [ ] **Delete account** — User doc, all session docs, and all watch_progress docs removed

---

## Important Notes

### User IDs
- **Before:** SQLite auto-increment integers (1, 2, 3, ...)
- **After:** Firestore document IDs (strings like `abc123def456`)
- Lucia and the app handle this automatically; no manual conversion needed.

### Watch Progress Key Format
- Composite key: `{userId}_{contentId}` (e.g., `user123_m1`)
- Avoids collision and makes queries efficient

### Backward Compatibility
- Old SQLite data is **not** automatically migrated
- All user accounts and watch progress will start fresh
- Consider a data migration script if you have existing users to preserve

### Security Considerations
- Firestore security rules should be configured based on your needs
- Default "production mode" rules block all reads/writes; set appropriate rules
- Service account has admin access; store the JSON securely
- Never commit the JSON file to Git; always use environment variables

### Performance
- All database calls are now async
- Page components calling static functions (movies, shows, genres) remain synchronous
- API routes properly await async database calls
- Firestore indexes are created automatically for common queries

---

## Rollback (If Needed)

If you need to revert to SQLite:
1. Revert the commits or checkout the previous branch
2. `bun install` to restore `better-sqlite3`
3. Note: You'd need to export Firestore data and import back to SQLite (manual process)

---

## References

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Lucia Auth Adapters](https://lucia-auth.com/docs/reference/adapter)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
