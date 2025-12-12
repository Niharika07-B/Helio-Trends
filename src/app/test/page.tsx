'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApiTester from '@/components/ApiTester';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestPage() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      'NEXT_PUBLIC_TMDB_API_KEY': !!process.env.NEXT_PUBLIC_TMDB_API_KEY,
      'NEXT_PUBLIC_NASA_API_KEY': !!process.env.NEXT_PUBLIC_NASA_API_KEY,
      'NEXT_PUBLIC_TMDB_BASE_URL': !!process.env.NEXT_PUBLIC_TMDB_BASE_URL,
      'NEXT_PUBLIC_NASA_BASE_URL': !!process.env.NEXT_PUBLIC_NASA_BASE_URL,
      'NEXT_PUBLIC_NOAA_BASE_URL': !!process.env.NEXT_PUBLIC_NOAA_BASE_URL,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            HelioTrends - API Test Suite
          </h1>
          <p className="text-slate-400">
            Verify your API connections and environment variables
          </p>
        </motion.div>

        {/* Environment Variables Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-white mb-4">Environment Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(envVars).map(([key, isSet]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm font-mono text-slate-300">{key}</span>
                <div className="flex items-center space-x-2">
                  {isSet ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">Set</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">Missing</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Warnings */}
          {!envVars['NEXT_PUBLIC_TMDB_API_KEY'] && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300">
                  TMDB API key is missing. Netflix trending data will use mock data.
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* API Tester */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ApiTester />
        </motion.div>

        {/* Quick Test Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Test Examples</h2>
          <div className="space-y-4">
            
            {/* TMDB Example */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">TMDB Trending TV Shows</h3>
              <code className="text-sm text-green-400 bg-black/30 p-2 rounded block">
                {`const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const res = await fetch(
  \`https://api.themoviedb.org/3/trending/tv/day?api_key=\${API_KEY}\`
);
const data = await res.json();
console.log(data);`}
              </code>
            </div>

            {/* NASA Example */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">NASA Solar Data</h3>
              <code className="text-sm text-orange-400 bg-black/30 p-2 rounded block">
                {`const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const res = await fetch(
  \`https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&endDate=2024-01-31&api_key=\${API_KEY}\`
);
const data = await res.json();
console.log(data);`}
              </code>
            </div>

            {/* NOAA Example */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">NOAA Kp-Index (No API Key Required)</h3>
              <code className="text-sm text-blue-400 bg-black/30 p-2 rounded block">
                {`const res = await fetch(
  'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
);
const data = await res.json();
console.log(data);`}
              </code>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>← Back to Dashboard</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}