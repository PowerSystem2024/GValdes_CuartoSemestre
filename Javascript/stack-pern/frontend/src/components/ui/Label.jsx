function Label({ children, htmlFor, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-slate-300 mb-2 ${className}`}
    >
      {children}
    </label>
  );
}
export default Label;
