import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

async function testTMDBConnection() {
  console.log('🔍 Testing TMDB API Connection...');
  console.log('API Key available:', !!TMDB_API_KEY);
  console.log('Bearer Token available:', !!TMDB_BEARER_TOKEN);
  console.log('Base URL:', TMDB_BASE_URL);

  const results = {
    apiKeyMethod: null as any,
    bearerTokenMethod: null as any,
    endpoints: {
      trendingTV: null as any,
      trendingMovies: null as any,
      tvGenres: null as any,
      movieGenres: null as any,
    }
  };

  // Test with API Key method
  if (TMDB_API_KEY) {
    try {
      console.log('📡 Testing API Key method...');
      const response = await fetch(`${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}`, {
        headers: {
          'User-Agent': 'HelioTrends/2.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        results.apiKeyMethod = {
          success: true,
          status: response.status,
          resultsCount: data.results?.length || 0,
          sampleTitle: data.results?.[0]?.name || data.results?.[0]?.title
        };
        console.log('✅ API Key method successful');
      } else {
        results.apiKeyMethod = {
          success: false,
          status: response.status,
          error: await response.text()
        };
        console.log('❌ API Key method failed:', response.status);
      }
    } catch (error) {
      results.apiKeyMethod = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.log('❌ API Key method error:', error);
    }
  }

  // Test with Bearer Token method
  if (TMDB_BEARER_TOKEN) {
    try {
      console.log('📡 Testing Bearer Token method...');
      const response = await fetch(`${TMDB_BASE_URL}/trending/tv/day`, {
        headers: {
          'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
          'User-Agent': 'HelioTrends/2.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        results.bearerTokenMethod = {
          success: true,
          status: response.status,
          resultsCount: data.results?.length || 0,
          sampleTitle: data.results?.[0]?.name || data.results?.[0]?.title
        };
        console.log('✅ Bearer Token method successful');
      } else {
        results.bearerTokenMethod = {
          success: false,
          status: response.status,
          error: await response.text()
        };
        console.log('❌ Bearer Token method failed:', response.status);
      }
    } catch (error) {
      results.bearerTokenMethod = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.log('❌ Bearer Token method error:', error);
    }
  }

  // Test all endpoints with the working method
  const workingMethod = results.bearerTokenMethod?.success ? 'bearer' : 
                       results.apiKeyMethod?.success ? 'apikey' : null;

  if (workingMethod) {
    console.log(`📡 Testing all endpoints with ${workingMethod} method...`);
    
    const endpoints = [
      { name: 'trendingTV', url: '/trending/tv/day' },
      { name: 'trendingMovies', url: '/trending/movie/day' },
      { name: 'tvGenres', url: '/genre/tv/list' },
      { name: 'movieGenres', url: '/genre/movie/list' }
    ];

    for (const endpoint of endpoints) {
      try {
        const url = workingMethod === 'bearer' 
          ? `${TMDB_BASE_URL}${endpoint.url}`
          : `${TMDB_BASE_URL}${endpoint.url}?api_key=${TMDB_API_KEY}`;
        
        const headers: Record<string, string> = { 'User-Agent': 'HelioTrends/2.0' };
        
        if (workingMethod === 'bearer') {
          headers['Authorization'] = `Bearer ${TMDB_BEARER_TOKEN}`;
        }

        const response = await fetch(url, { headers });
        
        if (response.ok) {
          const data = await response.json();
          results.endpoints[endpoint.name as keyof typeof results.endpoints] = {
            success: true,
            status: response.status,
            dataCount: data.results?.length || data.genres?.length || 0,
            sampleData: data.results?.[0] || data.genres?.[0]
          };
          console.log(`✅ ${endpoint.name} endpoint working`);
        } else {
          results.endpoints[endpoint.name as keyof typeof results.endpoints] = {
            success: false,
            status: response.status,
            error: await response.text()
          };
          console.log(`❌ ${endpoint.name} endpoint failed:`, response.status);
        }
      } catch (error) {
        results.endpoints[endpoint.name as keyof typeof results.endpoints] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        console.log(`❌ ${endpoint.name} endpoint error:`, error);
      }
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    const testResults = await testTMDBConnection();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        hasApiKey: !!TMDB_API_KEY,
        hasBearerToken: !!TMDB_BEARER_TOKEN,
        baseUrl: TMDB_BASE_URL
      },
      testResults,
      recommendation: testResults.bearerTokenMethod?.success 
        ? 'Use Bearer Token method for authentication'
        : testResults.apiKeyMethod?.success 
        ? 'Use API Key method for authentication'
        : 'Check your TMDB API credentials'
    }, {
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('TMDB test API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test TMDB API',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}