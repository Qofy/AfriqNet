import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const fetchMovies = async (page = 1) => {
  const { data } = await axios.get('/api/movies', { params: { page } });
  return data.data;
};

const fetchTvShows = async (page = 1) => {
  const { data } = await axios.get('/api/tv-shows', { params: { page } });
  return data.data;
};

const fetchMusicVideos = async (page = 1) => {
  const { data } = await axios.get('/api/music-videos', { params: { page } });
  return data.data;
};

const searchContent = async (query, contentType = 'all') => {
  const { data } = await axios.get('/api/search', {
    params: { query, contentType },
  });
  return data.data;
};

const contentBrowserSlice = createSlice({
  name: 'contentBrowser',
  initialState: {
    movies: [],
    tvShows: [],
    musicVideos: [],
    searchResults: [],
    currentPage: {
      movies: 1,
      tvShows: 1,
      musicVideos: 1,
    },
    searchQuery: '',
    searchContentType: 'all',
    error: null,
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
      state.error = null;
    },
    setTvShows: (state, action) => {
      state.tvShows = action.payload;
      state.error = null;
    },
    setMusicVideos: (state, action) => {
      state.musicVideos = action.payload;
      state.error = null;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      const { contentType, page } = action.payload;
      state.currentPage[contentType] = page;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchContentType: (state, action) => {
      state.searchContentType = action.payload;
    },
    appendMovies: (state, action) => {
      state.movies = [...state.movies, ...action.payload];
    },
    appendTvShows: (state, action) => {
      state.tvShows = [...state.tvShows, ...action.payload];
    },
    appendMusicVideos: (state, action) => {
      state.musicVideos = [...state.musicVideos, ...action.payload];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
  },
});

export const {
  setMovies,
  setTvShows,
  setMusicVideos,
  setSearchResults,
  setCurrentPage,
  setSearchQuery,
  setSearchContentType,
  appendMovies,
  appendTvShows,
  appendMusicVideos,
  setError,
  clearError,
  clearSearchResults,
} = contentBrowserSlice.actions;

export default contentBrowserSlice.reducer;

export function useMovies(page = 1) {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.contentBrowser.movies);

  return useQuery({
    queryKey: ['movies', page],
    queryFn: () => fetchMovies(page),
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      if (page === 1) {
        dispatch(setMovies(data));
      } else {
        dispatch(appendMovies(data));
      }
      dispatch(setCurrentPage({ contentType: 'movies', page }));
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.error || err.message));
    },
  });
}

export function useTvShows(page = 1) {
  const dispatch = useDispatch();
  const tvShows = useSelector((state) => state.contentBrowser.tvShows);

  return useQuery({
    queryKey: ['tvShows', page],
    queryFn: () => fetchTvShows(page),
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      if (page === 1) {
        dispatch(setTvShows(data));
      } else {
        dispatch(appendTvShows(data));
      }
      dispatch(setCurrentPage({ contentType: 'tvShows', page }));
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.error || err.message));
    },
  });
}

export function useMusicVideos(page = 1) {
  const dispatch = useDispatch();
  const musicVideos = useSelector((state) => state.contentBrowser.musicVideos);

  return useQuery({
    queryKey: ['musicVideos', page],
    queryFn: () => fetchMusicVideos(page),
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      if (page === 1) {
        dispatch(setMusicVideos(data));
      } else {
        dispatch(appendMusicVideos(data));
      }
      dispatch(setCurrentPage({ contentType: 'musicVideos', page }));
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.error || err.message));
    },
  });
}

export function useSearchContent(query, contentType = 'all') {
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.contentBrowser.searchResults);

  return useQuery({
    queryKey: ['search', query, contentType],
    queryFn: () => searchContent(query, contentType),
    staleTime: 1000 * 60 * 5,
    enabled: !!query,
    onSuccess: (data) => {
      dispatch(setSearchResults(data));
      dispatch(setSearchQuery(query));
      dispatch(setSearchContentType(contentType));
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.error || err.message));
    },
  });
}
