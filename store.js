import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/accountSlice';
import videoplayereReducer from './features/videoPlayerSlice';
import watchlistReducer from './features/watchlistSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    videoplayer: videoplayereReducer,
    watchlist: watchlistReducer,
  },
});
