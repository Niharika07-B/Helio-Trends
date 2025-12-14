'use client';

import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Bell
} from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import ThemeSelector from './ThemeSelector';

export default function Header() {
  const { 
    isLoading, 
    syncData, 
    unreadCount
  } = useDashboardStore();
  
  const { currentTheme } = useTheme();



  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/80 border-b border-white/10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Title & Status */}
          <div className="flex items-center space-x-6">
            <div>
              <h1 className={`text-2xl font-bold ${
                currentTheme === 'solar' 
                  ? 'text-gradient-solar' 
                  : 'text-gradient-netflix'
              } theme-transition`}>
                HelioTrends
              </h1>
              <p className="text-sm text-slate-400">
                Solar Activity vs Netflix Trends
              </p>
            </div>
            

          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Sync Button */}
            <motion.button
              onClick={syncData}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentTheme === 'solar'
                  ? 'hover:bg-solar-500/20 text-solar-400'
                  : 'hover:bg-netflix-500/20 text-netflix-400'
              } disabled:opacity-50 disabled:cursor-not-allowed theme-transition`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-slate-400" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center ${
                    currentTheme === 'solar' 
                      ? 'bg-solar-500' 
                      : 'bg-netflix-500'
                  } theme-transition`}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>


      </div>
    </header>
  );
}