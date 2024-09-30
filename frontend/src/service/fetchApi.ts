import axios from 'axios';

export const baseApi = axios.create({
  baseURL: 'https:/localhost:4000',
  withCredentials: true,
});
