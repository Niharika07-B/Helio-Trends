#!/usr/bin/env node

/**
 * HelioTrends 2.0 - API Verification Script
 * Run this to test your API connections before starting the dashboard
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const NASA_API_KEY = process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY;

console.log('🚀 HelioTrends 2.0 - API Verification\n');

// Utility function to make HTTP requests
function fetchData(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'HelioTrends/2.0',
        ...headers
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    }).on('error', reject);
  });
}

async function testTMDBAPI() {
  console.log('📺 Testing TMDB API...');
  console.log(`   API Key: ${TMDB_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Bearer Token: ${TMDB_BEARER_TOKEN ? '✅ Set' : '❌ Missing'}`);

  if (!TMDB_API_KEY && !TMDB_BEARER_TOKEN) {
    console.log('   ⚠️  No TMDB credentials found. Using mock data.\n');
    return false;
  }

  const tests = [
    {
      name: 'Trending TV Shows',
      url: 'https://api.themoviedb.org/3/trending/tv/day',
      urlWithKey: `https://api.themoviedb.org/3/trending/tv/day?api_key=${TMDB_API_KEY}`
    },
    {
      name: 'Trending Movies',
      url: 'https://api.themoviedb.org/3/trending/movie/day',
      urlWithKey: `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`
    },
    {
      name: 'TV Genres',
      url: 'https://api.themoviedb.org/3/genre/tv/list',
      urlWithKey: `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    try {
      let result;
      
      // Try Bearer Token first
      if (TMDB_BEARER_TOKEN) {
        console.log(`   Testing ${test.name} (Bearer Token)...`);
        result = await fetchData(test.url, {
          'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`
        });
      } else {
        console.log(`   Testing ${test.name} (API Key)...`);
        result = await fetchData(test.urlWithKey);
      }

      if (result.status === 200) {
        const count = result.data.results?.length || result.data.genres?.length || 0;
        console.log(`   ✅ ${test.name}: ${count} items fetched`);
        
        if (result.data.results?.[0]) {
          const sample = result.data.results[0];
          console.log(`      Sample: "${sample.name || sample.title}"`);
        }
      } else {
        console.log(`   ❌ ${test.name}: HTTP ${result.status}`);
        console.log(`      Error: ${result.data.status_message || 'Unknown error'}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: ${error.message}`);
      allPassed = false;
    }
  }

  console.log('');
  return allPassed;
}

async function testNASAAPI() {
  console.log('🌞 Testing NASA API...');
  console.log(`   API Key: ${NASA_API_KEY ? '✅ Set' : '❌ Using DEMO_KEY'}`);

  const apiKey = NASA_API_KEY || 'DEMO_KEY';
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tests = [
    {
      name: 'Solar Flares',
      url: `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
    },
    {
      name: 'CME Events',
      url: `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    try {
      console.log(`   Testing ${test.name}...`);
      const result = await fetchData(test.url);

      if (result.status === 200) {
        const count = Array.isArray(result.data) ? result.data.length : 0;
        console.log(`   ✅ ${test.name}: ${count} events found`);
      } else if (result.status === 429) {
        console.log(`   ⚠️  ${test.name}: Rate limited (${result.status})`);
        console.log(`      This is normal with DEMO_KEY. Get a free API key for higher limits.`);
      } else {
        console.log(`   ❌ ${test.name}: HTTP ${result.status}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: ${error.message}`);
      allPassed = false;
    }
  }

  console.log('');
  return allPassed;
}

async function testNOAAAPI() {
  console.log('🌍 Testing NOAA API (No API Key Required)...');

  const tests = [
    {
      name: 'Kp-Index',
      url: 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
    },
    {
      name: 'Solar Wind',
      url: 'https://services.swpc.noaa.gov/json/solar-wind/solar-wind-speed-1-day.json'
    }
  ];

  let allPassed = true;

  for (const test of tests) {
    try {
      console.log(`   Testing ${test.name}...`);
      const result = await fetchData(test.url);

      if (result.status === 200) {
        const count = Array.isArray(result.data) ? result.data.length : 0;
        console.log(`   ✅ ${test.name}: ${count} data points`);
        
        if (result.data.length > 0) {
          const latest = result.data[result.data.length - 1];
          if (latest.kp_index !== undefined) {
            console.log(`      Latest Kp-index: ${latest.kp_index}`);
          }
          if (latest.speed !== undefined) {
            console.log(`      Latest Solar Wind Speed: ${latest.speed} km/s`);
          }
        }
      } else {
        console.log(`   ❌ ${test.name}: HTTP ${result.status}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: ${error.message}`);
      allPassed = false;
    }
  }

  console.log('');
  return allPassed;
}

async function main() {
  console.log('Environment Variables:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   TMDB_API_KEY: ${TMDB_API_KEY ? 'Set' : 'Not set'}`);
  console.log(`   TMDB_BEARER_TOKEN: ${TMDB_BEARER_TOKEN ? 'Set' : 'Not set'}`);
  console.log(`   NASA_API_KEY: ${NASA_API_KEY ? 'Set' : 'Not set'}`);
  console.log('');

  const results = {
    tmdb: await testTMDBAPI(),
    nasa: await testNASAAPI(),
    noaa: await testNOAAAPI()
  };

  console.log('📊 Test Summary:');
  console.log(`   TMDB API: ${results.tmdb ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   NASA API: ${results.nasa ? '✅ PASS' : '⚠️  LIMITED'}`);
  console.log(`   NOAA API: ${results.noaa ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');

  if (results.tmdb && results.noaa) {
    console.log('🎉 All critical APIs are working! Your HelioTrends dashboard is ready.');
  } else if (results.noaa) {
    console.log('⚠️  Basic functionality available. TMDB issues will use mock Netflix data.');
  } else {
    console.log('❌ Critical API issues detected. Check your configuration.');
  }

  console.log('');
  console.log('Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Visit: http://localhost:3000');
  console.log('   3. Test APIs: http://localhost:3000/test');
}

main().catch(console.error);