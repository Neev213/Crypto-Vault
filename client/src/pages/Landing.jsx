import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp } from "lucide-react";
import Button from "../components/ui/Button";

const features = [
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    desc: "Real-time P&L, allocation charts, and AI-powered investment suggestions.",
  },
  {
    icon: TrendingUp,
    title: "Live Market Data",
    desc: "Powered by CoinGecko — track 50+ assets with price alerts.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "JWT authentication, encrypted sessions, and your data stays yours.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen mesh-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-bold gradient-text">CryptoVault</span>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 text-center lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
            <Zap size={14} /> Professional Crypto Portfolio Tracker
          </span>
          <h1 className="mt-8 font-display text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Track. Analyze.{" "}
            <span className="gradient-text">Invest Smarter.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            The all-in-one platform to manage your crypto holdings, monitor markets,
            set price alerts, and get actionable portfolio insights.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Start Free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-20 max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1 shadow-2xl shadow-cyan-500/10"
        >
          <div className="glass overflow-hidden rounded-xl p-8 text-left">
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-6">
              {["$24,582", "+12.4%", "Low Risk"].map((v, i) => (
                <div key={i}>
                  <p className="text-xs text-zinc-500">
                    {["Portfolio Value", "24h Change", "Risk Level"][i]}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-white">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {["Bitcoin", "Ethereum", "Solana"].map((coin, i) => (
                <div
                  key={coin}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
                >
                  <span className="font-medium">{coin}</span>
                  <span className={i === 1 ? "text-emerald-400" : "text-zinc-400"}>
                    {["+5.2%", "+8.1%", "-1.3%"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-8 transition hover:border-cyan-500/20"
            >
              <div className="mb-4 inline-flex rounded-xl bg-cyan-500/15 p-3">
                <Icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-zinc-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
