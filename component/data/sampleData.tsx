import kingOfLagos from "@/public/images/kingOfLagos.png";
import accraHustler from "@/public/images/accraHustler.png"

export const genres = {
  movie: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ],
  tv: [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
    { id: 37, name: "Western" }
  ]
};

export const sampleMovies = [
  {
    id: "m1",
    title: "Quantum Nexus",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    rating: 8.5,
    release_date: "2024-01-15",
    overview: "In a world where quantum computing has unlocked parallel dimensions, a brilliant physicist must prevent a catastrophic collision between realities. An epic sci-fi thriller that pushes the boundaries of imagination.",
    genre_ids: [878, 53, 28],
    runtime: 142,
    tagline: "Reality is just the beginning"
  },
  {
    id: "m2",
    title: "The Last Horizon",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80",
    rating: 7.8,
    release_date: "2023-11-20",
    overview: "A gripping tale of survival as humanity's last spaceship searches for a new home among the stars. With stunning visuals and emotional depth, this space odyssey redefines the genre.",
    genre_ids: [878, 12, 18],
    runtime: 156,
    tagline: "Our journey ends where hope begins"
  },
  {
    id: "m3",
    title: "Shadow Protocol",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80",
    rating: 8.2,
    release_date: "2024-02-10",
    overview: "An elite spy must uncover a global conspiracy before it's too late. Packed with intense action sequences and mind-bending plot twists that will keep you guessing until the very end.",
    genre_ids: [28, 53, 80],
    runtime: 128,
    tagline: "Trust no one"
  },
  {
    id: "m4",
    title: "Accra Hustler",
    type: "Action",
    poster: accraHustler,
    backdrop: accraHustler,
    rating: 9.1,
    release_date: "2023-12-05",
    overview: "A masterful exploration of time, memory, and human connection. When a scientist discovers a way to relive memories, she must confront her past to save her future. Critically acclaimed and emotionally powerful.",
    genre_ids: [18, 878, 9648],
    runtime: 138,
    tagline: "Some memories are worth reliving"
  },
  {
    id: "m5",
    title: "King Of Lagos",
    type: "Adventure",
    poster: kingOfLagos,
    backdrop: kingOfLagos,
    rating: 7.5,
    release_date: "2024-03-22",
    overview: "An action-packed underwater thriller where a submarine crew discovers an ancient secret that could change the course of human history. Breathtaking cinematography meets edge-of-your-seat suspense.",
    genre_ids: [28, 12, 53],
    runtime: 134,
    tagline: "Dive into the unknown"
  },
  {
    id: "m6",
    title: "Laughter in Paradise",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80",
    rating: 7.2,
    release_date: "2023-08-15",
    overview: "A hilarious comedy about a dysfunctional family who inherits a tropical resort. Chaos ensues as they try to keep the business afloat while dealing with eccentric guests and their own personal dramas.",
    genre_ids: [35, 10751],
    runtime: 105,
    tagline: "Family vacations just got complicated"
  },
  {
    id: "m7",
    title: "The Midnight Garden",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80",
    rating: 8.7,
    release_date: "2023-10-31",
    overview: "A haunting and beautiful fantasy where a young girl discovers a magical garden that only appears at midnight. An enchanting tale of wonder, loss, and the power of imagination.",
    genre_ids: [14, 18, 10751],
    runtime: 118,
    tagline: "Magic blooms in the darkness"
  },
  {
    id: "m8",
    title: "Velocity",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
    rating: 7.9,
    release_date: "2024-04-18",
    overview: "High-octane racing action meets street-level drama in this adrenaline-fueled ride. A young driver must race against time and rival gangs to save everything he holds dear.",
    genre_ids: [28, 80, 53],
    runtime: 122,
    tagline: "Speed is survival"
  },
  {
    id: "m9",
    title: "Hearts in Harmony",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&q=80",
    rating: 7.0,
    release_date: "2023-07-14",
    overview: "A touching romantic drama about two musicians from different worlds who find love through their shared passion for music. Beautiful performances and an unforgettable soundtrack.",
    genre_ids: [10749, 18, 10402],
    runtime: 112,
    tagline: "Love finds its rhythm"
  },
  {
    id: "m10",
    title: "The Silent Witness",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&q=80",
    rating: 8.4,
    release_date: "2024-01-28",
    overview: "A gripping mystery thriller about a detective who must solve a series of murders with only one witness - who hasn't spoken in years. Atmospheric and deeply suspenseful.",
    genre_ids: [9648, 53, 80],
    runtime: 145,
    tagline: "Some secrets refuse to stay buried"
  },
  {
    id: "m11",
    title: "Dragon's Peak",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=1920&q=80",
    rating: 8.0,
    release_date: "2023-09-08",
    overview: "An epic fantasy adventure following a young warrior's quest to find the legendary Dragon's Peak and unite the kingdoms. Spectacular visuals and world-building reminiscent of classic fantasy epics.",
    genre_ids: [14, 12, 28],
    runtime: 165,
    tagline: "Legends awaken"
  },
  {
    id: "m12",
    title: "Code Black",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=80",
    rating: 7.6,
    release_date: "2024-02-25",
    overview: "A tech thriller about a cybersecurity expert who uncovers a virus that could bring down the world's infrastructure. Tense, timely, and terrifyingly plausible.",
    genre_ids: [53, 80, 18],
    runtime: 119,
    tagline: "The system is compromised"
  },
  {
    id: "m13",
    title: "Summer Nights",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    rating: 6.8,
    release_date: "2023-06-20",
    overview: "A lighthearted coming-of-age story about teenagers spending one unforgettable summer together before going their separate ways. Nostalgic, funny, and surprisingly poignant.",
    genre_ids: [35, 18, 10749],
    runtime: 98,
    tagline: "The best nights are never planned"
  },
  {
    id: "m14",
    title: "Titan's Fall",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80",
    rating: 8.8,
    release_date: "2023-11-10",
    overview: "A monumental sci-fi epic spanning centuries as humanity faces extinction from an alien force. Visually stunning with profound themes about survival and sacrifice.",
    genre_ids: [878, 28, 12],
    runtime: 178,
    tagline: "The end is just the beginning"
  },
  {
    id: "m15",
    title: "The Art of Deception",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920&q=80",
    rating: 7.7,
    release_date: "2024-03-05",
    overview: "A sophisticated heist film about master thieves pulling off an impossible art museum robbery. Clever, stylish, and full of unexpected twists.",
    genre_ids: [80, 53, 9648],
    runtime: 130,
    tagline: "The greatest heist ever told"
  }
];

export const sampleTVShows = [
  {
    id: "tv1",
    name: "Nebula Station",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&q=80",
    rating: 9.2,
    first_air_date: "2022-03-15",
    overview: "A groundbreaking sci-fi series set on a space station at the edge of explored space. Political intrigue, alien encounters, and deeply human stories make this must-watch television.",
    genre_ids: [10765, 18],
    number_of_seasons: 3,
    status: "Returning Series"
  },
  {
    id: "tv2",
    name: "Crown of Thorns",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1532103054090-3491f1a05d0d?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1532103054090-3491f1a05d0d?w=1920&q=80",
    rating: 8.9,
    first_air_date: "2021-09-20",
    overview: "A historical drama chronicling the rise and fall of a medieval dynasty. Lavish production values, complex characters, and political machinations rival the greatest historical epics.",
    genre_ids: [18, 10768],
    number_of_seasons: 4,
    status: "Returning Series"
  },
  {
    id: "tv3",
    name: "Detective Bureau",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1920&q=80",
    rating: 8.5,
    first_air_date: "2023-01-10",
    overview: "A gritty crime procedural following an elite detective unit solving the city's most complex cases. Sharp writing and stellar performances elevate this above standard police dramas.",
    genre_ids: [80, 9648, 18],
    number_of_seasons: 2,
    status: "Returning Series"
  },
  {
    id: "tv4",
    name: "Laugh Track",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1920&q=80",
    rating: 7.8,
    first_air_date: "2022-08-05",
    overview: "A hilarious sitcom about aspiring comedians trying to make it in the cutthroat world of stand-up comedy. Witty dialogue and genuine heart make this a comedy standout.",
    genre_ids: [35],
    number_of_seasons: 3,
    status: "Returning Series"
  },
  {
    id: "tv5",
    name: "The Experiment",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    rating: 8.7,
    first_air_date: "2023-05-12",
    overview: "A psychological thriller about participants in a mysterious social experiment. Each episode peels back layers of deception in this mind-bending series.",
    genre_ids: [9648, 10765, 18],
    number_of_seasons: 2,
    status: "Returning Series"
  },
  {
    id: "tv6",
    name: "Culinary Wars",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80",
    rating: 7.5,
    first_air_date: "2022-11-18",
    overview: "Top chefs compete in culinary challenges that test their skills, creativity, and resilience. Mouthwatering dishes and high-stakes drama make this reality show addictive.",
    genre_ids: [10764],
    number_of_seasons: 4,
    status: "Returning Series"
  },
  {
    id: "tv7",
    name: "Bloodline Legacy",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80",
    rating: 8.3,
    first_air_date: "2021-10-22",
    overview: "A vampire drama that reinvents the genre with fresh mythology and compelling characters. Dark, seductive, and surprisingly emotional.",
    genre_ids: [10765, 18],
    number_of_seasons: 3,
    status: "Returning Series"
  },
  {
    id: "tv8",
    name: "Tech Titans",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80",
    rating: 8.0,
    first_air_date: "2023-02-08",
    overview: "A drama about Silicon Valley startups, tech innovation, and the price of success. Smart, timely, and packed with insights into modern tech culture.",
    genre_ids: [18],
    number_of_seasons: 1,
    status: "Returning Series"
  },
  {
    id: "tv9",
    name: "Family Bonds",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80",
    rating: 7.2,
    first_air_date: "2022-04-15",
    overview: "A heartwarming family drama that explores multiple generations navigating life's challenges together. Genuine performances and relatable storylines.",
    genre_ids: [18, 10751],
    number_of_seasons: 2,
    status: "Returning Series"
  },
  {
    id: "tv10",
    name: "The Underground",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&q=80",
    rating: 8.6,
    first_air_date: "2023-06-30",
    overview: "A music-driven drama about underground artists fighting for recognition in the hip-hop scene. Powerful performances and an incredible soundtrack.",
    genre_ids: [18],
    number_of_seasons: 1,
    status: "Returning Series"
  },
  {
    id: "tv11",
    name: "Wildlands",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    rating: 8.8,
    first_air_date: "2022-07-20",
    overview: "A nature documentary series showcasing Earth's most breathtaking wilderness areas and the animals that inhabit them. Stunning cinematography.",
    genre_ids: [99],
    number_of_seasons: 2,
    status: "Returning Series"
  },
  {
    id: "tv12",
    name: "Lost Signals",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
    rating: 8.1,
    first_air_date: "2023-09-15",
    overview: "A sci-fi mystery about strange radio signals from deep space and the team trying to decode them. Atmospheric and thought-provoking.",
    genre_ids: [10765, 9648],
    number_of_seasons: 1,
    status: "Returning Series"
  },
  {
    id: "tv13",
    name: "Comedy Central Stage",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80",
    rating: 7.6,
    first_air_date: "2022-05-10",
    overview: "Stand-up specials from the hottest comedians on the circuit. Fresh voices and bold comedy that pushes boundaries.",
    genre_ids: [35],
    number_of_seasons: 3,
    status: "Returning Series"
  },
  {
    id: "tv14",
    name: "Shadow Games",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&q=80",
    rating: 9.0,
    first_air_date: "2021-11-05",
    overview: "An espionage thriller with international intrigue, double-crosses, and high-stakes missions. Sophisticated storytelling meets pulse-pounding action.",
    genre_ids: [10759, 18],
    number_of_seasons: 3,
    status: "Returning Series"
  },
  {
    id: "tv15",
    name: "Time Loops",
    type: "tv",
    poster: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1920&q=80",
    rating: 8.4,
    first_air_date: "2023-04-01",
    overview: "A sci-fi anthology series exploring different time travel scenarios. Each episode is a standalone story with innovative concepts and emotional depth.",
    genre_ids: [10765, 18],
    number_of_seasons: 1,
    status: "Returning Series"
  }
];

export const sampleCast = [
  {
    id: "c1",
    name: "Emma Stone",
    character: "Dr. Sarah Chen",
    profile_path: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80"
  },
  {
    id: "c2",
    name: "Ryan Gosling",
    character: "Marcus Kane",
    profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80"
  },
  {
    id: "c3",
    name: "Zendaya",
    character: "Aria Williams",
    profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
  },
  {
    id: "c4",
    name: "Timothée Chalamet",
    character: "Leo Foster",
    profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"
  },
  {
    id: "c5",
    name: "Margot Robbie",
    character: "Jessica Hart",
    profile_path: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80"
  },
  {
    id: "c6",
    name: "Michael B. Jordan",
    character: "Commander Rhodes",
    profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80"
  }
];

export const sampleReviews = [
  {
    id: "r1",
    author: "MovieBuff2024",
    rating: 9,
    content: "Absolutely mind-blowing! The visual effects are stunning and the story keeps you on the edge of your seat from start to finish. One of the best films I've seen this year.",
    created_at: "2024-01-20"
  },
  {
    id: "r2",
    author: "CinematicCritic",
    rating: 8,
    content: "A solid entry in the genre with excellent performances from the cast. Some pacing issues in the second act, but overall a very entertaining watch.",
    created_at: "2024-01-18"
  },
  {
    id: "r3",
    author: "FilmFanatic",
    rating: 10,
    content: "Perfection! Every frame is beautifully crafted, the score is haunting, and the emotional depth is incredible. Will definitely be watching this again.",
    created_at: "2024-01-15"
  }
];

export const musicVideoGenres = [
  { id: 1, name: "Afrobeats" },
  { id: 2, name: "Hip Hop" },
  { id: 3, name: "R&B" },
  { id: 4, name: "Gospel" },
  { id: 5, name: "Highlife" },
  { id: 6, name: "Amapiano" },
  { id: 7, name: "Dancehall" },
  { id: 8, name: "Reggae" },
  { id: 9, name: "Pop" },
  { id: 10, name: "Soul" },
  {id:11, name:"Rap"}
];

export const sampleMusicVideos = [
  {
    id: "mv1",
    title: "Lagos Nights",
    artist: "Wizkid",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
    rating: 9.2,
    release_date: "2024-03-15",
    overview: "An energetic Afrobeats anthem celebrating the vibrant nightlife of Lagos. Stunning visuals showcase the city's culture and energy.",
    genre_ids: [1, 9],
    duration: "3:45",
    views: "15.2M"
  },
  {
    id: "mv2",
    title: "African Queen",
    artist: "Burna Boy",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80",
    rating: 9.5,
    release_date: "2024-02-20",
    overview: "A powerful fusion of traditional African sounds and modern production. The video features breathtaking cinematography across various African landscapes.",
    genre_ids: [1, 8],
    duration: "4:12",
    views: "22.8M"
  },
  {
    id: "mv3",
    title: "Ghana Vibes",
    artist: "Sarkodie ft. King Promise",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80",
    rating: 8.8,
    release_date: "2024-01-10",
    overview: "A celebration of Ghanaian culture with infectious beats and colorful visuals. The collaboration brings together two of Ghana's finest artists.",
    genre_ids: [2, 5],
    duration: "3:28",
    views: "18.5M"
  },
  {
    id: "mv4",
    title: "Amapiano Fever",
    artist: "DJ Maphorisa & Kabza De Small",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80",
    rating: 9.0,
    release_date: "2023-12-28",
    overview: "The kings of Amapiano deliver another hit with hypnotic rhythms and smooth production. Shot in the heart of Johannesburg's music scene.",
    genre_ids: [6],
    duration: "4:35",
    views: "25.1M"
  },
  {
    id: "mv5",
    title: "Soulful Journey",
    artist: "Asa",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=1920&q=80",
    rating: 8.7,
    release_date: "2024-02-05",
    overview: "An intimate and soulful performance that showcases Asa's incredible vocal range and emotional depth. Minimalist visuals that let the music speak.",
    genre_ids: [3, 10],
    duration: "3:52",
    views: "12.3M"
  },
  {
    id: "mv6",
    title: "Blessed",
    artist: "Nathaniel Bassey",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1920&q=80",
    rating: 9.3,
    release_date: "2024-01-01",
    overview: "An uplifting gospel anthem with powerful vocals and inspiring visuals. Perfect for worship and meditation.",
    genre_ids: [4],
    duration: "5:20",
    views: "30.5M"
  },
  {
    id: "mv7",
    title: "Island Rhythm",
    artist: "Stonebwoy",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
    rating: 8.9,
    release_date: "2023-11-15",
    overview: "A reggae-dancehall fusion that brings Caribbean vibes to West Africa. Shot on beautiful tropical beaches with stunning sunset scenes.",
    genre_ids: [7, 8],
    duration: "3:35",
    views: "16.7M"
  },
  {
    id: "mv8",
    title: "Street Symphony",
    artist: "Olamide",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&q=80",
    rating: 8.6,
    release_date: "2024-03-01",
    overview: "Raw and authentic hip-hop from the streets of Lagos. Olamide delivers hard-hitting bars over a trap-influenced beat.",
    genre_ids: [2],
    duration: "3:15",
    views: "20.2M"
  },
  {
    id: "mv9",
    title: "Love & Light",
    artist: "Tiwa Savage",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1920&q=80",
    rating: 9.1,
    release_date: "2024-02-14",
    overview: "A romantic R&B ballad with elegant choreography and luxurious visuals. Tiwa Savage at her finest.",
    genre_ids: [3, 9],
    duration: "4:05",
    views: "19.8M"
  },
  {
    id: "mv10",
    title: "Heritage",
    artist: "M.anifest",
    type: "Music Video",
    poster: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80",
    rating: 8.5,
    release_date: "2023-10-20",
    overview: "A thoughtful exploration of African heritage through hip-hop. Features traditional instruments blended with modern production.",
    genre_ids: [2, 5],
    duration: "4:28",
    views: "11.4M"
  }
];