import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { playIntroGlitchSound, playIntroRevealSound } from '../services/audioService';

interface IntroProps {
  onAnimationComplete: () => void;
}

const glitchWords = ["Trapped?", "Need an out?", "Stuck?", "Cornered?", "In a jam?"];

const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const titleCharVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export const Intro: React.FC<IntroProps> = ({ onAnimationComplete }) => {
  const [index, setIndex] = useState(0);
  const [showFinalTitle, setShowFinalTitle] = useState(false);

  useEffect(() => {
    playIntroGlitchSound(); // Play for the first word
    const wordInterval = setInterval(() => {
      setIndex(prev => {
        if (prev >= glitchWords.length - 1) {
          clearInterval(wordInterval);
          return prev;
        }
        playIntroGlitchSound(); // Play for subsequent words
        return prev + 1;
      });
    }, 1000); // 1 second per word

    const titleTimer = setTimeout(() => {
      playIntroRevealSound();
      setShowFinalTitle(true);
    }, glitchWords.length * 1000);

    // Total duration: (5 words * 1000ms) + 5000ms for title animation/hold = 10000ms
    const endTimer = setTimeout(() => {
      onAnimationComplete();
    }, glitchWords.length * 1000 + 5000); 

    return () => {
      clearInterval(wordInterval);
      clearTimeout(titleTimer);
      clearTimeout(endTimer);
    };
  }, [onAnimationComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-black flex items-center justify-center z-50"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <AnimatePresence mode="wait">
        {!showFinalTitle ? (
          <motion.h1
            key={index}
            className="text-5xl md:text-7xl font-display text-gray-200 glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {glitchWords[index]}
          </motion.h1>
        ) : (
          <motion.h1
            key="final-title"
            className="text-6xl md:text-8xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animated-text-gradient"
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from("Get Me Out").map((char, charIndex) => (
              <motion.span key={charIndex} variants={titleCharVariants} className="inline-block">
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
};