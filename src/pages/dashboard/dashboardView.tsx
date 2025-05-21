import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';

const DashboardView: React.FC = () => {
  const { summary, loading, error } = useDashboard();
  const { user } = useAuth();

  if (loading) return <p className="p-4">Loading dashboard data...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading dashboard: {error}</p>;

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-semibold mb-6">Welcome back, {user?.name || user?.username}!</h1>
      
      {summary && (
        <>
          <h2 className="text-xl font-medium mb-2">Financial Summary for {summary.month}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-700">Total Income</h3>
              <p className="text-2xl text-green-800">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-red-700">Total Outcome</h3>
              <p className="text-2xl text-red-800">{formatCurrency(summary.totalOutcome)}</p>
            </div>
            <div className={`p-6 rounded-lg shadow ${summary.balance >= 0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <h3 className={`text-lg font-semibold ${summary.balance >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>Current Balance</h3>
              <p className={`text-2xl ${summary.balance >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>{formatCurrency(summary.balance)}</p>
            </div>
          </div>

          <h2 className="text-xl font-medium mb-2">Recent Transactions</h2>
          {summary.recentTransactions.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description/Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.recentTransactions.map((tx, index) => (
                    <tr key={`${(tx as any).type}-${tx.id}-${index}`}> {/* Ensure unique key */}
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.tanggal).toLocaleDateString()}</td>
                      <td className={`px-6 py-4 whitespace-nowrap font-medium ${(tx as any).type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        { (tx as any).type === 'income' ? 'Income' : 'Outcome' }
                      </td>
                      <td className="px-6 py-4">
                        { (tx as any).type === 'income' ? tx.keterangan : (tx as any).kategori_pengeluaran?.nama || tx.keterangan }
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap font-medium ${(tx as any).type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(tx.jumlah)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent transactions found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardView;