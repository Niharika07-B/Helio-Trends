import { SolarData } from '@/hooks/useDataFetcher';

class SolarDataService {
  private readonly NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
  private readonly NASA_BASE_URL = 'https://api.nasa.gov/DONKI';
  private readonly NOAA_BASE_URL = 'https://services.swpc.noaa.gov/json';

  async getCurrentData(): Promise<SolarData> {
    try {
      const today = new Date();
      const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      // Fetch data from multiple sources in parallel
      const [kpData, flareData, stormData, cmeData] = await Promise.all([
        this.fetchKpIndex(),
        this.fetchSolarFlares(startDate, today),
        this.fetchGeomagneticStorms(startDate, today),
        this.fetchCMEEvents(startDate, today)
      ]);

      return {
        currentKpIndex: this.extractCurrentKpIndex(kpData),
        solarFlares: flareData,
        geomagneticStorms: stormData,
        cmeEvents: cmeData,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error fetching solar data:', error);
      // Return mock data for development
      return this.getMockSolarData();
    }
  }

  private async fetchKpIndex(): Promise<any[]> {
    const response = await fetch(`${this.NOAA_BASE_URL}/planetary_k_index_1m.json`);
    if (!response.ok) throw new Error('Failed to fetch Kp-index data');
    return response.json();
  }

  private async fetchSolarFlares(startDate: Date, endDate: Date): Promise<any[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${this.NASA_BASE_URL}/FLR?startDate=${start}&endDate=${end}&api_key=${this.NASA_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch solar flare data');
    return response.json();
  }

  private async fetchGeomagneticStorms(startDate: Date, endDate: Date): Promise<any[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${this.NASA_BASE_URL}/GST?startDate=${start}&endDate=${end}&api_key=${this.NASA_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch geomagnetic storm data');
    return response.json();
  }

  private async fetchCMEEvents(startDate: Date, endDate: Date): Promise<any[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${this.NASA_BASE_URL}/CME?startDate=${start}&endDate=${end}&api_key=${this.NASA_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch CME data');
    return response.json();
  }

  private extractCurrentKpIndex(kpData: any[]): number {
    if (!kpData || kpData.length === 0) return 2.5; // Default moderate value
    
    // Get the most recent Kp value
    const latest = kpData[kpData.length - 1];
    return parseFloat(latest.kp_index) || 2.5;
  }

  private getMockSolarData(): SolarData {
    // Mock data for development/demo purposes
    const mockKpIndex = 3.2 + Math.random() * 2; // Random value between 3.2 and 5.2
    
    return {
      currentKpIndex: mockKpIndex,
      solarFlares: [
        {
          flrID: 'mock-flr-001',
          beginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          peakTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          classType: 'M2.1',
          sourceLocation: 'S15W30',
          activeRegionNum: 3234
        }
      ],
      geomagneticStorms: [
        {
          gstID: 'mock-gst-001',
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          allKpIndex: [
            {
              observedTime: new Date().toISOString(),
              kpIndex: mockKpIndex,
              source: 'NOAA'
            }
          ]
        }
      ],
      cmeEvents: [
        {
          cmeID: 'mock-cme-001',
          startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          sourceLocation: 'S15W30',
          note: 'Mock CME event for development',
          speed: 450,
          type: 'C'
        }
      ],
      lastUpdate: new Date()
    };
  }

  // Utility method to convert solar flare class to numeric score
  flareClassToScore(flareClass: string): number {
    const classMap: Record<string, number> = {
      'A': 1, 'B': 2, 'C': 3, 'M': 4, 'X': 5
    };
    
    const baseScore = classMap[flareClass[0]] || 0;
    const magnitude = parseFloat(flareClass.substring(1)) || 1.0;
    
    return baseScore * 10 + magnitude;
  }

  // Calculate solar activity score from multiple factors
  calculateSolarActivityScore(data: SolarData): number {
    let score = data.currentKpIndex * 10; // Base score from Kp-index
    
    // Add flare contributions
    data.solarFlares.forEach(flare => {
      score += this.flareClassToScore(flare.classType) * 2;
    });
    
    // Add CME contributions
    data.cmeEvents.forEach(cme => {
      const speedFactor = Math.min(cme.speed / 1000, 2); // Normalize speed
      score += speedFactor * 10;
    });
    
    return Math.min(score, 100); // Cap at 100
  }
}

export const solarDataService = new SolarDataService();