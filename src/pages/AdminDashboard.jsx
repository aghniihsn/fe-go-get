
import AdminSidebar from "../components/organisms/AdminSidebar";
import { Typography } from "@material-tailwind/react";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 md:ml-72 mt-20">
        <Typography variant="h3" className="mb-6 text-blue-700">Admin Dashboard</Typography>
        {/* Konten dashboard admin di sini */}
      </div>
    </div>
  );
};

export default AdminDashboard;
