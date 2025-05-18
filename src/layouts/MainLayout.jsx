import React from "react";
import Navbar from "../components/molecules/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          {/* <h1 className="text-3xl font-bold text-gray-800">🎟 GoGet Dashboard</h1> */}
        </header>
        <main className="bg-white p-6 rounded-xl shadow-lg">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
