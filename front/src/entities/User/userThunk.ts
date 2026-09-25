import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  GlobalError,
  LoginMutation,
  RegisterMutation,
  User
} from "./types.ts";
import axiosApi, { getApiErrorMessage } from "../../shared/axios/AxiosApi.ts";

export const registerUser = createAsyncThunk<User, RegisterMutation, {
  rejectValue: GlobalError;
}>('user/register',

  async (
    registerMutation, {rejectWithValue}) => {
    try {
      const response =
        await axiosApi.post<User>('/users', registerMutation);
      return response.data;

    } catch (e) {
      return rejectWithValue({error: getApiErrorMessage(e),});
    }
  }
);

export const loginUser = createAsyncThunk<User, LoginMutation, {
  rejectValue: GlobalError;
}>('user/login',

  async (
    loginMutation, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post<User>('/users/login', loginMutation);
      return response.data;

    } catch (e) {
      return rejectWithValue({error: getApiErrorMessage(e)});
    }
  }
);

export const logoutUser =
  createAsyncThunk<void>('user/logout',
    async () => {
      await axiosApi.post('/users/logout');
    }
  );