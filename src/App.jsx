import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import FilmDetail from "./pages/FilmDetail";
import PaymentPage from "./pages/Payment";
import PesananPage from "./pages/Pesanan";

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/film/:id" element={<FilmDetail />} />
          <Route path="/pembayaran" element={<PaymentPage />} />
          <Route path="/pesanan" element={<PesananPage/>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
