import axiosInstance from '../utils/axiosInstance';

export interface Income {
  id: number;
  user_id: number;
  jumlah: number;
  keterangan?: string;
  tanggal: string;
}

export interface NewIncomePayload {
  jumlah: number;
  keterangan?: string;
  tanggal?: string;
}

export const fetchIncomes = async (): Promise<Income[]> => {
  const response = await axiosInstance.get('/income');
  return response.data;
};

export const addIncome = async (payload: NewIncomePayload): Promise<Income> => {
  const response = await axiosInstance.post('/income', payload);
  return response.data;
};

export const updateIncome = async (id: number, payload: Partial<NewIncomePayload>): Promise<Income> => {
  const response = await axiosInstance.put(`/income/${id}`, payload);
  return response.data;
};

export const deleteIncome = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/income/${id}`);
};