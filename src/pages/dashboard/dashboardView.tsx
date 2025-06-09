import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';
import DateRangeFilter, { DateRange } from '../../components/DateRangeFilter';
import { Chart, registerables, ChartConfiguration, TooltipItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

Chart.register(...registerables);

// Helper function to get an initial date range (e.g., current month)
const getInitialDateRange = (): DateRange => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
        startDate: firstDayOfMonth.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
    };
};

const DashboardPage: React.FC = () => {
    const { summary, loading, error, loadSummary } = useDashboard();
    const { user } = useAuth();
    // Initialize dateFilter with a default DateRange, making its type DateRange (not undefined)
    const [dateFilter, setDateFilter] = useState<DateRange>(getInitialDateRange());

    const incomeOutcomePieChartRef = useRef<HTMLCanvasElement | null>(null);
    const transactionsLineChartRef = useRef<HTMLCanvasElement | null>(null);
    const categoryPieChartRef = useRef<HTMLCanvasElement | null>(null);

    const [incomeOutcomePieChartInstance, setIncomeOutcomePieChartInstance] = useState<Chart | null>(null);
    const [transactionsLineChartInstance, setTransactionsLineChartInstance] = useState<Chart | null>(null);
    const [categoryPieChartInstance, setCategoryPieChartInstance] = useState<Chart | null>(null);

    useEffect(() => {
        // Now dateFilter is always a DateRange, so this call is safe.
        // Assuming DateRange is compatible with FetchParams or is FetchParams.
        loadSummary(dateFilter);
    }, [dateFilter, loadSummary]); // loadSummary is a dependency, ensure it's stable from useDashboard hook

    const handleDateFilterChange = (newRange: DateRange) => {
        setDateFilter(newRange);
    };

    const formatCurrency = (amount: number | string) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    useEffect(() => {
        // Chart destruction and creation logic (remains the same)
        const pieChart = incomeOutcomePieChartInstance;
        const lineChart = transactionsLineChartInstance;
        const categoryChart = categoryPieChartInstance;

        if (pieChart) pieChart.destroy();
        if (lineChart) lineChart.destroy();
        if (categoryChart) categoryChart.destroy();

        if (summary && summary.recentTransactions) {
            if (incomeOutcomePieChartRef.current && summary.totalIncome >=0 && summary.totalOutcome >=0) {
                const pieChartConfig: ChartConfiguration<'pie', number[], string> = {
                    type: 'pie',
                    data: {
                        labels: ['Total Income', 'Total Outcome'],
                        datasets: [{
                            label: 'Amount',
                            data: [summary.totalIncome, summary.totalOutcome],
                            backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: `Income vs Outcome (${summary.month})`,
                                font: {size: 16}
                            },
                            legend: {
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context: TooltipItem<'pie'>) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += formatCurrency(context.parsed);
                                        }
                                        return label;
                                    }
                                }
                            }
                        }
                    }
                };
                setIncomeOutcomePieChartInstance(new Chart(incomeOutcomePieChartRef.current, pieChartConfig));
            }

            if (transactionsLineChartRef.current && summary.recentTransactions.length > 0) {
                const dailyData: { [date: string]: { income: number, outcome: number } } = {};
                summary.recentTransactions.forEach(tx => {
                    const dateStr = new Date(tx.tanggal).toISOString().split('T')[0];
                    if (!dailyData[dateStr]) {
                        dailyData[dateStr] = { income: 0, outcome: 0 };
                    }
                    if (tx.type === 'income') dailyData[dateStr].income += Number(tx.jumlah);
                    else dailyData[dateStr].outcome += Number(tx.jumlah);
                });

                const sortedDates = Object.keys(dailyData).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

                const lineChartConfig: ChartConfiguration<'line', number[], string> = {
                    type: 'line',
                    data: {
                        labels: sortedDates,
                        datasets: [
                            {
                                label: 'Income',
                                data: sortedDates.map(date => dailyData[date].income),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                                tension: 0.1
                            },
                            {
                                label: 'Outcome',
                                data: sortedDates.map(date => dailyData[date].outcome),
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: true,
                                tension: 0.1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: `Daily Transactions Trend (${summary.month})`,
                                font: {size: 16}
                            },
                            legend: {
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context: TooltipItem<'line'>) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += formatCurrency(context.parsed.y);
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day',
                                    tooltipFormat: 'MMM dd, yyyy',
                                    displayFormats: {
                                        day: 'dd MMM'
                                    }
                                },
                                adapters: {
                                    date: {
                                        locale: enUS
                                    }
                                }
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => formatCurrency(Number(value))
                                }
                            }
                        }
                    }
                };
                setTransactionsLineChartInstance(new Chart(transactionsLineChartRef.current, lineChartConfig));
            }

            if (categoryPieChartRef.current && summary.recentTransactions.length > 0) {
                const outcomeCategories: { [categoryName: string]: number } = {};
                summary.recentTransactions.forEach(tx => {
                    if (tx.type === 'outcome' && tx.kategori_pengeluaran?.nama) {
                        const categoryName = tx.kategori_pengeluaran.nama;
                        outcomeCategories[categoryName] = (outcomeCategories[categoryName] || 0) + Number(tx.jumlah);
                    } else if (tx.type === 'outcome') {
                        outcomeCategories['Uncategorized'] = (outcomeCategories['Uncategorized'] || 0) + Number(tx.jumlah);
                    }
                });

                const categoryLabels = Object.keys(outcomeCategories);
                const categoryData = Object.values(outcomeCategories);

                if (categoryLabels.length > 0) {
                    const dynamicColors = () => {
                        const r = Math.floor(Math.random() * 200) + 55;
                        const g = Math.floor(Math.random() * 200) + 55;
                        const b = Math.floor(Math.random() * 200) + 55;
                        return `rgba(${r}, ${g}, ${b}, 0.7)`;
                    };

                    const backgroundColors = categoryLabels.map(() => dynamicColors());
                    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

                    const doughnutChartConfig: ChartConfiguration<'doughnut', number[], string> = {
                        type: 'doughnut',
                        data: {
                            labels: categoryLabels,
                            datasets: [{
                                label: 'Expense by Category',
                                data: categoryData,
                                backgroundColor: backgroundColors,
                                borderColor: borderColors,
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: `Expense Distribution by Category (${summary.month})`,
                                    font: {size: 16}
                                },
                                legend: {
                                    position: 'right',
                                    labels: {
                                        boxWidth: 12,
                                        padding: 10
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context: TooltipItem<'doughnut'>) {
                                            let label = context.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed !== null) {
                                                label += formatCurrency(context.parsed);
                                            }
                                            return label;
                                        }
                                    }
                                }
                            }
                        }
                    };
                    setCategoryPieChartInstance(new Chart(categoryPieChartRef.current, doughnutChartConfig));
                } else if (categoryPieChartInstance) {
                    categoryPieChartInstance.destroy();
                    setCategoryPieChartInstance(null);
                }
            }
        }
        return () => {
            if (incomeOutcomePieChartInstance) incomeOutcomePieChartInstance.destroy();
            if (transactionsLineChartInstance) transactionsLineChartInstance.destroy();
            if (categoryPieChartInstance) categoryPieChartInstance.destroy();
        };
    }, [summary]); // Dependencies for chart updates remain the same


    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                Welcome back, {user?.name || user?.username || user?.email?.split('@')[0] || 'User'}!
            </h1>

            <DateRangeFilter
                onFilterChange={handleDateFilterChange}
                defaultRange={dateFilter} // dateFilter is now always a DateRange object
            />

            {loading && <p className="p-4 md:p-6 text-center text-gray-600">Loading dashboard data...</p>}
            {error && <p className="p-4 md:p-6 text-red-500 bg-red-100 rounded-md text-sm">Error loading dashboard: {error}</p>}

            {summary && !loading && (
                <>
                    <h2 className="text-xl font-medium text-gray-700 my-4">Financial Summary for {summary.month}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-lg font-semibold text-green-700">Total Income</h3>
                            <p className="text-2xl md:text-3xl text-green-800 font-bold mt-1">{formatCurrency(summary.totalIncome)}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-lg font-semibold text-red-700">Total Outcome</h3>
                            <p className="text-2xl md:text-3xl text-red-800 font-bold mt-1">{formatCurrency(summary.totalOutcome)}</p>
                        </div>
                        <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                            <h3 className={`text-lg font-semibold ${summary.balance >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>Current Balance</h3>
                            <p className={`text-2xl md:text-3xl font-bold mt-1 ${summary.balance >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>{formatCurrency(summary.balance)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-4 rounded-lg shadow-md h-[300px] md:h-[350px]">
                            <canvas ref={incomeOutcomePieChartRef}></canvas>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md h-[300px] md:h-[350px]">
                            <canvas ref={categoryPieChartRef}></canvas>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md h-[300px] md:h-[350px] mb-8">
                        <canvas ref={transactionsLineChartRef}></canvas>
                    </div>

                    <h2 className="text-xl font-medium text-gray-700 mb-3">Recent Transactions (Max 10 for period)</h2>
                    {summary.recentTransactions.length > 0 ? (
                        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
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
                                    {summary.recentTransactions.map((tx) => (
                                        <tr key={`${tx.type}-${tx.id}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(tx.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'income' ? 'Income' : 'Outcome'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={tx.keterangan || (tx.type === 'income' && tx.kategori_pemasukan?.nama) || (tx.type === 'outcome' && tx.kategori_pengeluaran?.nama) || undefined}>
                                                {
                                                    tx.type === 'income'
                                                        ? (tx.kategori_pemasukan?.nama || tx.keterangan || 'N/A')
                                                        : (tx.kategori_pengeluaran?.nama || tx.keterangan || 'N/A')
                                                }
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.jumlah)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-4">No transactions found for the selected period.</p>
                    )}
                </>
            )}
            {!summary && !loading && !error && (
                <p className="text-gray-600 text-center py-4">No summary data available. Please select a date range or add transactions.</p>
            )}
        </div>
    );
};

export default DashboardPage;