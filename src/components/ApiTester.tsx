'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

interface TestResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
}

export default function ApiTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests = [
      { name: 'TMDB Connection Test', endpoint: '/api/test-tmdb' },
      { name: 'Solar Data API', endpoint: '/api/solar-data' },
      { name: 'Netflix Data API', endpoint: '/api/netflix-data' },
    ];

    const testResults: TestResult[] = [];

    for (const test of tests) {
      const startTime = Date.now();
      try {
        console.log(`🧪 Testing ${test.name}...`);
        const response = await fetch(test.endpoint);
        const data = await response.json();
        const duration = Date.now() - startTime;

        testResults.push({
          endpoint: test.name,
          success: response.ok,
          data: response.ok ? data : null,
          error: response.ok ? undefined : data.message || `HTTP ${response.status}`,
          duration
        });

        console.log(`${response.ok ? '✅' : '❌'} ${test.name}: ${duration}ms`);
      } catch (error) {
        const duration = Date.now() - startTime;
        testResults.push({
          endpoint: test.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration
        });
        console.log(`❌ ${test.name} failed:`, error);
      }

      setResults([...testResults]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }

    setIsRunning(false);
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">API Connection Tester</h2>
        <motion.button
          onClick={runTests}
          disabled={isRunning}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isRunning ? 'Testing...' : 'Run Tests'}</span>
        </motion.button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.endpoint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                result.success 
                  ? 'bg-green-500/10 border-green-500 text-green-100'
                  : 'bg-red-500/10 border-red-500 text-red-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <h3 className="font-semibold">{result.endpoint}</h3>
                </div>
                <span className="text-sm opacity-70">
                  {result.duration}ms
                </span>
              </div>

              {result.error && (
                <p className="text-sm text-red-300 mb-2">
                  Error: {result.error}
                </p>
              )}

              {result.success && result.data && (
                <details className="text-sm">
                  <summary className="cursor-pointer opacity-70 hover:opacity-100">
                    View Response Data
                  </summary>
                  <pre className="mt-2 p-3 bg-black/20 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </motion.div>
          ))}

          {/* Summary */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {results.filter(r => r.success).length}
                </div>
                <div className="text-sm text-slate-400">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {results.filter(r => !r.success).length}
                </div>
                <div className="text-sm text-slate-400">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {results.reduce((sum, r) => sum + (r.duration || 0), 0)}ms
                </div>
                <div className="text-sm text-slate-400">Total Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-slate-400">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Click "Run Tests" to verify API connections</p>
        </div>
      )}
    </div>
  );
}