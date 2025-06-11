import * as XLSX from 'xlsx';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DateRangeFilter from '../../components/DateRangeFilter';
import IncomeFormModal from '../../components/IncomeFormModal';
import PaginationControls from '../../components/PaginationControls';
import { useAuth } from '../../contexts/AuthContext';
import { Income, NewIncomePayload } from '../../api/income';
import { useIncome } from '../../hooks/useIncome';
import { formatCurrency } from '../../utils/formatCurrency';
import axiosInstance from '../../utils/axiosInstance';

interface ImportedIncomeRow {
  Tanggal: Date | string;
  Jumlah: number | string;
  Kategori?: string;
  Keterangan?: string;
}

interface CurrentIncomeFormState {
  id?: number;
  jumlah?: string;
  kategori_id?: string;
  keterangan?: string;
  tanggal?: string;
}

const IncomeView: React.FC = () => {
  const {
    incomes,
    pagination,
    categories,
    loading,
    error,
    handleAddIncome,
    handleUpdateIncome,
    handleDeleteIncome,
    setError,
    goToPage,
    applyDateFilter,
    currentFilters,
  } = useIncome();
  const { isGuest } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<CurrentIncomeFormState>({});
  const [isEditing, setIsEditing] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openModalForAdd = () => {
    setCurrentIncome({
      tanggal: new Date().toISOString().split('T')[0],
      kategori_id: categories.length > 0 && categories[0] ? categories[0].id.toString() : undefined,
      jumlah: '',
      keterangan: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
    setError(null);
  };

  const openModalForEdit = (income: Income) => {
    setCurrentIncome({
      id: income.id,
      jumlah: income.jumlah.toString(),
      kategori_id: income.kategori_id ? income.kategori_id.toString() : undefined,
      keterangan: income.keterangan || '',
      tanggal: income.tanggal
        ? new Date(income.tanggal).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    });
    setIsEditing(true);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentIncome({});
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentIncome((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setError('Guest mode: Operation not allowed.');
      return;
    }
    if (!currentIncome.jumlah || isNaN(parseFloat(currentIncome.jumlah)) || parseFloat(currentIncome.jumlah) <= 0) {
      setError('Jumlah (amount) must be a positive number.');
      return;
    }
    if (!currentIncome.tanggal) {
      setError('Date is required.');
      return;
    }

    const payload: NewIncomePayload = {
      jumlah: parseFloat(currentIncome.jumlah),
      keterangan: currentIncome.keterangan || undefined,
      tanggal: new Date(currentIncome.tanggal).toISOString(),
      kategori_id:
        currentIncome.kategori_id && currentIncome.kategori_id !== ''
          ? parseInt(currentIncome.kategori_id, 10)
          : undefined,
    };

    const success =
      isEditing && currentIncome.id
        ? await handleUpdateIncome(currentIncome.id, payload)
        : await handleAddIncome(payload);
    if (success) closeModal();
  };

  const confirmDelete = async (id: number) => {
    if (isGuest) {
      setError('Guest mode: Operation not allowed.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this income record?')) {
      await handleDeleteIncome(id);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuest) {
      setImportMessage('Guest mode: Import not allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportMessage(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          setImportMessage('Failed to read file.');
          setImportLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ImportedIncomeRow>(worksheet);

        if (jsonData.length === 0) {
          setImportMessage('File is empty or has an invalid structure.');
          setImportLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const firstRow = jsonData[0];
        if (!('Tanggal' in firstRow) || !('Jumlah' in firstRow)) {
          setImportMessage(
            "XLSX must contain 'Tanggal' and 'Jumlah' columns. 'Kategori' and 'Keterangan' are optional."
          );
          setImportLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const response = await axiosInstance.post('/income/import', { records: jsonData });
        setImportMessage(response.data.message);
        if (response.data.successfulImports > 0 && currentFilters.startDate && currentFilters.endDate) {
          applyDateFilter({ startDate: currentFilters.startDate, endDate: currentFilters.endDate });
        } else if (response.data.failedImports > 0 && response.data.errors && response.data.errors.length > 0) {
          setError(response.data.errors[0]?.error || 'Some records failed to import.');
        }
      } catch (err: unknown) {
        console.error('Error importing file:', err);
        const message =
          err instanceof Error && 'response' in err
            ? (err as any).response?.data?.message || 'Failed to import XLSX file.'
            : 'Failed to import XLSX file.';
        setImportMessage(message);
        setError(message);
      } finally {
        setImportLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className='p-4 md:p-6'>
      {isGuest && (
        <div className='mb-4 rounded-md bg-yellow-100 p-3 text-sm text-yellow-700'>
          You are in Guest Mode. Data shown is for demonstration only.
          <Link className='ml-1 font-bold underline' to='/register'>
            Register
          </Link>{' '}
          or{' '}
          <Link className='ml-1 font-bold underline' to='/login'>
            Login
          </Link>{' '}
          to save your data.
        </div>
      )}
      <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-2xl font-semibold text-gray-800'>Income Records</h1>
        <div className='flex flex-wrap gap-2'>
          <input
            accept='.xlsx, .xls'
            className='hidden'
            disabled={importLoading || isGuest}
            onChange={handleFileImport}
            ref={fileInputRef}
            type='file'
          />
          <button
            className='rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300'
            disabled={importLoading || isGuest}
            onClick={() => fileInputRef.current?.click()}>
            {importLoading ? 'Importing...' : 'Import from XLSX'}
          </button>
          <button
            className='rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300'
            disabled={isGuest}
            onClick={openModalForAdd}>
            Add Income
          </button>
        </div>
      </div>

      {importMessage && (
        <div
          className={`mb-4 rounded-md p-3 text-sm ${
            error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
          {importMessage}
        </div>
      )}

      {currentFilters.startDate && currentFilters.endDate && (
        <DateRangeFilter
          defaultRange={{ startDate: currentFilters.startDate, endDate: currentFilters.endDate }}
          onFilterChange={applyDateFilter}
        />
      )}

      {loading && !importLoading && <p className='py-4 text-center text-gray-600'>Loading incomes...</p>}
      {error && !isModalOpen && !importMessage && (
        <p className='mb-4 rounded-md bg-red-100 p-3 text-sm text-red-500'>{error}</p>
      )}

      <div className='mt-4 overflow-x-auto rounded-lg bg-white shadow-lg'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Date</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Amount</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Category
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Description
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {incomes.length === 0 && !loading && (
              <tr>
                <td className='py-8 text-center text-gray-500' colSpan={5}>
                  No income records found for the selected period.
                </td>
              </tr>
            )}
            {incomes.map((income) => (
              <tr className='transition-colors hover:bg-gray-50' key={income.id}>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-700'>
                  {new Date(income.tanggal).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-700'>{formatCurrency(income.jumlah)}</td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-700'>
                  {income.kategori_pemasukan?.nama || 'Uncategorized'}
                </td>
                <td
                  className='max-w-xs truncate px-6 py-4 text-sm text-gray-700'
                  title={income.keterangan || undefined}>
                  {income.keterangan || '-'}
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                  <button
                    className='mr-3 text-indigo-600 transition hover:text-indigo-900 disabled:cursor-not-allowed disabled:text-gray-400'
                    disabled={isGuest}
                    onClick={() => openModalForEdit(income)}>
                    Edit
                  </button>
                  <button
                    className='text-red-600 transition hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400'
                    disabled={isGuest}
                    onClick={() => confirmDelete(income.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls onPageChange={goToPage} pagination={pagination} />

      <IncomeFormModal
        categories={categories}
        error={error}
        income={currentIncome}
        isEditing={isEditing}
        isOpen={isModalOpen}
        loading={loading || importLoading}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default IncomeView;
