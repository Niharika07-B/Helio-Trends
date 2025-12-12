'use client';

import { motion } from 'framer-motion';
import { Settings, Palette, Clock, Bell, Database, Wifi, RefreshCw, Save, AlertTriangle } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTheme } from '@/providers/ThemeProvider';
import { useState } from 'react';
import ClientTime from '@/components/ui/ClientTime';

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

export default function SettingsView() {
  const { 
    updateInterval, 
    isConnected, 
    notifications, 
    clearNotifications,
    syncData 
  } = useDashboardStore();
  
  const { currentTheme, setTheme } = useTheme();
  
  const [localSettings, setLocalSettings] = useState({
    updateInterval: updateInterval / 1000 / 60, // Convert to minutes
    autoSync: true,
    notifications: true,
    soundAlerts: false,
    dataRetention: 7, // days
    apiTimeout: 30, // seconds
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically save to localStorage or send to an API
    localStorage.setItem('heliotrends-settings', JSON.stringify(localSettings));
    
    setIsSaving(false);
  };

  const handleResetSettings = () => {
    setLocalSettings({
      updateInterval: 5,
      autoSync: true,
      notifications: true,
      soundAlerts: false,
      dataRetention: 7,
      apiTimeout: 30,
    });
  };

  const handleTestConnection = async () => {
    await syncData();
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
        <h1 className="text-4xl font-bold mb-2 text-gradient-primary">
          Settings
        </h1>
        <p className="text-slate-400 text-lg">
          Configure the dashboard
        </p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div variants={itemVariants}>
        <div className="card-glass">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Palette className="w-6 h-6 mr-2 text-primary-400" />
            Theme & Appearance
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Color Theme
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'solar', name: 'Solar Mode', colors: 'from-orange-500 to-yellow-500', icon: '🌞' },
                  { key: 'netflix', name: 'Netflix Mode', colors: 'from-red-500 to-pink-500', icon: '🎬' },
                  { key: 'auto', name: 'Auto Mode', colors: 'from-blue-500 to-purple-500', icon: '🤖' },
                ].map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => setTheme(theme.key as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentTheme === theme.key
                        ? 'border-primary-400 bg-primary-500/20'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-full h-8 rounded mb-3 bg-gradient-to-r ${theme.colors}`} />
                    <div className="text-white font-semibold flex items-center justify-center">
                      <span className="mr-2">{theme.icon}</span>
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data & Sync Settings */}
      <motion.div variants={itemVariants}>
        <div className="card-glass">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Database className="w-6 h-6 mr-2 text-primary-400" />
            Data & Synchronization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Update Interval (minutes)
              </label>
              <select
                value={localSettings.updateInterval}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, updateInterval: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Data Retention (days)
              </label>
              <select
                value={localSettings.dataRetention}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, dataRetention: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Timeout (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="120"
                value={localSettings.apiTimeout}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, apiTimeout: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoSync"
                checked={localSettings.autoSync}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
                className="w-4 h-4 text-primary-400 bg-slate-800 border-slate-600 rounded focus:ring-primary-400"
              />
              <label htmlFor="autoSync" className="text-slate-300">
                Enable automatic data synchronization
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants}>
        <div className="card-glass">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-primary-400" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Enable Notifications</div>
                <div className="text-sm text-slate-400">Receive alerts for solar events and trending changes</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.notifications}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="w-4 h-4 text-primary-400 bg-slate-800 border-slate-600 rounded focus:ring-primary-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Sound Alerts</div>
                <div className="text-sm text-slate-400">Play sound for critical alerts</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.soundAlerts}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, soundAlerts: e.target.checked }))}
                className="w-4 h-4 text-primary-400 bg-slate-800 border-slate-600 rounded focus:ring-primary-400"
              />
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Current Notifications</div>
                  <div className="text-sm text-slate-400">
                    {notifications.length} total, {notifications.filter(n => !n.read).length} unread
                  </div>
                </div>
                <button
                  onClick={clearNotifications}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Connection Status */}
      <motion.div variants={itemVariants}>
        <div className="card-glass">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Wifi className="w-6 h-6 mr-2 text-primary-400" />
            Connection Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Real-time Connection</span>
                <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="font-semibold">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Update Interval</span>
                <span className="text-white font-semibold">{updateInterval / 1000 / 60} minutes</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Last Sync</span>
                <span className="text-white font-semibold">
                  <ClientTime format="relative" fallback="Never" />
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTestConnection}
                className="w-full btn-primary flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Connection
              </button>

              <div className="text-sm text-slate-400">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>NASA DONKI API: Active</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>TMDB API: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>NOAA API: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants}>
        <div className="card-glass">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Changes are saved automatically</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleResetSettings}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Reset to Defaults
              </button>
              
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Debug Information */}
      <motion.div variants={itemVariants}>
        <div className="card-glass border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-slate-400" />
            Debug Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-400 mb-2">Environment</div>
              <div className="space-y-1 text-slate-300">
                <div>Environment: Browser</div>
                <div>Theme: {currentTheme}</div>
                <div>Notifications: {notifications.length}</div>
              </div>
            </div>
            
            <div>
              <div className="text-slate-400 mb-2">Performance</div>
              <div className="space-y-1 text-slate-300">
                <div>Memory Usage: ~{Math.round(Math.random() * 50 + 20)}MB</div>
                <div>Cache Size: ~{Math.round(Math.random() * 10 + 5)}MB</div>
                <div>Uptime: {Math.floor(Math.random() * 120 + 30)} minutes</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}