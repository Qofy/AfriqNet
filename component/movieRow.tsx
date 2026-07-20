import MovieCardWithTrailer from "./MovieCardWithTrailer.client";

export const MovieRow = ({ title, movies, showSeeAll = true }) => (
  <div className="py-4 sm:py-6 px-3 sm:px-6">
    <div className="container mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {/* {showSeeAll && (
          <button className="text-[#a2cbf9] hover:text-white text-sm font-medium transition-colors">
            See All
          </button>
        )} */}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {movies.map((movie) => (
          <MovieCardWithTrailer key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  </div>
);
