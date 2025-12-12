'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, MessageCircle, TrendingUp, Zap } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import ClientTime from '@/components/ui/ClientTime';

interface AIInsightsProps {
  solarData: any;
  netflixData: any;
  correlationData: any;
}

export default function AIInsights({ solarData, netflixData, correlationData }: AIInsightsProps) {
  const { currentTheme } = useTheme();

  // Generate AI insights with emotional tone
  const generateInsights = () => {
    const insights = [];
    
    if (!solarData || !netflixData) {
      return [{
        id: 'loading',
        type: 'neutral',
        emoji: '🤖',
        title: 'AI Analysis Loading...',
        content: 'Gathering data from solar observatories and streaming platforms...',
        confidence: 0,
        tone: 'neutral'
      }];
    }

    const kpIndex = solarData.kpIndex || 0;
    const trendingScore = netflixData.aggregatedScore || 0;
    const topGenre = netflixData.topGenres?.[0]?.name || '';
    const flareCount = solarData.solarFlares?.length || 0;
    const correlation = correlationData?.coefficient || 0;

    // Solar activity insights
    if (kpIndex >= 7) {
      insights.push({
        id: 'solar-extreme',
        type: 'alert',
        emoji: '🌋',
        title: 'Intense Solar Storm Detected!',
        content: `Wow! The Sun is absolutely furious today with a Kp-index of ${kpIndex.toFixed(1)}! This extreme geomagnetic activity is like a cosmic thunderstorm that could dramatically shake up streaming preferences. Expect viewers to gravitate toward thrilling, high-energy content as the solar winds stir up our planet's magnetic field.`,
        confidence: 95,
        tone: 'excited'
      });
    } else if (kpIndex >= 5) {
      insights.push({
        id: 'solar-high',
        type: 'warning',
        emoji: '⚡',
        title: 'Solar Activity Ramping Up',
        content: `The Sun is getting quite active with a Kp-index of ${kpIndex.toFixed(1)}! This moderate solar storm is like nature's own special effects show, and it seems to be influencing what people want to watch. Science fiction and thriller content typically see a nice boost during these cosmic events.`,
        confidence: 82,
        tone: 'optimistic'
      });
    } else if (kpIndex <= 1) {
      insights.push({
        id: 'solar-calm',
        type: 'info',
        emoji: '😌',
        title: 'Peaceful Solar Conditions',
        content: `The Sun is taking a well-deserved break today with a very low Kp-index of ${kpIndex.toFixed(1)}. During these calm periods, streaming patterns tend to follow more predictable, seasonal trends. It's like the cosmic influence takes a backseat to everyday preferences.`,
        confidence: 78,
        tone: 'calm'
      });
    }

    // Netflix trending insights
    if (trendingScore > 2000) {
      insights.push({
        id: 'netflix-surge',
        type: 'success',
        emoji: '🚀',
        title: 'Streaming Activity is Soaring!',
        content: `Netflix is absolutely buzzing today with a trending score of ${trendingScore.toFixed(0)}! ${topGenre} content is leading this surge, and it's fascinating to see how viewer engagement peaks during certain cosmic conditions. The correlation between space weather and entertainment choices never ceases to amaze!`,
        confidence: 88,
        tone: 'enthusiastic'
      });
    } else if (trendingScore < 800) {
      insights.push({
        id: 'netflix-low',
        type: 'info',
        emoji: '📺',
        title: 'Steady Streaming Patterns',
        content: `Streaming activity is relatively quiet today with a score of ${trendingScore.toFixed(0)}. Sometimes the most interesting insights come from these calmer periods - they help us understand the baseline behavior before solar events shake things up!`,
        confidence: 72,
        tone: 'analytical'
      });
    }

    // Genre-specific insights
    if (topGenre.toLowerCase().includes('sci') || topGenre.toLowerCase().includes('science')) {
      insights.push({
        id: 'scifi-correlation',
        type: 'discovery',
        emoji: '🛸',
        title: 'Sci-Fi Content Dominating!',
        content: `${topGenre} is absolutely crushing it as today's top genre! This is particularly exciting because science fiction content often surges when solar activity increases. It's like viewers subconsciously tune into space-themed content when the cosmos gets active. The human psyche's connection to celestial events is truly remarkable!`,
        confidence: 91,
        tone: 'fascinated'
      });
    }

    // Correlation insights
    if (Math.abs(correlation) > 0.7) {
      insights.push({
        id: 'strong-correlation',
        type: 'discovery',
        emoji: '🔗',
        title: 'Incredible Correlation Discovered!',
        content: `This is absolutely fascinating! We've detected a ${correlation > 0 ? 'strong positive' : 'strong negative'} correlation of ${correlation.toFixed(3)} between solar activity and streaming patterns. This level of correlation (${Math.abs(correlation * 100).toFixed(0)}%) suggests a genuine relationship between space weather and human entertainment preferences. Science is beautiful!`,
        confidence: 94,
        tone: 'amazed'
      });
    } else if (Math.abs(correlation) < 0.2) {
      insights.push({
        id: 'weak-correlation',
        type: 'analytical',
        emoji: '🤔',
        title: 'Mysterious Correlation Patterns',
        content: `Today's correlation is quite weak at ${correlation.toFixed(3)}, which is actually interesting in its own way! Sometimes the absence of correlation tells us just as much as strong correlations do. Perhaps other factors are dominating streaming choices today, or we're in a transitional period between solar events.`,
        confidence: 68,
        tone: 'curious'
      });
    }

    // Flare activity insights
    if (flareCount > 5) {
      insights.push({
        id: 'flare-activity',
        type: 'warning',
        emoji: '💥',
        title: 'Solar Flare Frenzy!',
        content: `The Sun has been incredibly active with ${flareCount} solar flares in just 24 hours! Each flare is like a cosmic firework that can influence Earth's magnetic field. Based on historical patterns, we might see streaming preferences shift toward more intense, dramatic content over the next 24-48 hours as these solar particles reach Earth.`,
        confidence: 85,
        tone: 'excited'
      });
    }

    // Predictive insights
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (kpIndex > 4 && correlation > 0.3) {
      insights.push({
        id: 'prediction',
        type: 'prediction',
        emoji: '🔮',
        title: 'Tomorrow\'s Streaming Forecast',
        content: `Based on current solar conditions and correlation patterns, tomorrow looks exciting for streaming! The elevated solar activity (Kp: ${kpIndex.toFixed(1)}) combined with our positive correlation suggests we might see a ${Math.round(kpIndex * 12)}% increase in sci-fi and thriller content engagement. Keep an eye on space-themed shows!`,
        confidence: 76,
        tone: 'predictive'
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights for better UX
  };

  const insights = generateInsights();

  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'alert':
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          accent: 'text-red-400',
          glow: 'shadow-red-500/20'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30',
          accent: 'text-orange-400',
          glow: 'shadow-orange-500/20'
        };
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/30',
          accent: 'text-green-400',
          glow: 'shadow-green-500/20'
        };
      case 'discovery':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30',
          accent: 'text-purple-400',
          glow: 'shadow-purple-500/20'
        };
      case 'prediction':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30',
          accent: 'text-blue-400',
          glow: 'shadow-blue-500/20'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30',
          accent: 'text-slate-400',
          glow: 'shadow-slate-500/20'
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
          <Brain className="w-6 h-6 mr-2 text-purple-400" />
          AI Insights
        </h2>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-sm text-slate-400">Powered by AI</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const styles = getInsightStyles(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-lg border ${styles.bg} ${styles.glow} shadow-lg`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0 mt-1">
                  {insight.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${styles.accent}`}>
                      {insight.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className={`text-xs px-2 py-1 rounded-full ${styles.bg} ${styles.accent} font-medium`}>
                        {insight.confidence}% confident
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {insight.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <MessageCircle className="w-3 h-3" />
                      <span className="capitalize">{insight.tone} tone</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Generated <ClientTime format="relative" fallback="just now" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Summary */}
      <div className="mt-6 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-purple-300 font-semibold mb-2">AI Summary</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {insights.length > 0 ? (
                <>
                  Today's analysis reveals {insights.filter(i => i.confidence > 80).length > 0 ? 'strong' : 'moderate'} patterns 
                  in the solar-streaming relationship. The AI is most confident about{' '}
                  <strong>{insights.reduce((max, insight) => insight.confidence > max.confidence ? insight : max).title.toLowerCase()}</strong>
                  {insights.some(i => i.type === 'prediction') && (
                    <>, with predictive insights suggesting interesting developments ahead</>
                  )}.
                </>
              ) : (
                'Analyzing current data patterns to generate insights...'
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}