import { useState, useEffect, useCallback } from 'react';
import { DashboardSummary, fetchDashboardSummary } from '../api/dashboard';
import { FetchParams } from '../api/income';

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<FetchParams | undefined>(undefined);

  const loadSummary = useCallback(async (params?: FetchParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardSummary(params);
      setSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard summary');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary(currentParams);
  }, [loadSummary, currentParams]);

  const handleFilterChange = useCallback((newParams: FetchParams) => {
    setCurrentParams(newParams);
  }, []);

  return {
    summary,
    loading,
    error,
    loadSummary: handleFilterChange,
    setError,
  };
};