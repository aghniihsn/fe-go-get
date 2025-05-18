import React, { useEffect, useState } from "react";
import axios from "../services/api";

const PesananPage = () => {
  const [pesanan, setPesanan] = useState([]);

  useEffect(() => {
    axios.get("/tikets")
      .then((res) => setPesanan(res.data))
      .catch((err) => console.error(err));
  }, []);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PesananPage;
