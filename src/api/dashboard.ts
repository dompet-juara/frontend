import axiosInstance from '../utils/axiosInstance';
import { Income } from './income';
import { Outcome } from './outcome';

export interface DashboardSummary {
  totalIncome: number;
  totalOutcome: number;
  balance: number;
  month: string;
  recentTransactions: (Income | Outcome & { type: 'income' | 'outcome' })[];
}

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axiosInstance.get('/dashboard/summary');
  return response.data;
};