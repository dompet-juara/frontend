import React, { useState, useRef } from 'react';
import { useIncome } from '../../hooks/useIncome';
import { Income, NewIncomePayload, IncomeCategory } from '../../api/income';
import DateRangeFilter from '../../components/DateRangeFilter';
import PaginationControls from '../../components/PaginationControls';
import * as XLSX from 'xlsx';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface CurrentIncomeFormState {
    id?: number;
    jumlah?: string;
    kategori_id?: string;
    keterangan?: string;
    tanggal?: string;
}

const IncomePage: React.FC = () => {
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
        currentFilters
    } = useIncome();
    const { isGuest } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIncome, setCurrentIncome] = useState<CurrentIncomeFormState>({});
    const [isEditing, setIsEditing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importMessage, setImportMessage] = useState<string | null>(null);

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
            tanggal: income.tanggal ? new Date(income.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
        setCurrentIncome(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isGuest) {
            setError("Guest mode: Operation not allowed.");
            return;
        }
        if (!currentIncome.jumlah || isNaN(parseFloat(currentIncome.jumlah)) || parseFloat(currentIncome.jumlah) <= 0) {
            setError("Jumlah (amount) must be a positive number.");
            return;
        }
        if (!currentIncome.tanggal) {
            setError("Date is required.");
            return;
        }

        const payload: NewIncomePayload = {
            jumlah: parseFloat(currentIncome.jumlah),
            keterangan: currentIncome.keterangan || undefined,
            tanggal: new Date(currentIncome.tanggal).toISOString(),
            kategori_id: currentIncome.kategori_id && currentIncome.kategori_id !== "" ? parseInt(currentIncome.kategori_id, 10) : undefined,
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
        if (isGuest) {
            setError("Guest mode: Operation not allowed.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this income record?")) {
            await handleDeleteIncome(id);
        }
    };

    const formatCurrency = (amount: number | string) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isGuest) {
            setImportMessage("Guest mode: Import not allowed.");
            if(fileInputRef.current) fileInputRef.current.value = "";
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
                const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

                if (jsonData.length === 0) {
                    setImportMessage("File is empty or has an invalid structure.");
                    if(fileInputRef.current) fileInputRef.current.value = "";
                    setImportLoading(false);
                    return;
                }

                const firstRow: any = jsonData[0];
                if (!firstRow.hasOwnProperty('Tanggal') || !firstRow.hasOwnProperty('Jumlah')) {
                    setImportMessage("XLSX must contain 'Tanggal' and 'Jumlah' columns. 'Kategori' and 'Keterangan' are optional.");
                    if(fileInputRef.current) fileInputRef.current.value = "";
                    setImportLoading(false);
                    return;
                }
                
                const response = await axiosInstance.post('/income/import', { records: jsonData });
                setImportMessage(response.data.message);
                if (response.data.successfulImports > 0 && currentFilters.startDate && currentFilters.endDate) {
                    applyDateFilter({startDate: currentFilters.startDate, endDate: currentFilters.endDate});
                } else if (response.data.failedImports > 0 && response.data.errors && response.data.errors.length > 0) {
                    setError(response.data.errors[0]?.error || "Some records failed to import.");
                }

            } catch (err: any) {
                console.error("Error importing file:", err);
                const message = err.response?.data?.message || "Failed to import XLSX file.";
                setImportMessage(message);
                setError(message);
            } finally {
                setImportLoading(false);
                if(fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="p-4 md:p-6">
            {isGuest && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                You are in Guest Mode. Data shown is for demonstration only.
                <Link to="/register" className="font-bold underline ml-1">Register</Link> or <Link to="/login" className="font-bold underline ml-1">Login</Link> to save your data.
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">Income Records</h1>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileImport}
                        className="hidden"
                        ref={fileInputRef}
                        disabled={importLoading || isGuest}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:bg-green-300"
                        disabled={importLoading || isGuest}
                    >
                        {importLoading ? 'Importing...' : 'Import from XLSX'}
                    </button>
                    <button
                        onClick={openModalForAdd}
                        disabled={isGuest}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-blue-300"
                    >
                        Add Income
                    </button>
                </div>
            </div>

            {importMessage && (
                 <div className={`p-3 rounded-md mb-4 text-sm ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {importMessage}
                </div>
            )}

            {currentFilters.startDate && currentFilters.endDate && (
                <DateRangeFilter
                    defaultRange={{ startDate: currentFilters.startDate, endDate: currentFilters.endDate }}
                    onFilterChange={applyDateFilter}
                />
            )}

            {(loading && !importLoading) && <p className="text-center text-gray-600 py-4">Loading incomes...</p>}
            {error && !isModalOpen && !importMessage && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
            
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {incomes.length === 0 && !loading && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No income records found for the selected period.</td></tr>
                        )}
                        {incomes.map((income) => (
                            <tr key={income.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(income.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(income.jumlah)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{income.kategori_pemasukan?.nama || 'Uncategorized'}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={income.keterangan || undefined}>{income.keterangan || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => openModalForEdit(income)} disabled={isGuest} className="text-indigo-600 hover:text-indigo-900 mr-3 transition disabled:text-gray-400 disabled:cursor-not-allowed">Edit</button>
                                    <button onClick={() => confirmDelete(income.id)} disabled={isGuest} className="text-red-600 hover:text-red-900 transition disabled:text-gray-400 disabled:cursor-not-allowed">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls pagination={pagination} onPageChange={goToPage} />

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-[1000] flex items-center justify-center p-4 transition-opacity duration-300">
                    <div className="relative mx-auto p-6 border w-full max-w-lg shadow-xl rounded-md bg-white transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalFadeInScale">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit Income' : 'Add New Income'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition">×</button>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-3 bg-red-100 p-2 rounded-md">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Amount (Rp)</label>
                                <input
                                    type="number"
                                    name="jumlah"
                                    id="jumlah"
                                    value={currentIncome.jumlah || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., 1000000"
                                />
                            </div>
                            <div>
                                <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700">Category (Optional)</label>
                                <select
                                    name="kategori_id"
                                    id="kategori_id"
                                    value={currentIncome.kategori_id || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                                >
                                    <option value="">Select a category (optional)</option>
                                    {categories.map((cat: IncomeCategory) => <option key={cat.id} value={cat.id.toString()}>{cat.nama}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                                <textarea
                                    name="keterangan"
                                    id="keterangan"
                                    value={currentIncome.keterangan || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g., Monthly salary"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="tanggal"
                                    id="tanggal"
                                    value={currentIncome.tanggal || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || importLoading || isGuest}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
                                >
                                    {(loading || importLoading) ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Income')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomePage;