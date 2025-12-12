'use client';

import { useState, useEffect, ReactNode } from 'react';

interface HydrationSafeChartProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export default function HydrationSafeChart({ 
  children, 
  fallback = <div className="h-64 bg-slate-800 rounded-lg animate-pulse" />,
  className = ""
}: HydrationSafeChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={className}>{children}</div>;
}