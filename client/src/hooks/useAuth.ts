import { useState, useEffect } from 'react';
import type { User } from '../types/admin';
import { AuthService } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const syncUser = () => {
      AuthService.getCurrentUser().then((u) => {
        setUser(u);
        setLoading(false);
      });
    };

    syncUser();

    const handleAuthUpdated = (e: any) => {
      if (e && e.detail) {
        setUser(e.detail);
      } else {
        syncUser();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mstore_auth_updated', handleAuthUpdated);
      return () => window.removeEventListener('mstore_auth_updated', handleAuthUpdated);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await AuthService.login(email, pass);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const updateCredentials = async (data: { currentPassword: string; newEmail?: string; newPassword?: string }) => {
    const updated = await AuthService.updateCredentials(data);
    setUser(updated);
    return updated;
  };

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    updateCredentials,
  };
}
