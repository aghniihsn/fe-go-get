import React from "react";
import { useNavigate } from "react-router-dom";

const ButtonDetail = ({ id }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/film/${id}`)}
      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
    >
      Detail
    </button>
  );
};

export default ButtonDetail;
