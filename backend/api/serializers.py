from rest_framework import serializers
from .models import Video, Photo, MusicVideo
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class VideoSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'video_file', 'thumbnail',
                  'uploaded_by', 'duration', 'views', 'created_at', 'updated_at']
        read_only_fields = ['views', 'created_at', 'updated_at', 'uploaded_by']


class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = Photo
        fields = ['id', 'title', 'description', 'image', 'uploaded_by',
                  'views', 'created_at', 'updated_at']
        read_only_fields = ['views', 'created_at', 'updated_at', 'uploaded_by']


class MusicVideoSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = MusicVideo
        fields = ['id', 'title', 'artist', 'description', 'video_file',
                  'thumbnail', 'uploaded_by', 'duration', 'views', 'created_at', 'updated_at']
        read_only_fields = ['views', 'created_at', 'updated_at', 'uploaded_by']
