import { NextRequest, NextResponse } from 'next/server'
import { getUserLists, createUserList } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const lists = await getUserLists(userId)
    return NextResponse.json({ lists })

  } catch (error) {
    console.error('Get lists API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, description } = await request.json()

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    const list = await createUserList(userId, name, description)
    if (!list) {
      return NextResponse.json(
        { error: 'Failed to create user list' },
        { status: 500 }
      )
    }

    return NextResponse.json({ list })

  } catch (error) {
    console.error('Create list API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}