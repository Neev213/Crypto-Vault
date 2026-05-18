import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Bell, PieChart, ArrowUpRight } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import StatCard from "../components/StatCard";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { portfolioApi, cryptoApi, alertsApi } from "../api/services";
import { formatCurrency, formatPercent } from "../utils/format";

const COLORS = ["#06b6d4", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [triggered, setTriggered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [portfolio, trend, alerts] = await Promise.all([
          portfolioApi.get(),
          cryptoApi.trending(),
          alertsApi.triggered().catch(() => []),
        ]);
        setData(portfolio);
        setTrending(trend?.slice(0, 5) || []);
        setTriggered(alerts || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const summary = data?.analysis?.summary;
  const allocation = data?.analysis?.allocation || [];
  const holdings = data?.portfolio?.holdings || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-zinc-500">Your portfolio overview at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Portfolio Value"
          value={formatCurrency(summary?.totalCurrentValue || 0)}
          sub={`Invested ${formatCurrency(summary?.totalInvested || 0)}`}
          delay={0}
        />
        <StatCard
          icon={TrendingUp}
          label="Total P&L"
          value={formatPercent(summary?.totalProfitLossPercent || 0)}
          sub={formatCurrency(summary?.totalProfitLoss || 0)}
          delay={0.05}
        />
        <StatCard
          icon={PieChart}
          label="Holdings"
          value={summary?.holdingsCount ?? 0}
          sub={`Risk: ${summary?.riskLevel || "—"}`}
          delay={0.1}
        />
        <StatCard
          icon={Bell}
          label="Active Alerts"
          value={triggered.length}
          sub={triggered.length ? "Price targets hit!" : "No triggers yet"}
          delay={0.15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">Allocation</h2>
            <Link to="/portfolio" className="text-sm text-cyan-400 hover:underline">
              View portfolio
            </Link>
          </div>
          {allocation.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <RechartsPie>
                <Pie
                  data={allocation}
                  dataKey="currentValue"
                  nameKey="coinName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{
                    background: "#12121c",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-zinc-500">Add holdings to see allocation</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Suggestions</h2>
          <div className="space-y-3">
            {(data?.analysis?.suggestions || []).map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm text-zinc-400"
              >
                <span className="mb-1 inline-block rounded-md bg-violet-500/20 px-2 py-0.5 text-xs font-medium uppercase text-violet-300">
                  {s.type}
                </span>
                <p className="mt-2">{s.message}</p>
              </div>
            ))}
            {!data?.analysis?.suggestions?.length && (
              <p className="text-zinc-500">No suggestions yet</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Top Holdings</h2>
          <Link to="/portfolio" className="flex items-center gap-1 text-sm text-cyan-400">
            Manage <ArrowUpRight size={14} />
          </Link>
        </div>
        {holdings.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500">
                  <th className="pb-3 pr-4">Asset</th>
                  <th className="pb-3 pr-4">Value</th>
                  <th className="pb-3">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.slice(0, 5).map((h) => (
                  <tr key={h.coinId} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-medium text-white">
                      {h.coinName}{" "}
                      <span className="text-zinc-500">{h.symbol}</span>
                    </td>
                    <td className="py-3 pr-4">{formatCurrency(h.currentValue)}</td>
                    <td
                      className={
                        h.profitLoss >= 0 ? "py-3 text-emerald-400" : "py-3 text-red-400"
                      }
                    >
                      {formatPercent(h.profitLossPercent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-zinc-500">
            No holdings yet.{" "}
            <Link to="/portfolio" className="text-cyan-400 hover:underline">
              Add your first coin
            </Link>
          </p>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Trending</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trending.map((coin) => (
            <Link
              key={coin.id}
              to={`/markets/${coin.id}`}
              className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
            >
              <img src={coin.small} alt="" className="h-8 w-8 rounded-full" />
              <div>
                <p className="font-medium text-white">{coin.name}</p>
                <p className="text-xs text-zinc-500">{coin.symbol}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
