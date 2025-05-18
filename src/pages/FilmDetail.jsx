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
    <div className="p-4">
      <FilmInfo film={film} />
      <h3 className="text-xl font-semibold mt-6 mb-2">Jadwal Tayang</h3>
      <JadwalTable jadwals={jadwals} onBook={setSelectedJadwal} />
      {selectedJadwal && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Form Booking</h3>
          <BookForm jadwal={selectedJadwal} film={film} />
        </div>
      )}
    </div>
  );
};

export default FilmDetail;
