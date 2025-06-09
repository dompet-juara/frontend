import { useState, useEffect, useCallback } from 'react';
import {
    Income,
    NewIncomePayload,
    fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
    fetchIncomeCategories,
    IncomeCategory,
    FetchParams,
    PaginationInfo,
    PaginatedIncomeResponse
} from '../api/income';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_LIMIT = 10;

export const useIncome = () => {
    const { isGuest } = useAuth();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [categories, setCategories] = useState<IncomeCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentParams, setCurrentParams] = useState<FetchParams>(() => {
        const today = new Date().toISOString().split('T')[0];
        return { startDate: today, endDate: today, page: 1, limit: DEFAULT_LIMIT };
    });

    const loadIncomes = useCallback(async (params: FetchParams) => {
        setLoading(true);
        setError(null);

        try {
            const response: PaginatedIncomeResponse = await fetchIncomes(params);
            setIncomes(response.data);
            setPagination(response.pagination);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch incomes');
            setIncomes([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            const data = await fetchIncomeCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch income categories');
        }
    }, []);

    useEffect(() => {
        loadIncomes(currentParams);
        loadCategories();
    }, [loadIncomes, loadCategories, currentParams]);

    const handleAddIncome = async (payload: NewIncomePayload) => {
        if (isGuest) {
            setError("Guest mode: Cannot add data. Please register or login.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            await addIncome(payload);
            const newParams = { ...currentParams, page: 1 };
            setCurrentParams(newParams);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to add income');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateIncome = async (id: number, payload: Partial<NewIncomePayload>) => {
        if (isGuest) {
            setError("Guest mode: Cannot update data. Please register or login.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            await updateIncome(id, payload);
            await loadIncomes(currentParams);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update income');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteIncome = async (id: number) => {
        if (isGuest) {
            setError("Guest mode: Cannot delete data. Please register or login.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            await deleteIncome(id);
            let newParams = { ...currentParams };
            if (incomes.length === 1 && currentParams.page && currentParams.page > 1) {
                newParams.page = currentParams.page - 1;
            }
            setCurrentParams(newParams);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to delete income');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page: number) => {
        if (page > 0 && (!pagination || page <= pagination.totalPages)) {
            const newParams = { ...currentParams, page };
            setCurrentParams(newParams);
        }
    };

    const applyDateFilter = (dateRange: { startDate: string, endDate: string }) => {
        const newParams = { ...currentParams, ...dateRange, page: 1 };
        setCurrentParams(newParams);
    };

    return {
        incomes,
        pagination,
        categories,
        loading,
        error,
        handleAddIncome,
        handleUpdateIncome,
        handleDeleteIncome,
        setError,
        goToPage,
        applyDateFilter,
        currentFilters: currentParams,
    };
};