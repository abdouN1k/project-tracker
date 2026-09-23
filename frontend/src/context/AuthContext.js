import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = axios.create({
  baseURL: 'https://project-tracker-backend-85u8.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    const userToStore = { ...data.user, token: data.token };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    return userToStore;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    const userToStore = { ...data.user, token: data.token };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    return userToStore;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API };