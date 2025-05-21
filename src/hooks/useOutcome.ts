import { useState, useEffect, useCallback } from 'react';
import { Outcome, NewOutcomePayload, ExpenseCategory, fetchOutcomes, addOutcome, updateOutcome, deleteOutcome, fetchCategories } from '../api/outcome';

export const useOutcome = () => {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
    } finally {
    }
  }, []);
  
  const loadOutcomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOutcomes();
      setOutcomes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch outcomes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadOutcomes();
  }, [loadCategories, loadOutcomes]);

  const handleAddOutcome = async (payload: NewOutcomePayload) => {
    setLoading(true);
    setError(null);
    try {
      const newOutcome = await addOutcome(payload);
      setOutcomes((prev) => [newOutcome, ...prev].sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add outcome');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOutcome = async (id: number, payload: Partial<NewOutcomePayload>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOutcome = await updateOutcome(id, payload);
      setOutcomes((prev) => prev.map((out) => (out.id === id ? updatedOutcome : out))
                                .sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update outcome');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutcome = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteOutcome(id);
      setOutcomes((prev) => prev.filter((out) => out.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete outcome');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    outcomes,
    categories,
    loading,
    error,
    loadOutcomes,
    loadCategories,
    handleAddOutcome,
    handleUpdateOutcome,
    handleDeleteOutcome,
    setError,
  };
};