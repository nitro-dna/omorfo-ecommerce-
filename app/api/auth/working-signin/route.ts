import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const usersFile = path.join(process.cwd(), 'data', 'users.json')

const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

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

    const users = getUsers()

    // Find user
    const user = users.find((u: any) => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Signed in successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
