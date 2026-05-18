import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12121c] shadow-2xl ${
              wide ? "max-w-2xl" : "max-w-md"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
