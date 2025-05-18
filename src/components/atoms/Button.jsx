const Button = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
