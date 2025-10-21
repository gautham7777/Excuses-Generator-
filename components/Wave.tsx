import React from 'react';
import { motion } from 'framer-motion';

// Path 1 states
const path1A = "M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,250.7C672,267,768,245,864,213.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
const path1B = "M0,224L48,234.7C96,245,192,267,288,256C384,245,480,203,576,197.3C672,192,768,224,864,240C960,256,1056,256,1152,234.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

// Path 2 states
const path2A = "M0,288L60,261.3C120,235,240,181,360,176C480,171,600,213,720,213.3C840,213,960,171,1080,149.3C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";
const path2B = "M0,288L60,277.3C120,267,240,245,360,229.3C480,213,600,203,720,192C840,181,960,171,1080,186.7C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";

export const Wave: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-auto pointer-events-none">
      <svg
        className="w-full h-auto"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(55, 48, 163, 0.4)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(120, 52, 128, 0.4)' }} />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(30, 41, 59, 0.5)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(76, 29, 149, 0.5)' }} />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#wave-gradient-1)"
          animate={{ d: [path1A, path1B, path1A] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          fill="url(#wave-gradient-2)"
          animate={{ d: [path2A, path2B, path2A] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};