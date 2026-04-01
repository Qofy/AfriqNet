import { sampleMovies, sampleTVShows } from "@/component/data/sampleData";
import { MovieRow } from "@/component/movieRow";
import { MovieHero } from "@/component/MovieHero";
import DetailTabs from "@/component/DetailTabs";

export default async function DetailPage({ searchParams }) {
  const params = await searchParams;
  const movieId = params?.id;

  // Find the content by ID from URL params (search both movies and TV shows)
  const allContent = [...sampleMovies, ...sampleTVShows];
  const movie = allContent.find((item) => item.id === movieId) || sampleMovies[0];

  // Related/similar movies
  const relatedMovies = sampleMovies.slice(1, 7);

  // Sample cast data (server-side)
  const cast = [
    { id: 1, name: "Sarah Mitchell", role: "Dr. Elena Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
    { id: 2, name: "James Rodriguez", role: "Marcus Stone", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
    { id: 3, name: "Emily Zhang", role: "Director", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
    { id: 4, name: "David Park", role: "Producer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  ];

  // Sample episodes (server-side)
  const episodes = [
    { id: 1, season: 1, episode: 1, title: "Pilot", duration: "45 min", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", description: "The series premiere." },
    { id: 2, season: 1, episode: 2, title: "The Awakening", duration: "42 min", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80", description: "Mysteries deepen." },
    { id: 3, season: 1, episode: 3, title: "New Horizons", duration: "44 min", thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80", description: "The journey continues." },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <MovieHero movie={movie} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Tabs (client) - passes server data as props */}
        <DetailTabs movie={movie} episodes={episodes} cast={cast} />

        {/* Similar/Related Section */}
        <MovieRow title="More Like This" movies={relatedMovies} showSeeAll={false} />
      </div>
    </div>
  );
}
