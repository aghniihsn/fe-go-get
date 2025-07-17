import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import axios from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    try {
      // Login ke backend, dapatkan user & role & token
      const res = await axios.post("/auth/login", form);
      const { id, role, nama, token } = res.data;
      localStorage.setItem("user_id", id);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_nama", nama);
      localStorage.setItem("jwt_token", token);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      setError("Email atau password salah.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/public/bg-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/30 border border-white/40">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="mt-4 text-center text-white">
          Belum punya akun? <span className="text-blue-300 cursor-pointer underline" onClick={() => navigate("/register")}>Register</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
