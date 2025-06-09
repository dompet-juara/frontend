import axiosInstance from '../utils/axiosInstance';

export interface IncomeCategory {
    id: number;
    nama: string;
}

export interface Income {
    id: number;
    user_id: number;
    jumlah: number;
    keterangan?: string;
    tanggal: string;
    kategori_id?: number;
    kategori_pemasukan?: IncomeCategory;
}

export interface NewIncomePayload {
    jumlah: number;
    keterangan?: string;
    tanggal?: string;
    kategori_id?: number;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface PaginatedIncomeResponse {
    data: Income[];
    pagination: PaginationInfo;
}

export interface FetchParams {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export const fetchIncomes = async (params?: FetchParams): Promise<PaginatedIncomeResponse> => {
    const response = await axiosInstance.get<PaginatedIncomeResponse>('/income', { params });
    return response.data;
};

export const addIncome = async (payload: NewIncomePayload): Promise<Income> => {
    const response = await axiosInstance.post<Income>('/income', payload);
    return response.data;
};

export const updateIncome = async (id: number, payload: Partial<NewIncomePayload>): Promise<Income> => {
    const response = await axiosInstance.put<Income>(`/income/${id}`, payload);
    return response.data;
};

export const deleteIncome = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/income/${id}`);
};

export const fetchIncomeCategories = async (): Promise<IncomeCategory[]> => {
    const response = await axiosInstance.get<IncomeCategory[]>('/income/categories');
    return response.data;
};