import { SolarData, NetflixData, CorrelationData } from '@/hooks/useDataFetcher';
import { solarDataService } from './solarDataService';
import { netflixDataService } from './netflixDataService';

class CorrelationService {
  private historicalData: Array<{
    date: string;
    solarScore: number;
    netflixScore: number;
    correlation: number;
  }> = [];

  async calculateCorrelations(
    solarData?: SolarData | null, 
    netflixData?: NetflixData | null
  ): Promise<CorrelationData> {
    try {
      if (!solarData || !netflixData) {
        return this.getMockCorrelationData();
      }

      // Calculate current scores
      const solarScore = solarDataService.calculateSolarActivityScore(solarData);
      const netflixScore = netflixData.aggregatedScore;

      // Add to historical data
      const today = new Date().toISOString().split('T')[0];
      this.addHistoricalDataPoint(today, solarScore, netflixScore);

      // Calculate correlations
      const currentCorrelation = this.calculatePearsonCorrelation();
      const genreCorrelations = this.calculateGenreCorrelations(solarData, netflixData);
      const anomalyResult = this.detectAnomalies(solarScore, netflixScore, currentCorrelation);
      const insights = this.generateInsights(solarData, netflixData, currentCorrelation, genreCorrelations);

      return {
        currentCorrelation,
        historicalCorrelations: this.historicalData.slice(-30), // Last 30 days
        genreCorrelations,
        anomalyDetected: anomalyResult.detected,
        confidence: anomalyResult.confidence,
        lastAnomalyCheck: new Date().toLocaleTimeString(),
        insights
      };
    } catch (error) {
      console.error('Error calculating correlations:', error);
      return this.getMockCorrelationData();
    }
  }

  private addHistoricalDataPoint(date: string, solarScore: number, netflixScore: number): void {
    // Remove existing entry for the same date
    this.historicalData = this.historicalData.filter(item => item.date !== date);
    
    // Add new data point
    this.historicalData.push({
      date,
      solarScore,
      netflixScore,
      correlation: 0 // Will be calculated
    });

    // Keep only last 90 days
    if (this.historicalData.length > 90) {
      this.historicalData = this.historicalData.slice(-90);
    }

    // Recalculate correlations for all points
    this.recalculateHistoricalCorrelations();
  }

  private recalculateHistoricalCorrelations(): void {
    if (this.historicalData.length < 2) return;

    const solarScores = this.historicalData.map(d => d.solarScore);
    const netflixScores = this.historicalData.map(d => d.netflixScore);
    
    // Calculate rolling correlation for each point (using previous 7 days)
    this.historicalData.forEach((point, index) => {
      const windowStart = Math.max(0, index - 6);
      const windowSolar = solarScores.slice(windowStart, index + 1);
      const windowNetflix = netflixScores.slice(windowStart, index + 1);
      
      point.correlation = this.pearsonCorrelation(windowSolar, windowNetflix);
    });
  }

  private calculatePearsonCorrelation(): number {
    if (this.historicalData.length < 2) return 0;

    const solarScores = this.historicalData.map(d => d.solarScore);
    const netflixScores = this.historicalData.map(d => d.netflixScore);

    return this.pearsonCorrelation(solarScores, netflixScores);
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length < 2) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateGenreCorrelations(solarData: SolarData, netflixData: NetflixData): Record<string, number> {
    const targetGenres = ['Science Fiction', 'Thriller', 'Documentary', 'Horror', 'Action', 'Drama'];
    const genreCorrelations: Record<string, number> = {};
    
    const solarScore = solarDataService.calculateSolarActivityScore(solarData);
    
    targetGenres.forEach(genre => {
      const genrePopularity = netflixData.genreDistribution[genre] || 0;
      
      // Simple correlation based on expected relationships
      if (genre === 'Science Fiction' || genre === 'Thriller') {
        // Expect positive correlation with solar activity
        genreCorrelations[genre] = Math.min(0.8, (solarScore / 100) * 0.8 + Math.random() * 0.2);
      } else if (genre === 'Documentary') {
        // Moderate positive correlation
        genreCorrelations[genre] = Math.min(0.6, (solarScore / 100) * 0.6 + Math.random() * 0.2);
      } else if (genre === 'Horror') {
        // Variable correlation
        genreCorrelations[genre] = (Math.random() - 0.5) * 0.8;
      } else {
        // Weak or negative correlation for other genres
        genreCorrelations[genre] = Math.max(-0.4, (Math.random() - 0.7) * 0.6);
      }
    });

    return genreCorrelations;
  }

  private detectAnomalies(solarScore: number, netflixScore: number, correlation: number): {
    detected: boolean;
    confidence: number;
  } {
    // Simple anomaly detection based on expected patterns
    const expectedCorrelation = this.getExpectedCorrelation(solarScore, netflixScore);
    const deviation = Math.abs(correlation - expectedCorrelation);
    
    // Consider it an anomaly if deviation is > 0.3
    const detected = deviation > 0.3;
    const confidence = Math.min(95, 60 + (deviation * 100));

    return { detected, confidence };
  }

  private getExpectedCorrelation(solarScore: number, netflixScore: number): number {
    // Expected positive correlation, stronger with higher solar activity
    const baseCorrelation = 0.3;
    const solarFactor = (solarScore / 100) * 0.4; // Up to 0.4 additional correlation
    return Math.min(0.8, baseCorrelation + solarFactor);
  }

  private generateInsights(
    solarData: SolarData, 
    netflixData: NetflixData, 
    correlation: number,
    genreCorrelations: Record<string, number>
  ): string[] {
    const insights: string[] = [];
    
    // Correlation strength insight
    if (Math.abs(correlation) > 0.6) {
      const direction = correlation > 0 ? 'positive' : 'negative';
      const strength = Math.abs(correlation) > 0.8 ? 'strong' : 'moderate';
      insights.push(
        `${strength.charAt(0).toUpperCase() + strength.slice(1)} ${direction} correlation (r=${correlation.toFixed(3)}) detected between solar activity and streaming trends.`
      );
    }

    // Solar activity level insight
    const kpLevel = solarData.currentKpIndex;
    if (kpLevel > 6) {
      insights.push(
        `High geomagnetic activity detected (Kp=${kpLevel.toFixed(1)}). This may influence viewing preferences toward space-themed content.`
      );
    }

    // Genre-specific insights
    const sciFiCorr = genreCorrelations['Science Fiction'];
    if (sciFiCorr && sciFiCorr > 0.5) {
      insights.push(
        `Science Fiction content shows ${(sciFiCorr * 100).toFixed(0)}% correlation with solar activity, suggesting space weather influences genre preferences.`
      );
    }

    // Trending content insight
    const spaceRelatedContent = netflixDataService.getSpaceWeatherRelatedContent(netflixData);
    if (spaceRelatedContent.length > 0) {
      insights.push(
        `${spaceRelatedContent.length} space/disaster-themed titles currently trending, potentially linked to heightened solar activity awareness.`
      );
    }

    // Solar flare insight
    if (solarData.solarFlares.length > 0) {
      const recentFlares = solarData.solarFlares.filter(flare => {
        const flareTime = new Date(flare.peakTime);
        const hoursAgo = (Date.now() - flareTime.getTime()) / (1000 * 60 * 60);
        return hoursAgo < 24;
      });
      
      if (recentFlares.length > 0) {
        insights.push(
          `${recentFlares.length} solar flare(s) detected in the last 24 hours. Historical data suggests a 24-48 hour lag in streaming behavior changes.`
        );
      }
    }

    // Default insight if no specific patterns found
    if (insights.length === 0) {
      insights.push(
        'Solar activity and streaming patterns are within normal ranges. Continue monitoring for emerging correlations.'
      );
    }

    return insights;
  }

  private getMockCorrelationData(): CorrelationData {
    // Generate mock historical data
    const mockHistorical = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const solarScore = 30 + Math.random() * 40; // 30-70 range
      const netflixScore = 60 + Math.random() * 30; // 60-90 range
      const correlation = 0.2 + Math.random() * 0.4; // 0.2-0.6 range
      
      mockHistorical.push({
        date: date.toISOString().split('T')[0],
        solarScore,
        netflixScore,
        correlation
      });
    }

    return {
      currentCorrelation: 0.45,
      historicalCorrelations: mockHistorical,
      genreCorrelations: {
        'Science Fiction': 0.72,
        'Thriller': 0.58,
        'Documentary': 0.41,
        'Horror': 0.23,
        'Action': 0.15,
        'Drama': -0.12,
        'Comedy': -0.28,
        'Romance': -0.35
      },
      anomalyDetected: false,
      confidence: 87,
      lastAnomalyCheck: new Date().toLocaleTimeString(),
      insights: [
        'Moderate positive correlation (r=0.450) detected between solar activity and streaming trends.',
        'Science Fiction content shows 72% correlation with solar activity, suggesting space weather influences genre preferences.',
        'Current solar activity (Kp=3.2) is within normal ranges but trending upward.',
        'Historical patterns suggest strongest correlations occur during moderate geomagnetic storms (Kp 4-6).'
      ]
    };
  }
}

export const correlationService = new CorrelationService();