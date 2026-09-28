const Custombtn = ({
  className = "",
  text = "click me",
  onClick,
  type = "button",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-btn ${className} ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
      {...rest}
    >
      {text}
    </button>
  );
};

export default Custombtn;