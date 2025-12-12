'use client';

import { useState, useEffect } from 'react';

interface ClientTimeProps {
  date?: Date | string;
  format?: 'time' | 'timeWithSeconds' | 'relative';
  className?: string;
  fallback?: string;
}

export default function ClientTime({ 
  date, 
  format = 'time', 
  className = '',
  fallback = '--:--'
}: ClientTimeProps) {
  const [mounted, setMounted] = useState(false);
  const [timeString, setTimeString] = useState(fallback);

  useEffect(() => {
    setMounted(true);
    
    const updateTime = () => {
      const targetDate = date ? new Date(date) : new Date();
      
      switch (format) {
        case 'timeWithSeconds':
          setTimeString(targetDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }));
          break;
        case 'relative':
          const now = new Date();
          const diff = now.getTime() - targetDate.getTime();
          const minutes = Math.floor(diff / 60000);
          
          if (minutes < 1) {
            setTimeString('Just now');
          } else if (minutes < 60) {
            setTimeString(`${minutes}m ago`);
          } else {
            const hours = Math.floor(minutes / 60);
            setTimeString(`${hours}h ago`);
          }
          break;
        case 'time':
        default:
          setTimeString(targetDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
          }));
          break;
      }
    };

    updateTime();
    
    // Update every minute for relative times
    if (format === 'relative') {
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [date, format]);

  // Prevent hydration mismatch by showing fallback until mounted
  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{timeString}</span>;
}