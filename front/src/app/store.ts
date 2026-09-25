import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../entities/User/userSlice.ts';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import type { WebStorage } from 'redux-persist/es/types';
import storageModule from 'redux-persist/lib/storage';
import { cocktailReducer } from "../entities/Cocktail/cocktailSlice.ts";

const storage: WebStorage =
  (storageModule as unknown as { default: WebStorage }).default ||
  storageModule;

const rootReducer = combineReducers({
  user: userReducer,
  cocktail: cocktailReducer,
});

const persistConfig = {
  key: 'cocktailsApp:root',
  storage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;