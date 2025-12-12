'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, Sun, Activity, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import ClientTime from '@/components/ui/ClientTime';
import { safeFixed } from '@/utils/numberUtils';

interface AlertsPanelProps {
  solarData: any;
  netflixData: any;
  correlationData: any;
}

export default function AlertsPanel({ solarData, netflixData, correlationData }: AlertsPanelProps) {
  const { currentTheme } = useTheme();

  // Generate alerts based on current data
  const generateAlerts = () => {
    const alerts = [];
    const now = new Date();

    // Solar Activity Alerts
    if (solarData) {
      const kpIndex = solarData.kpIndex || 0;
      const activityLevel = solarData.activityLevel || 'LOW';
      const flareCount = solarData.solarFlares?.length || 0;
      const cmeCount = solarData.cmeEvents?.length || 0;

      // High solar activity alert
      if (kpIndex >= 7) {
        alerts.push({
          id: 'solar-extreme',
          type: 'severe',
          icon: AlertTriangle,
          title: '🔥 Severe Solar Storm',
          message: `Extreme geomagnetic activity detected (Kp: ${safeFixed(kpIndex, 1)})`,
          timestamp: now.toISOString(),
          priority: 1,
          action: 'Monitor space weather conditions closely'
        });
      } else if (kpIndex >= 5) {
        alerts.push({
          id: 'solar-high',
          type: 'warning',
          icon: Sun,
          title: '🟡 Moderate Solar Storm',
          message: `High solar activity ongoing (Kp: ${safeFixed(kpIndex, 1)})`,
          timestamp: now.toISOString(),
          priority: 2,
          action: 'Expect increased Sci-Fi content interest'
        });
      } else if (kpIndex <= 1) {
        alerts.push({
          id: 'solar-calm',
          type: 'info',
          icon: Sun,
          title: '🟢 Calm Solar Period',
          message: `Very low solar activity (Kp: ${safeFixed(kpIndex, 1)})`,
          timestamp: now.toISOString(),
          priority: 4,
          action: 'Normal streaming patterns expected'
        });
      }

      // Solar flare alerts
      if (flareCount > 5) {
        alerts.push({
          id: 'flares-high',
          type: 'warning',
          icon: Zap,
          title: '⚡ Multiple Solar Flares',
          message: `${flareCount} solar flares detected in 24h`,
          timestamp: now.toISOString(),
          priority: 2,
          action: 'Streaming surge likely in 24-48h'
        });
      }

      // CME alerts
      if (cmeCount > 3) {
        alerts.push({
          id: 'cme-active',
          type: 'warning',
          icon: Activity,
          title: '🌊 Active CME Period',
          message: `${cmeCount} coronal mass ejections this week`,
          timestamp: now.toISOString(),
          priority: 3,
          action: 'Monitor for delayed streaming effects'
        });
      }
    }

    // Netflix Trending Alerts
    if (netflixData) {
      const trendingScore = netflixData.aggregatedScore || 0;
      const topGenre = netflixData.topGenres?.[0]?.name || '';
      
      if (trendingScore > 2000) {
        alerts.push({
          id: 'netflix-surge',
          type: 'success',
          icon: TrendingUp,
          title: '📈 Streaming Surge Detected',
          message: `High trending activity (Score: ${safeFixed(trendingScore, 0)})`,
          timestamp: now.toISOString(),
          priority: 2,
          action: `${topGenre} content leading the surge`
        });
      }

      // Genre-specific alerts
      if (topGenre.toLowerCase().includes('sci') || topGenre.toLowerCase().includes('science')) {
        alerts.push({
          id: 'scifi-trending',
          type: 'info',
          icon: TrendingUp,
          title: '🚀 Sci-Fi Content Trending',
          message: `${topGenre} is the top genre today`,
          timestamp: now.toISOString(),
          priority: 3,
          action: 'Possible correlation with solar activity'
        });
      }
    }

    // Correlation Alerts
    if (correlationData) {
      const coefficient = correlationData.coefficient || 0;
      const strength = correlationData.strength || 'WEAK';
      
      if (Math.abs(coefficient) > 0.7) {
        alerts.push({
          id: 'correlation-strong',
          type: 'success',
          icon: Activity,
          title: '🔗 Strong Correlation Found',
          message: `${strength} correlation detected (r=${safeFixed(coefficient, 3)})`,
          timestamp: now.toISOString(),
          priority: 2,
          action: 'High confidence in solar-streaming relationship'
        });
      }

      // Anomaly alerts
      if (correlationData.anomalies?.length > 0) {
        const latestAnomaly = correlationData.anomalies[0];
        alerts.push({
          id: 'anomaly-detected',
          type: 'warning',
          icon: AlertTriangle,
          title: '🔍 Data Anomaly Detected',
          message: latestAnomaly.description || 'Unusual pattern in correlation data',
          timestamp: now.toISOString(),
          priority: 3,
          action: 'Investigating correlation disruption'
        });
      }
    }

    // Sort by priority (lower number = higher priority)
    return alerts.sort((a, b) => a.priority - b.priority);
  };

  const alerts = generateAlerts();

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'severe':
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          text: 'text-red-400',
          icon: 'text-red-400',
          pulse: 'animate-pulse'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30',
          text: 'text-orange-400',
          icon: 'text-orange-400',
          pulse: ''
        };
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/30',
          text: 'text-green-400',
          icon: 'text-green-400',
          pulse: ''
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          text: 'text-blue-400',
          icon: 'text-blue-400',
          pulse: ''
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
          Live Alerts
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-400">Real-time</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => {
              const styles = getAlertStyles(alert.type);
              const Icon = alert.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${styles.bg} ${styles.pulse}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${styles.text}`}>
                          {alert.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <ClientTime date={alert.timestamp} />
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">
                        {alert.message}
                      </p>
                      <div className="text-xs text-slate-400 italic">
                        → {alert.action}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Sun className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">All systems normal</p>
              <p className="text-slate-500 text-sm mt-1">No active alerts</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-slate-400">
                  {alerts.filter(a => a.type === 'severe').length} Severe
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span className="text-slate-400">
                  {alerts.filter(a => a.type === 'warning').length} Warning
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-slate-400">
                  {alerts.filter(a => a.type === 'info').length} Info
                </span>
              </div>
            </div>
            <div className="text-slate-400">
              Total: {alerts.length} alerts
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}