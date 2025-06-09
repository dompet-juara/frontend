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

const DUMMY_EXPENSE_CATEGORIES: ExpenseCategory[] = [
    { id: 801, nama: "Food & Dining (Demo)" },
    { id: 802, nama: "Housing (Demo)" },
    { id: 803, nama: "Transportation (Demo)" },
    { id: 804, nama: "Utilities (Demo)"},
    { id: 805, nama: "Entertainment (Demo)"},
];
const DUMMY_OUTCOMES: Outcome[] = [
    { id: 301, jumlah: 850000, kategori_id: 801, keterangan: 'Weekly Groceries (Demo)', tanggal: new Date(2023, 5, 3).toISOString(), kategori_pengeluaran: DUMMY_EXPENSE_CATEGORIES[0], user_id: 0 },
    { id: 302, jumlah: 3500000, kategori_id: 802, keterangan: 'Monthly Rent (Demo)', tanggal: new Date(2023, 5, 5).toISOString(), kategori_pengeluaran: DUMMY_EXPENSE_CATEGORIES[1], user_id: 0 },
    { id: 303, jumlah: 450000, kategori_id: 803, keterangan: 'Gasoline Fill-up (Demo)', tanggal: new Date(2023, 5, 8).toISOString(), kategori_pengeluaran: DUMMY_EXPENSE_CATEGORIES[2], user_id: 0 },
    { id: 304, jumlah: 600000, kategori_id: 804, keterangan: 'Electricity & Internet Bill (Demo)', tanggal: new Date(2023, 5, 12).toISOString(), kategori_pengeluaran: DUMMY_EXPENSE_CATEGORIES[3], user_id: 0 },
    { id: 305, jumlah: 250000, kategori_id: 805, keterangan: 'Cinema Tickets (Demo)', tanggal: new Date(2023, 5, 18).toISOString(), kategori_pengeluaran: DUMMY_EXPENSE_CATEGORIES[4], user_id: 0 },
];

export const useOutcome = () => {
    const { isGuest } = useAuth();
    const [outcomes, setOutcomes] = useState<Outcome[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentParams, setCurrentParams] = useState<FetchParams>(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        return { startDate: firstDayOfMonth, endDate: lastDayOfMonth, page: 1, limit: DEFAULT_LIMIT };
    });

    const loadOutcomesData = useCallback(async (params: FetchParams) => {
        setLoading(true);
        setError(null);
        try {
            if (isGuest) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setOutcomes(DUMMY_OUTCOMES);
            } else {
                const response: PaginatedOutcomeResponse = await fetchOutcomes(params);
                setOutcomes(response.data);
                setPagination(response.pagination);
            }
        } catch (err: any) {
            if (!isGuest) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch outcomes');
                setOutcomes([]);
                setPagination(null);
            } else {
                setOutcomes(DUMMY_OUTCOMES);
            }
        } finally {
            setLoading(false);
        }
    }, [isGuest]);

    const loadCategoriesData = useCallback(async () => {
        try {
            if (isGuest) {
                setCategories(DUMMY_EXPENSE_CATEGORIES);
            } else {
                const data = await fetchExpenseCategories();
                setCategories(data);
            }
        } catch (err: any) {
            if (!isGuest) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch expense categories');
            } else {
                setCategories(DUMMY_EXPENSE_CATEGORIES);
            }
        }
    }, [isGuest]);

    useEffect(() => {
        loadOutcomesData(currentParams);
        loadCategoriesData();
    }, [loadOutcomesData, loadCategoriesData, currentParams]);

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
            await loadOutcomesData(currentParams);
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
            let newParams = { ...currentParams };
            if (outcomes.length === 1 && currentParams.page && currentParams.page > 1) {
                newParams.page = currentParams.page - 1;
            }
            setCurrentParams(newParams);
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