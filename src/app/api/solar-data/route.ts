import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = process.env.NEXT_PUBLIC_NASA_BASE_URL || 'https://api.nasa.gov/DONKI';
const NOAA_BASE_URL = process.env.NEXT_PUBLIC_NOAA_BASE_URL || 'https://services.swpc.noaa.gov/json';

interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number;
}

interface CMEEvent {
  cmeID: string;
  startTime: string;
  sourceLocation: string;
  note: string;
  speed: number;
  type: string;
}

interface KpData {
  time_tag: string;
  kp_index: number;
  estimated_kp: number;
  kp: string;
}

interface SolarWindData {
  time_tag: string;
  speed: number;
  density: number;
  temperature: number;
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'HelioTrends/2.0'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchKpIndex(): Promise<KpData[]> {
  try {
    const response = await fetchWithTimeout(`${NOAA_BASE_URL}/planetary_k_index_1m.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Kp-index:', error);
    // Return mock data as fallback
    return [{
      time_tag: new Date().toISOString(),
      kp_index: 3.2,
      estimated_kp: 3.1,
      kp: '3+'
    }];
  }
}

async function fetchSolarWind(): Promise<SolarWindData[]> {
  try {
    const response = await fetchWithTimeout(`${NOAA_BASE_URL}/solar-wind/solar-wind-speed-1-day.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch solar wind:', error);
    // Return mock data as fallback
    return [{
      time_tag: new Date().toISOString(),
      speed: 420,
      density: 5.2,
      temperature: 100000
    }];
  }
}

async function fetchSolarFlares(): Promise<SolarFlare[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetchWithTimeout(
      `${NASA_BASE_URL}/FLR?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    );
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch solar flares:', error);
    // Return mock data as fallback
    return [{
      flrID: 'mock-flr-001',
      beginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      peakTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      classType: 'M2.1',
      sourceLocation: 'S15W30',
      activeRegionNum: 3234
    }];
  }
}

async function fetchCMEEvents(): Promise<CMEEvent[]> {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetchWithTimeout(
      `${NASA_BASE_URL}/CME?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    );
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch CME events:', error);
    // Return mock data as fallback
    return [{
      cmeID: 'mock-cme-001',
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sourceLocation: 'S15W30',
      note: 'Mock CME event for development',
      speed: 450,
      type: 'C'
    }];
  }
}

function classifyFlareIntensity(classType: string): number {
  const classMap: Record<string, number> = {
    'A': 1, 'B': 2, 'C': 3, 'M': 4, 'X': 5
  };
  
  const baseScore = classMap[classType[0]] || 0;
  const magnitude = parseFloat(classType.substring(1)) || 1.0;
  
  return baseScore * 10 + magnitude;
}

function determineActivityLevel(kpIndex: number): 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' {
  if (kpIndex >= 7) return 'EXTREME';
  if (kpIndex >= 5) return 'HIGH';
  if (kpIndex >= 3) return 'MODERATE';
  return 'LOW';
}

export async function GET(request: NextRequest) {
  try {
    // Fetch all solar data in parallel
    const [kpData, solarWindData, solarFlares, cmeEvents] = await Promise.all([
      fetchKpIndex(),
      fetchSolarWind(),
      fetchSolarFlares(),
      fetchCMEEvents()
    ]);

    // Get current values
    const currentKp = kpData[kpData.length - 1];
    const currentSolarWind = solarWindData[solarWindData.length - 1];

    // Process solar flares
    const processedFlares = solarFlares.map(flare => ({
      id: flare.flrID,
      classType: flare.classType,
      peakTime: flare.peakTime,
      intensity: classifyFlareIntensity(flare.classType)
    }));

    // Process CME events
    const processedCMEs = cmeEvents.map(cme => ({
      id: cme.cmeID,
      startTime: cme.startTime,
      speed: cme.speed,
      direction: cme.sourceLocation
    }));

    // Build response
    const solarData = {
      kpIndex: currentKp.kp_index,
      estimatedKp: currentKp.estimated_kp,
      activityLevel: determineActivityLevel(currentKp.kp_index),
      solarFlares: processedFlares,
      cmeEvents: processedCMEs,
      solarWind: {
        speed: currentSolarWind.speed || 400,
        density: currentSolarWind.density || 5.0,
        temperature: currentSolarWind.temperature || 100000
      },
      lastUpdate: new Date().toISOString()
    };

    return NextResponse.json(solarData, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Solar data API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch solar data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}