import React from "react";

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">{label}</label>
    <input
      className="border rounded-md p-2 focus:outline-none focus:ring"
      {...props}
    />
  </div>
);

export default Input;
