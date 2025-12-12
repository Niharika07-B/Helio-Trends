'use client';

import { useState, useEffect } from 'react';

interface ClientNumberProps {
  value?: number | null;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  fallback?: string;
}

export default function ClientNumber({ 
  value, 
  decimals = 1, 
  suffix = '',
  prefix = '',
  className = '',
  fallback = '0'
}: ClientNumberProps) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(fallback);

  useEffect(() => {
    setMounted(true);
    
    if (value !== null && value !== undefined) {
      const formattedValue = typeof value === 'number' ? value.toFixed(decimals) : fallback;
      setDisplayValue(`${prefix}${formattedValue}${suffix}`);
    } else {
      setDisplayValue(fallback);
    }
  }, [value, decimals, suffix, prefix, fallback]);

  // Prevent hydration mismatch by showing fallback until mounted
  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{displayValue}</span>;
}