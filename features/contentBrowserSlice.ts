import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import type { RootState } from '../store';

interface Content {
  [key: string]: unknown;
}

interface PageInfo {
  movies: number;
  tvShows: number;
  musicVideos: number;
}

interface ContentBrowserState {
  movies: Content[];
  tvShows: Content[];
  musicVideos: Content[];
  searchResults: Content[];
  currentPage: PageInfo;
  searchQuery: string;
  searchContentType: string;
  error: string | null;
}

const fetchMovies = async (page = 1): Promise<Content[]> => {
  const { data } = await axios.get('/api/movies', { params: { page } });
  return data.data;
};

const fetchTvShows = async (page = 1): Promise<Content[]> => {
  const { data } = await axios.get('/api/tv-shows', { params: { page } });
  return data.data;
};

const fetchMusicVideos = async (page = 1): Promise<Content[]> => {
  const { data } = await axios.get('/api/music-videos', { params: { page } });
  return data.data;
};

const searchContent = async (query: string, contentType = 'all'): Promise<Content[]> => {
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
  } as ContentBrowserState,
  reducers: {
    setMovies: (state, action: PayloadAction<Content[]>) => {
      state.movies = action.payload;
      state.error = null;
    },
    setTvShows: (state, action: PayloadAction<Content[]>) => {
      state.tvShows = action.payload;
      state.error = null;
    },
    setMusicVideos: (state, action: PayloadAction<Content[]>) => {
      state.musicVideos = action.payload;
      state.error = null;
    },
    setSearchResults: (state, action: PayloadAction<Content[]>) => {
      state.searchResults = action.payload;
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<{ contentType: keyof PageInfo; page: number }>) => {
      const { contentType, page } = action.payload;
      state.currentPage[contentType] = page;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchContentType: (state, action: PayloadAction<string>) => {
      state.searchContentType = action.payload;
    },
    appendMovies: (state, action: PayloadAction<Content[]>) => {
      state.movies = [...state.movies, ...action.payload];
    },
    appendTvShows: (state, action: PayloadAction<Content[]>) => {
      state.tvShows = [...state.tvShows, ...action.payload];
    },
    appendMusicVideos: (state, action: PayloadAction<Content[]>) => {
      state.musicVideos = [...state.musicVideos, ...action.payload];
    },
    setError: (state, action: PayloadAction<string | null>) => {
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

export function useMovies(page: number = 1) {
  const dispatch = useDispatch();
  const movies = useSelector((state: RootState) => state.contentBrowser.movies);

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
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : (err as any)?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    },
  });
}

export function useTvShows(page: number = 1) {
  const dispatch = useDispatch();
  const tvShows = useSelector((state: RootState) => state.contentBrowser.tvShows);

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
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : (err as any)?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    },
  });
}

export function useMusicVideos(page: number = 1) {
  const dispatch = useDispatch();
  const musicVideos = useSelector((state: RootState) => state.contentBrowser.musicVideos);

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
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : (err as any)?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    },
  });
}

export function useSearchContent(query: string, contentType: string = 'all') {
  const dispatch = useDispatch();
  const searchResults = useSelector((state: RootState) => state.contentBrowser.searchResults);

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
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : (err as any)?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    },
  });
}
