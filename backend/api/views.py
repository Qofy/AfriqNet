from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.conf import settings
from .models import Video, Photo, MusicVideo
from .serializers import VideoSerializer, PhotoSerializer, MusicVideoSerializer
import boto3
import os


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        video = self.get_object()
        video.views += 1
        video.save()
        return Response({'views': video.views})

    @action(detail=False, methods=['post'])
    def get_upload_url(self, request):
        """Generate presigned URL for direct S3 video upload"""
        if not settings.USE_S3:
            return Response({'error': 'S3 not configured'}, status=400)

        filename = request.data.get('filename')
        content_type = request.data.get('content_type', 'video/mp4')

        if not filename:
            return Response({'error': 'filename required'}, status=400)

        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )

            presigned_url = s3_client.generate_presigned_post(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=f'videos/{filename}',
                Fields={'acl': 'public-read', 'Content-Type': content_type},
                Conditions=[
                    {'acl': 'public-read'},
                    {'Content-Type': content_type},
                    ['content-length-range', 0, 5 * 1024 * 1024 * 1024]
                ],
                ExpiresIn=3600
            )
            return Response(presigned_url)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        photo = self.get_object()
        photo.views += 1
        photo.save()
        return Response({'views': photo.views})

    @action(detail=False, methods=['post'])
    def get_upload_url(self, request):
        """Generate presigned URL for direct S3 photo upload"""
        if not settings.USE_S3:
            return Response({'error': 'S3 not configured'}, status=400)

        filename = request.data.get('filename')
        content_type = request.data.get('content_type', 'image/jpeg')

        if not filename:
            return Response({'error': 'filename required'}, status=400)

        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )

            presigned_url = s3_client.generate_presigned_post(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=f'photos/{filename}',
                Fields={'acl': 'public-read', 'Content-Type': content_type},
                Conditions=[
                    {'acl': 'public-read'},
                    {'Content-Type': content_type},
                    ['content-length-range', 0, 100 * 1024 * 1024]
                ],
                ExpiresIn=3600
            )
            return Response(presigned_url)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class MusicVideoViewSet(viewsets.ModelViewSet):
    queryset = MusicVideo.objects.all()
    serializer_class = MusicVideoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        music_video = self.get_object()
        music_video.views += 1
        music_video.save()
        return Response({'views': music_video.views})

    @action(detail=False, methods=['post'])
    def get_upload_url(self, request):
        """Generate presigned URL for direct S3 music video upload"""
        if not settings.USE_S3:
            return Response({'error': 'S3 not configured'}, status=400)

        filename = request.data.get('filename')
        content_type = request.data.get('content_type', 'video/mp4')

        if not filename:
            return Response({'error': 'filename required'}, status=400)

        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )

            presigned_url = s3_client.generate_presigned_post(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=f'music_videos/{filename}',
                Fields={'acl': 'public-read', 'Content-Type': content_type},
                Conditions=[
                    {'acl': 'public-read'},
                    {'Content-Type': content_type},
                    ['content-length-range', 0, 5 * 1024 * 1024 * 1024]
                ],
                ExpiresIn=3600
            )
            return Response(presigned_url)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
