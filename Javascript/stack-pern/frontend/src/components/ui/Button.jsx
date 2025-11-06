function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold
      bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800
      focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;
