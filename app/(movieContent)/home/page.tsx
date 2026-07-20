import ContinueWatching from "@/component/continueWatching";
import MovieSlider from "@/component/moviesSlider";
import { MovieRow } from "../../../component/movieRow";
import { getContinueWatchingList, getTrendingMovies, getActionMovies, getNewReleases, getSciFiMovies } from "../../../lib/continue.server";
// import {sampleMovies} from "@/component/data/sampleData"
import { getAllMovies } from "../../../lib/db.server";
  




export default function HomePage() {
    const sampleMovies = getAllMovies();
    if(!sampleMovies){
      throw new Error ("Something went wrong! Unable to load movies")
    }

    const continueWatchingList = getContinueWatchingList();
    const trendingMovies = getTrendingMovies();
    const actionMovies = getActionMovies();
    const sciFiMovies = getSciFiMovies();
    const newReleases = getNewReleases();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Slider */}
      <MovieSlider movies={sampleMovies.slice(0, 8)} />

      {/* Continue Watching */}
      {continueWatchingList.length > 0 && (
        <ContinueWatching watchingList={continueWatchingList} />
      )}

      {/* Trending Now */}
      <MovieRow title="Trending Now" movies={trendingMovies} />

      {/* Action Movies */}
      <MovieRow title="Action Packed" movies={actionMovies} />

      {/* Sci-Fi Collection */}
      <MovieRow title="Sci-Fi Universe" movies={sciFiMovies} />

      {/* New Releases */}
      <MovieRow title="New Releases" movies={newReleases} />

      {/* Popular on AfriqNet */}
      <MovieRow 
        title="Popular on AfriqNet" 
        movies={sampleMovies.slice(5, 11)} 
      />

      {/* <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style> */}
    </div>
  );
}