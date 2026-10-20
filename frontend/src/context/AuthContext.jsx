import { createContext, useContext, useState } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken =
      localStorage.getItem('sb_token') ||
      localStorage.getItem('token') ||
      '';

    // Migrate an older token to the shared key.
    if (savedToken && !localStorage.getItem('sb_token')) {
      localStorage.setItem('sb_token', savedToken);
    }

    return savedToken;
  });

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { user, token } = response.data;

    if (!user || !token) {
      throw new Error('Invalid login response from server.');
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('sb_token', token);

    // Remove the old key to avoid conflicts.
    localStorage.removeItem('token');

    setUser(user);
    setToken(token);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sb_token');
    localStorage.removeItem('token');

    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
