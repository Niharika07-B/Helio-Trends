export default function HealthCheck() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          ✅ HelioTrends is Running!
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          Server is healthy and responding to requests
        </p>
        <div className="space-y-2 text-sm text-slate-500">
          <p>Next.js: 14.2.35</p>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}