'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { FeedbackModal } from '@/components/dashboard/modals/FeedbackModal';
import { SettingsModal } from '@/components/dashboard/modals/SettingsModal';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface DashboardLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ user, children }: DashboardLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirect from /dashboard to /dashboard/aisearch
  useEffect(() => {
    if (pathname === '/dashboard') {
      router.replace('/dashboard/aisearch');
    }
  }, [pathname, router]);

  // Determine active item based on current pathname
  const getActiveItem = () => {
    if (pathname.includes('/chat')) return 'AI Search';
    if (pathname.includes('/aisearch')) return 'AI Search';
    if (pathname.includes('/discover')) return 'Discover';
    if (pathname.includes('/mylists')) return 'My Lists';
    return 'AI Search'; // default
  };

  const handleNavigate = (item: string) => {
    if (item === 'Settings') {
      setShowSettingsModal(true);
    } else if (item === 'Feedback') {
      setShowFeedbackModal(true);
    } else {
      // Navigate to the appropriate route
      switch (item) {
        case 'AI Search':
          router.push('/dashboard/aisearch');
          break;
        case 'Discover':
          router.push('/dashboard/discover');
          break;
        case 'My Lists':
          router.push('/dashboard/mylists');
          break;
        default:
          router.push('/dashboard/aisearch');
      }
    }
  };

  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Don't render anything while redirecting
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <main className="flex h-screen overflow-hidden relative">
      <DashboardSidebar 
        user={user}
        activeItem={getActiveItem()}
        onNavigate={handleNavigate}
        onFeedbackClick={handleFeedbackClick}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className="flex-1 overflow-y-auto md:ml-0 transition-all duration-300 pt-[73px] md:pt-0">
        {children}
      </div>
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </main>
  );
} 