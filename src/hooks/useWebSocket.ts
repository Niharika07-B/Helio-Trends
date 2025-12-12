'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';

interface WebSocketMessage {
  type: 'solar_update' | 'netflix_update' | 'correlation_update' | 'notification';
  data: any;
  timestamp: string;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const { 
    setSolarData, 
    setNetflixData, 
    setCorrelationData, 
    addNotification,
    updateLastSyncTime
  } = useDashboardStore();

  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000; // Start with 1 second

  const connect = useCallback(() => {
    try {
      // For development, we'll simulate WebSocket connection
      // In production, this would connect to your WebSocket server
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
      
      // Simulate connection for demo purposes
      setIsConnected(true);
      setReconnectAttempts(0);
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        // Simulate receiving updates
        const updateType = Math.random();
        
        if (updateType < 0.3) {
          // Simulate solar data update
          addNotification({
            type: 'info',
            title: '🌞 Solar Data Updated',
            message: 'New solar activity data received',
            autoHide: true,
          });
        } else if (updateType < 0.6) {
          // Simulate Netflix data update
          addNotification({
            type: 'info',
            title: '📺 Netflix Trends Updated',
            message: 'New trending content data received',
            autoHide: true,
          });
        }
        
        updateLastSyncTime();
      }, 30000); // Every 30 seconds
      
      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
      
      /* Real WebSocket implementation would look like this:
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
        setSocket(ws);
        
        addNotification({
          type: 'success',
          title: '🔗 Connected',
          message: 'Real-time data connection established',
          autoHide: true,
        });
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'solar_update':
              setSolarData(message.data);
              addNotification({
                type: 'info',
                title: '🌞 Solar Data Updated',
                message: 'New solar activity data received',
                autoHide: true,
              });
              break;
              
            case 'netflix_update':
              setNetflixData(message.data);
              addNotification({
                type: 'info',
                title: '📺 Netflix Trends Updated',
                message: 'New trending content data received',
                autoHide: true,
              });
              break;
              
            case 'correlation_update':
              setCorrelationData(message.data);
              break;
              
            case 'notification':
              addNotification(message.data);
              break;
          }
          
          updateLastSyncTime();
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = reconnectDelay * Math.pow(2, reconnectAttempts);
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        } else {
          addNotification({
            type: 'error',
            title: '🔌 Connection Failed',
            message: 'Unable to establish real-time connection after multiple attempts',
            autoHide: false,
          });
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addNotification({
          type: 'error',
          title: '⚠️ Connection Error',
          message: 'Real-time data connection encountered an error',
          autoHide: true,
        });
      };
      
      return () => {
        ws.close();
      };
      */
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  }, [reconnectAttempts, setSolarData, setNetflixData, setCorrelationData, addNotification, updateLastSyncTime]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    setIsConnected(false);
    setSocket(null);
  }, [socket]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  useEffect(() => {
    const cleanup = connect();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    reconnectAttempts,
  };
}