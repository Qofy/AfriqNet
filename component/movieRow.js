import MovieCardWithTrailer from "./MovieCardWithTrailer.client";

export const MovieRow = ({ title, movies, showSeeAll = true }) => (
  <div className="py-6 px-6">
    <div className="container mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {/* {showSeeAll && (
          <button className="text-[#a2cbf9] hover:text-white text-sm font-medium transition-colors">
            See All
          </button>
        )} */}
      </div>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {movies.map((movie) => (
          <MovieCardWithTrailer key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  </div>
);
