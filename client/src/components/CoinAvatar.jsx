export default function CoinAvatar({ src, symbol, size = "md" }) {
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };

  if (src) {
    return (
      <img
        src={src}
        alt={symbol}
        className={`${sizes[size]} rounded-full bg-white/5 object-cover ring-2 ring-white/10`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 font-bold text-white ring-2 ring-white/10`}
    >
      {symbol?.slice(0, 2)?.toUpperCase()}
    </div>
  );
}
