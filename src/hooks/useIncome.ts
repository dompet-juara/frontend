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

const DUMMY_INCOME_CATEGORIES: IncomeCategory[] = [
    { id: 701, nama: "Salary (Demo)" },
    { id: 702, nama: "Freelance (Demo)" },
    { id: 703, nama: "Investments (Demo)" },
    { id: 704, nama: "Bonus (Demo)"},
];
const DUMMY_INCOMES: Income[] = [
    { id: 201, jumlah: 9000000, kategori_id: 701, keterangan: 'Monthly Salary (June Demo)', tanggal: new Date(2023, 5, 1).toISOString(), kategori_pemasukan: DUMMY_INCOME_CATEGORIES[0], user_id: 0 },
    { id: 202, jumlah: 2500000, kategori_id: 702, keterangan: 'Web Design Project (Demo)', tanggal: new Date(2023, 5, 10).toISOString(), kategori_pemasukan: DUMMY_INCOME_CATEGORIES[1], user_id: 0 },
    { id: 203, jumlah: 350000, kategori_id: 703, keterangan: 'Stock Dividends (Demo)', tanggal: new Date(2023, 5, 15).toISOString(), kategori_pemasukan: DUMMY_INCOME_CATEGORIES[2], user_id: 0 },
    { id: 204, jumlah: 1200000, kategori_id: 701, keterangan: 'Performance Bonus (Demo)', tanggal: new Date(2023, 5, 20).toISOString(), kategori_pemasukan: DUMMY_INCOME_CATEGORIES[0], user_id: 0 },
];

export const useIncome = () => {
    const { isGuest } = useAuth();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [categories, setCategories] = useState<IncomeCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentParams, setCurrentParams] = useState<FetchParams>(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        return { startDate: firstDayOfMonth, endDate: lastDayOfMonth, page: 1, limit: DEFAULT_LIMIT };
    });

    const loadIncomesData = useCallback(async (params: FetchParams) => {
        setLoading(true);
        setError(null);
        try {
            if (isGuest) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setIncomes(DUMMY_INCOMES);
            } else {
                const response: PaginatedIncomeResponse = await fetchIncomes(params);
                setIncomes(response.data);
                setPagination(response.pagination);
            }
        } catch (err: any) {
            if (!isGuest) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch incomes');
                setIncomes([]);
                setPagination(null);
            } else {
                setIncomes(DUMMY_INCOMES);
            }
        } finally {
            setLoading(false);
        }
    }, [isGuest]);

    const loadCategoriesData = useCallback(async () => {
        try {
            if (isGuest) {
                setCategories(DUMMY_INCOME_CATEGORIES);
            } else {
                const data = await fetchIncomeCategories();
                setCategories(data);
            }
        } catch (err: any) {
            if (!isGuest) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch income categories');
            } else {
                setCategories(DUMMY_INCOME_CATEGORIES);
            }
        }
    }, [isGuest]);

    useEffect(() => {
        loadIncomesData(currentParams);
        loadCategoriesData();
    }, [loadIncomesData, loadCategoriesData, currentParams]);


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
            await loadIncomesData(currentParams);
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