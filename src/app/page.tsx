'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/views/DashboardView';
import SolarView from '@/components/views/SolarView';
import NetflixView from '@/components/views/NetflixView';
import InsightsView from '@/components/views/InsightsView';
import SettingsView from '@/components/views/SettingsView';
import NotificationPanel from '@/components/NotificationPanel';
import LoadingOverlay from '@/components/LoadingOverlay';
import Footer from '@/components/Footer';
import { useWebSocket } from '@/hooks/useWebSocket';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export default function Dashboard() {
  const { 
    activeSection, 
    sidebarOpen, 
    isLoading, 
    error, 
    syncData, 
    setConnected 
  } = useDashboardStore();
  
  const { currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Initialize WebSocket connection
  const { isConnected } = useWebSocket();
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    if (mounted) {
      syncData();
    }
  }, [syncData, mounted]);
  
  // Update connection status
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected, setConnected]);

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'solar':
        return <SolarView />;
      case 'netflix':
        return <NetflixView />;

      case 'insights':
        return <InsightsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      currentTheme === 'solar' 
        ? 'from-slate-900 via-orange-900/20 to-slate-900' 
        : 'from-slate-900 via-red-900/20 to-slate-900'
    } theme-transition`} suppressHydrationWarning>
      
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-6">
          <motion.div
            key={activeSection}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-[calc(100vh-8rem)]"
          >
            {error ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Connection Error
                  </h2>
                  <p className="text-slate-400 mb-6 max-w-md">
                    {error}
                  </p>
                  <button
                    onClick={syncData}
                    className="btn-primary"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            ) : (
              renderActiveView()
            )}
          </motion.div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated background particles */}
        <div className={`absolute inset-0 opacity-20 ${
          currentTheme === 'solar' 
            ? 'bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10' 
            : 'bg-gradient-to-br from-red-500/10 via-transparent to-pink-500/10'
        } theme-transition`} />
        
        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 rounded-full blur-xl ${
              currentTheme === 'solar' 
                ? 'bg-orange-500/20' 
                : 'bg-red-500/20'
            } theme-transition`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}