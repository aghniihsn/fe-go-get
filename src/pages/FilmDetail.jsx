import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import FilmInfo from "../components/organisms/FilmInfo";
import JadwalTable from "../components/molecules/JadwalTable";
import BookForm from "../components/organisms/BookForm";

const FilmDetail = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [jadwals, setJadwals] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  useEffect(() => {
    API.get(`/films/${id}`).then((res) => setFilm(res.data));
    API.get(`/jadwals/film/${id}`).then((res) => setJadwals(res.data));
  }, [id]);

  if (!film) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md">
      <FilmInfo film={film} />
      <h3 className="text-2xl font-bold mt-8 mb-4 text-blue-700">Jadwal Tayang</h3>
      <JadwalTable jadwals={jadwals} onBook={setSelectedJadwal} />
      {selectedJadwal && (
        // <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-inner">
        //   <h3 className="text-xl font-semibold mb-4 text-blue-600">Form Booking</h3>
          <BookForm jadwal={selectedJadwal} film={film} />
        // </div>
      )}
    </div>
  );

};

export default FilmDetail;
