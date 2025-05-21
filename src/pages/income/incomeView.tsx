import React, { useState } from 'react';
import { useIncome } from '../../hooks/useIncome';
import { Income, NewIncomePayload } from '../../api/income';

const IncomeView: React.FC = () => {
  const { incomes, loading, error, handleAddIncome, handleUpdateIncome, handleDeleteIncome, setError } = useIncome();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Partial<Income> & { jumlah?: string }>({}); // Use string for form input
  const [isEditing, setIsEditing] = useState(false);

  const openModalForAdd = () => {
    setCurrentIncome({ tanggal: new Date().toISOString().split('T')[0] }); // Default to today
    setIsEditing(false);
    setIsModalOpen(true);
    setError(null);
  };

  const openModalForEdit = (income: Income) => {
    setCurrentIncome({ ...income, jumlah: income.jumlah.toString(), tanggal: income.tanggal.split('T')[0] });
    setIsEditing(true);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentIncome({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentIncome(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentIncome.jumlah || isNaN(parseFloat(currentIncome.jumlah)) || parseFloat(currentIncome.jumlah) <=0) {
        setError("Jumlah must be a positive number.");
        return;
    }
    const payload: NewIncomePayload = {
      jumlah: parseFloat(currentIncome.jumlah),
      keterangan: currentIncome.keterangan,
      tanggal: currentIncome.tanggal ? new Date(currentIncome.tanggal).toISOString() : undefined,
    };

    let success;
    if (isEditing && currentIncome.id) {
      success = await handleUpdateIncome(currentIncome.id, payload);
    } else {
      success = await handleAddIncome(payload);
    }
    if (success) closeModal();
  };
  
  const confirmDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      await handleDeleteIncome(id);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Income Records</h1>
        <button
          onClick={openModalForAdd}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Income
        </button>
      </div>

      {loading && <p>Loading incomes...</p>}
      {/* Global error for fetch, specific errors handled in modal */}
      {error && !isModalOpen && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incomes.length === 0 && !loading && (
              <tr><td colSpan={4} className="text-center py-4">No income records found.</td></tr>
            )}
            {incomes.map((income) => (
              <tr key={income.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(income.tanggal).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rp {Number(income.jumlah).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">{income.keterangan || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => openModalForEdit(income)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => confirmDelete(income.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[1000]">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{isEditing ? 'Edit Income' : 'Add New Income'}</h3>
                <button onClick={closeModal} className="text-2xl font-bold">×</button>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Amount (Rp)</label>
                <input type="number" name="jumlah" id="jumlah" value={currentIncome.jumlah || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="keterangan" id="keterangan" value={currentIncome.keterangan || ''} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="tanggal" id="tanggal" value={currentIncome.tanggal || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
                  {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Income')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeView;