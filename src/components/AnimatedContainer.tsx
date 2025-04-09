"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3
    }
  }
};

export default function AnimatedContainer({ children }: PropsWithChildren) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-4xl mx-auto p-6 rounded-lg backdrop-blur-xl bg-black/15 z-10 relative border border-gray-800/30"
    >
      {children}
    </motion.div>
  );
}
