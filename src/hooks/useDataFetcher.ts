'use client';

import { useState, useEffect, useCallback } from 'react';
import { solarDataService } from '@/services/solarDataService';
import { netflixDataService } from '@/services/netflixDataService';
import { correlationService } from '@/services/correlationService';

export interface SolarData {
  currentKpIndex: number;
  solarFlares: any[];
  geomagneticStorms: any[];
  cmeEvents: any[];
  lastUpdate: Date;
}

export interface NetflixData {
  trendingMovies: any[];
  trendingTv: any[];
  aggregatedScore: number;
  topGenre: string;
  genreDistribution: Record<string, number>;
  lastUpdate: Date;
}

export interface CorrelationData {
  currentCorrelation: number;
  historicalCorrelations: Array<{
    date: string;
    correlation: number;
    solarScore: number;
    netflixScore: number;
  }>;
  genreCorrelations: Record<string, number>;
  anomalyDetected: boolean;
  confidence: number;
  lastAnomalyCheck: string;
  insights: string[];
}

export function useDataFetcher(autoRefresh: boolean = true) {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [netflixData, setNetflixData] = useState<NetflixData | null>(null);
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolarData = useCallback(async () => {
    try {
      const data = await solarDataService.getCurrentData();
      setSolarData(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch solar data:', err);
      throw new Error('Failed to fetch solar weather data');
    }
  }, []);

  const fetchNetflixData = useCallback(async () => {
    try {
      const data = await netflixDataService.getTrendingData();
      setNetflixData(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch Netflix data:', err);
      throw new Error('Failed to fetch trending content data');
    }
  }, []);

  const fetchCorrelationData = useCallback(async (solar?: SolarData, netflix?: NetflixData) => {
    try {
      const data = await correlationService.calculateCorrelations(solar, netflix);
      setCorrelationData(data);
      return data;
    } catch (err) {
      console.error('Failed to calculate correlations:', err);
      throw new Error('Failed to calculate correlation data');
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch solar and Netflix data in parallel
      const [solarResult, netflixResult] = await Promise.all([
        fetchSolarData(),
        fetchNetflixData()
      ]);

      // Calculate correlations with the fresh data
      await fetchCorrelationData(solarResult, netflixResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSolarData, fetchNetflixData, fetchCorrelationData]);

  const refetch = useCallback(() => {
    return fetchAllData();
  }, [fetchAllData]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAllData();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAllData]);

  return {
    solarData,
    netflixData,
    correlationData,
    isLoading,
    error,
    refetch
  };
}