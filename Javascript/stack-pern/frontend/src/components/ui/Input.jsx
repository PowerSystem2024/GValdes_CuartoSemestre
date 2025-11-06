import { forwardRef } from "react";

const Input = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100
      placeholder:text-slate-400 px-3 py-2 outline-none
      focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 transition ${className}`}
      {...props}
    />
  );
});
export default Input;
