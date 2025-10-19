/**
 * Authentication Helper Functions
 * Handles password hashing, user creation, and validation
 */

import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const SALT_ROUNDS = 12

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Create a new user with email and password
 */
export async function createUserWithPassword(data: {
  email: string
  password: string
  name?: string
}) {
  const { email, password, name } = data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Hash the password
  const hashedPassword = await hashPassword(password)

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      name: name || email.split('@')[0],
      onboardingComplete: false,
      goals: [],
      podcastGenres: [],
    },
  })

  return user
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      hashedPassword: true,
      onboardingComplete: true,
    },
  })

  if (!user || !user.hashedPassword) {
    return null
  }

  const isValid = await verifyPassword(password, user.hashedPassword)

  if (!isValid) {
    return null
  }

  // Return user without password
  const { hashedPassword, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Check if email is available
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  return !user
}
