import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [films, setFilms] = useState([]);
  const navigate = useNavigate();

  const posterMap = {
    "The Silent Wave": "/posters/1.jpg",
    "Galactic Quest": "/posters/2.jpeg",
    "Haunted Hollow": "/posters/3.jpeg",
    "Laugh Factory": "/posters/4.jpeg",
    "Speed Horizon": "/posters/5.jpg",
    "Love in Rain": "/posters/6.jpeg",
    "Mystery Code": "/posters/7.jpg",
    "Wings of Glory": "/posters/8.jpg",
    "Pixel Dreams": "/posters/9.png",
    "Echoes": "/posters/10.jpg",
  };

  useEffect(() => {
    API.get("/films")
      .then((res) => setFilms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Typography variant="h4" className="mb-6 text-center">🎬 Daftar Film</Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {films.map((film) => (
          <div key={film.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={posterMap[film.title] || "/posters/default.jpg"}
              alt={film.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-bold">{film.title}</h3>
              <p className="text-gray-600">Genre: {film.genre}</p>
              <p className="text-gray-600">Durasi: {film.duration} menit</p>
              <button
                onClick={() => navigate(`/film/${film.id}`)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
