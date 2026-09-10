import type { User } from '../types/admin';

const AUTH_STORAGE_KEY = 'mstore_admin_auth_user';

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

  async login(email: string, pass: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple demo credentials: admin@mstore.in / admin123
        if (email.trim().toLowerCase() === 'admin@mstore.in' && pass === 'admin123') {
          const user: User = {
            id: 'admin_1',
            email: 'admin@mstore.in',
            name: 'M Store Manager',
            role: 'admin',
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          resolve(user);
        } else if (email.length > 3 && pass.length >= 4) {
          // Allow any demo login for convenience
          const user: User = {
            id: 'admin_demo',
            email,
            name: 'Demo Admin',
            role: 'admin',
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password. Use admin@mstore.in / admin123'));
        }
      }, 300);
    });
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
