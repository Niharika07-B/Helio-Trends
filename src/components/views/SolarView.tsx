'use client';

import { motion } from 'framer-motion';
import { Sun, Zap, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import ClientTime from '@/components/ui/ClientTime';
import ClientNumber from '@/components/ui/ClientNumber';

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

export default function SolarView() {
  const { solarData, isLoading } = useDashboardStore();
  const { currentTheme } = useTheme();

  const getSolarActivityColor = (level: string) => {
    switch (level) {
      case 'EXTREME': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getFlareClassColor = (classType: string) => {
    const firstChar = classType[0];
    switch (firstChar) {
      case 'X': return 'text-red-400 bg-red-500/20';
      case 'M': return 'text-orange-400 bg-orange-500/20';
      case 'C': return 'text-yellow-400 bg-yellow-500/20';
      case 'B': return 'text-blue-400 bg-blue-500/20';
      case 'A': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-gradient-solar">
          Solar Activity
        </h1>
        <p className="text-slate-400 text-lg">
          Current space weather conditions
        </p>
      </motion.div>

      {/* Current Activity Overview */}
      <motion.div variants={itemVariants}>
        <div className="card-solar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Sun className="w-8 h-8 mr-3 text-solar-400" />
              Current Solar Activity
            </h2>
            {solarData && (
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getSolarActivityColor(solarData.activityLevel)}`}>
                {solarData.activityLevel} ACTIVITY
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : solarData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kp-Index */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Kp-Index</h3>
                  <Activity className="w-6 h-6 text-solar-400" />
                </div>
                <div className="text-3xl font-bold text-solar-400 mb-2">
                  <ClientNumber value={solarData.kpIndex} decimals={1} fallback="0.0" />
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full bg-solar-gradient"
                    style={{ width: `${Math.min(((solarData.kpIndex || 0) / 9) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  Scale: 0-9 (Current: {solarData.activityLevel})
                </p>
              </div>

              {/* Solar Wind */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Solar Wind</h3>
                  <Zap className="w-6 h-6 text-solar-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Speed:</span>
                    <span className="text-white font-semibold">
                      {solarData.solarWind?.speed || 0} km/s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Density:</span>
                    <span className="text-white font-semibold">
                      {solarData.solarWind?.density || 0} p/cm³
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Temperature:</span>
                    <span className="text-white font-semibold">
                      <ClientNumber value={(solarData.solarWind?.temperature || 0) / 1000} decimals={0} suffix="K K" fallback="0K K" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Summary */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Events (7d)</h3>
                  <TrendingUp className="w-6 h-6 text-solar-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Solar Flares:</span>
                    <span className="text-white font-semibold">
                      {solarData.solarFlares?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">CME Events:</span>
                    <span className="text-white font-semibold">
                      {solarData.cmeEvents?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Last Update:</span>
                    <span className="text-white font-semibold">
                      {solarData.lastUpdate ? (
                        <ClientTime date={solarData.lastUpdate} fallback="N/A" />
                      ) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sun className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No solar data available</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Solar Flares */}
      <motion.div variants={itemVariants}>
        <div className="card-solar">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-solar-400" />
            Solar Flares
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : solarData && solarData.solarFlares && solarData.solarFlares.length > 0 ? (
            <div className="space-y-4">
              {solarData.solarFlares.slice(0, 10).map((flare, index) => (
                <motion.div
                  key={flare.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-lg p-4 border-l-4 border-solar-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getFlareClassColor(flare.classType)}`}>
                        {flare.classType}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          Solar Flare Event
                        </div>
                        <div className="text-sm text-slate-400">
                          Peak: <ClientTime date={flare.peakTime} format="timeWithSeconds" fallback="--:--:--" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-solar-400 font-semibold">
                        Intensity: {flare.intensity}
                      </div>
                      <div className="text-xs text-slate-400">
                        ID: {flare.id ? flare.id.split('-').pop() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No solar flares detected</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* CME Events */}
      <motion.div variants={itemVariants}>
        <div className="card-solar">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-solar-400" />
            Solar Storms (CMEs)
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : solarData && solarData.cmeEvents && solarData.cmeEvents.length > 0 ? (
            <div className="space-y-4">
              {solarData.cmeEvents.slice(0, 5).map((cme, index) => (
                <motion.div
                  key={cme.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-lg p-4 border-l-4 border-orange-400"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">
                        CME Event
                      </div>
                      <div className="text-sm text-slate-400">
                        Start: <ClientTime date={cme.startTime} format="timeWithSeconds" fallback="--:--:--" />
                      </div>
                      <div className="text-sm text-slate-400">
                        Direction: {cme.direction}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400 font-semibold">
                        {cme.speed} km/s
                      </div>
                      <div className="text-xs text-slate-400">
                        ID: {cme.id ? cme.id.split('-').pop() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No recent CME events detected</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}