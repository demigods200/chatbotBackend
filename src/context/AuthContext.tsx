import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user: { username: string; email: string }) => void;
  logout: () => void;
  token: string | null;
  user: { username: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  token: null,
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (newToken: string, userInfo: { username: string; email: string }) => {
    setToken(newToken);
    setUser(userInfo);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, user }}>
      {children}
    </AuthContext.Provider>
  );
}; 