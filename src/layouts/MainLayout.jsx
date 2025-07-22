import React from "react";
import Navbar from "../components/molecules/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 w-full">
        <header className="">
          {/* <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-lg">🎟 MovieTix Dashboard</h1> */}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
