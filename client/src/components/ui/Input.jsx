import { cn } from "../../utils/format";

export default function Input({ label, error, className, ...props }) {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-zinc-400">{label}</span>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 transition focus:border-cyan-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-500/20",
          error && "border-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}
