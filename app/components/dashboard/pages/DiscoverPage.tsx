'use client';

import React from 'react';

export function DiscoverPage() {
  return (
    <div className="bg-black min-h-full p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
        Discover
      </h1>
          <p className="text-green-400 text-lg font-bold mb-4">
            ✅ NEW DASHBOARD LOADED SUCCESSFULLY!
          </p>
          <p className="text-gray-400">
            Find and explore creators that match your brand
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Trending Creators</h3>
            <p className="text-gray-400 text-sm">
              Discover the most popular and trending creators in your niche
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Rising Stars</h3>
            <p className="text-gray-400 text-sm">
              Find up-and-coming creators with growing audiences
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Location-Based</h3>
            <p className="text-gray-400 text-sm">
              Find creators in specific locations or regions
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Discover page functionality coming soon
          </p>
        </div>
      </div>
    </div>
  );
}