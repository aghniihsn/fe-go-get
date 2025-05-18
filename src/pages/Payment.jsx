import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nama, jumlah, totalHarga } = location.state || {};
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold">Pembayaran Tiket</h2>
      <p>Nama: {nama}</p>
      <p>Jumlah Tiket: {jumlah}</p>
      <p className="text-lg font-bold">
        Total Harga: Rp {totalHarga?.toLocaleString()}
      </p>
      <Button
        onClick={() => setShowSuccess(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Bayar Sekarang
      </Button>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white p-6 rounded shadow-lg text-center space-y-4">
            <h3 className="text-xl font-semibold">Pembayaran Berhasil!</h3>
            <p>Tiket berhasil dipesan.</p>
            <Button onClick={() => navigate("/pesanan")}>
              Lihat Pesanan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
