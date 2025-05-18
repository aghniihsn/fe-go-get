import React from "react";
import { useNavigate } from "react-router-dom";

const ButtonDetail = ({ id }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/film/${id}`)}
      className="bg-blue-500 text-white px-2 py-1 rounded"
    >
      Detail
    </button>
  );
};

export default ButtonDetail;
