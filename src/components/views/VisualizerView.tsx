'use client';

import { motion } from 'framer-motion';
import { Box, Zap, Tv, Play, Settings } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function VisualizerView() {
  const { currentTheme } = useTheme();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className={`text-4xl font-bold mb-2 ${
          currentTheme === 'solar' 
            ? 'text-gradient-solar' 
            : 'text-gradient-netflix'
        } theme-transition`}>
          3D Data Visualizer
        </h1>
        <p className="text-slate-400 text-lg">
          Interactive 3D representations of solar activity and streaming trends
        </p>
      </motion.div>

      {/* 3D Solar Sphere */}
      <motion.div variants={itemVariants}>
        <div className={`card-${currentTheme} theme-transition`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Zap className="w-8 h-8 mr-3 text-solar-400" />
              Solar Activity Sphere
            </h2>
            <button className="btn-ghost">
              <Settings className="w-4 h-4 mr-2" />
              Controls
            </button>
          </div>

          {/* 3D Canvas Placeholder */}
          <div className="canvas-container h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Animated Solar Sphere Mockup */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="w-48 h-48 rounded-full bg-solar-gradient shadow-glow-lg relative"
            >
              {/* Solar Flare Effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-8 bg-yellow-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '1px 0px',
                    transform: `rotate(${i * 45}deg) translateY(-96px)`,
                  }}
                  animate={{
                    scaleY: [0.5, 1.5, 0.5],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
              
              {/* Core */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 animate-pulse" />
            </motion.div>

            {/* Info Overlay */}
            <div className="absolute top-4 left-4 glass-dark rounded-lg p-3">
              <div className="text-sm text-white font-semibold">Solar Activity</div>
              <div className="text-xs text-slate-300">Real-time 3D visualization</div>
            </div>

            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-solar-500/20 border border-solar-400/30 rounded-lg px-3 py-2">
              <div className="text-sm text-solar-300 font-semibold">Three.js Integration</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-slate-400">
            Interactive 3D solar sphere reacting to real-time Kp-index and flare activity
          </div>
        </div>
      </motion.div>

      {/* 3D Netflix Cube Cloud */}
      <motion.div variants={itemVariants}>
        <div className={`card-${currentTheme === 'solar' ? 'netflix' : 'solar'} theme-transition`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Tv className="w-8 h-8 mr-3 text-netflix-400" />
              Netflix Trending Cube Cloud
            </h2>
            <button className="btn-ghost">
              <Play className="w-4 h-4 mr-2" />
              Animate
            </button>
          </div>

          {/* 3D Canvas Placeholder */}
          <div className="canvas-container h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
            {/* Animated Cube Cloud Mockup */}
            <div className="relative w-80 h-80">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12 bg-netflix-gradient rounded-lg shadow-lg"
                  style={{
                    left: `${30 + (i % 4) * 60}px`,
                    top: `${30 + Math.floor(i / 4) * 60}px`,
                  }}
                  animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    z: [0, 50, 0],
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                    <div className="text-white text-xs font-bold">
                      {i + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info Overlay */}
            <div className="absolute top-4 left-4 glass-dark rounded-lg p-3">
              <div className="text-sm text-white font-semibold">Trending Content</div>
              <div className="text-xs text-slate-300">3D popularity visualization</div>
            </div>

            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-netflix-500/20 border border-netflix-400/30 rounded-lg px-3 py-2">
              <div className="text-sm text-netflix-300 font-semibold">Interactive Cubes</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-slate-400">
            3D cube cloud where each cube represents a trending show, sized by popularity
          </div>
        </div>
      </motion.div>

      {/* Visualization Controls */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Solar Controls */}
          <div className="card-solar">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-solar-400" />
              Solar Visualization Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Activity Sensitivity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="75"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Flare Animation Speed</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="50"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-rotate" className="rounded" defaultChecked />
                <label htmlFor="auto-rotate" className="text-sm text-slate-300">Auto-rotate sphere</label>
              </div>
            </div>
          </div>

          {/* Netflix Controls */}
          <div className="card-netflix">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Tv className="w-5 h-5 mr-2 text-netflix-400" />
              Netflix Visualization Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Cube Size Scale</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="60"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Animation Intensity</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="40"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="show-labels" className="rounded" defaultChecked />
                <label htmlFor="show-labels" className="text-sm text-slate-300">Show content labels</label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Implementation Status */}
      <motion.div variants={itemVariants}>
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Box className="w-5 h-5 mr-2 text-blue-400" />
            3D Implementation Roadmap
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Phase 1: Solar Sphere</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Three.js scene setup
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Sphere geometry and materials
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Real-time Kp-index integration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                  Solar flare particle effects
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Phase 2: Netflix Cubes</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Cube cloud generation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Popularity-based sizing
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                  Interactive hover effects
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                  Genre-based coloring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}