import React from "react";
import AdminSidebar from "../components/organisms/AdminSidebar";
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";

const AdminTiketPage = () => {
  const navigate = useNavigate();
  // Dummy tiket data
  const tiketList = [
    { id: 1, film: "Film 1", jadwal: "2025-07-20 19:00", kursi: "A1", harga: 50000 },
    { id: 2, film: "Film 2", jadwal: "2025-07-21 20:00", kursi: "B2", harga: 60000 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 md:ml-72 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Daftar Tiket</h2>
          <Button onClick={() => navigate("/admin/tiket/create")}>Create Tiket</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiketList.map((tiket) => (
            <div key={tiket.id} className="bg-white rounded-xl shadow p-6">
              <div className="font-semibold text-lg mb-2">{tiket.film}</div>
              <div className="text-gray-600">Jadwal: {tiket.jadwal}</div>
              <div className="text-gray-600">Kursi: {tiket.kursi}</div>
              <div className="text-gray-600">Harga: Rp{tiket.harga.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTiketPage;
