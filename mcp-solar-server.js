#!/usr/bin/env node

/**
 * HelioTrends Solar Data MCP Server
 * Provides real-time solar weather data from NOAA and NASA APIs
 */

const https = require('https');

class SolarMCPServer {
  constructor() {
    this.tools = [
      {
        name: 'fetch_kp_index',
        description: 'Fetch current Kp-index (geomagnetic activity level)',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of recent readings to fetch (default: 5)',
              default: 5
            }
          }
        }
      },
      {
        name: 'fetch_solar_wind',
        description: 'Fetch current solar wind conditions',
        inputSchema: {
          type: 'object',
          properties: {
            timeframe: {
              type: 'string',
              description: 'Time period for data (1-day, 3-day, 7-day)',
              default: '1-day'
            }
          }
        }
      },
      {
        name: 'get_solar_activity_level',
        description: 'Get interpreted solar activity level and alerts',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'fetch_geomagnetic_activity',
        description: 'Fetch comprehensive geomagnetic storm data',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days of historical data',
              default: 7
            }
          }
        }
      }
    ];
  }

  async fetchData(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        });
      }).on('error', reject);
    });
  }

  async handleToolCall(name, args) {
    try {
      switch (name) {
        case 'fetch_kp_index':
          return await this.fetchKpIndex(args.limit || 5);
        
        case 'fetch_solar_wind':
          return await this.fetchSolarWind(args.timeframe || '1-day');
        
        case 'get_solar_activity_level':
          return await this.getSolarActivityLevel();
        
        case 'fetch_geomagnetic_activity':
          return await this.fetchGeomagneticActivity(args.days || 7);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async fetchKpIndex(limit = 5) {
    const data = await this.fetchData('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
    const recent = data.slice(-limit);
    
    return {
      success: true,
      data: recent,
      current: recent[recent.length - 1],
      summary: {
        latest_kp: recent[recent.length - 1].kp_index,
        estimated_kp: recent[recent.length - 1].estimated_kp,
        timestamp: recent[recent.length - 1].time_tag,
        readings_count: recent.length
      },
      timestamp: new Date().toISOString()
    };
  }

  async fetchSolarWind(timeframe = '1-day') {
    const endpoints = {
      '1-day': 'https://services.swpc.noaa.gov/json/solar-wind/solar-wind-speed-1-day.json',
      '3-day': 'https://services.swpc.noaa.gov/json/solar-wind/solar-wind-speed-3-day.json',
      '7-day': 'https://services.swpc.noaa.gov/json/solar-wind/solar-wind-speed-7-day.json'
    };

    const url = endpoints[timeframe] || endpoints['1-day'];
    const data = await this.fetchData(url);
    const latest = data[data.length - 1];

    return {
      success: true,
      timeframe,
      data: data.slice(-10), // Last 10 readings
      current: latest,
      summary: {
        speed: latest?.speed || 'N/A',
        density: latest?.density || 'N/A',
        temperature: latest?.temperature || 'N/A',
        timestamp: latest?.time_tag || 'N/A',
        total_readings: data.length
      },
      timestamp: new Date().toISOString()
    };
  }

  async getSolarActivityLevel() {
    const kpData = await this.fetchKpIndex(1);
    const currentKp = kpData.current.kp_index;

    let level, color, description, alert;
    
    if (currentKp >= 7) {
      level = 'EXTREME';
      color = 'purple';
      description = 'Severe geomagnetic storm conditions';
      alert = true;
    } else if (currentKp >= 5) {
      level = 'HIGH';
      color = 'red';
      description = 'Strong geomagnetic storm activity';
      alert = true;
    } else if (currentKp >= 3) {
      level = 'MODERATE';
      color = 'yellow';
      description = 'Minor geomagnetic disturbances';
      alert = false;
    } else {
      level = 'LOW';
      color = 'green';
      description = 'Quiet geomagnetic conditions';
      alert = false;
    }

    return {
      success: true,
      activity_level: {
        level,
        color,
        description,
        alert,
        kp_index: currentKp,
        estimated_kp: kpData.current.estimated_kp,
        scale: 'Kp 0-9 scale',
        timestamp: kpData.current.time_tag
      },
      recommendations: this.getRecommendations(level),
      timestamp: new Date().toISOString()
    };
  }

  async fetchGeomagneticActivity(days = 7) {
    // Fetch multiple data sources
    const [kpData, solarWindData] = await Promise.all([
      this.fetchKpIndex(days * 24), // Approximate hourly readings
      this.fetchSolarWind('7-day')
    ]);

    // Calculate activity statistics
    const kpValues = kpData.data.map(d => d.kp_index);
    const avgKp = kpValues.reduce((a, b) => a + b, 0) / kpValues.length;
    const maxKp = Math.max(...kpValues);
    const minKp = Math.min(...kpValues);

    // Count storm events (Kp >= 5)
    const stormEvents = kpValues.filter(kp => kp >= 5).length;

    return {
      success: true,
      period: `${days} days`,
      statistics: {
        average_kp: avgKp.toFixed(2),
        maximum_kp: maxKp,
        minimum_kp: minKp,
        storm_events: stormEvents,
        storm_percentage: ((stormEvents / kpValues.length) * 100).toFixed(1)
      },
      recent_data: {
        kp_readings: kpData.data.slice(-24), // Last 24 hours
        solar_wind: solarWindData.data.slice(-24)
      },
      trends: {
        increasing: kpValues.slice(-5).every((val, i, arr) => i === 0 || val >= arr[i-1]),
        stable: Math.abs(maxKp - minKp) < 2,
        volatile: Math.abs(maxKp - minKp) > 4
      },
      timestamp: new Date().toISOString()
    };
  }

  getRecommendations(level) {
    const recommendations = {
      'EXTREME': [
        'Monitor for potential satellite disruptions',
        'Expect increased aurora activity at lower latitudes',
        'Possible radio communication blackouts',
        'High correlation expected with streaming behavior changes'
      ],
      'HIGH': [
        'Aurora may be visible at mid-latitudes',
        'Minor satellite operations may be affected',
        'Moderate correlation with entertainment preferences expected'
      ],
      'MODERATE': [
        'Aurora activity at high latitudes',
        'Minimal impact on technology',
        'Weak correlation with streaming patterns'
      ],
      'LOW': [
        'Normal space weather conditions',
        'No significant impacts expected',
        'Baseline correlation levels with entertainment data'
      ]
    };

    return recommendations[level] || [];
  }
}

// MCP Server Protocol Implementation
const server = new SolarMCPServer();

process.stdin.on('data', async (data) => {
  try {
    const request = JSON.parse(data.toString());
    
    if (request.method === 'tools/list') {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id: request.id,
        result: { tools: server.tools }
      }));
    } else if (request.method === 'tools/call') {
      const result = await server.handleToolCall(
        request.params.name,
        request.params.arguments || {}
      );
      
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id: request.id,
        result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      }));
    }
  } catch (error) {
    console.log(JSON.stringify({
      jsonrpc: '2.0',
      id: request?.id || null,
      error: { code: -1, message: error.message }
    }));
  }
});

console.error('HelioTrends Solar MCP Server started');
