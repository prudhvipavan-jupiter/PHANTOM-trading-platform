import { phantomApi } from '../services/phantomApi';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function initializeApi(): Promise<'live'> {
  const healthy = await phantomApi.healthCheck();
  if (!healthy) {
    console.warn('Backend health check failed — ensure API is running at', import.meta.env.VITE_API_URL || '/api');
  }
  return 'live';
}

export function getApiMode(): 'live' {
  return 'live';
}

export const api = phantomApi;
