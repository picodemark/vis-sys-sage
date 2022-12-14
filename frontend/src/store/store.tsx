import { configureStore } from '@reduxjs/toolkit';
import graphDataReducer from './graphDataSlice';

export const store = configureStore({
  reducer: {
    graphData: graphDataReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
