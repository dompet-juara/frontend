import { useState, useEffect, useCallback } from 'react';
import { AIRecommendation, fetchAIRecommendations } from '../api/ai';

export const useAIRecommender = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAIRecommendations();
      setRecommendations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch AI recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return {
    recommendations,
    loading,
    error,
    loadRecommendations,
  };
};