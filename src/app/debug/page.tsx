'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [mounted, setMounted] = useState(false);
  const [apiTests, setApiTests] = useState<{
    solar: { success: boolean; data: any } | null;
    netflix: { success: boolean; data: any } | null;
    correlations: { success: boolean; data: any } | null;
  }>({
    solar: null,
    netflix: null,
    correlations: null,
  });

  useEffect(() => {
    setMounted(true);
    
    // Test all APIs
    const testAPIs = async () => {
      try {
        // Test Solar API
        const solarRes = await fetch('/api/solar-data');
        const solarData = await solarRes.json();
        setApiTests(prev => ({ ...prev, solar: { success: solarRes.ok, data: solarData } }));

        // Test Netflix API
        const netflixRes = await fetch('/api/netflix-data');
        const netflixData = await netflixRes.json();
        setApiTests(prev => ({ ...prev, netflix: { success: netflixRes.ok, data: netflixData } }));

        // Test Correlations API
        const corrRes = await fetch('/api/correlations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ solarData, netflixData }),
        });
        const corrData = await corrRes.json();
        setApiTests(prev => ({ ...prev, correlations: { success: corrRes.ok, data: corrData } }));
      } catch (error) {
        console.error('API Test Error:', error);
      }
    };

    testAPIs();
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div>Loading debug page...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔧 HelioTrends Debug Panel</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">✅ System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Next.js Server:</span>
                <span className="text-green-400">Running</span>
              </div>
              <div className="flex justify-between">
                <span>React Hydration:</span>
                <span className="text-green-400">Complete</span>
              </div>
              <div className="flex justify-between">
                <span>Client-side JS:</span>
                <span className="text-green-400">Working</span>
              </div>
              <div className="flex justify-between">
                <span>Tailwind CSS:</span>
                <span className="text-green-400">Loaded</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className="text-blue-400">{process.env.NODE_ENV}</span>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">📡 API Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Solar Data API:</span>
                <span className={apiTests.solar?.success ? 'text-green-400' : 'text-yellow-400'}>
                  {apiTests.solar?.success ? '✅ Working' : '🔄 Testing...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Netflix Data API:</span>
                <span className={apiTests.netflix?.success ? 'text-green-400' : 'text-yellow-400'}>
                  {apiTests.netflix?.success ? '✅ Working' : '🔄 Testing...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Correlations API:</span>
                <span className={apiTests.correlations?.success ? 'text-green-400' : 'text-yellow-400'}>
                  {apiTests.correlations?.success ? '✅ Working' : '🔄 Testing...'}
                </span>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          {apiTests.netflix?.success && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">📊 Netflix Data</h2>
              <div className="space-y-2">
                <p>Trending Movies: {apiTests.netflix.data.trendingMovies?.length || 0}</p>
                <p>Trending TV: {apiTests.netflix.data.trendingTv?.length || 0}</p>
                <p>Top Genre: {apiTests.netflix.data.topGenres?.[0]?.name || 'N/A'}</p>
                <p>Aggregated Score: {apiTests.netflix.data.aggregatedScore?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Solar Data Summary */}
          {apiTests.solar?.success && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">🌞 Solar Data</h2>
              <div className="space-y-2">
                <p>Kp-Index: {apiTests.solar.data.kpIndex || 'N/A'}</p>
                <p>Activity Level: {apiTests.solar.data.activityLevel || 'N/A'}</p>
                <p>Solar Flares: {apiTests.solar.data.solarFlares?.length || 0}</p>
                <p>CME Events: {apiTests.solar.data.cmeEvents?.length || 0}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <a 
            href="/" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            🏠 Main Dashboard
          </a>
          <a 
            href="/health" 
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            ❤️ Health Check
          </a>
          <a 
            href="/test" 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            🧪 API Test Page
          </a>
        </div>

        {/* Browser Info */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-400">🌐 Browser Info</h2>
          <div className="text-sm space-y-1">
            <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
            <p>URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}