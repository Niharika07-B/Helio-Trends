'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Brain, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import ClientNumber from '@/components/ui/ClientNumber';
import HydrationSafeChart from '@/components/ui/HydrationSafeChart';

interface PredictionPanelProps {
  solarData: any;
  netflixData: any;
}

export default function PredictionPanel({ solarData, netflixData }: PredictionPanelProps) {
  const { currentTheme } = useTheme();

  // Generate prediction data using simple ML-like logic
  const generatePredictions = () => {
    const predictions = [];
    const currentKp = solarData?.kpIndex || 3;
    const currentTrend = netflixData?.aggregatedScore || 1000;
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simple prediction algorithm with some randomness
      const solarTrend = Math.sin(i * 0.5) * 2 + Math.random() * 1.5;
      const predictedKp = Math.max(0, Math.min(9, currentKp + solarTrend));
      
      // Correlation-based Netflix prediction
      const genreBoost = predictedKp > 5 ? 1.3 : predictedKp > 3 ? 1.1 : 0.9;
      const predictedTrend = currentTrend * genreBoost * (0.9 + Math.random() * 0.2);
      
      predictions.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        solarActivity: predictedKp,
        trendingScore: predictedTrend,
        confidence: Math.max(60, 95 - i * 8), // Decreasing confidence over time
        sciFiSurge: predictedKp > 5 ? Math.round((predictedKp - 3) * 15) : 0,
      });
    }
    
    return predictions;
  };

  const predictions = generatePredictions();
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-400" />
          7-Day Predictions
        </h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-400">Confidence:</div>
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            avgConfidence > 80 ? 'bg-green-500/20 text-green-400' :
            avgConfidence > 60 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            <ClientNumber value={avgConfidence} decimals={0} suffix="%" fallback="0%" />
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <HydrationSafeChart className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value, name) => [
                typeof value === 'number' ? Math.round(value * 10) / 10 : value,
                name === 'solarActivity' ? 'Solar Activity' : 'Trending Score'
              ]}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="solarActivity"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trendingScore"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </HydrationSafeChart>

      {/* Daily Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.slice(0, 6).map((pred, index) => (
          <motion.div
            key={pred.day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-white font-semibold">{pred.day}</div>
                <div className="text-xs text-slate-400">{pred.date}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                pred.confidence > 80 ? 'bg-green-500/20 text-green-400' :
                pred.confidence > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                <ClientNumber value={pred.confidence} decimals={0} suffix="%" fallback="0%" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Solar:</span>
                <span className={`font-semibold ${
                  pred.solarActivity > 6 ? 'text-red-400' :
                  pred.solarActivity > 4 ? 'text-orange-400' :
                  'text-green-400'
                }`}>
                  <ClientNumber value={pred.solarActivity} decimals={1} fallback="0.0" />
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Trends:</span>
                <span className="text-purple-400 font-semibold">
                  <ClientNumber value={pred.trendingScore} decimals={0} fallback="0" />
                </span>
              </div>
              
              {pred.sciFiSurge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Sci-Fi Boost:</span>
                  <span className="text-blue-400 font-semibold">
                    +{pred.sciFiSurge}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Summary */}
      <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-purple-300 font-semibold mb-2">AI Forecast Summary</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {predictions[0].solarActivity > 5 ? (
                <>
                  <strong>High solar activity expected</strong> in the coming days. 
                  Sci-Fi and space-themed content likely to see a <strong>{predictions[0].sciFiSurge}% surge</strong>. 
                  Peak activity predicted for <strong>{predictions[1].day}</strong>.
                </>
              ) : predictions[0].solarActivity > 3 ? (
                <>
                  <strong>Moderate solar conditions</strong> ahead. 
                  Streaming trends should remain stable with slight increases in 
                  science-fiction content during solar peaks.
                </>
              ) : (
                <>
                  <strong>Calm solar period</strong> expected. 
                  Streaming patterns likely to follow normal seasonal trends 
                  without significant solar influence.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}