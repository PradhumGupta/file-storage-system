import { createContext } from 'react'

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    // ....
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  login: (userData: User) => void
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
