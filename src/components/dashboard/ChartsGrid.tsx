'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import HydrationSafeChart from '@/components/ui/HydrationSafeChart';
import { SolarData, NetflixData, CorrelationData } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';

interface ChartsGridProps {
  solarData: SolarData | null;
  netflixData: NetflixData | null;
  correlationData: CorrelationData | null;
  isLoading: boolean;
}

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

export default function ChartsGrid({ solarData, netflixData, correlationData, isLoading }: ChartsGridProps) {
  const { currentTheme } = useTheme();

  // Generate time series data for correlation chart
  const generateTimeSeriesData = () => {
    if (!solarData || !netflixData) return [];
    
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const kpVariation = Math.sin(i * 0.3) * 2 + Math.random() * 1.5;
      const popularityVariation = Math.cos(i * 0.2) * 500 + Math.random() * 300;
      
      data.push({
        time: time.toISOString().slice(11, 16), // Use consistent HH:MM format
        kpIndex: Math.max(0, Math.min(9, solarData.kpIndex + kpVariation)),
        popularity: Math.max(0, netflixData.aggregatedScore + popularityVariation),
        correlation: correlationData ? correlationData.coefficient * 100 : 0,
      });
    }
    
    return data;
  };

  // Generate genre distribution data
  const genreData = netflixData?.topGenres.map(genre => ({
    name: genre.name,
    value: genre.count,
    popularity: genre.popularity,
  })) || [];

  // Generate solar activity distribution
  const solarActivityData = solarData ? [
    { name: 'Low (0-2)', value: solarData.kpIndex <= 2 ? 1 : 0, color: '#10B981' },
    { name: 'Moderate (3-5)', value: solarData.kpIndex > 2 && solarData.kpIndex <= 5 ? 1 : 0, color: '#F59E0B' },
    { name: 'High (6-7)', value: solarData.kpIndex > 5 && solarData.kpIndex <= 7 ? 1 : 0, color: '#F97316' },
    { name: 'Extreme (8-9)', value: solarData.kpIndex > 7 ? 1 : 0, color: '#EF4444' },
  ].filter(item => item.value > 0) : [];

  // Generate correlation scatter plot data
  const scatterData = correlationData ? 
    Object.entries(correlationData.genreCorrelations).map(([genre, correlation]) => ({
      genre,
      correlation: correlation * 100,
      popularity: netflixData?.topGenres.find(g => g.name.toLowerCase() === genre.toLowerCase())?.popularity || 0,
    })) : [];

  const timeSeriesData = generateTimeSeriesData();

  const colors = {
    solar: {
      primary: '#F97316',
      secondary: '#FED7AA',
      gradient: ['#F97316', '#FBBF24'],
    },
    netflix: {
      primary: '#EF4444',
      secondary: '#FECACA',
      gradient: ['#EF4444', '#F87171'],
    },
  };

  const themeColors = currentTheme === 'solar' ? colors.solar : colors.netflix;

  const GENRE_COLORS = [
    '#EF4444', '#F97316', '#FBBF24', '#10B981', '#06B6D4', 
    '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E', '#84CC16'
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-glass animate-pulse">
            <div className="h-8 bg-slate-700 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-8 h-8 mr-3 text-primary-400" />
        Data Visualization
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Correlation Chart */}
        <motion.div variants={itemVariants} className="card-glass">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-400" />
            Real-Time Correlation (24h)
          </h3>
          <HydrationSafeChart className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
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
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="kpIndex"
                  stroke={themeColors.primary}
                  strokeWidth={2}
                  dot={{ fill: themeColors.primary, strokeWidth: 2, r: 4 }}
                  name="Kp-Index"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="popularity"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                  name="Popularity Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </HydrationSafeChart>
        </motion.div>

        {/* Genre Distribution Pie Chart */}
        <motion.div variants={itemVariants} className="card-glass">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-primary-400" />
            Genre Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                  labelLine={false}
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Solar Activity Levels */}
        <motion.div variants={itemVariants} className="card-glass">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-400" />
            Solar Activity Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solarActivityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value">
                  {solarActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Correlation Scatter Plot */}
        <motion.div variants={itemVariants} className="card-glass">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary-400" />
            Genre Correlation Analysis
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number"
                  dataKey="correlation"
                  name="Correlation %"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  type="number"
                  dataKey="popularity"
                  name="Popularity"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name, props) => [
                    name === 'correlation' ? `${Math.round(Number(value) * 10) / 10}%` : value,
                    name === 'correlation' ? 'Correlation' : 'Popularity'
                  ]}
                  labelFormatter={(label, payload) => 
                    payload && payload[0] ? `Genre: ${payload[0].payload.genre}` : ''
                  }
                />
                <Scatter 
                  name="Genres" 
                  dataKey="popularity" 
                  fill={themeColors.primary}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Solar Wind Speed Chart */}
      {solarData && (
        <motion.div variants={itemVariants} className="card-glass">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-400" />
            Solar Wind Parameters
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Speed', value: solarData.solarWind.speed, unit: 'km/s', color: '#F97316' },
                { name: 'Density', value: solarData.solarWind.density, unit: 'p/cm³', color: '#FBBF24' },
                { name: 'Temperature', value: solarData.solarWind.temperature / 1000, unit: 'K (×1000)', color: '#EF4444' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name, props) => [
                    `${value} ${props.payload.unit}`,
                    props.payload.name
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={themeColors.primary}
                  fill={`${themeColors.primary}20`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}