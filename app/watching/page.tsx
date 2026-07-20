import { getMovieById, getMusicVideoById } from '@/lib/db.server';
import { verifyAuth } from '../../lib/auth';
import { redirect } from 'next/navigation';
import VideoPlayer from '../../component/VideoPlayer.client';
import BackButton from '../../component/BackButton';

interface SearchParams {
  id?: string;
  type?: string;
  autoplay?: string;
}

interface Content {
  id: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

export default async function WatchingPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams;
  const movieId = params?.id;
  const type = params?.type; // 'movie' or 'music_video'
  const autoplay = params?.autoplay === '1' || params?.autoplay === 'true';

  if (!movieId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">No content specified. Append <code>?id=&lt;contentId&gt;</code> to the URL.</p>
      </div>
    );
  }

  // Try to get content - first try as movie, then as music video if not found
  let content: Content | null = getMovieById(movieId) as Content | null;
  let contentType = 'movie';

  if (!content) {
    content = getMusicVideoById(movieId) as Content | null;
    contentType = 'music_video';
  }

  // If type parameter is provided, use it to determine which function to call
  if (type === 'music_video') {
    content = getMusicVideoById(movieId) as Content | null;
    contentType = 'music_video';
  } else if (type === 'movie') {
    content = getMovieById(movieId) as Content | null;
    contentType = 'movie';
  }

  const { session } = await verifyAuth();
  if (!session) {
    redirect('/');
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Content not found.</p>
      </div>
    );
  }

  const streamUrl = `/api/stream/${content.id}?type=${contentType}`;
  const title = content.title || content.name;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-0 py-8 max-w-7xl">
        <BackButton />
        <h1 className="text-2xl font-bold mb-4 px-6">Now Playing: {title}</h1>

        {/* Full-bleed video using client player with custom controls */}
        <div className="-mx-6 md:-mx-12 bg-black rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer
            src={streamUrl}
            autoplay={autoplay}
            className="w-full h-[70vh] sm:h-[80vh] md:h-[92vh]"
            contentId={content.id}
          />
        </div>

        {/* <div className="mt-6 text-gray-300 max-w-4xl px-6">
          <p className="mb-2"><strong>Overview:</strong> {content.overview}</p>
          <p className="mb-1"><strong>Release:</strong> {content.release_date}</p>
          <p className="mb-1"><strong>Runtime:</strong> {content.runtime} minutes</p>
        </div> */}
      </div>
    </div>
  );
}

