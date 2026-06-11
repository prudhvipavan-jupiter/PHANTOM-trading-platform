import { USE_MOCK_API } from '../config/env';
import { mockApi } from './mockApi';
import { realApi } from '../services/realApi';

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

type ApiClient = typeof mockApi;

let resolvedMode: 'mock' | 'live' = USE_MOCK_API ? 'mock' : 'live';

function createHybridClient(): ApiClient {
  return new Proxy(mockApi, {
    get(target, prop: keyof ApiClient) {
      if (resolvedMode === 'live' && prop in realApi) {
        const liveValue = (realApi as unknown as Record<string, unknown>)[prop as string];
        if (typeof liveValue === 'function') {
          return liveValue.bind(realApi);
        }
      }
      const value = target[prop];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as ApiClient;
}

let activeClient = createHybridClient();

export async function initializeApi(): Promise<'mock' | 'live'> {
  if (USE_MOCK_API) {
    resolvedMode = 'mock';
  } else {
    const healthy = await realApi.healthCheck();
    resolvedMode = healthy ? 'live' : 'mock';
  }
  activeClient = createHybridClient();
  return resolvedMode;
}

export function getApiMode(): 'mock' | 'live' {
  return resolvedMode;
}

export const api: ApiClient = new Proxy(mockApi, {
  get(_target, prop: keyof ApiClient) {
    const value = activeClient[prop];
    return typeof value === 'function' ? (value as Function).bind(activeClient) : value;
  },
}) as ApiClient;
