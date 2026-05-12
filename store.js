import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/accountSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});
