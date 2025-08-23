// Temporary in-memory user storage
// In production, this should be replaced with Supabase or a proper database

export interface User {
  id: string
  name: string
  email: string
  password: string
  image?: string
  email_verified?: string
  created_at?: string
  updated_at?: string
}

// In-memory storage
let users: User[] = []

export const userStorage = {
  // Add a user
  addUser: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    users.push(newUser)
    return newUser
  },

  // Find user by email
  findByEmail: (email: string) => {
    return users.find(user => user.email === email)
  },

  // Find user by id
  findById: (id: string) => {
    return users.find(user => user.id === id)
  },

  // Get all users (for debugging)
  getAllUsers: () => {
    return users
  },

  // Clear all users (for testing)
  clearUsers: () => {
    users = []
  }
}
