import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">GoGet Dashboard</h1>
      </header>
      <main className="bg-white p-6 rounded-xl shadow-md">{children}</main>
    </div>
  );
};

export default MainLayout;
