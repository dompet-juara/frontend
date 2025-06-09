import axiosInstance from '../utils/axiosInstance';

export interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar_url?: string;
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
  const response = await axiosInstance.post<RegisterResponse>('/register', data);
  return response.data;
};

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export const loginUser = async (data: { identifier: string; password: string }): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/login', data);
  return response.data;
};

export const logoutUser = async (refreshToken: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/logout', { refreshToken });
    return response.data;
};

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}
export const refreshToken = async (currentRefreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<RefreshTokenResponse>('/refresh-token', { refreshToken: currentRefreshToken });
    return response.data;
}

export interface GoogleSignInDataResponse {
  email: string;
  name: string;
  picture?: string;
}
export const getGoogleSignInData = async (idToken: string): Promise<GoogleSignInDataResponse> => {
  const response = await axiosInstance.post<GoogleSignInDataResponse>('/auth/google-signin-data', { idToken });
  return response.data;
}