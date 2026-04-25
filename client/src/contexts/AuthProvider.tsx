import api from '@/lib/axios';
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User } from './AuthContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoaded(true);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setLoaded(true);
  };

  const logout = async () => {
    await api.post("/api/auth/logout", {});
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading: !loaded, login, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;