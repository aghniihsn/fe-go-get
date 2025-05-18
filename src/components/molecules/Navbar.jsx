import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/pesanan" className="hover:underline">Pesanan</Link>
        <Link to="/profil" className="hover:underline">Profil</Link>
      </div>
      {/* <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button> */}
    </nav>
  );
};

export default Navbar;
