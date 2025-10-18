import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { tedicsApi } from './apiSlice';

/**
 * Redux Store Configuration.
 *
 * This sets up the Redux store and integrates the RTK Query middleware.
 * The apiSlice reducer is added to manage the API state.
 */
export const store = configureStore({
  reducer: {
    // Add the generated reducer from our apiSlice.
    [tedicsApi.reducerPath]: tedicsApi.reducer,
    // You can add other reducers here (e.g., for an auth slice).
  },
  /**
   * Adding the api middleware enables caching, invalidation, polling,
   * and other powerful features of RTK Query.
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tedicsApi.middleware),
});

/**
 * Optional, but recommended for refetchOnFocus/refetchOnReconnect behaviors.
 * See `setupListeners` documentation for more details.
 */
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself for use throughout the app.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
