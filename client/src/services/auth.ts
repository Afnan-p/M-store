import type { User } from '../types/admin';
import { fetchFromAPI } from './apiClient';

const AUTH_STORAGE_KEY = 'mstore_admin_auth_user';
const TOKEN_STORAGE_KEY = 'mstore_admin_auth_token';

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export const AuthService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading auth state:', e);
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  async login(email: string, pass: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();

    const remote = await fetchFromAPI<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password: pass }),
    });

    if (remote && remote.success && remote.token && remote.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, remote.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(remote.user));
      return remote.user;
    }

    throw new Error('Invalid email or password');
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};
