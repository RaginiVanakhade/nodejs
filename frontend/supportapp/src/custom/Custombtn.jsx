const Custombtn = ({ className = "", text = "click me", onClick }) => {
  return (
    <div>
      <button
        className={`custom-btn ${className}`}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Custombtn;