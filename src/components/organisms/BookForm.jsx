import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

const BookForm = ({ jadwal }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    jumlah: 1,
  });
  const [totalHarga, setTotalHarga] = useState(jadwal.harga);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      axios.get(`/users/${userId}`).then((res) => {
        setForm((prev) => ({
          ...prev,
          nama: res.data.nama,
          email: res.data.email,
        }));
      });
    }
  }, []);

  useEffect(() => {
    setTotalHarga(form.jumlah * jadwal.harga);
  }, [form.jumlah, jadwal.harga]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: new Date().getTime().toString(),
        jadwal_id: jadwal.id,
        nama: form.nama,
        email: form.email,
        jumlah: parseInt(form.jumlah),
        user_id: localStorage.getItem("user_id"), // <-- Tambahkan ini
      };

      const res = await axios.post("/tikets", payload);
      navigate("/pembayaran", {
        state: {
          nama: form.nama,
          jumlah: form.jumlah,
          totalHarga: res.data.total_harga,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memesan tiket.");
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mt-6 bg-white rounded-xl shadow-md space-y-5 border border-blue-100"
    >
      <h4 className="text-xl font-semibold text-blue-800">Form Pemesanan</h4>
      <Input
        label="Nama"
        name="nama"
        value={form.nama}
        onChange={handleChange}
        disabled
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        disabled
      />
      <Input
        label="Jumlah Tiket"
        name="jumlah"
        type="number"
        value={form.jumlah}
        onChange={handleChange}
        min={1}
        required
      />
      <div className="text-blue-700 font-semibold">
        Total Harga: Rp {totalHarga.toLocaleString()}
      </div>
      <div className="flex gap-4 pt-2">
        <Button
          type="submit"
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Pesan Tiket
        </Button>
        <Button
          type="button"
          onClick={() => navigate(-1)}
          className="w-1/2 border !text-gray-800 bg-white hover:bg-red-400 hover:!text-white"
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
