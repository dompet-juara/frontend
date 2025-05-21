import axiosInstance from '../utils/axiosInstance';

interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
}
interface RegisterResponse {
  message: string;
  user: UserData;
}

export const registerUser = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const response = await axiosInstance.post('/register', data);
  return response.data;
};

interface LoginResponse {
  message: string;
  token: string;
  user: UserData;
}

export const loginUser = async (data: { identifier: string; password: string }): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/login', data);
  return response.data;
};