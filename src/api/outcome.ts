import axiosInstance from '../utils/axiosInstance';

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

export interface NewOutcomePayload {
  kategori_id: number;
  jumlah: number;
  keterangan?: string;
  tanggal?: string;
}

export const fetchCategories = async (): Promise<ExpenseCategory[]> => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const fetchOutcomes = async (): Promise<Outcome[]> => {
  const response = await axiosInstance.get('/outcome');
  return response.data;
};

export const addOutcome = async (payload: NewOutcomePayload): Promise<Outcome> => {
  const response = await axiosInstance.post('/outcome', payload);
  return response.data;
};

export const updateOutcome = async (id: number, payload: Partial<NewOutcomePayload>): Promise<Outcome> => {
  const response = await axiosInstance.put(`/outcome/${id}`, payload);
  return response.data;
};

export const deleteOutcome = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/outcome/${id}`);
};