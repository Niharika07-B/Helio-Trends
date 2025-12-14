import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SolarData {
  kpIndex: number;
  estimatedKp: number;
  activityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  solarFlares: Array<{
    id: string;
    classType: string;
    peakTime: string;
    intensity: number;
  }>;
  cmeEvents: Array<{
    id: string;
    startTime: string;
    speed: number;
    direction: string;
  }>;
  solarWind: {
    speed: number;
    density: number;
    temperature: number;
  };
  lastUpdate: string;
}

export interface NetflixData {
  trendingMovies: Array<{
    id: number;
    title: string;
    popularity: number;
    genres: string[];
    rating: number;
  }>;
  trendingTv: Array<{
    id: number;
    name: string;
    popularity: number;
    genres: string[];
    rating: number;
  }>;
  topGenres: Array<{
    name: string;
    count: number;
    popularity: number;
  }>;
  aggregatedScore: number;
  lastUpdate: string;
}

export interface CorrelationData {
  coefficient: number;
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
  significance: number;
  genreCorrelations: Record<string, number>;
  anomalies: Array<{
    timestamp: string;
    type: string;
    description: string;
    confidence: number;
  }>;
  insights: string[];
  lastCalculated: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  autoHide?: boolean;
}

interface DashboardState {
  // Data
  solarData: SolarData | null;
  netflixData: NetflixData | null;
  correlationData: CorrelationData | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  lastSyncTime: string | null;
  
  // Sidebar
  sidebarOpen: boolean;
  activeSection: 'dashboard' | 'solar' | 'netflix' | 'insights' | 'settings';
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Real-time updates
  isConnected: boolean;
  updateInterval: number;
  
  // Actions
  setSolarData: (data: SolarData) => void;
  setNetflixData: (data: NetflixData) => void;
  setCorrelationData: (data: CorrelationData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveSection: (section: DashboardState['activeSection']) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setConnected: (connected: boolean) => void;
  updateLastSyncTime: () => void;
  syncData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    solarData: null,
    netflixData: null,
    correlationData: null,
    isLoading: false,
    error: null,
    lastSyncTime: null,
    sidebarOpen: true,
    activeSection: 'dashboard',
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    updateInterval: 300000, // 5 minutes

    // Actions
    setSolarData: (data) => {
      set({ solarData: data });
      
      // Add notification for significant solar activity
      if (data.activityLevel === 'HIGH' || data.activityLevel === 'EXTREME') {
        get().addNotification({
          type: 'warning',
          title: '⚠️ Solar Storm Alert',
          message: `${data.activityLevel.toLowerCase()} geomagnetic activity detected (Kp: ${data.kpIndex})`,
          autoHide: false,
        });
      }
      
      // Check for new solar flares
      const currentFlares = get().solarData?.solarFlares || [];
      const newFlares = data.solarFlares.filter(
        flare => !currentFlares.some(existing => existing.id === flare.id)
      );
      
      newFlares.forEach(flare => {
        get().addNotification({
          type: 'info',
          title: '🌞 New Solar Flare',
          message: `${flare.classType} class flare detected at ${new Date(flare.peakTime).toLocaleTimeString()}`,
          autoHide: true,
        });
      });
    },

    setNetflixData: (data) => {
      const previousData = get().netflixData;
      set({ netflixData: data });
      
      // Check for trending changes
      if (previousData) {
        const previousTop = previousData.trendingMovies[0]?.title || previousData.trendingTv[0]?.name;
        const currentTop = data.trendingMovies[0]?.title || data.trendingTv[0]?.name;
        
        if (previousTop !== currentTop && currentTop) {
          get().addNotification({
            type: 'success',
            title: '🔥 New Trending Leader',
            message: `"${currentTop}" is now the top trending content`,
            autoHide: true,
          });
        }
      }
      
      // Check for genre shifts
      if (previousData && data.topGenres.length > 0) {
        const previousTopGenre = previousData.topGenres[0]?.name;
        const currentTopGenre = data.topGenres[0]?.name;
        
        if (previousTopGenre !== currentTopGenre) {
          get().addNotification({
            type: 'info',
            title: '📊 Genre Shift Detected',
            message: `${currentTopGenre} is now the most popular genre`,
            autoHide: true,
          });
        }
      }
    },

    setCorrelationData: (data) => {
      set({ correlationData: data });
      
      // Add notifications for anomalies
      data.anomalies.forEach(anomaly => {
        get().addNotification({
          type: 'warning',
          title: '🔍 Anomaly Detected',
          message: anomaly.description,
          autoHide: false,
        });
      });
      
      // Notify about strong correlations
      if (Math.abs(data.coefficient) > 0.7) {
        get().addNotification({
          type: 'success',
          title: '📈 Strong Correlation Found',
          message: `${data.strength.toLowerCase()} correlation detected (r=${data.coefficient.toFixed(3)})`,
          autoHide: true,
        });
      }
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setActiveSection: (section) => set({ activeSection: section }),

    addNotification: (notification) => {
      const id = Date.now().toString();
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      set(state => ({
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
        unreadCount: state.unreadCount + 1,
      }));
      
      // Auto-hide notifications after 5 seconds
      if (notification.autoHide !== false) {
        setTimeout(() => {
          get().markNotificationRead(id);
        }, 5000);
      }
    },

    markNotificationRead: (id) => {
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    },

    clearNotifications: () => {
      set({ notifications: [], unreadCount: 0 });
    },

    setConnected: (connected) => {
      const wasConnected = get().isConnected;
      set({ isConnected: connected });
      
      if (!wasConnected && connected) {
        get().addNotification({
          type: 'success',
          title: '🔗 Connected',
          message: 'Real-time data connection established',
          autoHide: true,
        });
      } else if (wasConnected && !connected) {
        get().addNotification({
          type: 'error',
          title: '🔌 Connection Lost',
          message: 'Real-time data connection interrupted',
          autoHide: false,
        });
      }
    },

    updateLastSyncTime: () => {
      set({ lastSyncTime: new Date().toISOString() });
    },

    syncData: async () => {
      const { setLoading, setError, setSolarData, setNetflixData, setCorrelationData, updateLastSyncTime } = get();
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel using server-side API routes
        const [solarResponse, netflixResponse] = await Promise.all([
          fetch('/api/solar-data'),
          fetch('/api/netflix-data'),
        ]);
        
        if (!solarResponse.ok || !netflixResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const [solarData, netflixData] = await Promise.all([
          solarResponse.json(),
          netflixResponse.json(),
        ]);
        
        setSolarData(solarData);
        setNetflixData(netflixData);
        
        // Calculate correlations using server-side API
        const correlationResponse = await fetch('/api/correlations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ solarData, netflixData }),
        });
        
        if (correlationResponse.ok) {
          const correlationData = await correlationResponse.json();
          setCorrelationData(correlationData);
        }
        
        updateLastSyncTime();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    },
  }))
);

// Subscribe to data changes for auto-sync
useDashboardStore.subscribe(
  (state) => state.isConnected,
  (isConnected) => {
    if (isConnected) {
      // Start auto-sync when connected
      const interval = setInterval(() => {
        useDashboardStore.getState().syncData();
      }, useDashboardStore.getState().updateInterval);
      
      return () => clearInterval(interval);
    }
  }
);