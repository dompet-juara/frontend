import { useState, useEffect, useCallback } from 'react';
import { Income, NewIncomePayload, fetchIncomes, addIncome, updateIncome, deleteIncome } from '../api/income';

export const useIncome = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncomes();
      setIncomes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch incomes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncomes();
  }, [loadIncomes]);

  const handleAddIncome = async (payload: NewIncomePayload) => {
    setLoading(true);
    setError(null);
    try {
      const newIncome = await addIncome(payload);
      setIncomes((prev) => [newIncome, ...prev].sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add income');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIncome = async (id: number, payload: Partial<NewIncomePayload>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedIncome = await updateIncome(id, payload);
      setIncomes((prev) => prev.map((inc) => (inc.id === id ? updatedIncome : inc))
                               .sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update income');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((inc) => inc.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete income');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    incomes,
    loading,
    error,
    loadIncomes,
    handleAddIncome,
    handleUpdateIncome,
    handleDeleteIncome,
    setError,
  };
};