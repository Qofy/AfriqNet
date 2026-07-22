import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

interface WatchlistItem {
  contentId: string;
  [key: string]: unknown;
}

interface WatchlistState {
  items: Record<string, boolean>;
  isHydrated: boolean;
  error: string | null;
}

const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
  const { data } = await axios.get('/api/watchlist');
  return data.data; // array of { id, contentId, addedAt }
};

const addToWatchlistApi = async (contentId: string): Promise<unknown> => {
  const { data } = await axios.post('/api/watchlist', { contentId });
  return data.data;
};

const removeFromWatchlistApi = async (contentId: string): Promise<unknown> => {
  const { data } = await axios.delete('/api/watchlist', { data: { contentId } });
  return data.data;
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: {},
    isHydrated: false,
    error: null,
  } as WatchlistState,
  reducers: {
    hydrateWatchlist: (state, action: PayloadAction<WatchlistItem[]>) => {
      state.items = {};
      (action.payload || []).forEach(({ contentId }) => {
        state.items[contentId] = true;
      });
      state.isHydrated = true;
      state.error = null;
    },
    optimisticAdd: (state, action: PayloadAction<string>) => {
      state.items[action.payload] = true;
    },
    optimisticRemove: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    revertItem: (state, action: PayloadAction<{ contentId: string; wasInList: boolean }>) => {
      const { contentId, wasInList } = action.payload;
      if (wasInList) {
        state.items[contentId] = true;
      } else {
        delete state.items[contentId];
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  hydrateWatchlist,
  optimisticAdd,
  optimisticRemove,
  revertItem,
  setError,
  clearError,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;


export function useWatchlist() {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
    staleTime: 1000 * 60 * 5, 
    onSuccess: (data) => {
      dispatch(hydrateWatchlist(data));
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : (err as any)?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    },
  });
}

interface ToggleWatchlistReturn {
  inList: boolean;
  toggle: () => void;
  isLoading: boolean;
}

/**
 * useToggleWatchlist(contentId)
 * Self-contained hook for a single card/button.
 * Reads its own inList status from Redux and dispatches optimistic updates.
 *
 * Usage (inside WatchlistButton):
 *   const { inList, toggle, isLoading } = useToggleWatchlist(movieId);
 */
export function useToggleWatchlist(contentId: string): ToggleWatchlistReturn {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const inList = useSelector((state: any) => !!state.watchlist.items[contentId]);

  const addMutation = useMutation({
    mutationFn: () => addToWatchlistApi(contentId),
    onMutate: () => {
      dispatch(optimisticAdd(contentId));
    },
    onError: () => {
      dispatch(revertItem({ contentId, wasInList: false }));
      dispatch(setError('Failed to add to watchlist'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFromWatchlistApi(contentId),
    onMutate: () => {
      dispatch(optimisticRemove(contentId));
    },
    onError: () => {
      dispatch(revertItem({ contentId, wasInList: true }));
      dispatch(setError('Failed to remove from watchlist'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const toggle = (): void => {
    if (inList) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  return {
    inList,
    toggle,
    isLoading: ((addMutation as any).isPending || (addMutation as any).isLoading) || ((removeMutation as any).isPending || (removeMutation as any).isLoading) || false,
  };
}
