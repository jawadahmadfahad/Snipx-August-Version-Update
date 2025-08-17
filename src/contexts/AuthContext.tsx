import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiService } from '../services/api';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = ApiService.getToken();
    if (token) {
      // For demo purposes, set a default user when token exists
      setUser({ email: 'demo@snipx.com', firstName: 'Demo', lastName: 'User' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const loginAsDemo = async () => {
    try {
      // Use demo credentials to login
      const response = await ApiService.login('demo@snipx.com', 'demo1234');
      setUser(response.user);
    } catch (error) {
      // If demo login fails, create a local demo session
      console.warn('Demo login failed, creating local session:', error);
      ApiService.setToken('demo-token-123456');
      setUser({ 
        email: 'demo@snipx.com', 
        firstName: 'Demo', 
        lastName: 'User' 
      });
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    await ApiService.register(data);
  };

  const logout = () => {
    ApiService.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}