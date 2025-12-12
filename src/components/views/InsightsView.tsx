'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, Lightbulb, BarChart3, Zap, Target } from 'lucide-react';
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

export default function InsightsView() {
  const { correlationData, solarData, netflixData, isLoading } = useDashboardStore();
  const { currentTheme } = useTheme();

  const getCorrelationStrengthColor = (strength: string) => {
    switch (strength) {
      case 'STRONG': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'WEAK': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getAnomalyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'spike': return <TrendingUp className="w-5 h-5" />;
      case 'correlation': return <BarChart3 className="w-5 h-5" />;
      case 'solar': return <Zap className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
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
        <h1 className="text-4xl font-bold mb-2 text-gradient-primary">
          Data Analysis
        </h1>
        <p className="text-slate-400 text-lg">
          Correlation between solar activity and streaming trends
        </p>
      </motion.div>

      {/* Correlation Overview */}
      <motion.div variants={itemVariants}>
        <div className="card-glass">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Brain className="w-8 h-8 mr-3 text-primary-400" />
              Data Correlation
            </h2>
            {correlationData && (
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getCorrelationStrengthColor(correlationData.strength || 'WEAK')}`}>
                {correlationData.strength || 'WEAK'} CORRELATION
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
          ) : correlationData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Correlation Coefficient */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Coefficient</h3>
                  <BarChart3 className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  <ClientNumber value={correlationData.coefficient} decimals={3} fallback="0.000" />
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      Math.abs(correlationData.coefficient || 0) > 0.7 
                        ? 'bg-green-500' 
                        : Math.abs(correlationData.coefficient || 0) > 0.3 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.abs(correlationData.coefficient || 0) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  Range: -1.0 to +1.0
                </p>
              </div>

              {/* Statistical Significance */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Significance</h3>
                  <Target className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  <ClientNumber value={(correlationData.significance || 0) * 100} decimals={1} suffix="%" fallback="0.0%" />
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full bg-primary-gradient"
                    style={{ width: `${(correlationData.significance || 0) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  Confidence level
                </p>
              </div>

              {/* Anomaly Count */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Anomalies</h3>
                  <AlertCircle className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {(correlationData.anomalies || []).length}
                </div>
                <div className="text-sm text-slate-400 mb-2">
                  Detected patterns
                </div>
                <p className="text-sm text-slate-400">
                  Last calculated: {correlationData.lastCalculated ? (
                    <ClientTime date={correlationData.lastCalculated} fallback="N/A" />
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No correlation data available</p>
              <p className="text-slate-500 text-sm mt-2">
                Data will appear once both solar and Netflix data are loaded
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Genre Correlations */}
      {correlationData && correlationData.genreCorrelations && Object.keys(correlationData.genreCorrelations).length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="card-glass">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-primary-400" />
              Genre-Specific Correlations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(correlationData.genreCorrelations)
                .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                .map(([genre, correlation], index) => (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold capitalize">{genre}</h3>
                    <div className={`text-sm font-bold ${
                      Math.abs(correlation) > 0.5 
                        ? 'text-green-400' 
                        : Math.abs(correlation) > 0.2 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                    }`}>
                      <ClientNumber value={correlation} decimals={3} prefix={(correlation || 0) > 0 ? '+' : ''} fallback="0.000" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        Math.abs(correlation) > 0.5 
                          ? 'bg-green-500' 
                          : Math.abs(correlation) > 0.2 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.abs(correlation) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      {correlationData && correlationData.insights && correlationData.insights.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="card-glass">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-primary-400" />
              AI-Generated Insights
            </h2>

            <div className="space-y-4">
              {correlationData.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-lg p-4 border-l-4 border-primary-400"
                >
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-200 leading-relaxed">{insight}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Anomaly Detection */}
      {correlationData && correlationData.anomalies && correlationData.anomalies.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="card-glass">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2 text-primary-400" />
              Detected Anomalies
            </h2>

            <div className="space-y-4">
              {correlationData.anomalies
                .sort((a, b) => b.confidence - a.confidence)
                .map((anomaly, index) => (
                <motion.div
                  key={anomaly.timestamp + anomaly.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-lg p-4 border-l-4 border-yellow-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-yellow-400">
                        {getAnomalyTypeIcon(anomaly.type)}
                      </div>
                      <div>
                        <div className="text-white font-semibold capitalize">
                          {anomaly.type} Anomaly
                        </div>
                        <div className="text-sm text-slate-400">
                          <ClientTime date={anomaly.timestamp} format="timeWithSeconds" fallback="--:--:--" />
                        </div>
                        <div className="text-sm text-slate-300 mt-1">
                          {anomaly.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-semibold">
                        <ClientNumber value={(anomaly.confidence || 0) * 100} decimals={0} suffix="%" fallback="0%" />
                      </div>
                      <div className="text-xs text-slate-400">
                        Confidence
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Explain Like I'm 10 */}
      <motion.div variants={itemVariants}>
        <div className="card-glass border-2 border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="text-2xl mr-2">🧒</span>
              Simple Explanation
            </h2>
            <div className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              Kid-Friendly
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h3 className="text-green-300 font-semibold mb-2 flex items-center">
                <span className="mr-2">☀️</span>
                What's Happening?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {solarData && netflixData ? (
                  solarData.kpIndex > 5 ? (
                    <>
                      The Sun is sending <strong>strong energy waves</strong> to Earth today! 
                      When this happens, people seem to want to watch more <strong>space movies</strong> and 
                      <strong>exciting shows</strong>. It's like the Sun is making everyone interested in space adventures! 🚀
                    </>
                  ) : solarData.kpIndex > 2 ? (
                    <>
                      The Sun is being a little bit active today, sending some energy waves to Earth. 
                      This might make people want to watch slightly more <strong>science shows</strong> than usual. 
                      It's like a gentle nudge from space! ✨
                    </>
                  ) : (
                    <>
                      The Sun is very calm today, like it's taking a nap! 😴 
                      When the Sun is quiet, people watch their normal favorite shows without any special space influence. 
                      Everything is peaceful in both space and on Netflix!
                    </>
                  )
                ) : (
                  'We\'re still learning about what the Sun and Netflix are doing today...'
                )}
              </p>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
                <span className="mr-2">🔗</span>
                The Cool Connection
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Scientists discovered that when the Sun gets excited and sends energy to Earth, 
                people somehow become more interested in watching <strong>space movies</strong> and 
                <strong>science shows</strong>! It's like the Sun is whispering "Hey, want to learn about space?" 
                and people say "Yes!" without even knowing why. Pretty amazing, right? 🌟
              </p>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h3 className="text-purple-300 font-semibold mb-2 flex items-center">
                <span className="mr-2">🎯</span>
                Fun Fact
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                This dashboard is like a detective that watches both the Sun and Netflix at the same time! 
                It tries to figure out if they're connected. Sometimes they are, sometimes they're not - 
                just like how sometimes you want ice cream when it's sunny, but sometimes you want it when it's cloudy too! 🍦
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Card */}
      {solarData && netflixData && (
        <motion.div variants={itemVariants}>
          <div className="card-glass border-2 border-primary-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary-400" />
              Current Analysis Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Solar Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Current Kp-Index:</span>
                    <span className="text-white font-semibold">{solarData.kpIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Activity Level:</span>
                    <span className="text-white font-semibold">{solarData.activityLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Recent Flares:</span>
                    <span className="text-white font-semibold">{solarData.solarFlares.length}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Streaming Trends</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Trending Score:</span>
                    <span className="text-white font-semibold">
                      <ClientNumber value={netflixData.aggregatedScore} decimals={1} fallback="0.0" />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Top Genre:</span>
                    <span className="text-white font-semibold">
                      {netflixData.topGenres[0]?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Shows:</span>
                    <span className="text-white font-semibold">
                      {netflixData.trendingMovies.length + netflixData.trendingTv.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {correlationData && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400 mb-2">
                    {correlationData.strength || 'WEAK'} Correlation Detected
                  </div>
                  <div className="text-slate-300">
                    Coefficient: <span className="font-semibold">
                      <ClientNumber value={correlationData.coefficient} decimals={3} fallback="0.000" />
                    </span>
                    {' • '}
                    Significance: <span className="font-semibold">
                      <ClientNumber value={(correlationData.significance || 0) * 100} decimals={1} suffix="%" fallback="0.0%" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}