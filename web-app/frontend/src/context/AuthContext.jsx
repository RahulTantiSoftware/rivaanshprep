import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient, { setAccessToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('rivaanshprep_subscribed') === 'true';
  });

  // Check existing session silently on load
  const checkAuth = async () => {
    try {
      const response = await axiosClient.post('/auth/refresh');
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    // Send username (supports either username or email)
    const response = await axiosClient.post('/auth/login', {
      username: username.trim(),
      password,
    });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (formData) => {
    const response = await axiosClient.post('/auth/register', formData);
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout error', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const response = await axiosClient.put('/profile', profileData);
    setUser(response.data);
    return response.data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const response = await axiosClient.post('/profile/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  };

  const subscribe = (plan = 'Class 10th Study Pass') => {
    localStorage.setItem('rivaanshprep_subscribed', 'true');
    localStorage.setItem('rivaanshprep_subscription_plan', plan);
    setIsSubscribed(true);
  };

  const unsubscribe = () => {
    localStorage.removeItem('rivaanshprep_subscribed');
    localStorage.removeItem('rivaanshprep_subscription_plan');
    setIsSubscribed(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSubscribed,
        subscribe,
        unsubscribe,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
