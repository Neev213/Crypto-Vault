import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Star,
  Bell,
  LogOut,
  Hexagon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/format";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/portfolio", icon: Wallet, label: "Portfolio" },
  { to: "/markets", icon: TrendingUp, label: "Markets" },
  { to: "/watchlist", icon: Star, label: "Watchlist" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
];

export default function Sidebar({ mobile, onNavigate }) {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    cn(
      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
      isActive
        ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white shadow-inner"
        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
    );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/5 bg-[#0a0a12]/90 backdrop-blur-xl",
        mobile ? "w-full" : "w-64 shrink-0"
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/5 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
          <Hexagon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-white">CryptoVault</p>
          <p className="text-xs text-zinc-500">Portfolio Analyzer</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={navClass} onClick={onNavigate}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-3 rounded-xl bg-white/5 p-3">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-zinc-500">@{user?.username}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
