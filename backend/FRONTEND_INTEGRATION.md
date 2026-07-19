# Frontend Integration Guide

Connect your Next.js frontend to Django backend with S3 uploads.

## Part 1: Test API Endpoints

### 1.1 Start Django Server

```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

### 1.2 Test GET Videos

```bash
curl http://localhost:8000/api/videos/
```

Response:
```json
{
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "All The Devils Are There",
      "description": "...",
      "video_file": "",
      "thumbnail": "",
      "uploaded_by": {"id": 1, "username": "admin", ...},
      "duration": 142,
      "views": 0,
      "created_at": "2024-07-19T...",
      "updated_at": "2024-07-19T..."
    },
    ...
  ]
}
```

### 1.3 Test GET Music Videos

```bash
curl http://localhost:8000/api/music-videos/
```

### 1.4 Get S3 Upload URL

```bash
curl -X POST http://localhost:8000/api/videos/get_upload_url/ \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test-video.mp4",
    "content_type": "video/mp4"
  }'
```

Response:
```json
{
  "url": "https://africannet-media.s3.amazonaws.com/",
  "fields": {
    "key": "videos/test-video.mp4",
    "acl": "public-read",
    "Content-Type": "video/mp4",
    "policy": "...",
    "signature": "..."
  }
}
```

---

## Part 2: Connect Next.js Frontend

### 2.1 Create API Client

Create `lib/api.js`:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = {
  // Fetch videos
  async getVideos(page = 1) {
    const res = await fetch(`${API_URL}/videos/?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    return res.json();
  },

  // Fetch single video
  async getVideo(id) {
    const res = await fetch(`${API_URL}/videos/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch video');
    return res.json();
  },

  // Fetch music videos
  async getMusicVideos(page = 1) {
    const res = await fetch(`${API_URL}/music-videos/?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch music videos');
    return res.json();
  },

  // Fetch photos
  async getPhotos(page = 1) {
    const res = await fetch(`${API_URL}/photos/?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
  },

  // Increment view count
  async incrementViews(type, id) {
    const res = await fetch(`${API_URL}/${type}/${id}/increment_views/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to increment views');
    return res.json();
  },

  // Get S3 presigned URL for upload
  async getUploadUrl(type, filename, contentType) {
    const res = await fetch(`${API_URL}/${type}/get_upload_url/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        content_type: contentType,
      }),
    });
    if (!res.ok) throw new Error('Failed to get upload URL');
    return res.json();
  },

  // Upload file to S3 using presigned URL
  async uploadToS3(presignedUrl, file) {
    const formData = new FormData();
    
    // Add fields from presigned URL
    Object.entries(presignedUrl.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add file
    formData.append('file', file);

    const res = await fetch(presignedUrl.url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload to S3');
    
    // S3 returns 204 No Content on success
    return `${presignedUrl.url}${presignedUrl.fields.key}`;
  },
};
```

### 2.2 Environment Variables

Create `.env.local` in your frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

### 2.3 Update Movies Page

Replace `app/(movieContent)/movies/page.js`:

```javascript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import MovieCard from '@/component/MovieCard';

export default function MoviesPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      setLoading(true);
      const data = await apiClient.getVideos();
      setVideos(data.results);
    } catch (err) {
      setError(err.message);
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading movies...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <MovieCard key={video.id} movie={video} />
        ))}
      </div>
    </div>
  );
}
```

### 2.4 Update Music Videos Page

Replace `app/(movieContent)/musicVideos/page.js`:

```javascript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import MusicVideoCard from '@/component/MusicVideoCard';

export default function MusicVideosPage() {
  const [musicVideos, setMusicVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMusicVideos();
  }, []);

  async function loadMusicVideos() {
    try {
      setLoading(true);
      const data = await apiClient.getMusicVideos();
      setMusicVideos(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading music videos...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Music Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {musicVideos.map((video) => (
          <MusicVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
```

---

## Part 3: Video Upload Component

Create `components/VideoUploadForm.js`:

```javascript
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

export default function VideoUploadForm({ onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Title and file are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Get S3 presigned URL
      console.log('Getting upload URL...');
      const presignedUrl = await apiClient.getUploadUrl(
        'videos',
        file.name,
        file.type
      );

      // Step 2: Upload file to S3
      console.log('Uploading to S3...');
      const fileUrl = await apiClient.uploadToS3(presignedUrl, file);

      // Step 3: Create video record in Django
      console.log('Creating video record...');
      const response = await fetch('http://localhost:8000/api/videos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          video_file: fileUrl,
          duration: Math.floor(file.duration || 0),
        }),
      });

      if (!response.ok) throw new Error('Failed to create video record');

      const newVideo = await response.json();
      console.log('Upload successful:', newVideo);

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setProgress(0);

      if (onUploadSuccess) {
        onUploadSuccess(newVideo);
      }
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold">Upload Video</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full"
          required
          disabled={loading}
        />
        {file && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Video'}
      </button>
    </form>
  );
}
```

---

## Part 4: CORS Configuration

Make sure your Django backend allows requests from your frontend.

Update `backend/.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://your-frontend.com
```

---

## Testing Workflow

### 1. Start Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

### 2. Start Frontend
```bash
npm run dev
# Runs on http://localhost:3000
```

### 3. Test API
```bash
# Fetch videos
curl http://localhost:8000/api/videos/

# Upload video
# Use the VideoUploadForm component
```

### 4. Check S3
```bash
python manage_s3.py list
python manage_s3.py stats
```

---

## Production Deployment

### Backend
- Deploy to AWS EC2
- Set `ALLOWED_HOSTS` to your domain
- Enable HTTPS

### Frontend
- Deploy to Vercel or Netlify
- Update `NEXT_PUBLIC_API_URL` to production backend URL

### Example Production URLs
```env
NEXT_PUBLIC_API_URL=https://api.africannet.com/api
CORS_ALLOWED_ORIGINS=https://africannet.com,https://www.africannet.com
```

---

## Troubleshooting

### CORS Errors
```
Error: Cross-Origin Request Blocked
```
**Fix:** Update `CORS_ALLOWED_ORIGINS` in `.env`

### S3 Upload Fails
```
Error: Access Denied
```
**Fix:** Check AWS credentials and bucket policy

### Videos Not Showing
- Check if videos are in S3: `python manage_s3.py list`
- Check if database records exist: `curl http://localhost:8000/api/videos/`
- Check browser console for API errors

---

## Next Steps

1. ✅ Backend API running
2. ✅ S3 uploads working
3. ✅ Create upload component
4. ⬜ Deploy backend to AWS
5. ⬜ Deploy frontend to production
6. ⬜ Add authentication
7. ⬜ Add payment integration (if needed)
