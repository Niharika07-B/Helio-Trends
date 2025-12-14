/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_NASA_API_KEY: process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY',
    NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    NEXT_PUBLIC_TMDB_BEARER_TOKEN: process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN,
    NOAA_API_BASE: 'https://services.swpc.noaa.gov/json',
  },
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/Helio-Trends' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Helio-Trends/' : '',
  
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