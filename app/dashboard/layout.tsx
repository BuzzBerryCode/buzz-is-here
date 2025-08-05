import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // Get the user session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    redirect('/');
  }
  
  if (!session?.user) {
    console.log('No session found, redirecting to login');
    redirect('/');
  }
  
  console.log('Dashboard layout - User authenticated:', {
    userId: session.user.id,
    userEmail: session.user.email,
    hasSession: !!session
  });
  
  return (
    <DashboardLayoutClient 
      user={session.user}
      children={children}
    />
  );
} 