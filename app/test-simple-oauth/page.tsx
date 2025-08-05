'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function TestSimpleOAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const supabase = createClientComponentClient();

  const testSimpleOAuth = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing simple OAuth...');
      
      // Try with minimal configuration
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        },
      });

      console.log('Simple OAuth result:', { data, error });
      
      setResult({
        success: !error,
        hasUrl: !!data?.url,
        error: error?.message,
        data: data
      });

      if (data?.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Simple OAuth error:', err);
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Simple OAuth Test</h1>
        
        <button
          onClick={testSimpleOAuth}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg mb-4"
        >
          {loading ? 'Testing...' : 'Test Simple Google OAuth'}
        </button>

        {result && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-2">Result:</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <p>This tests OAuth with minimal configuration.</p>
          <p>If this works, the issue is in the OAuth callback handling.</p>
        </div>
      </div>
    </div>
  );
} 