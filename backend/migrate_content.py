#!/usr/bin/env python
"""
Migrate content from db.server.js to Django backend
Imports movies, TV shows, and music videos
"""

import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africannet_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Video, Photo, MusicVideo


# Content data from db.server.js
MOVIES = [
  {
    "id": "m1",
    "title": "All The Devils Are There",
    "type": "Movie",
    "poster": "/images/movies/All-The-Devils-Are-Here-link2.webp",
    "backdrop": "/images/movies/All_the_Devils_Are_Here_poster.jpg",
    "rating": 8.5,
    "release_date": "2024-01-15",
    "overview": "A 'bottle thriller' centered on a post-heist getaway where the criminals' paranoia creates a 'submarine hell' atmosphere.",
    "genre_ids": [878, 53, 28],
    "runtime": 142,
    "tagline": "Reality is just the beginning",
    "video_stram": "/trailer/All-the-devils-are-there.mp4",
    "trailer": "/trailer/All-the-devils-are-there.mp4"
  },
  {
    "id": "m2",
    "title": "The Last Horizon",
    "type": "Movie",
    "poster": "/images/movies/gl-2-link2.jpg",
    "backdrop": "/images/movies/greenland-2.jpg",
    "rating": 7.8,
    "release_date": "2023-11-20",
    "overview": "A gripping tale of survival as humanity's last spaceship searches for a new home among the stars.",
    "genre_ids": [878, 12, 18],
    "runtime": 156,
    "tagline": "Our journey ends where hope begins",
    "video_stram": "/trailer/Under-the-stars.mp4",
    "trailer": "/trailer/Under-the-stars.mp4"
  },
  {
    "id": "m3",
    "title": "Greeland 2",
    "type": "Movie",
    "poster": "/images/movies/greenland-2.jpg",
    "backdrop": "/images/movies/gl-2-link2.jpg",
    "rating": 8.2,
    "release_date": "2024-02-10",
    "overview": "An action-packed survival thriller as humanity faces extinction from natural disasters.",
    "genre_ids": [28, 53, 80],
    "runtime": 128,
    "tagline": "Trust no one",
    "video_stram": "/trailer/Greeland-2.mp4",
    "trailer": "/trailer/Greeland-2.mp4"
  },
  {
    "id": "m4",
    "title": "War Machine",
    "type": "Movie",
    "poster": "/images/movies/war-machine.webp",
    "backdrop": "/images/movies/w-m-link2.jpg",
    "rating": 7.5,
    "release_date": "2024-03-22",
    "overview": "A military satire following a general tasked with ending the war in Afghanistan.",
    "genre_ids": [28, 12, 53],
    "runtime": 134,
    "tagline": "Strategy meets chaos",
    "video_stram": "",
    "trailer": "/trailer/WAR-MACHINE-Official-Trailer-Netflix.mp4"
  },
  {
    "id": "m5",
    "title": "Chief of War",
    "type": "Movie",
    "poster": "/images/movies/chief-of-war.jpg",
    "backdrop": "/images/movies/chief-f-w-link2.jpg",
    "rating": 7.2,
    "release_date": "2023-08-15",
    "overview": "An epic tale of power, conquest and the birth of the Hawaiian Kingdom.",
    "genre_ids": [35, 10751, 18],
    "runtime": 105,
    "tagline": "A kingdom forged in blood",
    "video_stram": "/trailer/chief-of-war.mp4",
    "trailer": "/trailer/chief-of-war.mp4"
  },
  {
    "id": "m6",
    "title": "Running Man",
    "type": "Movie",
    "poster": "/images/movies/the-running-man.jpg",
    "backdrop": "/images/movies/the-r-m-link2.jpg",
    "rating": 8.7,
    "release_date": "2023-10-31",
    "overview": "A dystopian action thriller where contestants fight for survival in a deadly game show.",
    "genre_ids": [14, 18, 10751, 28],
    "runtime": 118,
    "tagline": "Run or die",
    "video_stram": "/trailer/runningMan.mp4",
    "trailer": "/trailer/runningMan.mp4"
  },
  {
    "id": "m7",
    "title": "The Chef and I",
    "type": "Movie",
    "poster": "https://i.ytimg.com/vi/QItezpzarLQ/maxresdefault.jpg",
    "backdrop": "https://i.ytimg.com/vi/QItezpzarLQ/maxresdefault.jpg",
    "rating": 7.7,
    "release_date": "2024-03-05",
    "overview": "Follows an undercover restaurant worker trying to expose hidden truths within the business while balancing family expectations and a developing romance.",
    "genre_ids": [80, 53, 9648],
    "runtime": 130,
    "tagline": "The greatest heist ever told",
    "video_stram": "/movies/THE_CHEF_AND_I.mp4",
    "trailer": "/trailer/chief-of-war.mp4"
  }
]

MUSIC_VIDEOS = [
  {
    "id": "mv1",
    "title": "Oil On My Head",
    "artist": "Black Sherif",
    "type": "Music Video",
    "poster": "/images/music/oil-on-my-head.jpg",
    "backdrop": "/images/music/o-n-m-h-link2.jpg",
    "rating": 9.2,
    "release_date": "2024-03-15",
    "overview": "An energetic Afrobeats anthem celebrating the vibrant nightlife of Ghana. Stunning visuals showcase the city's culture and energy.",
    "genre_ids": [1, 9],
    "duration": "3:45",
    "views": "15.2M",
    "stream": "/trailer/music/oil-on-my-head.mp4"
  },
  {
    "id": "mv2",
    "title": "Sister Girl",
    "artist": "Juls ft Wande Coal",
    "type": "Music Video",
    "poster": "/images/music/juls-.webp",
    "backdrop": "/images/music/juls-link2.jpg",
    "rating": 9.5,
    "release_date": "2024-02-20",
    "overview": "A powerful fusion of traditional African sounds and modern production.",
    "genre_ids": [1, 8],
    "duration": "4:12",
    "views": "22.8M",
    "stream": "/trailer/music/Juls ft Wande Coal - Sister Girl (Dance Video) 720p.mp4"
  },
  {
    "id": "mv3",
    "title": "Ten Toes",
    "artist": "King Promise ft. fireboy",
    "type": "Music Video",
    "poster": "/images/music/ten-toes.jpg",
    "backdrop": "/images/music/t-t-link2.jpg",
    "rating": 8.8,
    "release_date": "2024-01-10",
    "overview": "A celebration of Ghanaian culture with infectious beats and colorful visuals.",
    "genre_ids": [2, 5],
    "duration": "3:28",
    "views": "18.5M",
    "stream": "/trailer/music/ten-toes(king-promise).mp4"
  },
  {
    "id": "mv4",
    "title": "Therapy",
    "artist": "Stone Bwoy",
    "type": "Music Video",
    "poster": "/images/music/therapy.png",
    "backdrop": "/images/music/tra-link2.jpg",
    "rating": 9.0,
    "release_date": "2023-12-28",
    "overview": "The kings of Amapiano deliver another hit with hypnotic rhythms and smooth production.",
    "genre_ids": [6],
    "duration": "4:35",
    "views": "25.1M",
    "stream": "/trailer/music/therapy(stone-bwoy).mp4"
  },
  {
    "id": "mv5",
    "title": "Soulful Journey",
    "artist": "Asa",
    "type": "Music Video",
    "poster": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500&q=80",
    "backdrop": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=1920&q=80",
    "rating": 8.7,
    "release_date": "2024-02-05",
    "overview": "An intimate and soulful performance that showcases Asa's incredible vocal range.",
    "genre_ids": [3, 10],
    "duration": "3:52",
    "views": "12.3M",
    "stream": "/trailer/WAR-MACHINE-Official-Trailer-Netflix.mp4"
  },
  {
    "id": "mv6",
    "title": "Blessed",
    "artist": "Nathaniel Bassey",
    "type": "Music Video",
    "poster": "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=500&q=80",
    "backdrop": "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1920&q=80",
    "rating": 9.3,
    "release_date": "2024-01-01",
    "overview": "An uplifting gospel anthem with powerful vocals and inspiring visuals.",
    "genre_ids": [4],
    "duration": "5:20",
    "views": "30.5M",
    "stream": "/trailer/All-the-devils-are-there.mp4"
  },
  {
    "id": "mv7",
    "title": "Island Rhythm",
    "artist": "Stonebwoy",
    "type": "Music Video",
    "poster": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80",
    "backdrop": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
    "rating": 8.9,
    "release_date": "2023-11-15",
    "overview": "A reggae-dancehall fusion that brings Caribbean vibes to West Africa.",
    "genre_ids": [7, 8],
    "duration": "3:35",
    "views": "16.7M",
    "stream": "/trailer/runningMan.mp4"
  },
  {
    "id": "mv8",
    "title": "Street Symphony",
    "artist": "Olamide",
    "type": "Music Video",
    "poster": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
    "backdrop": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&q=80",
    "rating": 8.6,
    "release_date": "2024-03-01",
    "overview": "Raw and authentic hip-hop from the streets of Lagos.",
    "genre_ids": [2],
    "duration": "3:15",
    "views": "20.2M",
    "stream": "/trailer/music/therapy(stone-bwoy).mp4"
  },
  {
    "id": "mv9",
    "title": "Love & Light",
    "artist": "Tiwa Savage",
    "type": "Music Video",
    "poster": "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=500&q=80",
    "backdrop": "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1920&q=80",
    "rating": 9.1,
    "release_date": "2024-02-14",
    "overview": "A romantic R&B ballad with elegant choreography and luxurious visuals.",
    "genre_ids": [3, 9],
    "duration": "4:05",
    "views": "19.8M",
    "stream": "/tailer/music/stir-up.mp4"
  },
  {
    "id": "mv10",
    "title": "Heritage",
    "artist": "M.anifest",
    "type": "Music Video",
    "poster": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    "backdrop": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80",
    "rating": 8.5,
    "release_date": "2023-10-20",
    "overview": "A thoughtful exploration of African heritage through hip-hop.",
    "genre_ids": [2, 5],
    "duration": "4:28",
    "views": "11.4M",
    "stream": "/trailer/Greeland-2.mp4"
  }
]


def migrate_movies():
    """Migrate movies to Django Video model"""
    print("\n📽️ Migrating Movies...")

    # Get or create default user
    user = User.objects.first()
    if not user:
        user = User.objects.create_user(username='admin', email='admin@africannet.com')
        print(f"  Created default user: {user.username}")

    created = 0
    for movie in MOVIES:
        try:
            video, created_flag = Video.objects.get_or_create(
                title=movie['title'],
                defaults={
                    'description': movie.get('overview', ''),
                    'uploaded_by': user,
                    'duration': movie.get('runtime', 0),
                    'views': 0,
                }
            )

            if created_flag:
                created += 1
                print(f"  ✅ {movie['title']} ({video.duration}s)")
            else:
                print(f"  ⏭️  {movie['title']} (already exists)")

        except Exception as e:
            print(f"  ❌ {movie['title']}: {e}")

    print(f"\n✅ Migrated {created} movies")


def migrate_music_videos():
    """Migrate music videos to Django MusicVideo model"""
    print("\n🎵 Migrating Music Videos...")

    user = User.objects.first()
    if not user:
        user = User.objects.create_user(username='admin', email='admin@africannet.com')

    created = 0
    for video in MUSIC_VIDEOS:
        try:
            music_video, created_flag = MusicVideo.objects.get_or_create(
                title=video['title'],
                artist=video['artist'],
                defaults={
                    'description': video.get('overview', ''),
                    'uploaded_by': user,
                    'duration': duration_to_seconds(video.get('duration', '0:00')),
                    'views': parse_views(video.get('views', '0')),
                }
            )

            if created_flag:
                created += 1
                print(f"  ✅ {video['artist']} - {video['title']}")
            else:
                print(f"  ⏭️  {video['artist']} - {video['title']} (already exists)")

        except Exception as e:
            print(f"  ❌ {video['title']}: {e}")

    print(f"\n✅ Migrated {created} music videos")


def duration_to_seconds(duration_str):
    """Convert duration string like '3:45' to seconds"""
    try:
        parts = duration_str.split(':')
        if len(parts) == 2:
            return int(parts[0]) * 60 + int(parts[1])
        return int(parts[0])
    except:
        return 0


def parse_views(views_str):
    """Parse view count like '15.2M' to integer"""
    try:
        if 'M' in views_str:
            return int(float(views_str.replace('M', '')) * 1000000)
        elif 'K' in views_str:
            return int(float(views_str.replace('K', '')) * 1000)
        return int(float(views_str))
    except:
        return 0


def main():
    print("🚀 Starting content migration to Django backend...\n")
    print(f"Database: {django.db.DEFAULT_DB_ALIAS}")

    try:
        migrate_movies()
        migrate_music_videos()

        print("\n" + "="*60)
        print("✅ Migration Complete!")
        print("="*60)
        print(f"\n📊 Summary:")
        print(f"  Videos (Movies): {Video.objects.count()}")
        print(f"  Music Videos: {MusicVideo.objects.count()}")
        print(f"\n🌐 Access your content:")
        print(f"  Admin: http://localhost:8000/admin/")
        print(f"  API Videos: http://localhost:8000/api/videos/")
        print(f"  API Music Videos: http://localhost:8000/api/music-videos/")

    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
