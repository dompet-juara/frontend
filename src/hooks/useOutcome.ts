import { useState, useEffect, useCallback } from 'react';
import {
    Outcome,
    NewOutcomePayload,
    ExpenseCategory,
    fetchOutcomes,
    addOutcome,
    updateOutcome,
    deleteOutcome,
    fetchExpenseCategories,
    PaginatedOutcomeResponse
} from '../api/outcome';
import { FetchParams, PaginationInfo } from '../api/income';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_LIMIT = 10;

export const useOutcome = () => {
    const { isGuest } = useAuth();
    const [outcomes, setOutcomes] = useState<Outcome[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentParams, setCurrentParams] = useState<FetchParams>(() => {
        const today = new Date().toISOString().split('T')[0];
        return { startDate: today, endDate: today, page: 1, limit: DEFAULT_LIMIT };
    });

    const loadOutcomes = useCallback(async (params: FetchParams) => {
        setLoading(true);
        setError(null);
        try {
            const response: PaginatedOutcomeResponse = await fetchOutcomes(params);
            setOutcomes(response.data);
            setPagination(response.pagination);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch outcomes');
            setOutcomes([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            const data = await fetchExpenseCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch expense categories');
        }
    }, []);

    useEffect(() => {
        loadOutcomes(currentParams);
        loadCategories();
    }, [currentParams, loadOutcomes, loadCategories]);

    const handleAddOutcome = async (payload: NewOutcomePayload) => {
        if (isGuest) {
            setError("Guest mode: Cannot add data. Please register or login.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            await addOutcome(payload);
            setCurrentParams((prevParams: FetchParams) => ({ ...prevParams, page: 1 }));
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to add outcome');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOutcome = async (id: number, payload: Partial<NewOutcomePayload>) => {
        if (isGuest) {
            setError("Guest mode: Cannot update data. Please register or login.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            await updateOutcome(id, payload);
            await loadOutcomes(currentParams);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update outcome');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOutcome = async (id: number) => {
        if (isGuest) {
            setError("Guest mode: Cannot delete data. Please register or login.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            await deleteOutcome(id);
            if (outcomes.length === 1 && currentParams.page && currentParams.page > 1) {
                setCurrentParams((prevParams: FetchParams) => ({ ...prevParams, page: prevParams.page! - 1 }));
            } else {
                await loadOutcomes(currentParams);
            }
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to delete outcome');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page: number) => {
        if (page > 0 && (!pagination || page <= pagination.totalPages)) {
            setCurrentParams((prevParams: FetchParams) => ({ ...prevParams, page }));
        }
    };

    const applyDateFilter = (dateRange: { startDate: string, endDate: string }) => {
        setCurrentParams((prevParams: FetchParams) => ({ ...prevParams, ...dateRange, page: 1 }));
    };

    return {
        outcomes,
        pagination,
        categories,
        loading,
        error,
        handleAddOutcome,
        handleUpdateOutcome,
        handleDeleteOutcome,
        setError,
        goToPage,
        applyDateFilter,
        currentFilters: currentParams,
    };
};