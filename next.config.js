/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  env: {
    NASA_API_KEY: process.env.NASA_API_KEY || 'DEMO_KEY',
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TMDB_BEARER_TOKEN: process.env.TMDB_BEARER_TOKEN,
    NOAA_API_BASE: 'https://services.swpc.noaa.gov/json',
  },
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
