'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Sun, 
  Tv, 
  Box, 
  Brain, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Main Overview'
  },
  {
    id: 'solar',
    label: 'Solar Activity',
    icon: Sun,
    description: 'Space Weather Data'
  },
  {
    id: 'netflix',
    label: 'Netflix Trends',
    icon: Tv,
    description: 'Popular Shows & Movies'
  },
  {
    id: 'insights',
    label: 'Analysis',
    icon: Brain,
    description: 'Data Insights'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'App Settings'
  }
] as const;

export default function Sidebar() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    activeSection, 
    setActiveSection,
    solarData,
    netflixData,
    isConnected
  } = useDashboardStore();
  
  const { currentTheme } = useTheme();

  const getActivityIndicator = (sectionId: string) => {
    switch (sectionId) {
      case 'solar':
        if (!solarData) return null;
        const level = solarData.activityLevel;
        const colors = {
          LOW: 'bg-green-500',
          MODERATE: 'bg-yellow-500',
          HIGH: 'bg-orange-500',
          EXTREME: 'bg-red-500'
        };
        return (
          <div className={`w-2 h-2 rounded-full ${colors[level]} animate-pulse`} />
        );
      
      case 'netflix':
        if (!netflixData) return null;
        const isHot = netflixData.aggregatedScore > 1000;
        return isHot ? (
          <TrendingUp className="w-3 h-3 text-red-400 animate-pulse" />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className={`h-full sidebar ${
          currentTheme === 'solar' 
            ? 'bg-gradient-to-b from-slate-900/95 to-orange-900/20' 
            : 'bg-gradient-to-b from-slate-900/95 to-red-900/20'
        } theme-transition`}>
          
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    currentTheme === 'solar' 
                      ? 'bg-solar-gradient' 
                      : 'bg-netflix-gradient'
                  } theme-transition`}>
                    {currentTheme === 'solar' ? (
                      <Sun className="w-4 h-4 text-white" />
                    ) : (
                      <Zap className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">HelioTrends</h1>

                  </div>
                </motion.div>
              )}
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="px-4 py-2">
            <div className={`flex items-center space-x-2 text-xs ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              {sidebarOpen && (
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const activityIndicator = getActivityIndicator(item.id);

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full sidebar-item ${isActive ? 'active' : ''} ${
                    isActive && currentTheme === 'solar' ? 'bg-solar-500/20 text-solar-300' : ''
                  } ${
                    isActive && currentTheme === 'netflix' ? 'bg-netflix-500/20 text-netflix-300' : ''
                  } theme-transition`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${
                        isActive 
                          ? currentTheme === 'solar' 
                            ? 'text-solar-400' 
                            : 'text-netflix-400'
                          : 'text-slate-400'
                      } theme-transition`} />
                      {activityIndicator && (
                        <div className="absolute -top-1 -right-1">
                          {activityIndicator}
                        </div>
                      )}
                    </div>
                    
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 text-left"
                      >
                        <div className={`font-medium ${
                          isActive ? 'text-white' : 'text-slate-300'
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 border-t border-white/10"
            >
              <div className="text-xs text-slate-500 text-center">
                <p>Solar Activity vs</p>
                <p>Netflix Trends</p>
                <div className="mt-2 flex items-center justify-center space-x-1">
                  <div className={`w-1 h-1 rounded-full ${
                    currentTheme === 'solar' ? 'bg-solar-400' : 'bg-netflix-400'
                  } animate-pulse theme-transition`} />
                  <div className={`w-1 h-1 rounded-full ${
                    currentTheme === 'solar' ? 'bg-solar-400' : 'bg-netflix-400'
                  } animate-pulse theme-transition`} style={{ animationDelay: '0.2s' }} />
                  <div className={`w-1 h-1 rounded-full ${
                    currentTheme === 'solar' ? 'bg-solar-400' : 'bg-netflix-400'
                  } animate-pulse theme-transition`} style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}