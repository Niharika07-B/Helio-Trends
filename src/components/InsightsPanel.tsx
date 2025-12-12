'use client';

import { Brain, TrendingUp, AlertTriangle, Clock, Zap, Tv2 } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface InsightsPanelProps {
  solarData: any;
  netflixData: any;
  correlationData: any;
  isLoading: boolean;
}

export default function InsightsPanel({
  solarData,
  netflixData,
  correlationData,
  isLoading
}: InsightsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="card">
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="medium" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI-Generated Insights */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI-Generated Insights</h3>
        </div>
        
        <div className="space-y-3">
          {correlationData?.insights?.map((insight: string, index: number) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-3 border-l-4 border-purple-400">
              <p className="text-gray-200 text-sm leading-relaxed">{insight}</p>
            </div>
          )) || (
            <div className="bg-gray-700/50 rounded-lg p-3 border-l-4 border-gray-500">
              <p className="text-gray-400 text-sm">Generating insights from current data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solar Activity Details */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-white">Solar Activity Details</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Current Kp-index</span>
              <span className="text-orange-400 font-semibold">
                {solarData?.currentKpIndex?.toFixed(1) || '3.2'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Solar Flares (24h)</span>
              <span className="text-orange-400 font-semibold">
                {solarData?.solarFlares?.length || 2}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">CME Events (7d)</span>
              <span className="text-orange-400 font-semibold">
                {solarData?.cmeEvents?.length || 1}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Storm Level</span>
              <span className="text-orange-400 font-semibold">
                {solarData?.currentKpIndex > 6 ? 'High' : 
                 solarData?.currentKpIndex > 3 ? 'Moderate' : 'Low'}
              </span>
            </div>
          </div>
        </div>

        {/* Netflix Trends Details */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Tv2 className="w-5 h-5 text-netflix-red" />
            <h4 className="font-semibold text-white">Trending Content</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Top Genre</span>
              <span className="text-netflix-red font-semibold">
                {netflixData?.topGenre || 'Science Fiction'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Avg Popularity</span>
              <span className="text-netflix-red font-semibold">
                {netflixData?.aggregatedScore?.toFixed(1) || '78.5'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Trending Movies</span>
              <span className="text-netflix-red font-semibold">
                {netflixData?.trendingMovies?.length || 20}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Trending TV</span>
              <span className="text-netflix-red font-semibold">
                {netflixData?.trendingTv?.length || 20}
              </span>
            </div>
          </div>
        </div>

        {/* Statistical Summary */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white">Statistical Summary</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Correlation (r)</span>
              <span className={`font-semibold ${
                Math.abs(correlationData?.currentCorrelation || 0) > 0.5 
                  ? 'text-green-400' 
                  : 'text-yellow-400'
              }`}>
                {correlationData?.currentCorrelation?.toFixed(3) || '0.450'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Significance</span>
              <span className="text-green-400 font-semibold">
                {Math.abs(correlationData?.currentCorrelation || 0) > 0.5 ? 'High' : 'Moderate'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Data Points</span>
              <span className="text-green-400 font-semibold">
                {correlationData?.historicalCorrelations?.length || 30}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Confidence</span>
              <span className="text-green-400 font-semibold">
                {correlationData?.confidence || 87}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Timeline */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-white">Recent Events Timeline</h4>
        </div>
        
        <div className="space-y-3">
          <EventTimelineItem
            time="2 hours ago"
            type="solar"
            title="M2.1 Solar Flare Detected"
            description="Moderate solar flare from active region AR3234"
            icon={<Zap className="w-4 h-4 text-orange-400" />}
          />
          
          <EventTimelineItem
            time="4 hours ago"
            type="netflix"
            title="Sci-Fi Genre Surge"
            description="Science fiction content popularity increased by 15%"
            icon={<TrendingUp className="w-4 h-4 text-netflix-red" />}
          />
          
          <EventTimelineItem
            time="6 hours ago"
            type="correlation"
            title="Correlation Spike"
            description="Correlation coefficient reached 0.72, highest this week"
            icon={<Brain className="w-4 h-4 text-green-400" />}
          />
          
          {correlationData?.anomalyDetected && (
            <EventTimelineItem
              time="Just now"
              type="anomaly"
              title="Anomaly Detected"
              description="Unusual pattern in correlation data requires attention"
              icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface EventTimelineItemProps {
  time: string;
  type: 'solar' | 'netflix' | 'correlation' | 'anomaly';
  title: string;
  description: string;
  icon: React.ReactNode;
}

function EventTimelineItem({ time, type, title, description, icon }: EventTimelineItemProps) {
  const typeColors = {
    solar: 'border-orange-400 bg-orange-400/10',
    netflix: 'border-red-400 bg-red-400/10',
    correlation: 'border-green-400 bg-green-400/10',
    anomaly: 'border-red-400 bg-red-400/10'
  };

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg border ${typeColors[type]}`}>
      <div className="flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-white">{title}</h5>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-xs text-gray-300 mt-1">{description}</p>
      </div>
    </div>
  );
}