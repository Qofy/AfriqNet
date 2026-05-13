import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/accountSlice';
import videoplayereReducer from './features/videoPlayerSlice'


export const store = configureStore({
  reducer: {
    account: accountReducer,
    videoplayer: videoplayereReducer,
  },
});
