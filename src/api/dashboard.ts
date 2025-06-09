import axiosInstance from '../utils/axiosInstance';
import { FetchParams } from './income';

export interface DashboardTransaction {
  id: number;
  jumlah: number;
  keterangan?: string;
  tanggal: string;
  type: 'income' | 'outcome';
  kategori_id?: number;
  kategori_pemasukan?: { nama: string };
  kategori_pengeluaran?: { nama: string };
}

export interface DashboardSummary {
  totalIncome: number;
  totalOutcome: number;
  balance: number;
  month: string;
  recentTransactions: DashboardTransaction[];
}

export const fetchDashboardSummary = async (params?: FetchParams): Promise<DashboardSummary> => {
  const response = await axiosInstance.get<DashboardSummary>('/dashboard/summary', { params });
  return response.data;
};