'use client';

import { motion } from 'framer-motion';
import { Sun, Tv, Zap } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function LoadingOverlay() {
  const { currentTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
    >
      <div className="text-center">
        {/* Animated Icons */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              currentTheme === 'solar' 
                ? 'bg-solar-gradient shadow-glow-md' 
                : 'bg-netflix-gradient shadow-lg'
            } theme-transition`}
          >
            {currentTheme === 'solar' ? (
              <Sun className="w-8 h-8 text-white" />
            ) : (
              <Tv className="w-8 h-8 text-white" />
            )}
          </motion.div>

          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl"
          >
            ⚡
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              currentTheme === 'solar' 
                ? 'bg-netflix-gradient shadow-lg' 
                : 'bg-solar-gradient shadow-glow-md'
            } theme-transition`}
          >
            {currentTheme === 'solar' ? (
              <Tv className="w-8 h-8 text-white" />
            ) : (
              <Sun className="w-8 h-8 text-white" />
            )}
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-2xl font-bold mb-2 ${
            currentTheme === 'solar' 
              ? 'text-gradient-solar' 
              : 'text-gradient-netflix'
          } theme-transition`}>
            HelioTrends
          </h2>
          <p className="text-slate-400 mb-6">
            Syncing solar storms with streaming trends...
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <div className="space-y-3">
          {[
            'Fetching solar activity data...',
            'Loading Netflix trending shows...',
            'Calculating correlations...',
            'Preparing visualizations...'
          ].map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex items-center justify-center space-x-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className={`w-4 h-4 border-2 border-transparent rounded-full ${
                  currentTheme === 'solar'
                    ? 'border-t-solar-400'
                    : 'border-t-netflix-400'
                } theme-transition`}
              />
              <span className="text-sm text-slate-300">{text}</span>
            </motion.div>
          ))}
        </div>

        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-2 mt-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className={`w-2 h-2 rounded-full ${
                currentTheme === 'solar' 
                  ? 'bg-solar-400' 
                  : 'bg-netflix-400'
              } theme-transition`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}