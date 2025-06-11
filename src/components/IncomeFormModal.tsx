import React from 'react';

import { IncomeCategory } from '../api/income';

interface CurrentIncomeFormState {
  id?: number;
  jumlah?: string;
  kategori_id?: string;
  keterangan?: string;
  tanggal?: string;
}

interface IncomeFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  income: CurrentIncomeFormState;
  categories: IncomeCategory[];
  error: string | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const IncomeFormModal: React.FC<IncomeFormModalProps> = ({
  isOpen,
  isEditing,
  income,
  categories,
  error,
  loading,
  onClose,
  onSubmit,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[1000] flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-75 p-4 transition-opacity duration-300'>
      <div className='relative mx-auto w-full max-w-lg transform rounded-md border bg-white p-6 shadow-xl transition-all duration-300 ease-out'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-800'>{isEditing ? 'Edit Income' : 'Add New Income'}</h3>
          <button className='text-2xl font-bold text-gray-400 transition hover:text-gray-600' onClick={onClose}>
            ×
          </button>
        </div>
        {error && <p className='mb-3 rounded-md bg-red-100 p-2 text-sm text-red-500'>{error}</p>}
        <form className='space-y-4' onSubmit={onSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-700' htmlFor='jumlah'>
              Amount (Rp)
            </label>
            <input
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              id='jumlah'
              name='jumlah'
              onChange={onChange}
              placeholder='e.g., 1000000'
              required
              type='number'
              value={income.jumlah || ''}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700' htmlFor='kategori_id'>
              Category (Optional)
            </label>
            <select
              className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              id='kategori_id'
              name='kategori_id'
              onChange={onChange}
              value={income.kategori_id || ''}>
              <option value=''>Select a category (optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700' htmlFor='keterangan'>
              Description (Optional)
            </label>
            <textarea
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              id='keterangan'
              name='keterangan'
              onChange={onChange}
              placeholder='e.g., Monthly salary'
              rows={3}
              value={income.keterangan || ''}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700' htmlFor='tanggal'>
              Date
            </label>
            <input
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              id='tanggal'
              name='tanggal'
              onChange={onChange}
              required
              type='date'
              value={income.tanggal || ''}
            />
          </div>
          <div className='flex justify-end space-x-3 pt-2'>
            <button
              className='rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300'
              onClick={onClose}
              type='button'>
              Cancel
            </button>
            <button
              className='rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-300'
              disabled={loading}
              type='submit'>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeFormModal;
