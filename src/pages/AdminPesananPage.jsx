import React from "react";
import AdminSidebar from "../components/organisms/AdminSidebar";

const pesananList = [
  { id: 1, user: "Aghni", film: "Film 1", jadwal: "2025-07-20 19:00", kursi: "A1", harga: 50000, status: "Paid" },
  { id: 2, user: "Lenovo", film: "Film 2", jadwal: "2025-07-21 20:00", kursi: "B2", harga: 60000, status: "Pending" },
];

const AdminPesananPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 md:ml-72 mt-20">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Daftar Pesanan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Film</th>
                <th className="py-3 px-4 text-left">Jadwal</th>
                <th className="py-3 px-4 text-left">Kursi</th>
                <th className="py-3 px-4 text-left">Harga</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {pesananList.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 px-4">{p.user}</td>
                  <td className="py-2 px-4">{p.film}</td>
                  <td className="py-2 px-4">{p.jadwal}</td>
                  <td className="py-2 px-4">{p.kursi}</td>
                  <td className="py-2 px-4">Rp{p.harga.toLocaleString()}</td>
                  <td className="py-2 px-4">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPesananPage;
