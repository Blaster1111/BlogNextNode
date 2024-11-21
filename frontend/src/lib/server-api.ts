// lib/server-api.ts
import axios from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://blognextnode.onrender.com/api';

export const serverApi = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to include the JWT token in requests
serverApi.interceptors.request.use((config) => {
  const token = cookies().get('token')?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});