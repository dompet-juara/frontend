import axiosInstance from '../utils/axiosInstance';
import { FetchParams, PaginationInfo } from './income';

export interface ExpenseCategory {
    id: number;
    nama: string;
}

export interface Outcome {
    id: number;
    user_id: number;
    kategori_id: number;
    jumlah: number;
    keterangan?: string;
    tanggal: string;
    kategori_pengeluaran?: ExpenseCategory;
}

export interface PaginatedOutcomeResponse {
    data: Outcome[];
    pagination: PaginationInfo;
}

export interface NewOutcomePayload {
    kategori_id: number;
    jumlah: number;
    keterangan?: string;
    tanggal?: string;
}

export const fetchOutcomes = async (params?: FetchParams): Promise<PaginatedOutcomeResponse> => {
    const response = await axiosInstance.get<PaginatedOutcomeResponse>('/outcome', { params });
    return response.data;
};

export const fetchExpenseCategories = async (): Promise<ExpenseCategory[]> => {
    const response = await axiosInstance.get<ExpenseCategory[]>('/categories');
    return response.data;
};

export const addOutcome = async (payload: NewOutcomePayload): Promise<Outcome> => {
    const response = await axiosInstance.post<Outcome>('/outcome', payload);
    return response.data;
};

export const updateOutcome = async (id: number, payload: Partial<NewOutcomePayload>): Promise<Outcome> => {
    const response = await axiosInstance.put<Outcome>(`/outcome/${id}`, payload);
    return response.data;
};

export const deleteOutcome = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/outcome/${id}`);
};