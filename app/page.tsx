import Image from "next/image";
import { Search, Clapperboard, Star, Smartphone, Download, Drama} from "lucide-react";
import FeaturedMovies from "@/lib/utilities"
import GeneralHeader from "@/component/GeneralHeader";

export default function Home() {
  const fm =FeaturedMovies()
  // console.log(fm)
  return (
    <>
    <GeneralHeader/>
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: 'url(/images/cover.png)'}}>
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="relative z-10">

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Unlimited
            <span className="text-[#006eeb]"> Movies</span>,
            <br />
            TV Shows & More
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Watch anywhere. Cancel anytime. Stream thousands of movies and TV shows 
            with unlimited access to entertainment.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for movies, TV shows..."
                className="w-full px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-color btn-hover text-white p-2 rounded-md transition-colors">
                <Search/>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-color btn-hover text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Featured Movies Preview */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fm.map((movie) => (
              <div key={movie?.id ?? Math.random()} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all cursor-pointer">
                <div className="h-100 bg-gradient-to-br from-[#38cff0] to-[#039aec] flex items-center justify-center relative overflow-hidden">
                  {movie ? (
                    // If the movie has an image path, render with Next/Image using `fill` so we don't need explicit width/height
                    movie.poster || movie.backdrop ? (
                      <Image
                        src={movie.poster ?? movie.backdrop}
                        alt={movie.title ?? 'Movie poster'}
                        fill
                        className="object-cover object-center"
                        priority={false}
                      />
                    ) : (
                      <Clapperboard className="text-white" />
                    )
                  ) : (
                    <Clapperboard className="text-white" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2">{movie?.title ?? 'Untitled'}</h3>
                  <p className="text-gray-300 text-sm">• {movie.type} • {movie?.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
                  <div className="flex items-center mt-2">
                    <Star size={16} color="yellow" fill="yellow"/>
                    <span className="text-white ml-1 text-sm">{movie?.rating ?? '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 btn-color rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone/>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Watch Everywhere</h3>
            <p className="text-gray-300">Stream on your phone, tablet, laptop, and TV without paying more.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 btn-color rounded-full flex items-center justify-center mx-auto mb-4">
             <Download/>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Download & Go</h3>
            <p className="text-gray-300">Download your favorites to watch offline on the go.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 btn-color rounded-full flex items-center justify-center mx-auto mb-4">
              <Drama/>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Unlimited Entertainment</h3>
            <p className="text-gray-300">Thousands of movies and TV shows with new content added regularly.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm mt-24 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© 2026 MovieStream. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
    </>
  );
}
