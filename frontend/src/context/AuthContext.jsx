
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

    if (savedToken && !localStorage.getItem('sb_token')) {
      localStorage.setItem('sb_token', savedToken);
    }

    return savedToken;
  });

  const saveAuth = (user, token) => {
    if (!user || !token) {
      throw new Error('Invalid authentication response from server.');
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('sb_token', token);
    localStorage.removeItem('token');

    setUser(user);
    setToken(token);

    return user;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    return saveAuth(response.data.user, response.data.token);
  };

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData);

    return saveAuth(response.data.user, response.data.token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sb_token');
    localStorage.removeItem('token');

    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout }}
    >
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
