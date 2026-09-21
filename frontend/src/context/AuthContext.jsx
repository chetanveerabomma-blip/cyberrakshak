import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, removeAuthToken, getStoredUser, setStoredUser, removeStoredUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then((profile) => {
          const userData = { ...profile, role: profile.role };
          setUser(userData);
          setStoredUser(userData);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setAuthToken(res.token);
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role
    };
    setUser(userData);
    setStoredUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await api.register(data);
    setAuthToken(res.token);
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role
    };
    setUser(userData);
    setStoredUser(userData);
    return userData;
  };

  const logout = () => {
    removeAuthToken();
    removeStoredUser();
    setUser(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isOfficer = user?.role === 'ROLE_OFFICER';
  const isStaff = isAdmin || isOfficer;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isOfficer, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
