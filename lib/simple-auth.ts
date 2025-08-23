import bcrypt from 'bcryptjs'

// Simple in-memory storage for testing
const users: any[] = []

export const simpleAuth = {
  // Register a new user
  register: async (name: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      email_verified: new Date().toISOString(),
    }

    users.push(newUser)

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  },

  // Sign in a user
  signIn: async (email: string, password: string) => {
    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  },

  // Get all users (for debugging)
  getAllUsers: () => {
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }))
  },

  // Clear all users (for testing)
  clearUsers: () => {
    users.length = 0
  }
}
