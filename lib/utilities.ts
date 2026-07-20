import { sampleMovies } from "../component/data/sampleData";

interface Movie {
  [key: string]: unknown;
}

export default function FeaturedMovies(): Movie[] {
    const featureMovie: Movie[] = sampleMovies.slice(1, 5);
    return featureMovie;
}