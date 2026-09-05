import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signup = async (formData) => {
    const res = await api.signup(formData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const adminLogin = async (credentials) => {
    const res = await api.adminLogin(credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await api.getMe();
    setUser(res.data);
    return res.data;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    adminLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};