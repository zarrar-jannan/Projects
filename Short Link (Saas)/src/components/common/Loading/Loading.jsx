import { motion } from "framer-motion";

export function Loading({size='24px'}) {
  return (
      <motion.div
        style={{width: size, height: size}}
        className="rounded-full border-4 border-gray-700 border-t-yellow-400"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
  );
}

