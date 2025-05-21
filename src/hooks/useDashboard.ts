import { useState, useEffect, useCallback } from 'react';
import { DashboardSummary, fetchDashboardSummary } from '../api/dashboard';

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    loading,
    error,
    loadSummary,
    setError
  };
};