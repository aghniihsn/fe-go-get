import React, { useEffect, useState } from "react";
import axios from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
} from "@material-tailwind/react";

const PesananPage = () => {
  const [pesanan, setPesanan] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = () => {
    const userId = localStorage.getItem("user_id");
    axios
      .get(`/tikets/user/${userId}`)
      .then((res) => {
        console.log(res.data); // debug
        setPesanan(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setPesanan([]);
      });
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`/tikets/${selectedId}`)
      .then(() => {
        fetchPesanan();
        setOpenDialog(false);
      })
      .catch(() => alert("Gagal hapus tiket"));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Daftar Pesanan
      </Typography>

      <div className="grid gap-4">
        {Array.isArray(pesanan) && pesanan.length > 0 ? (
          pesanan.map((item) => (
            <Card key={item.id} className="shadow-md">
              <CardBody>
                <Typography variant="h6">{item.nama}</Typography>
                <Typography variant="small" color="gray">
                  Email: {item.email}
                </Typography>
                <Typography variant="small">Jumlah Tiket: {item.jumlah}</Typography>
                <Typography variant="small" className="mb-2">
                  Total Harga: Rp {item.total_harga.toLocaleString()}
                </Typography>
                <Button
                  color="red"
                  variant="text"
                  onClick={() => handleDelete(item.id)}
                  className="border"
                >
                  Hapus
                </Button>
              </CardBody>
            </Card>
          ))
        ) : (
          <Typography className="text-center">Tidak ada pesanan.</Typography>
        )}
      </div>

      {/* Dialog Konfirmasi */}
      <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
        <div className="p-6 text-center space-y-4">
          <Typography variant="h5" color="red">
            Konfirmasi Hapus
          </Typography>
          <Typography>Apakah kamu yakin ingin menghapus tiket ini?</Typography>
          <div className="flex justify-center gap-4 mt-4">
            <Button color="red" onClick={confirmDelete}>
              Hapus
            </Button>
            <Button variant="text" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PesananPage;
