import { useState } from 'react';
import { registerUser, loginUser as apiLoginUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const useAuthPresenter = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: contextLogin } = useAuth();

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
      if (result.token && result.user) {
        contextLogin(result.token, result.user);
      } else {
        throw new Error("Login response did not include token or user data.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    handleLogin,
    error,
    loading,
    setError
  };
};