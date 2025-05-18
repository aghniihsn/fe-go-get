const Button = ({ children, onClick, className = "", type = "Button" }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-blue-500 text-white px-3 py-1 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
