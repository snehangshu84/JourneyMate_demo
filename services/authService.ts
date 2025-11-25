import { User, Persona } from '../types';

const CURRENT_USER_KEY = 'journeymate_current_user';

// MOCK BACKEND ENDPOINT: POST /auth/register
export const register = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email.includes('error')) {
    throw new Error('Email already in use.');
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(2, 9),
    email,
    name,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
    preferences: { persona: Persona.LOCAL }
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

// MOCK BACKEND ENDPOINT: POST /auth/login
export const login = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (password.length < 4) {
    throw new Error('Invalid credentials.');
  }

  // Check if we have a stored user to preserve preferences between logins for this mock
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  let preferences = { persona: Persona.LOCAL };
  
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.email === email && parsed.preferences) {
      preferences = parsed.preferences;
    }
  }

  const user: User = {
    id: 'user-123',
    email,
    name: email.split('@')[0], // Default name from email
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=0D8ABC&color=fff`,
    preferences
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// MOCK BACKEND ENDPOINT: POST /auth/google
export const loginWithGoogle = async (): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const user: User = {
    id: 'google-user-123',
    email: 'traveler@gmail.com',
    name: 'Traveler',
    avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    preferences: { persona: Persona.LOCAL }
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// MOCK BACKEND ENDPOINT: PUT /user/preferences
export const updateUserPreferences = async (user: User, persona: Persona): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const updatedUser = {
    ...user,
    preferences: {
      ...user.preferences,
      persona
    }
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};