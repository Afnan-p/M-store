import { useState, useEffect } from 'react';
import type { User } from '../types/admin';
import { AuthService } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    AuthService.getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
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

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
}
