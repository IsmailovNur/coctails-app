import axios, { isAxiosError } from 'axios';
import { store } from "../../app/store.ts";

export const apiURL = 'http://localhost:8080';

const axiosApi = axios.create({
  baseURL: apiURL,
});

axiosApi.interceptors.request.use((config) => {
  const token = store.getState().user.user?.token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }

    return (
      data.message || data.error || 'Request failed!'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Request failed!';
};

export default axiosApi;