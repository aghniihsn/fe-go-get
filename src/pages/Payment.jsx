import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nama, jumlah, totalHarga } = location.state || {};

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold">Pembayaran Tiket</h2>
        <p>Nama: {nama}</p>
        <p>Jumlah Tiket: {jumlah}</p>
        <p className="text-lg font-bold">Total Harga: Rp {totalHarga?.toLocaleString()}</p>
        <button onClick={() => { 
            alert("Pembayaran berhasil!"); 
            navigate("/pesanan");
        }}
        className="bg-green-500 text-white px-4 py-2 rounded">
            Bayar Sekarang
        </button>    
    </div>
  );
};

export default PaymentPage;
