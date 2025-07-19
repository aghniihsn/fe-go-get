
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import FilmDetail from "./pages/FilmDetail";
import PaymentPage from "./pages/Payment";
import PesananPage from "./pages/Pesanan";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFilmPage from "./pages/AdminFilmPage";
import AdminCreateFilmPage from "./pages/AdminCreateFilmPage";
import { isLoggedIn, getUserRole } from "./utils/auth";
import AdminJadwalPage from "./pages/AdminJadwalPage";
import AdminCreateJadwalPage from "./pages/AdminCreateJadwalPage";
// import AdminTiketPage from "./pages/AdminTiketPage";
// import AdminCreateTiketPage from "./pages/AdminCreateTiketPage";
import AdminPesananPage from "./pages/AdminPesananPage";

// Komponen proteksi route
function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (role && getUserRole() !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/admin/film"
          element={
            <MainLayout>
              <AdminFilmPage />
            </MainLayout>
          }
        />
        <Route
          path="/admin/create"
          element={
            <MainLayout>
              <AdminCreateFilmPage />
            </MainLayout>
          }
        />
        <Route
          path="/admin/jadwal"
          element={
            <MainLayout>
              <AdminJadwalPage />
            </MainLayout>
          }
        />
        <Route
          path="/admin/jadwal/create"
          element={
            <MainLayout>
              <AdminCreateJadwalPage />
            </MainLayout>
          }
        />
        {/* <Route
          path="/admin/tiket"
          element={
            <MainLayout>
              <AdminTiketPage />
            </MainLayout>
          }
        />
        <Route
          path="/admin/tiket/create"
          element={
            <MainLayout>
              <AdminCreateTiketPage />
            </MainLayout>
          }
        /> */}
        <Route
          path="/admin/pesanan"
          element={
            <MainLayout>
              <AdminPesananPage />
            </MainLayout>
          }
        />
        <Route
          path="/"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/film/:id"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <FilmDetail />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/pembayaran"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/pesanan"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <PesananPage />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <UserProfile />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
