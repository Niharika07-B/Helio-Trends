'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Sun,
  Tv,
  Brain,
  Zap
} from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import ClientTime from './ui/ClientTime';

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    clearNotifications 
  } = useDashboardStore();
  
  const { currentTheme } = useTheme();

  const getNotificationIcon = (type: string, title: string) => {
    if (title.includes('Solar') || title.includes('🌞')) {
      return <Sun className="w-4 h-4 text-orange-400" />;
    }
    if (title.includes('Netflix') || title.includes('📺')) {
      return <Tv className="w-4 h-4 text-red-400" />;
    }
    if (title.includes('Correlation') || title.includes('📈')) {
      return <Brain className="w-4 h-4 text-blue-400" />;
    }
    if (title.includes('Anomaly') || title.includes('🔍')) {
      return <Zap className="w-4 h-4 text-purple-400" />;
    }

    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'border-l-blue-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      case 'success':
        return 'border-l-green-500';
      default:
        return 'border-l-slate-500';
    }
  };

  return (
    <>
      {/* Notification Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-200 ${
          currentTheme === 'solar'
            ? 'bg-solar-gradient hover:shadow-glow-md'
            : 'bg-netflix-gradient hover:shadow-xl'
        } theme-transition`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 glass-dark border-l border-white/20 z-40 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <p className="text-sm text-slate-400">
                      {unreadCount} unread
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No notifications yet</p>
                      <p className="text-sm text-slate-500 mt-2">
                        You'll see real-time updates here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`notification ${getNotificationBorderColor(notification.type)} ${
                            !notification.read ? 'bg-white/5' : 'bg-transparent'
                          } cursor-pointer`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type, notification.title)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className={`text-sm font-medium ${
                                  !notification.read ? 'text-white' : 'text-slate-300'
                                }`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${
                                    currentTheme === 'solar' ? 'bg-solar-400' : 'bg-netflix-400'
                                  } theme-transition`} />
                                )}
                              </div>
                              
                              <p className={`text-xs mt-1 ${
                                !notification.read ? 'text-slate-300' : 'text-slate-400'
                              }`}>
                                {notification.message}
                              </p>
                              
                              <p className="text-xs text-slate-500 mt-2">
                                <ClientTime date={notification.timestamp} format="relative" fallback="Just now" />
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="text-xs text-slate-500 text-center">
                  <p>Real-time notifications enabled</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}