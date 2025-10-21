

import React from 'react';
// Fix: Import `Variants` type from framer-motion to explicitly type animation variants.
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Fix: Explicitly type `dotVariants` with `Variants` to prevent TypeScript from inferring `ease` as a generic string.
const dotVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const Loader: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex items-center justify-center space-x-1 -ml-1 mr-3"
    >
      <motion.span variants={dotVariants} className="h-2 w-2 bg-white rounded-full" />
      <motion.span variants={dotVariants} className="h-2 w-2 bg-white rounded-full" />
      <motion.span variants={dotVariants} className="h-2 w-2 bg-white rounded-full" />
    </motion.div>
  );
};
