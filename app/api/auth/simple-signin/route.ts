import { NextRequest, NextResponse } from 'next/server'
import { simpleAuth } from '@/lib/simple-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in user
    const user = await simpleAuth.signIn(email, password)

    return NextResponse.json(
      { 
        message: 'Signed in successfully',
        user
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 401 }
    )
  }
}
