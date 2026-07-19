# AWS S3 Integration Guide for AfriqNet

Complete guide to set up free/cheap S3 storage for videos and photos.

## Part 1: AWS Setup

### 1.1 Create AWS Account (Free Tier)

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Complete sign-up with email and payment method
4. Choose "Basic" support plan (free)

**Free Tier Benefits:**
- 5 GB S3 storage (12 months)
- 20,000 GET requests (free)
- 2,000 PUT requests (free)
- 100 GB data transfer out (12 months)

### 1.2 Create S3 Bucket

**Using AWS Console:**

1. Go to [S3 Console](https://s3.console.aws.amazon.com)
2. Click "Create bucket"
3. **Bucket name:** `africannet-media` (must be globally unique)
4. **Region:** `us-east-1` (cheapest)
5. **Block Public Access:** Uncheck all (to serve files publicly)
6. Click "Create bucket"

**Using AWS CLI:**

```bash
# Install AWS CLI first
pip install awscli

# Configure credentials
aws configure

# Create bucket
aws s3 mb s3://africannet-media --region us-east-1
```

### 1.3 Set Bucket Policy (Public Read)

In AWS Console:
1. Go to your bucket → **Permissions** tab
2. Click **Bucket Policy**
3. Paste this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::africannet-media/*"
        }
    ]
}
```

4. Click "Save"

### 1.4 Create IAM User (Upload Credentials)

**Why:** Give the app upload access without exposing main AWS account.

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. **User name:** `africannet-app`
4. Click "Next"
5. Click "Attach policies directly"
6. Search and select: **AmazonS3FullAccess** (or see restricted policy below)
7. Click "Next" → "Create user"

**Create Access Keys:**
1. Click the user → **Security credentials** tab
2. **Access keys** section → "Create access key"
3. Choose "Application running on an AWS compute service"
4. Click "Next"
5. Copy and save:
   - Access Key ID
   - Secret Access Key

⚠️ **Save these securely!** You'll only see them once.

**Restricted Policy (More Secure):**

Instead of AmazonS3FullAccess, attach this inline policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::africannet-media/*"
        }
    ]
}
```

---

## Part 2: Django Configuration

### 2.1 Environment Setup

Update `.env` in the backend directory:

```bash
cp .env.example .env
```

Add to `.env`:

```env
# S3 Configuration
USE_S3=True
AWS_STORAGE_BUCKET_NAME=africannet-media
AWS_S3_REGION_NAME=us-east-1
AWS_S3_ACCESS_KEY_ID=your-access-key-id
AWS_S3_SECRET_ACCESS_KEY=your-secret-access-key
```

### 2.2 Test Upload Endpoint

Start the Django server:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

Visit http://localhost:8000/api/videos/ to test the API.

### 2.3 Upload via Django Shell

```bash
python manage.py shell
```

```python
from django.core.files.base import ContentFile
from api.models import Video
from django.contrib.auth.models import User

# Get or create user
user = User.objects.first()

# Create video with file
video = Video.objects.create(
    title="Test Video",
    description="Testing S3 upload",
    uploaded_by=user,
    duration=120
)

# Add video file
with open('/path/to/video.mp4', 'rb') as f:
    video.video_file.save('test-video.mp4', f)

# Add thumbnail
with open('/path/to/thumbnail.jpg', 'rb') as f:
    video.thumbnail.save('test-thumb.jpg', f)

video.save()
print(f"Video uploaded to: {video.video_file.url}")
```

---

## Part 3: Frontend Integration (Next.js)

### 3.1 Upload to Django Backend

Create a hook for uploads:

```javascript
// lib/useUpload.js
import { useState } from 'react';

export const useUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadVideo = async (file, title, description) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video_file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', Math.floor(file.duration || 0));

      const response = await fetch('http://localhost:8000/api/videos/', {
        method: 'POST',
        body: formData,
        // Add auth token if required:
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file, title, description) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch('http://localhost:8000/api/photos/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadVideo, uploadPhoto, loading, error };
};
```

### 3.2 Upload Component

```javascript
// components/VideoUploadForm.js
'use client';

import { useState } from 'react';
import { useUpload } from '@/lib/useUpload';

export default function VideoUploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const { uploadVideo, loading, error } = useUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const result = await uploadVideo(file, title, description);
      console.log('Upload successful:', result);
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="w-full"
          required
        />
      </div>

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

### 3.3 Direct S3 Upload (Advanced)

For large files, upload directly to S3 from frontend (faster):

**Backend endpoint to generate presigned URL:**

```python
# api/views.py - Add to VideoViewSet

from rest_framework.decorators import action
from rest_framework.response import Response
import boto3

@action(detail=False, methods=['post'])
def get_upload_url(self, request):
    """Generate presigned URL for direct S3 upload"""
    filename = request.data.get('filename')
    content_type = request.data.get('content_type')

    if not settings.USE_S3:
        return Response({'error': 'S3 not configured'}, status=400)

    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    try:
        presigned_url = s3_client.generate_presigned_post(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=f'videos/{filename}',
            Fields={
                'acl': 'public-read',
                'Content-Type': content_type,
            },
            Conditions=[
                {'acl': 'public-read'},
                {'Content-Type': content_type},
                ['content-length-range', 0, 5 * 1024 * 1024 * 1024]  # 5GB max
            ],
            ExpiresIn=3600
        )
        return Response(presigned_url)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
```

**Frontend upload using presigned URL:**

```javascript
const uploadToS3Direct = async (file) => {
  try {
    // 1. Get presigned URL from backend
    const urlResponse = await fetch('http://localhost:8000/api/videos/get_upload_url/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type,
      }),
    });

    const { url, fields } = await urlResponse.json();

    // 2. Upload directly to S3
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (uploadResponse.ok) {
      console.log('File uploaded successfully to S3');
      // Now create record in your database
      return `https://${bucket}.s3.amazonaws.com/videos/${file.name}`;
    }
  } catch (error) {
    console.error('S3 upload error:', error);
  }
};
```

---

## Part 4: Cost Optimization

### Free Tier Limits (12 months)

| Item | Free Limit | After Free |
|------|-----------|-----------|
| Storage | 5 GB | $0.023/GB |
| Requests (GET) | 20,000 | $0.0004/1000 |
| Requests (PUT) | 2,000 | $0.005/1000 |
| Data Transfer Out | 100 GB | $0.09/GB |

### Money-Saving Tips

1. **Use CloudFront CDN** (~$0.085/GB vs $0.09/GB)
   ```python
   # In settings.py
   AWS_S3_CUSTOM_DOMAIN = 'distribution-id.cloudfront.net'
   ```

2. **Enable S3 Intelligent-Tiering**
   - Auto-moves old files to cheaper storage
   - Saves 40-50% on long-term storage

3. **Set Lifecycle Rules**
   - Move videos to Glacier after 30 days ($0.004/GB)
   - Delete old thumbnails after 90 days

4. **Compress Videos**
   - Reduce file size → Lower storage + transfer costs
   - Example: 1GB video → 100MB (10x smaller)

### Glacier for Archival (Ultra-Cheap)

For old content you rarely access:

```python
# Lifecycle rule: Move to Glacier after 30 days
# Cost: $0.004/GB vs $0.023/GB
# Retrieval: 1-5 minutes, $0.10/GB retrieval fee
```

---

## Part 5: Testing

### Test Upload Workflow

```bash
# 1. Start Django
python manage.py runserver 8000

# 2. In another terminal, test with curl
curl -X POST http://localhost:8000/api/videos/ \
  -F "title=Test Video" \
  -F "description=Testing S3" \
  -F "video_file=@/path/to/video.mp4"

# 3. Check S3
aws s3 ls s3://africannet-media/videos/
```

### Monitor Costs

1. Go to [AWS Billing Dashboard](https://console.aws.amazon.com/billing/)
2. Click **Budgets** → Create budget
3. Set limit: $10/month (alerts if exceeded)
4. Enable email notifications

---

## Part 6: Troubleshooting

### "Access Denied" Error

**Solution:**
1. Verify AWS credentials in `.env`
2. Check IAM user has S3 permissions
3. Verify bucket name is correct

### "NoSuchBucket" Error

**Solution:**
- Bucket name must be globally unique
- Check spelling and region

### Files Not Public

**Solution:**
1. Check bucket policy allows public read
2. Check object ACL is set to "public-read"
3. In `settings.py`, verify `AWS_DEFAULT_ACL = 'public-read'`

### High Costs

**Solution:**
1. Review CloudWatch → S3 metrics
2. Check for accidental large uploads
3. Enable Intelligent-Tiering
4. Set lifecycle rules to archive old files

---

## Quick Reference

**Enable S3 in Django:**

```env
USE_S3=True
AWS_STORAGE_BUCKET_NAME=africannet-media
AWS_S3_ACCESS_KEY_ID=xxx
AWS_S3_SECRET_ACCESS_KEY=xxx
```

**File URLs:**
- Videos: `https://africannet-media.s3.amazonaws.com/videos/filename.mp4`
- Photos: `https://africannet-media.s3.amazonaws.com/photos/filename.jpg`
- Thumbnails: `https://africannet-media.s3.amazonaws.com/thumbnails/filename.jpg`

**API Endpoints:**
- List videos: `GET /api/videos/`
- Upload video: `POST /api/videos/`
- Get file URL: Check `video_file` field in response
