import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import FilmDetail from "./pages/FilmDetail";
import PaymentPage from "./pages/Payment";
import PesananPage from "./pages/Pesanan";
import UserProfile from "./pages/UserProfile";

export default function App() {
  useEffect(() => {
    localStorage.setItem("user_id", "USR001");
  }, []);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/film/:id" element={<FilmDetail />} />
          <Route path="/pembayaran" element={<PaymentPage />} />
          <Route path="/pesanan" element={<PesananPage />} />
          <Route path="/profil" element={<UserProfile />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
