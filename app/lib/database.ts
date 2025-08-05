import { supabase } from './supabaseClient';
import type { UserList } from '../types/database';

export async function getUserLists(userId: string): Promise<UserList[]> {
  try {
    const { data, error } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user lists:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserLists:', error)
    return []
  }
}

export async function createUserList(
  userId: string, 
  name: string, 
  description?: string
): Promise<UserList | null> {
  try {
    const { data, error } = await supabase
      .from('user_lists')
      .insert({
        user_id: userId,
        name,
        description,
        creator_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user list:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in createUserList:', error)
    return null
  }
} 