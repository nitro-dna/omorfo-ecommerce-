import { NextResponse } from 'next/server'
import { userStorage } from '@/lib/users'

export async function GET() {
  const users = userStorage.getAllUsers()
  return NextResponse.json({ users })
}
