'use client';

import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({ 
  title, 
  icon, 
  children, 
  isLoading = false,
  className = '' 
}: MetricCardProps) {
  return (
    <div className={`metric-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {icon}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="small" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}