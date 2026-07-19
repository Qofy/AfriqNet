# AfriqNet Backend - Django REST API

Django backend for AfriqNet with S3 integration for video and photo storage.

## Project Structure

```
backend/
├── africannet_backend/     # Django project settings
│   ├── settings.py        # Project configuration
│   ├── urls.py            # URL routing
│   ├── wsgi.py            # WSGI for production
│   └── __init__.py
├── api/                    # Main API app
│   ├── models.py          # Video, Photo, MusicVideo models
│   ├── views.py           # REST API viewsets
│   ├── serializers.py     # Data serialization
│   ├── urls.py            # API routes
│   ├── admin.py           # Admin interface
│   └── __init__.py
├── manage.py              # Django CLI
├── requirements.txt       # Python dependencies
└── .env.example          # Environment variables template
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env and set your values
```

### 4. Database Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver 8000
```

Visit:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

## API Endpoints

### Videos
- `GET /api/videos/` - List all videos
- `POST /api/videos/` - Create video
- `GET /api/videos/{id}/` - Video details
- `PATCH /api/videos/{id}/` - Update video
- `DELETE /api/videos/{id}/` - Delete video
- `POST /api/videos/{id}/increment_views/` - Add view count

### Photos
- `GET /api/photos/` - List all photos
- `POST /api/photos/` - Create photo
- `GET /api/photos/{id}/` - Photo details
- `PATCH /api/photos/{id}/` - Update photo
- `DELETE /api/photos/{id}/` - Delete photo
- `POST /api/photos/{id}/increment_views/` - Add view count

### Music Videos
- `GET /api/music-videos/` - List all music videos
- `POST /api/music-videos/` - Create music video
- `GET /api/music-videos/{id}/` - Music video details
- `PATCH /api/music-videos/{id}/` - Update music video
- `DELETE /api/music-videos/{id}/` - Delete music video
- `POST /api/music-videos/{id}/increment_views/` - Add view count

## AWS S3 Setup (Free Tier)

### 1. Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://your-bucket-name --region us-east-1
```

### 2. Set Bucket Policy (Public Read Access)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### 3. Configure Environment

Update `.env`:
```
USE_S3=True
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_ACCESS_KEY_ID=your-access-key
AWS_S3_SECRET_ACCESS_KEY=your-secret-key
```

### 4. Upload Static Files

```bash
python manage.py collectstatic
```

## Development Notes

- SQLite is used for development (auto-configured)
- CORS is configured to accept requests from Next.js frontend (localhost:3000)
- Authentication uses Django REST Token (included in requirements)
- File uploads are saved to `media/` locally or S3 when `USE_S3=True`

## Production Deployment

See `../docs/DEPLOYMENT.md` for AWS EC2 deployment instructions.
