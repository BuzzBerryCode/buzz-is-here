'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function TestOAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const supabase = createClientComponentClient();

  const testOAuth = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing OAuth configuration...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      console.log('OAuth test result:', { data, error });
      
      setResult({
        success: !error,
        hasUrl: !!data?.url,
        error: error?.message,
        data: data
      });

      if (data?.url) {
        console.log('Redirecting to OAuth URL:', data.url);
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('OAuth test error:', err);
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
        <h1 className="text-2xl font-bold text-white mb-6">OAuth Test Page</h1>
        
        <button
          onClick={testOAuth}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg mb-4"
        >
          {loading ? 'Testing...' : 'Test Google OAuth'}
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
          <p>This page tests the OAuth configuration.</p>
          <p>If successful, you'll be redirected to Google.</p>
        </div>
      </div>
    </div>
  );
} 