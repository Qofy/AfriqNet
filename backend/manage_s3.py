#!/usr/bin/env python
"""
S3 Management Helper Script
Simplifies S3 bucket operations and testing
"""

import os
import sys
import django
import argparse
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africannet_backend.settings')
django.setup()

from django.conf import settings
import boto3
from api.models import Video, Photo, MusicVideo


def init_s3_client():
    """Initialize S3 client"""
    if not settings.USE_S3:
        print("❌ S3 is not enabled. Set USE_S3=True in .env")
        sys.exit(1)

    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )


def test_connection():
    """Test S3 connection"""
    try:
        s3 = init_s3_client()
        s3.head_bucket(Bucket=settings.AWS_STORAGE_BUCKET_NAME)
        print(f"✅ Successfully connected to S3 bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False


def list_files(prefix='', limit=20):
    """List files in S3 bucket"""
    try:
        s3 = init_s3_client()
        response = s3.list_objects_v2(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Prefix=prefix,
            MaxKeys=limit
        )

        if 'Contents' not in response:
            print("No files found")
            return

        print(f"\n📁 Files in {settings.AWS_STORAGE_BUCKET_NAME}/{prefix}:")
        print("-" * 60)
        for obj in response['Contents']:
            size_mb = obj['Size'] / (1024 * 1024)
            print(f"  {obj['Key']:45} {size_mb:>8.2f} MB")
        print("-" * 60)
    except Exception as e:
        print(f"❌ Error: {e}")


def get_bucket_stats():
    """Get bucket statistics"""
    try:
        s3 = init_s3_client()

        # Get bucket size
        response = s3.list_objects_v2(Bucket=settings.AWS_STORAGE_BUCKET_NAME)

        total_size = 0
        total_files = 0
        if 'Contents' in response:
            for obj in response['Contents']:
                total_size += obj['Size']
                total_files += 1

        size_gb = total_size / (1024 * 1024 * 1024)

        print(f"\n📊 Bucket Statistics:")
        print(f"  Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
        print(f"  Region: {settings.AWS_S3_REGION_NAME}")
        print(f"  Files: {total_files}")
        print(f"  Total Size: {size_gb:.2f} GB")

        # Get videos count from database
        video_count = Video.objects.count()
        photo_count = Photo.objects.count()
        music_count = MusicVideo.objects.count()

        print(f"\n📹 Database:")
        print(f"  Videos: {video_count}")
        print(f"  Photos: {photo_count}")
        print(f"  Music Videos: {music_count}")

    except Exception as e:
        print(f"❌ Error: {e}")


def clean_bucket(prefix=''):
    """Delete files from S3 bucket"""
    try:
        s3 = init_s3_client()
        response = s3.list_objects_v2(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Prefix=prefix
        )

        if 'Contents' not in response:
            print("No files to delete")
            return

        print(f"⚠️  This will delete {len(response['Contents'])} files")
        confirm = input("Are you sure? (yes/no): ")

        if confirm.lower() != 'yes':
            print("Cancelled")
            return

        for obj in response['Contents']:
            s3.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=obj['Key']
            )
            print(f"  Deleted: {obj['Key']}")

        print(f"✅ Deleted {len(response['Contents'])} files")

    except Exception as e:
        print(f"❌ Error: {e}")


def create_test_video():
    """Create a test video entry"""
    from django.contrib.auth.models import User
    from django.core.files.base import ContentFile

    try:
        user = User.objects.first()
        if not user:
            print("❌ No users found. Create a superuser first: python manage.py createsuperuser")
            return

        video = Video.objects.create(
            title="Test Video",
            description="This is a test video from the management script",
            uploaded_by=user,
            duration=120
        )

        # Create a small test file
        test_content = b"This is a test video file content"
        video.video_file.save('test-video.mp4', ContentFile(test_content))
        video.save()

        print(f"✅ Test video created:")
        print(f"  Title: {video.title}")
        print(f"  URL: {video.video_file.url}")

    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    parser = argparse.ArgumentParser(description='S3 Management Helper')
    parser.add_argument('command', choices=[
        'test', 'list', 'stats', 'clean', 'create-test'
    ], help='Command to execute')
    parser.add_argument('--prefix', default='', help='S3 prefix filter')
    parser.add_argument('--limit', type=int, default=20, help='Max items to list')

    args = parser.parse_args()

    if args.command == 'test':
        test_connection()
    elif args.command == 'list':
        list_files(args.prefix, args.limit)
    elif args.command == 'stats':
        get_bucket_stats()
    elif args.command == 'clean':
        clean_bucket(args.prefix)
    elif args.command == 'create-test':
        create_test_video()


if __name__ == '__main__':
    main()
