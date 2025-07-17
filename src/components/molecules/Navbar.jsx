import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUserRole, logout } from "../../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const role = getUserRole();
  const nama = localStorage.getItem("user_nama") || "";
  const dropdownRef = React.useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="backdrop-blur-md bg-gray-100 shadow-lg px-8 py-4 flex items-center rounded-b-xl border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      {/* Left: Logo & App Name */}
      <div className="flex-1 flex items-center">
        <span className="text-xl font-extrabold text-blue-700">GoGet</span>
      </div>
      {/* Center: Navigation */}
      <div className="flex-1 flex justify-center gap-8 text-base font-medium text-gray-700">
        {isLoggedIn() && (
          <>
            <Link to="/" className="hover:text-blue-500 transition">Dashboard</Link>
            {role === "admin" && (
              <Link to="/admin" className="hover:text-blue-500 transition">Admin</Link>
            )}
            <Link to="/pesanan" className="hover:text-blue-500 transition">Pesanan</Link>
          </>
        )}
      </div>
      {/* Right: Profile Dropdown / Login */}
      <div className="flex-1 flex justify-end items-center">
        {isLoggedIn() ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="hover:text-blue-500 transition font-semibold px-4 py-2 rounded-full bg-blue-100"
              onClick={() => setShowDropdown((prev) => !prev)}
              id="profile-dropdown-btn"
            >
              {nama}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10 border">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 rounded-b"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-blue-500 transition font-semibold px-4 py-2 rounded-xl bg-blue-100">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
