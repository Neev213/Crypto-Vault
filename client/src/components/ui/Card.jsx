import { motion } from "framer-motion";
import { cn } from "../../utils/format";

export default function Card({ children, className, hover = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "glass rounded-2xl p-6",
        hover && "transition hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
