import { api } from './api';
import { UserProfile, MembershipCard } from '@ilc/shared';

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  membership?: MembershipCard | null;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await api.fetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      api.setToken(data.token);
    }
    return data;
  },

  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    const data = await api.fetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    });
    if (data.token) {
      api.setToken(data.token);
    }
    return data;
  },

  async getSession(): Promise<{ authenticated: boolean; user: UserProfile | null; membership: MembershipCard | null }> {
    try {
      return await api.fetch('/auth/session');
    } catch {
      return { authenticated: false, user: null, membership: null };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.fetch('/auth/session', { method: 'POST' });
    } finally {
      api.setToken(null);
    }
  },

  /**
   * Google Sign-In Adapter
   * In Expo Go, Google Sign-in requires Expo AuthSession proxy or EAS dev client with native credentials.
   * This adapter provides honest status reporting without fabricated responses.
   */
  async signInWithGoogle(): Promise<{ success: boolean; message: string }> {
    return {
      success: false,
      message:
        'Google Sign-In requires configuring Google Cloud OAuth Client IDs and redirect URI in app.json. Please sign in with email for local development.',
    };
  },
};
