import React, { useEffect, useState } from "react";
import axios from "../services/api";

const PesananPage = () => {
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = () => {
    const userId = localStorage.getItem("user_id");
    axios.get(`/tikets/user/${userId}`)
      .then((res) => setPesanan(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin hapus tiket ini?")) {
      axios.delete(`/tikets/${id}`)
        .then(() => fetchPesanan())
        .catch(() => alert("Gagal hapus tiket"));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Daftar Pesanan</h2>
      <div className="space-y-4">
        {pesanan.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow bg-white">
            <p><strong>Nama:</strong> {item.nama}</p>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Jumlah Tiket:</strong> {item.jumlah}</p>
            <p><strong>Total Harga:</strong> Rp {item.total_harga.toLocaleString()}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="mt-2 text-red-600 underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PesananPage;
