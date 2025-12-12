'use client';

import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Clock, Zap } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import ClientTime from '../ui/ClientTime';

export default function RealtimeUpdates() {
  const { 
    isConnected, 
    lastSyncTime, 
    isLoading, 
    syncData,
    solarData,
    netflixData 
  } = useDashboardStore();
  
  const { currentTheme } = useTheme();

  const getLastUpdateText = () => {
    if (!lastSyncTime) return 'Never';
    return 'relative-time'; // Will be handled by ClientTime component
  };

  const getDataFreshness = () => {
    if (!lastSyncTime) return 'stale';
    const minutesAgo = (Date.now() - new Date(lastSyncTime).getTime()) / (1000 * 60);
    if (minutesAgo < 5) return 'fresh';
    if (minutesAgo < 15) return 'recent';
    return 'stale';
  };

  const freshness = getDataFreshness();
  const freshnessColors = {
    fresh: 'text-green-400 bg-green-500/20 border-green-500/30',
    recent: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    stale: 'text-red-400 bg-red-500/20 border-red-500/30'
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`glass rounded-xl p-4 border ${
        currentTheme === 'solar' 
          ? 'border-solar-500/30' 
          : 'border-netflix-500/30'
      } theme-transition`}
    >
      <div className="flex items-center justify-between">
        {/* Connection Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wifi className="w-5 h-5 text-green-400" />
              </motion.div>
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? 'Live Connection' : 'Offline Mode'}
            </span>
          </div>

          {/* Data Freshness */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${freshnessColors[freshness]}`}>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Data {freshness}</span>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-sm text-slate-400">
            Updated {lastSyncTime ? <ClientTime date={lastSyncTime} format="relative" fallback="Never" /> : 'Never'}
          </div>
        </div>

        {/* Activity Indicators */}
        <div className="flex items-center space-x-4">
          {/* Solar Activity Pulse */}
          {solarData && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                solarData.activityLevel === 'EXTREME' ? 'bg-red-500 animate-pulse' :
                solarData.activityLevel === 'HIGH' ? 'bg-orange-500 animate-pulse' :
                solarData.activityLevel === 'MODERATE' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <span className="text-xs text-slate-400">
                Solar: {solarData.activityLevel}
              </span>
            </div>
          )}

          {/* Netflix Activity Pulse */}
          {netflixData && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                netflixData.aggregatedScore > 2000 ? 'bg-red-500 animate-pulse' :
                netflixData.aggregatedScore > 1000 ? 'bg-orange-500' :
                'bg-green-500'
              }`} />
              <span className="text-xs text-slate-400">
                Trends: {netflixData.aggregatedScore > 2000 ? 'HOT' : 'NORMAL'}
              </span>
            </div>
          )}

          {/* Manual Sync Button */}
          <motion.button
            onClick={syncData}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentTheme === 'solar'
                ? 'hover:bg-solar-500/20 text-solar-400'
                : 'hover:bg-netflix-500/20 text-netflix-400'
            } disabled:opacity-50 disabled:cursor-not-allowed theme-transition`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Real-time Activity Bar */}
      <div className="mt-3 flex items-center space-x-2">
        <Zap className="w-4 h-4 text-slate-400" />
        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={`h-full w-1/3 rounded-full ${
              currentTheme === 'solar' 
                ? 'bg-solar-gradient' 
                : 'bg-netflix-gradient'
            } theme-transition`}
          />
        </div>
        <span className="text-xs text-slate-400">
          {isConnected ? 'Streaming live data' : 'Using cached data'}
        </span>
      </div>
    </motion.div>
  );
}