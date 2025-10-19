import { NextResponse } from 'next/server'
import { createUserWithPassword, isEmailAvailable } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if email is available
    const available = await isEmailAvailable(email)
    if (!available) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create the user
    const user = await createUserWithPassword({
      email,
      password,
      name,
    })

    console.log('[SignupAPI] ✅ User created:', { id: user.id, email: user.email })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('[SignupAPI] ❌ Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create account',
      },
      { status: 500 }
    )
  }
}
