import Card from "./ui/Card";
import { cn } from "../utils/format";

export default function StatCard({ icon: Icon, label, value, sub, trend, delay = 0 }) {
  const isPositive = trend != null && trend >= 0;

  return (
    <Card delay={delay} hover className="relative overflow-hidden">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {value}
          </p>
          {sub && <p className="mt-1 text-sm text-zinc-500">{sub}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 p-3">
            <Icon className="h-5 w-5 text-cyan-400" />
          </div>
        )}
      </div>
      {trend != null && (
        <p
          className={cn(
            "relative mt-3 text-sm font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(trend).toFixed(2)}% (24h)
        </p>
      )}
    </Card>
  );
}
