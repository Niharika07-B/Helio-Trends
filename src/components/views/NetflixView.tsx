'use client';

import { motion } from 'framer-motion';
import { Tv, TrendingUp, Star, Play, Film } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
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

export default function NetflixView() {
  const { netflixData, isLoading } = useDashboardStore();
  const { currentTheme } = useTheme();

  const getPopularityColor = (popularity: number) => {
    if (popularity > 2000) return 'text-red-400';
    if (popularity > 1000) return 'text-orange-400';
    if (popularity > 500) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 7) return 'text-yellow-400';
    if (rating >= 6) return 'text-orange-400';
    return 'text-red-400';
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
        <h1 className="text-4xl font-bold mb-2 text-gradient-netflix">
          Netflix Trends
        </h1>
        <p className="text-slate-400 text-lg">
          Popular movies and TV shows
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div variants={itemVariants}>
        <div className="card-netflix">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Tv className="w-8 h-8 mr-3 text-netflix-400" />
              Trending Overview
            </h2>
            {netflixData && (
              <div className="text-netflix-400 font-semibold">
                Score: <ClientNumber value={netflixData.aggregatedScore} decimals={0} fallback="0" />
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
          ) : netflixData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Movies */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Movies</h3>
                  <Film className="w-6 h-6 text-netflix-400" />
                </div>
                <div className="text-3xl font-bold text-netflix-400 mb-2">
                  {netflixData.trendingMovies.length}
                </div>
                <p className="text-sm text-slate-400">
                  Trending titles
                </p>
                {netflixData.trendingMovies[0] && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-300">
                      Top: {netflixData.trendingMovies[0].title}
                    </p>
                  </div>
                )}
              </div>

              {/* TV Shows */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">TV Shows</h3>
                  <Play className="w-6 h-6 text-netflix-400" />
                </div>
                <div className="text-3xl font-bold text-netflix-400 mb-2">
                  {netflixData.trendingTv.length}
                </div>
                <p className="text-sm text-slate-400">
                  Trending series
                </p>
                {netflixData.trendingTv[0] && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-300">
                      Top: {netflixData.trendingTv[0].name}
                    </p>
                  </div>
                )}
              </div>

              {/* Top Genre */}
              <div className="glass-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Top Genre</h3>
                  <TrendingUp className="w-6 h-6 text-netflix-400" />
                </div>
                <div className="text-2xl font-bold text-netflix-400 mb-2">
                  {netflixData.topGenres[0]?.name || 'Unknown'}
                </div>
                <p className="text-sm text-slate-400">
                  {netflixData.topGenres[0]?.count || 0} titles
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-300">
                    Popularity: <ClientNumber value={netflixData.topGenres[0]?.popularity} decimals={0} fallback="0" />
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Tv className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No Netflix data available</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trending Movies */}
      <motion.div variants={itemVariants}>
        <div className="card-netflix">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Film className="w-6 h-6 mr-2 text-netflix-400" />
            Trending Movies
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : netflixData && netflixData.trendingMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {netflixData.trendingMovies.slice(0, 12).map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className={`w-4 h-4 ${getRatingColor(movie.rating)}`} />
                      <span className={`text-xs font-semibold ${getRatingColor(movie.rating)}`}>
                        <ClientNumber value={movie.rating} decimals={1} fallback="0.0" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${getPopularityColor(movie.popularity)}`}>
                      <ClientNumber value={movie.popularity} decimals={0} fallback="0" />
                    </span>
                    <span className="text-xs text-slate-400">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 3).map((genre, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-netflix-500/20 text-netflix-300 rounded">
                        {genre}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Film className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No trending movies available</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trending TV Shows */}
      <motion.div variants={itemVariants}>
        <div className="card-netflix">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Play className="w-6 h-6 mr-2 text-netflix-400" />
            Trending TV Shows
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : netflixData && netflixData.trendingTv.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {netflixData.trendingTv.slice(0, 12).map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {show.name}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className={`w-4 h-4 ${getRatingColor(show.rating)}`} />
                      <span className={`text-xs font-semibold ${getRatingColor(show.rating)}`}>
                        <ClientNumber value={show.rating} decimals={1} fallback="0.0" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${getPopularityColor(show.popularity)}`}>
                      <ClientNumber value={show.popularity} decimals={0} fallback="0" />
                    </span>
                    <span className="text-xs text-slate-400">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {show.genres.slice(0, 3).map((genre, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-netflix-500/20 text-netflix-300 rounded">
                        {genre}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Play className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No trending TV shows available</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Genre Analysis */}
      <motion.div variants={itemVariants}>
        <div className="card-netflix">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-netflix-400" />
            Genre Popularity
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : netflixData && netflixData.topGenres.length > 0 ? (
            <div className="space-y-4">
              {netflixData.topGenres.slice(0, 10).map((genre, index) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{genre.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-netflix-400 font-semibold">
                        <ClientNumber value={genre.popularity} decimals={0} fallback="0" />
                      </span>
                      <span className="text-xs text-slate-400">
                        {genre.count} titles
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-netflix-gradient"
                      style={{ width: `${Math.min((genre.popularity / netflixData.topGenres[0].popularity) * 100, 100)}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No genre data available</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}