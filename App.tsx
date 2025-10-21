import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useTransform } from 'framer-motion';
import { generateExcuse } from './services/geminiService';
import { Wave } from './components/Wave';
import { Loader } from './components/Loader';
import { TypingText } from './components/TypingText';
import { GithubIcon } from './components/GithubIcon';
import { Intro } from './components/Intro';
import { playClickSound, playSuccessSound, playCopySound, playTypingSound, startGeneratingSound, stopGeneratingSound } from './services/audioService';
import { LogoIcon } from './components/LogoIcon';

const App: React.FC = () => {
  const [situation, setSituation] = useState<string>('');
  const [excuse, setExcuse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = event;
        mouseX.set(clientX);
        mouseY.set(clientY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Play success sound when a new excuse is generated, but not for the initial prompt.
    const initialExcuse = "Please tell me the situation first, and I'll whip up an excuse for you!";
    if (excuse && excuse !== initialExcuse && !isLoading) {
      playSuccessSound();
    }
  }, [excuse, isLoading]);


  const orb1X = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-40, 40]);
  const orb1Y = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 0], [-40, 40]);
  const orb2X = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [30, -30]);
  const orb2Y = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 0], [30, -30]);

  const cardRotateX = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 0], [10, -10]);
  const cardRotateY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-10, 10]);

  const handleGenerateExcuse = useCallback(async () => {
    playClickSound();
    startGeneratingSound();
    setIsLoading(true);
    setError('');
    setExcuse('');
    try {
      const result = await generateExcuse(situation);
      setExcuse(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      stopGeneratingSound();
    }
  }, [situation]);

  const handleCopyExcuse = useCallback(() => {
    if (!excuse) return;
    playCopySound();
    navigator.clipboard.writeText(excuse);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  }, [excuse]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2
      } 
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <Intro onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            ref={containerRef} style={{ perspective: '800px' }} className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex flex-col items-center justify-center p-4 font-sans overflow-hidden animated-gradient">
            {/* Animated Orbs */}
            <motion.div className="orb w-72 h-72 bg-purple-500/50 top-1/4 left-1/4" style={{ x: orb1X, y: orb1Y, animationDelay: '0s' }}></motion.div>
            <motion.div className="orb w-48 h-48 bg-pink-500/50 bottom-1/4 right-1/4" style={{ x: orb2X, y: orb2Y, animationDelay: '2s' }}></motion.div>
            <div className="orb w-32 h-32 bg-orange-500/40 top-1/3 right-1/2" style={{ animationDelay: '4s' }}></div>

            <main className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
              <motion.div 
                className="relative w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg p-8 text-center text-gray-200"
                style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ velocity: 0.1, stiffness: 40, damping: 10 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-x-3 mb-2"
                  variants={itemVariants}
                >
                  <LogoIcon className="w-10 h-10 text-gray-400" />
                  <h1 
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animated-text-gradient"
                  >
                    Get Me Out
                  </h1>
                </motion.div>
                <motion.p 
                  className="text-gray-400 mb-8"
                  variants={itemVariants}
                >
                  For when you're in a bit of a pickle...
                </motion.p>

                <motion.div 
                  className="w-full space-y-6 flex flex-col items-center"
                  variants={itemVariants}
                >
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    onKeyDown={playTypingSound}
                    placeholder="What did you do? (e.g., 'Forgot our anniversary')"
                    className="w-full h-28 bg-gray-700/50 text-white rounded-lg p-4 focus:ring-2 focus:ring-pink-400 focus:outline-none focus:shadow-lg focus:shadow-pink-500/30 transition-all duration-300 shadow-inner resize-none placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={handleGenerateExcuse}
                    disabled={isLoading || !situation}
                    className="w-full md:w-auto flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 px-8 rounded-full shadow-md transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    whileHover={{ scale: isLoading || !situation ? 1 : 1.05, boxShadow: '0 10px 20px rgba(236, 72, 153, 0.4)' }}
                    whileTap={{ scale: isLoading || !situation ? 1 : 0.95 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader />
                        <span>Generating...</span>
                      </>
                    ) : (
                      'Generate Excuse'
                    )}
                  </motion.button>
                </motion.div>

                <AnimatePresence>
                  {(excuse || error) && (
                    <motion.div 
                      className="mt-8 w-full"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`p-6 rounded-lg shadow-inner ${excuse ? 'bg-slate-900/60' : 'bg-red-900/50'}`}>
                        {excuse && (
                          <motion.div
                            className="flex flex-col items-start text-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Perfect Excuse:</h3>
                            <div className="w-full">
                               <TypingText text={`"${excuse}"`} className="text-gray-200 text-lg whitespace-pre-wrap break-words min-w-0" />
                            </div>
                          </motion.div>
                        )}
                        {error && <p className="text-red-400 font-medium">{error}</p>}
                      </div>
                      
                      {excuse && !error && (
                        <div className="w-full flex justify-center mt-4">
                           <button
                            onClick={handleCopyExcuse}
                            className="relative bg-gray-700 text-pink-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            disabled={isCopied}
                            aria-label="Copy excuse"
                          >
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={isCopied ? 'copied' : 'copy'}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                              >
                               {isCopied ? 'Copied!' : 'Copy'}
                              </motion.span>
                            </AnimatePresence>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </main>

            <footer className="absolute bottom-4 right-4 z-10">
              <motion.a
                  href="https://github.com/google/aistudio-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors duration-300"
                  aria-label="View source on GitHub"
                  whileHover={{ scale: 1.1, color: '#f472b6' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GithubIcon className="w-6 h-6" />
                </motion.a>
            </footer>

            <Wave />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
