import { useState, useEffect, useCallback } from 'react';
import { DashboardSummary, fetchDashboardSummary, DashboardTransaction } from '../api/dashboard';
import { FetchParams } from '../api/income';
import { useAuth } from '../contexts/AuthContext';

const DUMMY_DASHBOARD_SUMMARY: DashboardSummary = {
    month: "Demo Period (Guest View)",
    totalIncome: 12500000,
    totalOutcome: 7850000,
    balance: 12500000 - 7850000,
    recentTransactions: [
        {
            id: 1001, type: 'income', tanggal: new Date(Date.now() - 86400000 * 7).toISOString(), jumlah: 8000000, keterangan: 'Demo Monthly Salary',
            kategori_pemasukan: { nama: 'Demo Salary' }
        },
        {
            id: 1002, type: 'outcome', tanggal: new Date(Date.now() - 86400000 * 6).toISOString(), jumlah: 2500000, keterangan: 'Demo Rent Payment',
            kategori_pengeluaran: { nama: 'Demo Housing' }
        },
        {
            id: 1003, type: 'income', tanggal: new Date(Date.now() - 86400000 * 4).toISOString(), jumlah: 4500000, keterangan: 'Demo Freelance Project',
            kategori_pemasukan: { nama: 'Demo Side Income' }
        },
        {
            id: 1004, type: 'outcome', tanggal: new Date(Date.now() - 86400000 * 3).toISOString(), jumlah: 1250000, keterangan: 'Demo Groceries & Supplies',
            kategori_pengeluaran: { nama: 'Demo Food & Household' }
        },
        {
            id: 1005, type: 'outcome', tanggal: new Date(Date.now() - 86400000 * 1).toISOString(), jumlah: 700000, keterangan: 'Demo Utilities (Electricity, Internet)',
            kategori_pengeluaran: { nama: 'Demo Bills' }
        },
        {
            id: 1006, type: 'outcome', tanggal: new Date().toISOString(), jumlah: 3400000, keterangan: 'Demo Car Payment',
            kategori_pengeluaran: { nama: 'Demo Transport' }
        },
    ] as DashboardTransaction[],
};


export const useDashboard = () => {
  const { isGuest } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<FetchParams | undefined>(undefined);

  const loadSummaryData = useCallback(async (params?: FetchParams) => {
    setLoading(true);
    setError(null);
    try {
      if (isGuest) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setSummary(DUMMY_DASHBOARD_SUMMARY);
      } else {
        const data = await fetchDashboardSummary(params);
        setSummary(data);
      }
    } catch (err: any) {
      if (!isGuest) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard summary');
        setSummary(null);
      } else {
        setSummary(DUMMY_DASHBOARD_SUMMARY);
      }
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadSummaryData(currentParams);
  }, [loadSummaryData, currentParams]);

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