import axiosInstance from '../utils/axiosInstance';

export interface AIRecommendation {
    message: string;
    tips: string[];
}

export const fetchAIRecommendations = async (): Promise<AIRecommendation> => {
  const response = await axiosInstance.get('/ai/recommendations');
  return response.data;
};