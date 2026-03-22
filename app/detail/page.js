import { sampleMovies } from "@/component/data/sampleData";
import { MovieRow } from "@/component/movieRow";
import { MovieHero } from "@/component/MovieHero";
import { MovieOverview } from "@/component/MovieOverview";

export default async function DetailPage({ searchParams }) {
  const params = await searchParams;
  const movieId = params?.id;
  
  // Find the movie by ID from URL params
  const movie = sampleMovies.find(m => m.id === movieId) || sampleMovies[0];

  // Related/similar movies
  const relatedMovies = sampleMovies.slice(1, 7);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <MovieHero movie={movie} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Overview Content */}
        <MovieOverview movie={movie} />

        {/* Similar/Related Section */}
        <MovieRow title="More Like This" movies={relatedMovies} showSeeAll={false} />
      </div>
    </div>
  );
}
