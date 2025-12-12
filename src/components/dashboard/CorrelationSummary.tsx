'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import ClientNumber from '@/components/ui/ClientNumber';

interface CorrelationSummaryProps {
  correlationData: any;
  isLoading: boolean;
}

export default function CorrelationSummary({ correlationData, isLoading }: CorrelationSummaryProps) {
  const { currentTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!correlationData) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Correlation analysis will appear here</p>
        </div>
      </div>
    );
  }

  const { coefficient = 0, strength = 'WEAK', significance = 0, anomalies = [] } = correlationData || {};

  const getCorrelationIcon = () => {
    const coeff = coefficient || 0;
    if (coeff > 0.1) return <TrendingUp className="w-6 h-6 text-green-400" />;
    if (coeff < -0.1) return <TrendingDown className="w-6 h-6 text-red-400" />;
    return <Minus className="w-6 h-6 text-slate-400" />;
  };

  const getCorrelationColor = () => {
    const coeff = coefficient || 0;
    if (Math.abs(coeff) > 0.7) return 'text-green-400';
    if (Math.abs(coeff) > 0.4) return 'text-yellow-400';
    return 'text-slate-400';
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'STRONG': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'WEAK': return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Brain className={`w-6 h-6 mr-2 ${
            currentTheme === 'solar' ? 'text-solar-400' : 'text-netflix-400'
          } theme-transition`} />
          Correlation Analysis
        </h2>
        {anomalies && anomalies.length > 0 && (
          <div className="flex items-center space-x-1 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Correlation Coefficient */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-dark rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Correlation</h3>
            {getCorrelationIcon()}
          </div>
          
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${getCorrelationColor()}`}>
              <ClientNumber value={coefficient} decimals={3} prefix={(coefficient || 0) >= 0 ? '+' : ''} fallback="0.000" />
            </div>
            
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStrengthColor()}`}>
              {strength}
            </div>
            
            <p className="text-xs text-slate-400">
              {(coefficient || 0) > 0 ? 'Positive' : (coefficient || 0) < 0 ? 'Negative' : 'No'} relationship detected
            </p>
          </div>
        </motion.div>

        {/* Statistical Significance */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-dark rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Significance</h3>
            <div className={`w-3 h-3 rounded-full ${
              (significance || 0) > 95 ? 'bg-green-500' :
              (significance || 0) > 80 ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              <ClientNumber value={significance} decimals={0} suffix="%" fallback="0%" />
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${significance || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-2 rounded-full ${
                  (significance || 0) > 95 ? 'bg-green-500' :
                  (significance || 0) > 80 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>
            
            <p className="text-xs text-slate-400">
              {(significance || 0) > 95 ? 'Highly significant' :
               (significance || 0) > 80 ? 'Significant' :
               'Not significant'}
            </p>
          </div>
        </motion.div>

        {/* Trend Direction */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-dark rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-300">Trend</h3>
            <div className={`text-2xl ${
              (coefficient || 0) > 0.3 ? '📈' :
              (coefficient || 0) < -0.3 ? '📉' :
              '➡️'
            }`} />
          </div>
          
          <div className="space-y-2">
            <div className="text-lg font-bold text-white">
              {(coefficient || 0) > 0.3 ? 'Rising' :
               (coefficient || 0) < -0.3 ? 'Falling' :
               'Stable'}
            </div>
            
            <p className="text-xs text-slate-400">
              {(coefficient || 0) > 0.3 ? 'Solar activity increases streaming engagement' :
               (coefficient || 0) < -0.3 ? 'Solar activity decreases streaming engagement' :
               'No clear directional relationship'}
            </p>
            
            <div className="text-xs text-slate-500">
              Based on current data patterns
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interpretation */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border-l-4 border-purple-400">
        <h4 className="text-sm font-medium text-purple-300 mb-2">Interpretation</h4>
        <p className="text-sm text-slate-300">
          {Math.abs(coefficient || 0) > 0.7 ? (
            `Strong ${(coefficient || 0) > 0 ? 'positive' : 'negative'} correlation suggests solar activity ${(coefficient || 0) > 0 ? 'significantly increases' : 'significantly decreases'} streaming engagement.`
          ) : Math.abs(coefficient || 0) > 0.4 ? (
            `Moderate ${(coefficient || 0) > 0 ? 'positive' : 'negative'} correlation indicates solar activity may ${(coefficient || 0) > 0 ? 'influence increased' : 'influence decreased'} streaming behavior.`
          ) : (
            'Weak correlation suggests minimal direct relationship between solar activity and streaming patterns, though other factors may be involved.'
          )}
        </p>
      </div>
    </motion.div>
  );
}