import React, { useEffect, useState } from "react";
import axios from "../services/api";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const UserProfile = () => {
  const [form, setForm] = useState({ nama: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get(`/users/${userId}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/users/${userId}`, form)
      .then(() => setOpenDialog(true))
      .catch(() => alert("Gagal update"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Profil Pengguna
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <Button type="submit" color="blue">
              Simpan
            </Button>
          </form>
        </CardBody>
      </Card>

      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <DialogHeader>Berhasil</DialogHeader>
        <DialogBody>Profil berhasil diperbarui.</DialogBody>
        <DialogFooter>
          <Button
            color="green"
            onClick={() => {
              setOpenDialog(false);
              window.location.href = "/";
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default UserProfile;
