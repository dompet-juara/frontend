import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Dashboard() {
  const incomeChartRef = useRef(null);
  const expenseChartRef = useRef(null);
  const weeklyRef = useRef(null);
  const monthlyRef = useRef(null);

  const incomeData = [
    { label: "Gaji", amount: 5000000 },
    { label: "Simpanan", amount: 2000000 },
    { label: "Investasi", amount: 1500000 },
    { label: "Pemasukan Lainnya", amount: 1000000 },
  ];

  const expenseData = [
    { label: "Bahan Pokok", amount: 3000000 },
    { label: "Non Esensial", amount: 1200000 },
    { label: "Pajak", amount: 800000 },
    { label: "Asuransi", amount: 600000 },
    { label: "Pakaian", amount: 500000 },
  ];

  const formatRupiah = (num) => `Rp ${num.toLocaleString("id-ID")}`;
  const totalIncome = incomeData.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenseData.reduce((a, b) => a + b.amount, 0);
  const surplus = totalIncome - totalExpense;

  const now = new Date();
  const bulan = now.toLocaleDateString("id-ID", { month: "long" });
  const tahun = now.getFullYear();

  useEffect(() => {
    const greenPalette = [
      "#4CAF50",
      "#81C784",
      "#A5D6A7",
      "#66BB6A",
      "#388E3C",
    ];

    const incomeChart = new Chart(incomeChartRef.current, {
      type: "pie",
      data: {
        labels: incomeData.map((d) => d.label),
        datasets: [
          {
            data: incomeData.map((d) => d.amount),
            backgroundColor: greenPalette,
          },
        ],
      },
      options: {
        plugins: {
          title: { display: true, text: "Pemasukan" },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const expenseChart = new Chart(expenseChartRef.current, {
      type: "pie",
      data: {
        labels: expenseData.map((d) => d.label),
        datasets: [
          {
            data: expenseData.map((d) => d.amount),
            backgroundColor: greenPalette,
          },
        ],
      },
      options: {
        plugins: {
          title: { display: true, text: "Pengeluaran" },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const weeklyChart = new Chart(weeklyRef.current, {
      type: "line",
      data: {
        labels: [
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
          "Minggu",
        ],
        datasets: [
          {
            label: "Pengeluaran",
            data: [300000, 250000, 200000, 400000, 500000, 600000, 350000],
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: {
          title: { display: true, text: "Riwayat Mingguan" },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const monthlyChart = new Chart(monthlyRef.current, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei"],
        datasets: [
          {
            label: "Pengeluaran",
            data: [4000000, 3700000, 4200000, 3900000, 4500000],
            backgroundColor: "#66BB6A",
          },
        ],
      },
      options: {
        plugins: {
          title: { display: true, text: "Riwayat Bulanan" },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      incomeChart.destroy();
      expenseChart.destroy();
      weeklyChart.destroy();
      monthlyChart.destroy();
    };
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 text-center md:text-left">
        Dashboard Keuangan - {bulan} {tahun}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-xl shadow text-green-900">
          <p className="text-sm">💰 Total Pemasukan</p>
          <p className="text-lg md:text-xl font-bold">
            {formatRupiah(totalIncome)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow text-red-900">
          <p className="text-sm">💸 Total Pengeluaran</p>
          <p className="text-lg md:text-xl font-bold">
            {formatRupiah(totalExpense)}
          </p>
        </div>
        <div
          className={`p-4 rounded-xl shadow text-white ${
            surplus >= 0 ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <p className="text-sm">📊 {surplus >= 0 ? "Surplus" : "Defisit"}</p>
          <p className="text-lg md:text-xl font-bold">
            {formatRupiah(surplus)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow w-full h-[300px] max-h-[400px]">
          <canvas ref={incomeChartRef}></canvas>
        </div>
        <div className="bg-white p-4 rounded-xl shadow w-full h-[300px] max-h-[400px]">
          <canvas ref={expenseChartRef}></canvas>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-xl shadow w-full h-[300px] max-h-[400px]">
          <canvas ref={weeklyRef}></canvas>
        </div>
        <div className="bg-white p-4 rounded-xl shadow w-full h-[300px] max-h-[400px]">
          <canvas ref={monthlyRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
