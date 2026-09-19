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

    // 1. Try real backend Express REST API login
    try {
      const remote = await fetchFromAPI<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      if (remote && remote.success && remote.token && remote.user) {
        localStorage.setItem(TOKEN_STORAGE_KEY, remote.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(remote.user));
        return remote.user;
      }
    } catch (err) {
      console.warn('[AuthService] Express API auth unavailable, attempting local fallback:', err);
    }

    // 2. Client-side fallback for offline development
    if (cleanEmail === 'admin@mstore.in' && pass === 'admin123') {
      const user: User = {
        id: 'admin_1',
        email: 'admin@mstore.in',
        name: 'M Store Manager',
        role: 'admin',
      };
      const mockToken = 'mock_jwt_token_admin_mstore_2026';
      localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    if (cleanEmail.length > 3 && pass.length >= 4) {
      const user: User = {
        id: 'admin_demo',
        email: cleanEmail,
        name: 'Demo Admin',
        role: 'admin',
      };
      const mockToken = 'mock_jwt_token_demo_mstore_2026';
      localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid email or password. Use admin@mstore.in / admin123');
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};
