function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-900 text-slate-100 border border-slate-800/70 rounded-2xl p-6 shadow
      hover:shadow-lg transition ${className}`}
    >
      {children}
    </div>
  );
}
export default Card;
