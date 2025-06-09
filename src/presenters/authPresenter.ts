import { useState } from 'react';
import { registerUser, loginUser as apiLoginUser, logoutUser as apiLogoutUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const useAuthPresenter = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: contextLogin, logout: contextLogout, isAuthenticated } = useAuth();

  const handleRegister = async ({
    name,
    username,
    email,
    password,
  }: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser({ email, password, name, username });
      console.log('Registration success', result);
      return true; 
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiLoginUser({ identifier, password });
      console.log('Login success data:', result);
      if (result.accessToken && result.refreshToken && result.user) {
        contextLogin(result.accessToken, result.refreshToken, result.user);
      } else {
        throw new Error("Login response did not include all required token or user data.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiLogoutUser(refreshToken);
      }
    } catch (err: any) {
      console.error("API logout failed:", err.response?.data?.message || err.message);
    } finally {
      contextLogout();
      setLoading(false);
    }
  };


  return {
    handleRegister,
    handleLogin,
    handleLogout,
    isAuthenticated,
    error,
    loading,
    setError
  };
};