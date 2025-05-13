import React, { useState } from 'react';

function Outcome() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    deskripsi: '',
    tanggal: '',
  });

  const kategoriOptions = [
    'Bahan Pokok',
    'Protein dan Gizi',
    'Konsumsi Instan',
    'Pengeluaran Non Esensial',
    'Kebutuhan Primer',
    'Barang & Jasa Tambahan',
    'Pakaian dan Aksesoris',
    'Pajak',
    'Asuransi',
    'Sosial dan Budaya',
    'Simpanan',
  ];

  const dummyData = [
    {
      nama: 'Beras',
      kategori: 'Bahan Pokok',
      deskripsi: 'Beli beras 5kg',
      tanggal: '2025-05-10',
    },
    {
      nama: 'Indomie',
      kategori: 'Konsumsi Instan',
      deskripsi: 'Stok mie instan',
      tanggal: '2025-05-09',
    },
    {
      nama: 'Zakat',
      kategori: 'Sosial dan Budaya',
      deskripsi: 'Zakat bulanan',
      tanggal: '2025-05-08',
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data Pengeluaran:', formData);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pengeluaran</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => setShowModal(true)}
      >
        Tambah Pengeluaran
      </button>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Form Tambah Pengeluaran</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Kategori</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriOptions.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-medium">Tanggal Pengeluaran</label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Daftar Pengeluaran</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {dummyData.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded p-4 border border-gray-200">
              <h3 className="font-bold text-lg">{item.nama}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Kategori:</span> {item.kategori}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Deskripsi:</span> {item.deskripsi}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Tanggal:</span> {item.tanggal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Outcome;
