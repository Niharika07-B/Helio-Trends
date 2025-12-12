'use client';

import { motion } from 'framer-motion';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import MetricsGrid from '../dashboard/MetricsGrid';
import ChartsGrid from '../dashboard/ChartsGrid';
import CorrelationSummary from '../dashboard/CorrelationSummary';
import RealtimeUpdates from '../dashboard/RealtimeUpdates';
import PredictionPanel from '../dashboard/PredictionPanel';
import SimulationPanel from '../dashboard/SimulationPanel';
import AlertsPanel from '../dashboard/AlertsPanel';
import AIInsights from '../dashboard/AIInsights';
import ClientNumber from '../ui/ClientNumber';

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

export default function DashboardView() {
  const { solarData, netflixData, correlationData, isLoading } = useDashboardStore();
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
          HelioTrends Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Solar Activity vs Netflix Trends
        </p>
      </motion.div>

      {/* Real-time Updates Banner */}
      <motion.div variants={itemVariants}>
        <RealtimeUpdates />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants}>
        <MetricsGrid 
          solarData={solarData}
          netflixData={netflixData}
          correlationData={correlationData}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Correlation Summary */}
      <motion.div variants={itemVariants}>
        <CorrelationSummary 
          correlationData={correlationData}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Live Alerts */}
      <motion.div variants={itemVariants}>
        <AlertsPanel 
          solarData={solarData}
          netflixData={netflixData}
          correlationData={correlationData}
        />
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={itemVariants}>
        <AIInsights 
          solarData={solarData}
          netflixData={netflixData}
          correlationData={correlationData}
        />
      </motion.div>

      {/* Prediction Panel */}
      <motion.div variants={itemVariants}>
        <PredictionPanel 
          solarData={solarData}
          netflixData={netflixData}
        />
      </motion.div>

      {/* Interactive Simulation */}
      <motion.div variants={itemVariants}>
        <SimulationPanel 
          solarData={solarData}
          netflixData={netflixData}
        />
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants}>
        <ChartsGrid 
          solarData={solarData}
          netflixData={netflixData}
          correlationData={correlationData}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Quick Insights */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solar Activity Summary */}
          <div className={`card-${currentTheme} theme-transition`}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                solarData?.activityLevel === 'EXTREME' ? 'bg-red-500 animate-pulse' :
                solarData?.activityLevel === 'HIGH' ? 'bg-orange-500 animate-pulse' :
                solarData?.activityLevel === 'MODERATE' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              Solar Activity Status
            </h3>
            {solarData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Current Kp-index:</span>
                  <span className="text-white font-semibold">
                    <ClientNumber value={solarData.kpIndex} decimals={1} fallback="0.0" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Activity Level:</span>
                  <span className={`font-semibold ${
                    solarData.activityLevel === 'EXTREME' ? 'text-red-400' :
                    solarData.activityLevel === 'HIGH' ? 'text-orange-400' :
                    solarData.activityLevel === 'MODERATE' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {solarData.activityLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Solar Flares (24h):</span>
                  <span className="text-white font-semibold">{solarData.solarFlares.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">CME Events (7d):</span>
                  <span className="text-white font-semibold">{solarData.cmeEvents.length}</span>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                    <div className="h-4 bg-slate-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Netflix Trends Summary */}
          <div className={`card-${currentTheme === 'solar' ? 'netflix' : 'solar'} theme-transition`}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                netflixData && netflixData.aggregatedScore > 2000 ? 'bg-red-500 animate-pulse' :
                netflixData && netflixData.aggregatedScore > 1000 ? 'bg-orange-500' :
                'bg-green-500'
              }`} />
              Netflix Trends Status
            </h3>
            {netflixData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Top Genre:</span>
                  <span className="text-white font-semibold">
                    {netflixData.topGenres[0]?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Avg Popularity:</span>
                  <span className="text-white font-semibold">
                    <ClientNumber value={netflixData.aggregatedScore} decimals={0} fallback="0" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Trending Movies:</span>
                  <span className="text-white font-semibold">{netflixData.trendingMovies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Trending TV Shows:</span>
                  <span className="text-white font-semibold">{netflixData.trendingTv.length}</span>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                    <div className="h-4 bg-slate-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI Insights Preview */}
      {correlationData && correlationData.insights.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse mr-2" />
              Latest AI Insights
            </h3>
            <div className="space-y-3">
              {correlationData.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-purple-400">
                  <p className="text-slate-200 text-sm">{insight}</p>
                </div>
              ))}
            </div>
            {correlationData.insights.length > 3 && (
              <div className="mt-4 text-center">
                <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  View all insights →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}