import React from 'react';
import { PaginationInfo } from '../api/income';

interface PaginationControlsProps {
    pagination: PaginationInfo | null;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) {
        return null;
    }

    const { currentPage, totalPages } = pagination;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-2 sm:mb-0">
                Showing page {currentPage} of {totalPages} (Total {pagination.totalItems} items)
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    « Previous
                </button>

                {startPage > 1 && (
                    <>
                        <button onClick={() => onPageChange(1)} className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">1</button>
                        {startPage > 2 && <span className="px-2 py-1">...</span>}
                    </>
                )}

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-3 py-1 border rounded-md ${
                            currentPage === number
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {number}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages -1 && <span className="px-2 py-1">...</span>}
                        <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">{totalPages}</button>
                    </>
                )}

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next »
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;