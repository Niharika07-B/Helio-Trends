'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Zap, TrendingUp, Play, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ClientNumber from '@/components/ui/ClientNumber';
import HydrationSafeChart from '@/components/ui/HydrationSafeChart';

interface SimulationPanelProps {
  solarData: any;
  netflixData: any;
}

export default function SimulationPanel({ solarData, netflixData }: SimulationPanelProps) {
  const [solarActivity, setSolarActivity] = useState(solarData?.kpIndex || 3);
  const [cmeIntensity, setCmeIntensity] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);

  // Calculate genre impact based on simulation parameters
  const calculateGenreImpact = () => {
    const baseMultiplier = 1 + (solarActivity - 3) * 0.15 + (cmeIntensity - 50) * 0.008;
    
    return [
      { 
        genre: 'Sci-Fi', 
        impact: Math.max(0, Math.round((baseMultiplier - 1) * 100)),
        color: '#3B82F6',
        description: 'Space & technology themes'
      },
      { 
        genre: 'Thriller', 
        impact: Math.max(0, Math.round((baseMultiplier * 0.7 - 1) * 100)),
        color: '#EF4444',
        description: 'Suspense & thrillers'
      },
      { 
        genre: 'Documentary', 
        impact: Math.max(0, Math.round((baseMultiplier * 0.8 - 1) * 100)),
        color: '#10B981',
        description: 'Educational content'
      },
      { 
        genre: 'Action', 
        impact: Math.max(0, Math.round((baseMultiplier * 0.6 - 1) * 100)),
        color: '#F59E0B',
        description: 'High-energy content'
      },
      { 
        genre: 'Horror', 
        impact: Math.max(0, Math.round((baseMultiplier * 0.5 - 1) * 100)),
        color: '#8B5CF6',
        description: 'Fear & supernatural'
      },
      { 
        genre: 'Romance', 
        impact: Math.max(-20, Math.round((1 - baseMultiplier * 0.3) * 100)),
        color: '#EC4899',
        description: 'Love & relationships'
      }
    ];
  };

  const genreImpacts = calculateGenreImpact();
  const totalImpact = genreImpacts.reduce((sum, g) => sum + Math.abs(g.impact), 0);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1500);
  };

  const resetSimulation = () => {
    setSolarActivity(solarData?.kpIndex || 3);
    setCmeIntensity(50);
  };

  const getSeverityLevel = () => {
    if (solarActivity >= 7) return { level: 'EXTREME', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (solarActivity >= 5) return { level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (solarActivity >= 3) return { level: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'LOW', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const severity = getSeverityLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Sliders className="w-6 h-6 mr-2 text-blue-400" />
          Interactive Simulation
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-1 disabled:opacity-50"
          >
            <Play className="w-3 h-3" />
            <span>{isSimulating ? 'Running...' : 'Simulate'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <div className="glass-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Simulation Controls</h3>
            
            {/* Solar Activity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-orange-400" />
                  Solar Activity (Kp-Index)
                </label>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${severity.bg} ${severity.color}`}>
                  <ClientNumber value={solarActivity} decimals={1} fallback="0.0" /> - {severity.level}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.1"
                value={solarActivity}
                onChange={(e) => setSolarActivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Calm (0)</span>
                <span>Extreme (9)</span>
              </div>
            </div>

            {/* CME Intensity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-purple-400" />
                  CME Intensity
                </label>
                <div className="text-purple-400 font-semibold text-sm">
                  {cmeIntensity}%
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={cmeIntensity}
                onChange={(e) => setCmeIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Weak (0%)</span>
                <span>Intense (100%)</span>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-300 font-semibold mb-2">Predicted Impact</h4>
              <div className="text-sm text-slate-300">
                <div className="flex justify-between mb-1">
                  <span>Total Genre Impact:</span>
                  <span className="font-semibold text-blue-400">+{totalImpact}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Strongest Effect:</span>
                  <span className="font-semibold text-blue-400">
                    {genreImpacts[0].genre} (+{genreImpacts[0].impact}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Visualization */}
        <div className="space-y-4">
          <div className="glass-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Genre Impact Simulation</h3>
            
            {/* Bar Chart */}
            <HydrationSafeChart className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genreImpacts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="genre" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value) => [`${value}%`, 'Impact']}
                  />
                  <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                    {genreImpacts.map((entry, index) => (
                      <motion.rect
                        key={`cell-${index}`}
                        fill={entry.color}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </HydrationSafeChart>

            {/* Genre Details */}
            <div className="space-y-2">
              {genreImpacts.slice(0, 4).map((genre, index) => (
                <motion.div
                  key={genre.genre}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-slate-800/50 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                    <div>
                      <div className="text-white font-medium text-sm">{genre.genre}</div>
                      <div className="text-xs text-slate-400">{genre.description}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    genre.impact > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {genre.impact > 0 ? '+' : ''}{genre.impact}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Explanation */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
        <h4 className="text-white font-semibold mb-2 flex items-center">
          <Sliders className="w-4 h-4 mr-2 text-blue-400" />
          How It Works
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          This simulation uses correlation patterns to predict how changes in solar activity 
          might affect Netflix viewing preferences. Higher solar activity typically increases 
          interest in <strong>Sci-Fi</strong> and <strong>Thriller</strong> content, while 
          <strong>Romance</strong> shows may see decreased viewership during intense space weather events.
        </p>
      </div>
    </motion.div>
  );
}