import { useState } from 'react';
import { registerUser, loginUser } from '../api/auth';

export const useAuthPresenter = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
    const result = await loginUser({ identifier, password });
    console.log('Login success', result);
  } catch (err: any) {
    setError(err.response?.data?.error || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return {
    handleRegister,
    handleLogin,
    error,
    loading,
  };
};
