from django.contrib import admin
from .models import Video, Photo, MusicVideo


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploaded_by', 'views', 'created_at']
    list_filter = ['created_at', 'views']
    search_fields = ['title', 'description']
    readonly_fields = ['views', 'created_at', 'updated_at']


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploaded_by', 'views', 'created_at']
    list_filter = ['created_at', 'views']
    search_fields = ['title', 'description']
    readonly_fields = ['views', 'created_at', 'updated_at']


@admin.register(MusicVideo)
class MusicVideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'uploaded_by', 'views', 'created_at']
    list_filter = ['created_at', 'views']
    search_fields = ['title', 'artist', 'description']
    readonly_fields = ['views', 'created_at', 'updated_at']
