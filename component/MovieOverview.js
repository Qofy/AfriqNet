export const MovieOverview = ({ movie }) => {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="relative">
          <p className="text-white/80 text-lg leading-relaxed">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-xl font-bold mb-3">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {movie.genre_ids && movie.genre_ids.map((id, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors cursor-pointer"
            >
              Genre {id}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};