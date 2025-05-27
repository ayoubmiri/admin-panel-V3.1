// src/services/authService.js
import axios from 'axios';

const KEYCLOAK_BASE_URL = process.env.REACT_APP_KEYCLOAK_BASE_URL || 'http://localhost:8080';
const REALM = process.env.REACT_APP_KEYCLOAK_REALM || 'ent_est-realm';
const CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'ent_est-client';
const CLIENT_SECRET = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET || 'your-client-secret';

// Keycloak token endpoint
const TOKEN_URL = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`;

// Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// --- AUTH FUNCTIONS ---

export const login = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    const expiration = Date.now() + expires_in * 1000;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('token_expires_at', expiration);

    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
  // Optional redirect
  window.location.href = '/login';
};

export const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error('No refresh token found.');

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;
    const expiration = Date.now() + expires_in * 1000;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('token_expires_at', expiration);

    return access_token;
  } catch (error) {
    logout();
    throw error;
  }
};

const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('token_expires_at');
  return !expiresAt || Date.now() > parseInt(expiresAt);
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');

    if (token && isTokenExpired()) {
      try {
        const newToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch {
        logout();
        throw new Error('Token refresh failed.');
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const newToken = await refreshToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch {
        logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Example to get current user from your backend
export const getCurrentUser = async () => {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (err) {
    return null;
  }
};

export default api;
