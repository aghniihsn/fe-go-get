const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>
    <input
      {...props}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />
  </div>
);

export default Input;
