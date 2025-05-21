// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            // Failed to fetch user - invalid token
            handleLogout();
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const tokens = await authLogin(username, password);
      const userData = await getCurrentUser();
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
