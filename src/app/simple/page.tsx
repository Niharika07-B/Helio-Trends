'use client';

import { useState, useEffect } from 'react';

export default function SimplePage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Test API call
    fetch('/api/netflix-data')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('API Error:', err));
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">HelioTrends - Simple Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Server Status</h2>
          <div className="space-y-2">
            <p>✅ Next.js Server: Running</p>
            <p>✅ React Hydration: Complete</p>
            <p>✅ Client-side JS: Working</p>
            <p>✅ Tailwind CSS: Loaded</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">API Test</h2>
          {data ? (
            <div className="space-y-2">
              <p>✅ Netflix API: Connected</p>
              <p>Movies: {data.trendingMovies?.length || 0}</p>
              <p>TV Shows: {data.trendingTv?.length || 0}</p>
              <p>Score: {data.aggregatedScore?.toFixed(1) || 'N/A'}</p>
            </div>
          ) : (
            <p>🔄 Loading API data...</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Go to Full Dashboard
        </a>
      </div>
    </div>
  );
}