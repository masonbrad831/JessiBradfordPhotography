import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      // TODO: Validate token with backend
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      if (username === 'admin' && password === 'password') {
        const token = 'dummy_token_' + Date.now();
        localStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        setUser({ username, role: 'admin' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}; 