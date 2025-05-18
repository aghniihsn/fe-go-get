import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-bold text-blue-600">GoGet</div>
      <div className="flex gap-6 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-blue-500 transition">Dashboard</Link>
        <Link to="/pesanan" className="hover:text-blue-500 transition">Pesanan</Link>
        <Link to="/profil" className="hover:text-blue-500 transition">Profil</Link>
      </div>
    </nav>
  );
};

export default Navbar;
