import { createApi } from './apiClient';

const apiUrl = import.meta.env.VITE_API_URL;

export const apiClient = createApi(apiUrl);
