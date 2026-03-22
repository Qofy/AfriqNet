  import {sampleMovies} from "@/component/data/sampleData"
  // Sample continue watching data
  export const continueWatchingList = [
    {
      id: "cw1",
      title: "Quantum Nexus",
      backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
      progress: 65,
      year: 2024,
      timeLeft: "45 min"
    },
    {
      id: "cw2",
      title: "The Last Horizon",
      backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
      progress: 30,
      year: 2023,
      timeLeft: "1h 50min"
    },
    {
      id: "cw3",
      title: "Shadow Protocol",
      backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
      progress: 80,
      year: 2024,
      timeLeft: "20 min"
    },
    {
      id: "cw4",
      title: "Eternal Echoes",
      backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
      progress: 15,
      year: 2023,
      timeLeft: "2h 5min"
    }
  ];

  // Get different categories
 export const trendingMovies = sampleMovies.slice(0, 6);
  export const actionMovies = sampleMovies.filter(m => m.genre_ids.includes(28)).slice(0, 6);
  export const sciFiMovies = sampleMovies.filter(m => m.genre_ids.includes(878)).slice(0, 6);
  export const newReleases = sampleMovies.slice(10, 16);
