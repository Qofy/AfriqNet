import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface VideoPlayerState {
  playing: boolean;
  showOverlay: boolean;
  currentTime: number;
  duration: number;
  lastSaved: number | null;
  resumeNotice: string | null;
  isFullscreen: boolean;
  errorMessage: string | null;
  nowTick: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: VideoPlayerState = {
    playing: false,
    showOverlay: true,
    currentTime: 0,
    duration: 0,
    lastSaved: null,
    resumeNotice: null,
    isFullscreen: false,
    errorMessage: null,
    nowTick: 0,
    isLoading: false,
    error: null
}

const videoPlayerSlice = createSlice({
    name:"videoplayer",
    initialState, 
    reducers: {
        setPlaying(state, action: PayloadAction<boolean>) {
            state.playing = action.payload;
            state.showOverlay = !action.payload;
            if(action.payload) {
                state.errorMessage = null;
            }
        },
        setShowOverlay(state, action: PayloadAction<boolean>) {
            state.showOverlay = action.payload;
        },
        setCurrentTime(state, action: PayloadAction<number>) {
            state.currentTime = action.payload;
        },
        setDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload;
        },
        setLastSaved(state, action: PayloadAction<number | null>) {
            state.lastSaved = action.payload;
        },
        setResumeNotice(state, action: PayloadAction<string | null>) {
            state.resumeNotice = action.payload;
        },
        clearResumeNotice(state) {
            state.resumeNotice = null;
        },
        setIsFullscreen(state, action: PayloadAction<boolean>) {
            state.isFullscreen = action.payload;
        },
        setErrorMessage(state, action: PayloadAction<string | null>) {
            state.errorMessage = action.payload;
            state.playing = false;
            state.showOverlay = true;
        },
        clearErrorMessage(state) {
            state.errorMessage = null;
        },
        setNowTick(state, action: PayloadAction<number>) {
            state.nowTick = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        resetPlayer(state) {
            state.playing = false;
            state.showOverlay = true;
            state.currentTime = 0;
            state.duration = 0;
            state.resumeNotice = null;
            state.errorMessage = null;
        }
    }
})

export const {
  setPlaying,
  setShowOverlay,
  setCurrentTime,
  setDuration,
  setLastSaved,
  setResumeNotice,
  clearResumeNotice,
  setIsFullscreen,
  setErrorMessage,
  clearErrorMessage,
  setNowTick,
  setLoading,
  setError,
  clearError,
  resetPlayer
} = videoPlayerSlice.actions;


const fetchProgressApi = async (contentId) => {
  const { data } = await axios.get(
    `/api/progress?contentId=${encodeURIComponent(contentId)}`
  );
  if (data?.success && data.data) {
    return {
      position: Number(data.data.position || 0),
      duration: Number(data.data.duration || 0),
    };
  }
  return null;
};

const saveProgressApi = async ({ contentId, position, duration }) => {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    navigator.sendBeacon(
      "/api/progress",
      JSON.stringify({ contentId, position, duration })
    );
    return { success: true };
  }
  const { data } = await axios.post("/api/progress", {
    contentId,
    position,
    duration,
  });
  return data;
};

// ─── React Query hooks ────────────────────────────────────────────────────────

/**
 * useProgressQuery(contentId)
 * Fetches the saved position for a piece of content and dispatches
 * setResumeNotice so the VideoPlayer can seek on load.
 *
 * Usage (inside VideoPlayer):
 *   const { data, isLoading } = useProgressQuery(contentId);
 */
export function useProgressQuery(contentId) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["progress", contentId],
    queryFn: () => fetchProgressApi(contentId),
    enabled: !!contentId,          
    staleTime: Infinity,          
    onSuccess: (data) => {
      if (data?.position > 0) {
        dispatch(setResumeNotice(data.position));
      }
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.error || err.message));
    },
  });
}

/**
 * useSaveProgress()
 * Returns a mutate function that POSTs watch progress.
 * Keeps the last-saved timestamp in Redux on success.
 *
 * Usage (inside VideoPlayer):
 *   const { saveProgress } = useSaveProgress();
 *   saveProgress({ contentId, position, duration });
 */
export function useSaveProgress() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveProgressApi,
    onSuccess: (_data, variables) => {
      dispatch(setLastSaved(Date.now()));
      queryClient.invalidateQueries({ queryKey: ["progress", variables.contentId] });
    },
    onError: (err) => {
      dispatch(setError(err?.response?.data?.error || err.message));
    },
  });

  return {
    saveProgress: mutation.mutate,
    isLoading: mutation.isPending,
  };
}

export default videoPlayerSlice.reducer;