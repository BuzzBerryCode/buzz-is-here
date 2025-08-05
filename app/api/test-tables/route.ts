import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection and listing tables...');

    // Test connection by trying to get table information
    // Note: We can't directly list tables with the anon key, but we can try different table names
    
    const possibleTableNames = [
      'creatordata',
      'creator_data', 
      'creators',
      'creator',
      'influencers',
      'influencer_data',
      'social_creators',
      'users',
      'profiles'
    ];

    const results: any = {};

    for (const tableName of possibleTableNames) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);

        if (error) {
          results[tableName] = { error: error.message, code: error.code };
        } else {
          results[tableName] = { 
            exists: true, 
            count: count,
            sampleData: data?.length ? data[0] : null
          };
        }
      } catch (err) {
        results[tableName] = { error: 'Unexpected error', details: err };
      }
    }

    return NextResponse.json({
      success: true,
      tableResults: results,
      connectionInfo: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 