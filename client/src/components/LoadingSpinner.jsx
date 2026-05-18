export default function LoadingSpinner({ fullScreen }) {
  const spinnerCls =
    "animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400";

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center mesh-bg">
        <div className={`h-12 w-12 ${spinnerCls}`} role="status" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-20">
      <div className={`h-10 w-10 ${spinnerCls}`} role="status" />
    </div>
  );
}

