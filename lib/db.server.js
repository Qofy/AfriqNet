import { getFirestoreDb } from './firebase.server';

// ============================================================================
// STATIC CONTENT DATA (hardcoded, no database queries)
// ============================================================================

const staticMovies = [
  {
    id: 'm1',
    title: 'All The Devils Are There',
    type: 'Movie',
    poster: '/images/movies/All-The-Devils-Are-Here-link2.webp',
    backdrop: '/images/movies/All_the_Devils_Are_Here_poster.jpg',
    rating: 8.5,
    release_date: '2024-01-15',
    overview:
      "A 'bottle thriller' centered on a post-heist getaway where the criminals' paranoia creates a 'submarine hell' atmosphere.",
    genre_ids: [878, 53, 28],
    runtime: 142,
    tagline: 'Reality is just the beginning',
    video_stram: '/trailer/All-the-devils-are-there.mp4',
    trailer: '/trailer/All-the-devils-are-there.mp4'
  },
  {
    id: 'm2',
    title: 'The Last Horizon',
    type: 'Movie',
    poster: '/images/movies/gl-2-link2.jpg',
    backdrop: '/images/movies/greenland-2.jpg',
    rating: 7.8,
    release_date: '2023-11-20',
    overview:
      "A gripping tale of survival as humanity's last spaceship searches for a new home among the stars.",
    genre_ids: [878, 12, 18],
    runtime: 156,
    tagline: 'Our journey ends where hope begins',
    video_stram: '/trailer/Under-the-stars.mp4',
    trailer: '/trailer/Under-the-stars.mp4'
  },
  {
    id: 'm3',
    title: 'Greeland 2',
    type: 'Movie',
    poster: '/images/movies/greenland-2.jpg',
    backdrop: '/images/movies/gl-2-link2.jpg',
    rating: 8.2,
    release_date: '2024-02-10',
    overview: 'An action-packed survival thriller as humanity faces extinction from natural disasters.',
    genre_ids: [28, 53, 80],
    runtime: 128,
    tagline: 'Trust no one',
    video_stram: '/trailer/Greeland-2.mp4',
    trailer: '/trailer/Greeland-2.mp4'
  },
  {
    id: 'm4',
    title: 'War Machine',
    type: 'Movie',
    poster: '/images/movies/war-machine.webp',
    backdrop: '/images/movies/w-m-link2.jpg',
    rating: 7.5,
    release_date: '2024-03-22',
    overview: 'A military satire following a general tasked with ending the war in Afghanistan.',
    genre_ids: [28, 12, 53],
    runtime: 134,
    tagline: 'Strategy meets chaos',
    video_stram: '',
    trailer: '/trailer/WAR-MACHINE-Official-Trailer-Netflix.mp4'
  },
  {
    id: 'm5',
    title: 'Chief of War',
    type: 'Movie',
    poster: '/images/movies/chief-of-war.jpg',
    backdrop: '/images/movies/chief-f-w-link2.jpg',
    rating: 7.2,
    release_date: '2023-08-15',
    overview: 'An epic tale of power, conquest and the birth of the Hawaiian Kingdom.',
    genre_ids: [35, 10751, 18],
    runtime: 105,
    tagline: 'A kingdom forged in blood',
    video_stram: '/trailer/chief-of-war.mp4',
    trailer: '/trailer/chief-of-war.mp4'
  },
  {
    id: 'm6',
    title: 'Running Man',
    type: 'Movie',
    poster: '/images/movies/the-running-man.jpg',
    backdrop: '/images/movies/the-r-m-link2.jpg',
    rating: 8.7,
    release_date: '2023-10-31',
    overview:
      'A dystopian action thriller where contestants fight for survival in a deadly game show.',
    genre_ids: [14, 18, 10751, 28],
    runtime: 118,
    tagline: 'Run or die',
    video_stram: '/trailer/runningMan.mp4',
    trailer: '/trailer/runningMan.mp4'
  },
  {
    id: 'm7',
    title: 'The Chief and I',
    type: 'Movie',
    poster: 'https://i.ytimg.com/vi/QItezpzarLQ/maxresdefault.jpg',
    backdrop: 'https://i.ytimg.com/vi/QItezpzarLQ/maxresdefault.jpg',
    rating: 7.7,
    release_date: '2024-03-05',
    overview:
      'Follows an undercover restaurant worker trying to expose hidden truths within the business while balancing family expectations and a developing romance.',
    genre_ids: [80, 53, 9648],
    runtime: 130,
    tagline: 'The greatest heist ever told',
    video_stram: '/movies/THE_CHEF_AND_I.mp4',
    trailer: '/trailer/chief-of-war.mp4'
  }
];

const staticTVShows = [
  {
    id: 'tv1',
    name: 'Nebula Station',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&q=80',
    rating: 9.2,
    first_air_date: '2022-03-15',
    overview: 'A groundbreaking sci-fi series set on a space station at the edge of explored space.',
    genre_ids: [10765, 18],
    number_of_seasons: 3,
    status: 'Returning Series'
  },
  {
    id: 'tv2',
    name: 'Crown of Thorns',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1532103054090-3491f1a05d0d?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1532103054090-3491f1a05d0d?w=1920&q=80',
    rating: 8.9,
    first_air_date: '2021-09-20',
    overview: 'A historical drama chronicling the rise and fall of a medieval dynasty.',
    genre_ids: [18, 10768],
    number_of_seasons: 4,
    status: 'Returning Series'
  },
  {
    id: 'tv3',
    name: 'Detective Bureau',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1920&q=80',
    rating: 8.5,
    first_air_date: '2023-01-10',
    overview: 'A gritty crime procedural following an elite detective unit.',
    genre_ids: [80, 9648, 18],
    number_of_seasons: 2,
    status: 'Returning Series'
  },
  {
    id: 'tv4',
    name: 'Laugh Track',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1920&q=80',
    rating: 7.8,
    first_air_date: '2022-08-05',
    overview:
      'A hilarious sitcom about aspiring comedians trying to make it in the cutthroat world of stand-up comedy.',
    genre_ids: [35],
    number_of_seasons: 3,
    status: 'Returning Series'
  },
  {
    id: 'tv5',
    name: 'The Experiment',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    rating: 8.7,
    first_air_date: '2023-05-12',
    overview: 'A psychological thriller about participants in a mysterious social experiment.',
    genre_ids: [9648, 10765, 18],
    number_of_seasons: 2,
    status: 'Returning Series'
  },
  {
    id: 'tv6',
    name: 'Culinary Wars',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80',
    rating: 7.5,
    first_air_date: '2022-11-18',
    overview: 'Top chefs compete in culinary challenges that test their skills, creativity, and resilience.',
    genre_ids: [10764],
    number_of_seasons: 4,
    status: 'Returning Series'
  },
  {
    id: 'tv7',
    name: 'Bloodline Legacy',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80',
    rating: 8.3,
    first_air_date: '2021-10-22',
    overview:
      'A vampire drama that reinvents the genre with fresh mythology and compelling characters.',
    genre_ids: [10765, 18],
    number_of_seasons: 3,
    status: 'Returning Series'
  },
  {
    id: 'tv8',
    name: 'Tech Titans',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80',
    rating: 8.0,
    first_air_date: '2023-02-08',
    overview: 'A drama about Silicon Valley startups, tech innovation, and the price of success.',
    genre_ids: [18],
    number_of_seasons: 1,
    status: 'Returning Series'
  },
  {
    id: 'tv9',
    name: 'Family Bonds',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80',
    rating: 7.2,
    first_air_date: '2022-04-15',
    overview:
      "A heartwarming family drama that explores multiple generations navigating life's challenges together.",
    genre_ids: [18, 10751],
    number_of_seasons: 2,
    status: 'Returning Series'
  },
  {
    id: 'tv10',
    name: 'The Underground',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&q=80',
    rating: 8.6,
    first_air_date: '2023-06-30',
    overview: 'A music-driven drama about underground artists fighting for recognition in the hip-hop scene.',
    genre_ids: [18],
    number_of_seasons: 1,
    status: 'Returning Series'
  },
  {
    id: 'tv11',
    name: 'Wildlands',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    rating: 8.8,
    first_air_date: '2022-07-20',
    overview:
      "A nature documentary series showcasing Earth's most breathtaking wilderness areas and the animals that inhabit them.",
    genre_ids: [99],
    number_of_seasons: 2,
    status: 'Returning Series'
  },
  {
    id: 'tv12',
    name: 'Lost Signals',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
    rating: 8.1,
    first_air_date: '2023-09-15',
    overview: 'A sci-fi mystery about strange radio signals from deep space and the team trying to decode them.',
    genre_ids: [10765, 9648],
    number_of_seasons: 1,
    status: 'Returning Series'
  },
  {
    id: 'tv13',
    name: 'Comedy Central Stage',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80',
    rating: 7.6,
    first_air_date: '2022-05-10',
    overview:
      'Stand-up specials from the hottest comedians on the circuit. Fresh voices and bold comedy that pushes boundaries.',
    genre_ids: [35],
    number_of_seasons: 3,
    status: 'Returning Series'
  },
  {
    id: 'tv14',
    name: 'Shadow Games',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&q=80',
    rating: 9.0,
    first_air_date: '2021-11-05',
    overview:
      'An espionage thriller with international intrigue, double-crosses, and high-stakes missions.',
    genre_ids: [10759, 18],
    number_of_seasons: 3,
    status: 'Returning Series'
  },
  {
    id: 'tv15',
    name: 'Time Loops',
    type: 'tv',
    poster: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1920&q=80',
    rating: 8.4,
    first_air_date: '2023-04-01',
    overview:
      'A sci-fi anthology series exploring different time travel scenarios. Each episode is a standalone story with innovative concepts and emotional depth.',
    genre_ids: [10765, 18],
    number_of_seasons: 1,
    status: 'Returning Series'
  }
];

const staticMusicVideos = [
  {
    id: 'mv1',
    title: 'Oil On My Head',
    artist: 'Black Sherif',
    type: 'Music Video',
    poster: '/images/music/oil-on-my-head.jpg',
    backdrop: '/images/music/o-n-m-h-link2.jpg',
    rating: 9.2,
    release_date: '2024-03-15',
    overview:
      "An energetic Afrobeats anthem celebrating the vibrant nightlife of Ghana. Stunning visuals showcase the city's culture and energy.",
    genre_ids: [1, 9],
    duration: '3:45',
    views: '15.2M',
    stream: '/trailer/music/oil-on-my-head.mp4'
  },
  {
    id: 'mv2',
    title: 'Sister Girl',
    artist: 'Juls ft Wande Coal',
    type: 'Music Video',
    poster: '/images/music/juls-.webp',
    backdrop: '/images/music/juls-link2.jpg',
    rating: 9.5,
    release_date: '2024-02-20',
    overview:
      'A powerful fusion of traditional African sounds and modern production. The video features breathtaking cinematography across various African landscapes.',
    genre_ids: [1, 8],
    duration: '4:12',
    views: '22.8M',
    stream: '/trailer/music/stir-up.mp4'
  },
  {
    id: 'mv3',
    title: 'Ten Toes',
    artist: 'King Promise ft. fireboy',
    type: 'Music Video',
    poster: '/images/music/ten-toes.jpg',
    backdrop: '/images/music/t-t-link2.jpg',
    rating: 8.8,
    release_date: '2024-01-10',
    overview:
      "A celebration of Ghanaian culture with infectious beats and colorful visuals. The collaboration brings together two of Ghana's finest artists.",
    genre_ids: [2, 5],
    duration: '3:28',
    views: '18.5M',
    stream: '/trailer/music/ten-toes(king-promise).mp4'
  },
  {
    id: 'mv4',
    title: 'Therapy',
    artist: 'Stone Bwoy',
    type: 'Music Video',
    poster: '/images/music/therapy.png',
    backdrop: '/images/music/tra-link2.jpg',
    rating: 9.0,
    release_date: '2023-12-28',
    overview:
      "The kings of Amapiano deliver another hit with hypnotic rhythms and smooth production. Shot in the heart of Johannesburg's music scene.",
    genre_ids: [6],
    duration: '4:35',
    views: '25.1M',
    stream: '/trailer/music/therapy(stone-bwoy).mp4'
  },
  {
    id: 'mv5',
    title: 'Soulful Journey',
    artist: 'Asa',
    type: 'Music Video',
    poster: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=1920&q=80',
    rating: 8.7,
    release_date: '2024-02-05',
    overview:
      "An intimate and soulful performance that showcases Asa's incredible vocal range and emotional depth. Minimalist visuals that let the music speak.",
    genre_ids: [3, 10],
    duration: '3:52',
    views: '12.3M',
    stream: '/trailer/WAR-MACHINE-Official-Trailer-Netflix.mp4'
  },
  {
    id: 'mv6',
    title: 'Blessed',
    artist: 'Nathaniel Bassey',
    type: 'Music Video',
    poster: 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1920&q=80',
    rating: 9.3,
    release_date: '2024-01-01',
    overview:
      'An uplifting gospel anthem with powerful vocals and inspiring visuals. Perfect for worship and meditation.',
    genre_ids: [4],
    duration: '5:20',
    views: '30.5M',
    stream: '/trailer/All-the-devils-are-there.mp4'
  },
  {
    id: 'mv7',
    title: 'Island Rhythm',
    artist: 'Stonebwoy',
    type: 'Music Video',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80',
    rating: 8.9,
    release_date: '2023-11-15',
    overview:
      'A reggae-dancehall fusion that brings Caribbean vibes to West Africa. Shot on beautiful tropical beaches with stunning sunset scenes.',
    genre_ids: [7, 8],
    duration: '3:35',
    views: '16.7M',
    stream: '/trailer/runningMan.mp4'
  },
  {
    id: 'mv8',
    title: 'Street Symphony',
    artist: 'Olamide',
    type: 'Music Video',
    poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&q=80',
    rating: 8.6,
    release_date: '2024-03-01',
    overview:
      'Raw and authentic hip-hop from the streets of Lagos. Olamide delivers hard-hitting bars over a trap-influenced beat.',
    genre_ids: [2],
    duration: '3:15',
    views: '20.2M',
    stream: '/trailer/music/therapy(stone-bwoy).mp4'
  },
  {
    id: 'mv9',
    title: 'Love & Light',
    artist: 'Tiwa Savage',
    type: 'Music Video',
    poster: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1920&q=80',
    rating: 9.1,
    release_date: '2024-02-14',
    overview:
      'A romantic R&B ballad with elegant choreography and luxurious visuals. Tiwa Savage at her finest.',
    genre_ids: [3, 9],
    duration: '4:05',
    views: '19.8M',
    stream: '/tailer/music/stir-up.mp4'
  },
  {
    id: 'mv10',
    title: 'Heritage',
    artist: 'M.anifest',
    type: 'Music Video',
    poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80',
    rating: 8.5,
    release_date: '2023-10-20',
    overview:
      'A thoughtful exploration of African heritage through hip-hop. Features traditional instruments blended with modern production.',
    genre_ids: [2, 5],
    duration: '4:28',
    views: '11.4M',
    stream: '/trailer/Greeland-2.mp4'
  }
];

const staticGenres = [
  [28, 'Action', 'movie'],
  [12, 'Adventure', 'movie'],
  [16, 'Animation', 'movie'],
  [35, 'Comedy', 'movie'],
  [80, 'Crime', 'movie'],
  [99, 'Documentary', 'movie'],
  [18, 'Drama', 'movie'],
  [14, 'Fantasy', 'movie'],
  [27, 'Horror', 'movie'],
  [9648, 'Mystery', 'movie'],
  [10749, 'Romance', 'movie'],
  [878, 'Sci-Fi', 'movie'],
  [53, 'Thriller', 'movie'],
  [10759, 'Action & Adventure', 'tv'],
  [10765, 'Sci-Fi & Fantasy', 'tv'],
  [10768, 'War & Politics', 'tv'],
  [10764, 'Reality', 'tv'],
  [1, 'Afrobeats', 'music'],
  [2, 'Hip Hop', 'music'],
  [3, 'R&B', 'music'],
  [4, 'Gospel', 'music'],
  [5, 'Highlife', 'music'],
  [6, 'Amapiano', 'music'],
  [7, 'Dancehall', 'music'],
  [8, 'Reggae', 'music'],
  [9, 'Pop', 'music'],
  [10, 'Soul', 'music']
];

// ============================================================================
// STATIC CONTENT FUNCTIONS (synchronous, no database queries)
// ============================================================================

export function getAllMovies() {
  return staticMovies.map(movie => ({
    ...movie,
    genre_ids: movie.genre_ids || [],
    videoStream: movie.video_stram || null,
    trailer: movie.trailer || null
  }));
}

export function getAllTVShows() {
  return staticTVShows.map(show => ({
    ...show,
    genre_ids: show.genre_ids || []
  }));
}

export function getAllMusicVideos() {
  return staticMusicVideos.map(video => ({
    ...video,
    genre_ids: video.genre_ids || [],
    stream: video.stream || null
  }));
}

export function getMovieById(id) {
  const movie = staticMovies.find(m => m.id === id);
  if (movie) {
    return {
      ...movie,
      genre_ids: movie.genre_ids || [],
      videoStream: movie.video_stram || null,
      trailer: movie.trailer || null
    };
  }
  return null;
}

export function getTVShowById(id) {
  const show = staticTVShows.find(s => s.id === id);
  if (show) {
    return {
      ...show,
      genre_ids: show.genre_ids || []
    };
  }
  return null;
}

export function getMusicVideoById(id) {
  const video = staticMusicVideos.find(m => m.id === id);
  if (video) {
    return {
      ...video,
      genre_ids: video.genre_ids || [],
      stream: video.stream || null
    };
  }
  return null;
}

export function getGenresByType(type) {
  return staticGenres
    .filter(g => g[2] === type)
    .map(g => ({ id: g[0], name: g[1] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllGenres() {
  return staticGenres.map(g => ({ id: g[0], name: g[1], type: g[2] }));
}

export function searchContent(query, contentType = null) {
  const searchTerm = query.toLowerCase();
  const results = [];

  if (contentType !== 'tv') {
    const movies = staticMovies.filter(
      m =>
        m.title.toLowerCase().includes(searchTerm) ||
        (m.overview && m.overview.toLowerCase().includes(searchTerm))
    );
    results.push(
      ...movies.map(m => ({
        content_type: 'movie',
        id: m.id,
        name: m.title,
        type: m.type,
        poster: m.poster,
        backdrop: m.backdrop,
        rating: m.rating,
        date: m.release_date,
        overview: m.overview
      }))
    );
  }

  if (contentType !== 'movie') {
    const shows = staticTVShows.filter(
      s =>
        s.name.toLowerCase().includes(searchTerm) ||
        (s.overview && s.overview.toLowerCase().includes(searchTerm))
    );
    results.push(
      ...shows.map(s => ({
        content_type: 'tv',
        id: s.id,
        name: s.name,
        type: s.type,
        poster: s.poster,
        backdrop: s.backdrop,
        rating: s.rating,
        date: s.first_air_date,
        overview: s.overview
      }))
    );
  }

  if (contentType !== 'movie') {
    const videos = staticMusicVideos.filter(
      v =>
        v.title.toLowerCase().includes(searchTerm) ||
        v.artist.toLowerCase().includes(searchTerm) ||
        (v.overview && v.overview.toLowerCase().includes(searchTerm))
    );
    results.push(
      ...videos.map(v => ({
        content_type: 'music',
        id: v.id,
        name: v.title,
        type: v.type,
        poster: v.poster,
        backdrop: v.backdrop,
        rating: v.rating,
        date: v.release_date,
        overview: v.overview
      }))
    );
  }

  return results.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 20);
}

// ============================================================================
// DYNAMIC FIRESTORE FUNCTIONS (async, database operations)
// ============================================================================

export async function createUser({ name, email, passwordHash }) {
  const now = Date.now();
  const docRef = await getFirestoreDb().collection('users').add({
    id: '', // will be set to docRef.id below
    name: name || null,
    email,
    password: passwordHash,
    profile_image: null,
    created_at: now
  });
  // Update the document to store the actual ID
  await getFirestoreDb().collection('users').doc(docRef.id).update({ id: docRef.id });
  return {
    id: docRef.id,
    name,
    email,
    created_at: now
  };
}

export async function getUserByEmail(email) {
  const snap = await getFirestoreDb().collection('users').where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    profileImage: data.profile_image || null
  };
}

export async function getUserById(id) {
  const doc = await getFirestoreDb().collection('users').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    profileImage: data.profile_image || null
  };
}

export async function updateUser(userId, fields) {
  const updates = {};
  if (fields.name !== undefined) updates.name = fields.name;
  if (fields.email !== undefined) updates.email = fields.email;
  if (fields.profile_image !== undefined) updates.profile_image = fields.profile_image;
  if (fields.password !== undefined) updates.password = fields.password;

  if (Object.keys(updates).length === 0) return null;

  await getFirestoreDb().collection('users').doc(userId).update(updates);
  return getUserById(userId);
}

export async function updateUserProfileImage(userId, url) {
  await getFirestoreDb().collection('users').doc(userId).update({ profile_image: url });
  return getUserById(userId);
}

export async function updateUserPassword(userId, passwordHash) {
  await getFirestoreDb().collection('users').doc(userId).update({ password: passwordHash });
}

export async function deleteUser(userId) {
  await getFirestoreDb().collection('users').doc(userId).delete();
}

export async function createSession({ id, userId, expiresAt }) {
  const now = Date.now();
  await getFirestoreDb().collection('sessions').doc(id).set({
    user_id: userId,
    expires_at: expiresAt.getTime ? expiresAt.getTime() : expiresAt,
    created_at: now
  });
  return { id, userId, expiresAt, created_at: now };
}

export async function getSession(id) {
  const doc = await getFirestoreDb().collection('sessions').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.user_id,
    expiresAt: data.expires_at,
    created_at: data.created_at
  };
}

export async function deleteSession(id) {
  await getFirestoreDb().collection('sessions').doc(id).delete();
}

export async function deleteUserSessions(userId) {
  const snap = await getFirestoreDb().collection('sessions').where('user_id', '==', userId).get();
  const batch = firestoreDb.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  if (snap.docs.length > 0) await batch.commit();
}

export async function deleteExpiredSessions() {
  const snap = await getFirestoreDb().collection('sessions').where('expires_at', '<', Date.now()).get();
  const batch = firestoreDb.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  if (snap.docs.length > 0) await batch.commit();
}

export async function upsertWatchProgress({ userId, contentId, position, duration }) {
  const now = Date.now();
  const docKey = `${userId}_${contentId}`;
  await getFirestoreDb().collection('watch_progress').doc(docKey).set(
    {
      user_id: userId,
      content_id: contentId,
      position,
      duration: duration || null,
      updated_at: now
    },
    { merge: true }
  );
  return {
    id: docKey,
    userId,
    contentId,
    position,
    duration,
    updated_at: now
  };
}

export async function getWatchProgress(userId, contentId) {
  const docKey = `${userId}_${contentId}`;
  const doc = await getFirestoreDb().collection('watch_progress').doc(docKey).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.user_id,
    contentId: data.content_id,
    position: data.position,
    duration: data.duration,
    updated_at: data.updated_at
  };
}

export async function deleteWatchProgressForUser(userId) {
  const snap = await getFirestoreDb().collection('watch_progress').where('user_id', '==', userId).get();
  const batch = firestoreDb.batch();
  snap.docs.forEach(doc => batch.delete(doc.ref));
  if (snap.docs.length > 0) await batch.commit();
}
