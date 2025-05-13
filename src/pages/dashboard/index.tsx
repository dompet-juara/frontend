import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Dashboard() {
  const incomeChartRef = useRef(null);
  const expenseChartRef = useRef(null);
  const weeklyRef = useRef(null);
  const monthlyRef = useRef(null);

  useEffect(() => {
    const greenPalette = ['#4CAF50', '#81C784', '#A5D6A7', '#66BB6A', '#388E3C'];

    const incomeChart = new Chart(incomeChartRef.current, {
      type: 'pie',
      data: {
        labels: ['Gaji', 'Simpanan', 'Investasi', 'Pemasukan Lainnya'],
        datasets: [{
          data: [5000000, 2000000, 1500000, 1000000],
          backgroundColor: greenPalette,
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Komposisi Pemasukan' }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    const expenseChart = new Chart(expenseChartRef.current, {
      type: 'pie',
      data: {
        labels: ['Bahan Pokok', 'Non Esensial', 'Pajak', 'Asuransi', 'Pakaian'],
        datasets: [{
          data: [3000000, 1200000, 800000, 600000, 500000],
          backgroundColor: greenPalette,
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Komposisi Pengeluaran' }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    const weeklyChart = new Chart(weeklyRef.current, {
      type: 'line',
      data: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [{
          label: 'Pengeluaran',
          data: [300000, 250000, 200000, 400000, 500000, 600000, 350000],
          borderColor: '#4CAF50',
          backgroundColor: '#A5D6A7',
          fill: true,
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: 'Riwayat Mingguan' }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    const monthlyChart = new Chart(monthlyRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
        datasets: [{
          label: 'Pengeluaran',
          data: [4000000, 3700000, 4200000, 3900000, 4500000],
          borderColor: '#388E3C',
          backgroundColor: '#81C784',
          fill: true,
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: 'Riwayat Bulanan' }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    return () => {
      incomeChart.destroy();
      expenseChart.destroy();
      weeklyChart.destroy();
      monthlyChart.destroy();
    };
  }, []);

  const incomeData = [
    { label: 'Gaji', amount: 5000000 },
    { label: 'Simpanan', amount: 2000000 },
    { label: 'Investasi', amount: 1500000 },
    { label: 'Pemasukan Lainnya', amount: 1000000 }
  ];

  const expenseData = [
    { label: 'Bahan Pokok', amount: 3000000 },
    { label: 'Non Esensial', amount: 1200000 },
    { label: 'Pajak', amount: 800000 },
    { label: 'Asuransi', amount: 600000 },
    { label: 'Pakaian', amount: 500000 }
  ];

  const formatRupiah = (num) =>
    `Rp ${num.toLocaleString("id-ID")}`;

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Dashboard Keuangan</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-2 text-green-700">Ringkasan Pemasukan</h3>
          <ul className="space-y-1 text-green-900">
            {incomeData.map((item, idx) => (
              <li key={idx}>
                <span className="font-medium">{item.label}:</span> {formatRupiah(item.amount)}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-2 text-green-700">Ringkasan Pengeluaran</h3>
          <ul className="space-y-1 text-green-900">
            {expenseData.map((item, idx) => (
              <li key={idx}>
                <span className="font-medium">{item.label}:</span> {formatRupiah(item.amount)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 mt-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <canvas ref={weeklyRef} style={{ height: '250px', width: '100%' }}></canvas>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <canvas ref={monthlyRef} style={{ height: '250px', width: '100%' }}></canvas>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4" style={{ height: '250px', width: '100%' }}>
          <canvas ref={incomeChartRef}></canvas>
        </div>
        <div className="flex flex-col justify-center bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-2 text-green-700">Detail Pemasukan</h3>
          <ul className="space-y-1 text-green-900">
            {incomeData.map((item, idx) => (
              <li key={idx}>
                <span className="font-medium">{item.label}:</span> {formatRupiah(item.amount)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4" style={{ height: '250px', width: '100%' }}>
          <canvas ref={expenseChartRef}></canvas>
        </div>
        <div className="flex flex-col justify-center bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-2 text-green-700">Detail Pengeluaran</h3>
          <ul className="space-y-1 text-green-900">
            {expenseData.map((item, idx) => (
              <li key={idx}>
                <span className="font-medium">{item.label}:</span> {formatRupiah(item.amount)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
