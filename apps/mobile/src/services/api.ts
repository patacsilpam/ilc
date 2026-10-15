import { Platform } from 'react-native';

// Use configured URL or environment-appropriate local host
// For Android emulator, 10.0.2.2 maps to the host machine's localhost
const DEFAULT_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      // In mobile, log and rethrow with clear diagnostic
      console.warn(`[ILC API] Request error on ${url}:`, err.message);
      throw err;
    }
  }
}

export const api = new ApiClient();
