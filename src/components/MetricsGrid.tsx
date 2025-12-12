'use client';

import { Activity, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { MetricCard } from './ui/MetricCard';
import { LoadingSpinner } from './ui/LoadingSpinner';
import ClientNumber from './ui/ClientNumber';

interface MetricsGridProps {
  solarData: any;
  netflixData: any;
  correlationData: any;
  isLoading: boolean;
}

export default function MetricsGrid({
  solarData,
  netflixData,
  correlationData,
  isLoading
}: MetricsGridProps) {
  // Calculate current metrics
  const currentKpIndex = solarData?.currentKpIndex || 0;
  const trendingScore = netflixData?.aggregatedScore || 0;
  const correlationCoeff = correlationData?.currentCorrelation || 0;
  const hasAnomaly = correlationData?.anomalyDetected || false;

  const getSolarActivityLevel = (kp: number) => {
    if (kp >= 7) return { level: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500/20' };
    if (kp >= 5) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (kp >= 3) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const getCorrelationColor = (corr: number) => {
    if (Math.abs(corr) > 0.7) return 'text-green-400';
    if (Math.abs(corr) > 0.4) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const solarActivity = getSolarActivityLevel(currentKpIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Solar Activity Gauge */}
      <MetricCard
        title="Solar Activity"
        icon={<Activity className="w-6 h-6 text-orange-400" />}
        isLoading={isLoading}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">
              <ClientNumber value={currentKpIndex} decimals={1} fallback="0.0" />
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${solarActivity.bg} ${solarActivity.color}`}>
              {solarActivity.level}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500"
              style={{ width: `${Math.min((currentKpIndex / 9) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">Kp-index (0-9 scale)</p>
        </div>
      </MetricCard>

      {/* Netflix Trending Score */}
      <MetricCard
        title="Netflix Trending"
        icon={<TrendingUp className="w-6 h-6 text-netflix-red" />}
        isLoading={isLoading}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">
              <ClientNumber value={trendingScore} decimals={0} fallback="0" />
            </span>
            <div className="text-xs text-gray-400">
              {netflixData?.topGenre || 'Sci-Fi'}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-netflix-red to-red-800"
              style={{ width: `${Math.min(trendingScore, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">Aggregated popularity score</p>
        </div>
      </MetricCard>

      {/* Correlation Coefficient */}
      <MetricCard
        title="Correlation"
        icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
        isLoading={isLoading}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${getCorrelationColor(correlationCoeff)}`}>
              <ClientNumber value={correlationCoeff} decimals={3} prefix={correlationCoeff >= 0 ? '+' : ''} fallback="0.000" />
            </span>
            <div className="text-xs text-gray-400">
              {Math.abs(correlationCoeff) > 0.5 ? 'Strong' : 'Weak'}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                correlationCoeff >= 0 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${Math.abs(correlationCoeff) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">7-day rolling average</p>
        </div>
      </MetricCard>

      {/* Anomaly Detector */}
      <MetricCard
        title="Anomaly Detection"
        icon={<AlertCircle className={`w-6 h-6 ${hasAnomaly ? 'text-red-400' : 'text-green-400'}`} />}
        isLoading={isLoading}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${hasAnomaly ? 'text-red-400' : 'text-green-400'}`}>
              {hasAnomaly ? 'DETECTED' : 'NORMAL'}
            </span>
            <div className="text-xs text-gray-400">
              {correlationData?.confidence || 95}% confidence
            </div>
          </div>
          
          {hasAnomaly ? (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
              <p className="text-xs text-red-300">
                Unusual pattern detected in correlation data
              </p>
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
              <p className="text-xs text-green-300">
                All patterns within expected ranges
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-400">
            Last check: {correlationData?.lastAnomalyCheck || 'Just now'}
          </p>
        </div>
      </MetricCard>
    </div>
  );
}