import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/accountSlice';
import videoplayereReducer from './features/videoPlayerSlice';
import watchlistReducer from './features/watchlistSlice';
import contentBrowserReducer from './features/contentBrowserSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    videoplayer: videoplayereReducer,
    watchlist: watchlistReducer,
    contentBrowser: contentBrowserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
