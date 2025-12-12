'use client';

import { motion } from 'framer-motion';
import ClientTime from '@/components/ui/ClientTime';
import ClientNumber from '@/components/ui/ClientNumber';
import { 
  Activity, 
  TrendingUp, 
  BarChart3, 
  AlertCircle,
  Sun,
  Tv,
  Zap,
  Brain
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

interface MetricsGridProps {
  solarData: any;
  netflixData: any;
  correlationData: any;
  isLoading: boolean;
}

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function MetricsGrid({
  solarData,
  netflixData,
  correlationData,
  isLoading
}: MetricsGridProps) {
  const { currentTheme } = useTheme();

  const getSolarActivityLevel = (kp: number) => {
    if (kp >= 7) return { level: 'EXTREME', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    if (kp >= 5) return { level: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
    if (kp >= 3) return { level: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { level: 'LOW', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
  };

  const getCorrelationColor = (corr: number) => {
    if (Math.abs(corr) > 0.7) return 'text-green-400';
    if (Math.abs(corr) > 0.4) return 'text-yellow-400';
    return 'text-slate-400';
  };

  const currentKpIndex = solarData?.kpIndex || 0;
  const trendingScore = netflixData?.aggregatedScore || 0;
  const correlationCoeff = correlationData?.coefficient || 0;
  const hasAnomaly = correlationData?.anomalies?.length > 0 || false;

  const solarActivity = getSolarActivityLevel(currentKpIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Solar Activity Gauge */}
      <motion.div
        variants={cardVariants}
        className={`metric-card-${currentTheme} theme-transition`}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-300">Solar Activity</h3>
          <Sun className="w-6 h-6 text-orange-400" />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-2 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">
                <ClientNumber value={currentKpIndex} decimals={1} fallback="0.0" />
              </span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${solarActivity.bg} ${solarActivity.color} ${solarActivity.border}`}>
                {solarActivity.level}
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((currentKpIndex / 9) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-400">
              <span>Kp-index (0-9)</span>
              <span>{solarData?.solarFlares?.length || 0} flares</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Netflix Trending Score */}
      <motion.div
        variants={cardVariants}
        className={`metric-card-${currentTheme === 'solar' ? 'netflix' : 'solar'} theme-transition`}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-300">Netflix Trends</h3>
          <Tv className="w-6 h-6 text-red-400" />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-2 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">
                <ClientNumber value={trendingScore} decimals={0} fallback="0" />
              </span>
              <div className="text-xs text-slate-400">
                {netflixData?.topGenres?.[0]?.name || 'Unknown'}
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(trendingScore / 30, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-2 rounded-full bg-gradient-to-r from-red-600 to-red-800"
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-400">
              <span>Popularity Score</span>
              <span>{(netflixData?.trendingMovies?.length || 0) + (netflixData?.trendingTv?.length || 0)} trending</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Correlation Coefficient */}
      <motion.div
        variants={cardVariants}
        className="metric-card theme-transition"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-300">Correlation</h3>
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-2 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getCorrelationColor(correlationCoeff)}`}>
                <ClientNumber value={correlationCoeff} decimals={3} prefix={correlationCoeff >= 0 ? '+' : ''} fallback="0.000" />
              </span>
              <div className="text-xs text-slate-400">
                {correlationData?.strength || 'Unknown'}
              </div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(correlationCoeff) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                className={`h-2 rounded-full ${
                  correlationCoeff >= 0 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-400">
              <span>Pearson r</span>
              <span>
                <ClientNumber value={correlationData?.significance} decimals={0} suffix="%" fallback="0%" /> confidence
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Anomaly Detector */}
      <motion.div
        variants={cardVariants}
        className="metric-card theme-transition"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-300">AI Monitor</h3>
          <Brain className={`w-6 h-6 ${hasAnomaly ? 'text-red-400' : 'text-green-400'}`} />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${hasAnomaly ? 'text-red-400' : 'text-green-400'}`}>
                {hasAnomaly ? 'ANOMALY' : 'NORMAL'}
              </span>
              <div className="text-xs text-slate-400">
                <ClientNumber value={correlationData?.significance} decimals={0} suffix="%" fallback="95%" /> confidence
              </div>
            </div>
            
            {hasAnomaly ? (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-300">Pattern Detected</span>
                </div>
                <p className="text-xs text-red-200">
                  {correlationData?.anomalies?.[0]?.description || 'Unusual correlation pattern detected'}
                </p>
              </div>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">All Systems Normal</span>
                </div>
                <p className="text-xs text-green-200">
                  Patterns within expected ranges
                </p>
              </div>
            )}
            
            <p className="text-xs text-slate-400">
              Last check: {correlationData?.lastCalculated ? (
                <ClientTime date={correlationData.lastCalculated} format="relative" fallback="Just now" />
              ) : 'Just now'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}