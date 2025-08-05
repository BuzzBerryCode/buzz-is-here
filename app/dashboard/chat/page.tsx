'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { BuzzberryChatPage } from '../../components/dashboard/screens/BuzzberryChatPage';

export default function DashboardChatPage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');

  return (
    <div className="bg-black min-h-full">
      <BuzzberryChatPage initialPrompt={prompt || undefined} />
    </div>
  );
} 