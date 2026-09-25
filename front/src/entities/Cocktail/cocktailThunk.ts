import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
  Cocktail,
  CreateCocktailMutation,
  DeleteCocktailResponse,
  GlobalError,
  PublishCocktailMutation
} from "./types.ts";

import axiosApi, { getApiErrorMessage } from "../../shared/axios/AxiosApi.ts";


export const fetchPublishedCocktails =
  createAsyncThunk<
    Cocktail[],
    void,
    { rejectValue: GlobalError; }
  >('cocktail/fetchPublished',

    async (_, {rejectWithValue}) => {
      try {
        const response = await axiosApi.get<Cocktail[]>('/cocktails');
        return response.data;

      } catch (e) {
        return rejectWithValue({error: getApiErrorMessage(e),});
      }
    }
  );

export const fetchMyCocktails =
  createAsyncThunk<
    Cocktail[],
    void,
    { rejectValue: GlobalError; }
  >('cocktail/fetchMy',

    async (_, {rejectWithValue}) => {
      try {
        const response = await axiosApi.get<Cocktail[]>('/cocktails/my');
        return response.data;

      } catch (e) {
        return rejectWithValue({error: getApiErrorMessage(e),});
      }
    }
  );

export const fetchAdminCocktails =
  createAsyncThunk<
    Cocktail[],
    void,
    { rejectValue: GlobalError; }
  >('cocktail/fetchAdmin',

    async (_, {rejectWithValue}
    ) => {
      try {
        const response = await axiosApi.get<Cocktail[]>('/cocktails/admin');
        return response.data;

      } catch (e) {
        return rejectWithValue({error: getApiErrorMessage(e),});
      }
    }
  );

export const createCocktail =
  createAsyncThunk<
    Cocktail,
    CreateCocktailMutation,
    { rejectValue: GlobalError; }
  >('cocktail/create',

    async (mutation, {rejectWithValue}) => {
      try {
        const formData = new FormData();
        formData.append('name', mutation.name);
        formData.append('recipe', mutation.recipe);
        formData.append('ingredients', JSON.stringify(mutation.ingredients));
        formData.append('image', mutation.image);

        const response = await axiosApi.post<Cocktail>('/cocktails', formData);
        return response.data;

      } catch (e) {
        return rejectWithValue({error: getApiErrorMessage(e)});
      }
    }
  );

export const publishCocktail =
  createAsyncThunk<
    Cocktail,
    PublishCocktailMutation,
    { rejectValue: GlobalError; }
  >('cocktail/publish',

    async (mutation, {rejectWithValue}) => {
      try {
        const response = await axiosApi.patch<Cocktail>(`/cocktails/${mutation.id}/publish`,
          {
            isPublished: mutation.isPublished
          }
        );
        return response.data;

      } catch (e) {
        return rejectWithValue({error: getApiErrorMessage(e)});
      }
    }
  );

export const deleteCocktail =
  createAsyncThunk<
    DeleteCocktailResponse,
    string,
    { rejectValue: GlobalError; }
  >('cocktail/delete',

    async (id, {rejectWithValue}) => {
      try {
        const response = await axiosApi.delete<DeleteCocktailResponse>(`/cocktails/${id}`);
        return response.data;

      } catch (e) {
        return rejectWithValue({error: getApiErrorMessage(e)});
      }
    }
  );