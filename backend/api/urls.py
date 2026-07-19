from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, PhotoViewSet, MusicVideoViewSet

router = DefaultRouter()
router.register(r'videos', VideoViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'music-videos', MusicVideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
