import React, { useState } from 'react';
import { useOutcome } from '../../hooks/useOutcome';
import { Outcome, NewOutcomePayload } from '../../api/outcome';

const OutcomeView: React.FC = () => {
  const { outcomes, categories, loading, error, handleAddOutcome, handleUpdateOutcome, handleDeleteOutcome, setError } = useOutcome();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState<Partial<Outcome> & { jumlah?: string, kategori_id?: string }>({});
  const [isEditing, setIsEditing] = useState(false);

  const openModalForAdd = () => {
    setCurrentOutcome({ tanggal: new Date().toISOString().split('T')[0], kategori_id: categories.length > 0 ? categories[0].id.toString() : "" });
    setIsEditing(false);
    setIsModalOpen(true);
    setError(null);
  };

  const openModalForEdit = (outcome: Outcome) => {
    setCurrentOutcome({ 
        ...outcome, 
        jumlah: outcome.jumlah.toString(), 
        kategori_id: outcome.kategori_id.toString(),
        tanggal: outcome.tanggal.split('T')[0] 
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOutcome({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentOutcome(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOutcome.jumlah || isNaN(parseFloat(currentOutcome.jumlah)) || parseFloat(currentOutcome.jumlah) <=0) {
        setError("Jumlah must be a positive number.");
        return;
    }
    if (!currentOutcome.kategori_id) {
        setError("Category is required.");
        return;
    }
    const payload: NewOutcomePayload = {
      jumlah: parseFloat(currentOutcome.jumlah),
      kategori_id: parseInt(currentOutcome.kategori_id, 10),
      keterangan: currentOutcome.keterangan,
      tanggal: currentOutcome.tanggal ? new Date(currentOutcome.tanggal).toISOString() : undefined,
    };

    let success;
    if (isEditing && currentOutcome.id) {
      success = await handleUpdateOutcome(currentOutcome.id, payload);
    } else {
      success = await handleAddOutcome(payload);
    }
    if (success) closeModal();
  };
  
  const confirmDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this outcome record?")) {
      await handleDeleteOutcome(id);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Outcome Records</h1>
        <button
          onClick={openModalForAdd}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Outcome
        </button>
      </div>

      {loading && categories.length === 0 && <p>Loading categories and outcomes...</p>}
      {error && !isModalOpen && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {outcomes.length === 0 && !loading && (
              <tr><td colSpan={5} className="text-center py-4">No outcome records found.</td></tr>
            )}
            {outcomes.map((outcome) => (
              <tr key={outcome.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(outcome.tanggal).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{outcome.kategori_pengeluaran?.nama || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rp {Number(outcome.jumlah).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">{outcome.keterangan || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => openModalForEdit(outcome)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => confirmDelete(outcome.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
                <h3 className="text-lg font-medium">{isEditing ? 'Edit Outcome' : 'Add New Outcome'}</h3>
                <button onClick={closeModal} className="text-2xl font-bold">×</button>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Amount (Rp)</label>
                <input type="number" name="jumlah" id="jumlah" value={currentOutcome.jumlah || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700">Category</label>
                <select name="kategori_id" id="kategori_id" value={currentOutcome.kategori_id || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nama}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="keterangan" id="keterangan" value={currentOutcome.keterangan || ''} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="tanggal" id="tanggal" value={currentOutcome.tanggal || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
                  {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Outcome')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutcomeView;