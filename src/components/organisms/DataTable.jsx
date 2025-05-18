import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const DataTable = () => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get("/films")
      .then((res) => setFilms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-700 border rounded-xl shadow">
        <thead className="bg-blue-500 text-white">
          <tr>
            {/* <th className="px-4 py-2 text-left">ID</th> */}
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">Kategori</th>
            <th className="px-4 py-2 text-left">Deskripsi</th>
            <th className="px-4 py-2 text-left">Tanggal Dibuat</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {films.map((film) => (
            <tr key={film.id} className="hover:bg-gray-50 border-b">
              {/* <td className="px-4 py-2">{film.id}</td> */}
              <td className="px-4 py-2">{film.nama}</td>
              <td className="px-4 py-2">{film.kategori}</td>
              <td className="px-4 py-2">{film.deskripsi}</td>
              <td className="px-4 py-2">{film.tanggal_dibuat}</td>
              <td className="px-4 py-2">{film.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
