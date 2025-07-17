import React from "react";
import AdminSidebar from "../components/organisms/AdminSidebar";
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";

const AdminJadwalPage = () => {
  const navigate = useNavigate();
  // Dummy jadwal data
  const jadwalList = [
    { id: 1, film: "Film 1", tanggal: "2025-07-20", jam: "19:00" },
    { id: 2, film: "Film 2", tanggal: "2025-07-21", jam: "20:00" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 md:ml-72 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Jadwal Film</h2>
          <Button onClick={() => navigate("/admin/jadwal/create")}>Create Jadwal</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jadwalList.map((jadwal) => (
            <div key={jadwal.id} className="bg-white rounded-xl shadow p-6">
              <div className="font-semibold text-lg mb-2">{jadwal.film}</div>
              <div className="text-gray-600">Tanggal: {jadwal.tanggal}</div>
              <div className="text-gray-600">Jam: {jadwal.jam}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminJadwalPage;
