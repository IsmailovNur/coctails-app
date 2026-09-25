import {
  fetchAdminCocktails,
  fetchMyCocktails,
  fetchPublishedCocktails
} from "./cocktailThunk.ts";
import { createSlice } from "@reduxjs/toolkit";
import type { Cocktail } from "./types.ts";

interface CocktailState {
  cocktails: Cocktail[];
  loading: boolean;
  error: string | null;
}

const initialState:
  CocktailState = {
  cocktails: [],
  loading: false,
  error: null
};

const cocktailSlice = createSlice({
  name: "cocktail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishedCocktails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedCocktails.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails = action.payload;
      })

      .addCase(fetchPublishedCocktails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to load cocktails!";
      })

      .addCase(fetchMyCocktails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCocktails.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails = action.payload;
      })
      .addCase(
        fetchMyCocktails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error || "Failed to load cocktails!";
        })

      .addCase(fetchAdminCocktails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCocktails.fulfilled, (state, action) => {
        state.loading = false;
        state.cocktails = action.payload;
      })
      .addCase(fetchAdminCocktails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to load cocktails!";
      });
  },

  selectors: {
    cocktails: (state) => state.cocktails,
    isLoading: (state) => state.loading,
    cocktailError: (state) => state.error
  },
});

export const cocktailReducer = cocktailSlice.reducer;

export const {
  cocktails,
  isLoading,
  cocktailError
} = cocktailSlice.selectors;