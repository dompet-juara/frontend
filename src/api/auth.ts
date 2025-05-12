import axiosInstance from '../utils/axiosInstance';

export const registerUser = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post('/register', data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed.';
    console.error('Register failed:', message);
    throw new Error(message);
  }
};

export const loginUser = async (data: { identifier: string; password: string }) => {
  try {
    const response = await axiosInstance.post('/login', data);
    return response.data;
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};
