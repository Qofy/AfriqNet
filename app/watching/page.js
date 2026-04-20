import { getMovieById } from '@/lib/db.server';
import { verifyAuth } from '../../lib/auth';
import { redirect } from 'next/navigation';
import VideoPlayer from '../../component/VideoPlayer.client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function WatchingPage({ searchParams }) {
  const params = await searchParams;
  const movieId = params?.id;
  const autoplay = params?.autoplay === '1' || params?.autoplay === 'true';

  if (!movieId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">No movie specified. Append <code>?id=&lt;movieId&gt;</code> to the URL.</p>
      </div>
    );
  }

  const movie = getMovieById(movieId);
  const { session } = await verifyAuth();
  if (!session) {
    redirect('/');
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Movie not found.</p>
      </div>
    );
  }

  const streamUrl = `/api/stream/${movie.id}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-0 py-8 max-w-7xl">
        <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                  </Link>
        <h1 className="text-2xl font-bold mb-4 px-6">Now Playing: {movie.title}</h1>

        {/* Full-bleed video using client player with custom controls */}
        <div className="-mx-6 md:-mx-12 bg-black rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer
            src={streamUrl}
            autoplay={autoplay}
            className="w-full h-[70vh] sm:h-[80vh] md:h-[92vh]"
            contentId={movie.id}
          />
        </div>

        {/* <div className="mt-6 text-gray-300 max-w-4xl px-6">
          <p className="mb-2"><strong>Overview:</strong> {movie.overview}</p>
          <p className="mb-1"><strong>Release:</strong> {movie.release_date}</p>
          <p className="mb-1"><strong>Runtime:</strong> {movie.runtime} minutes</p>
        </div> */}
      </div>
    </div>
  );
}

