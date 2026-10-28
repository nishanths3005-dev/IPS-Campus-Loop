import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DEFAULT_USERS } from '../data/mockItems';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<{ success: boolean }>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    department: string;
    classYear: string;
    studentId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (user: User) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('campusloop_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default logged in as Aarav Mehta for seamless prototype viewing, but user can log out, switch, or sign in as Google user
    return DEFAULT_USERS[0];
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('campusloop_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('campusloop_auth_user');
      }
    } catch {
      // ignore storage quota issues
    }
  }, [currentUser]);

  const loginWithPassword = async (email: string, password: string) => {
    // Validate inputs
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid university or personal email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check existing default users
    const matched = DEFAULT_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      setCurrentUser(matched);
      return { success: true };
    }

    // Otherwise create or log into account
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = nameFromEmail
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const isEdu = email.toLowerCase().endsWith('.edu');

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: formattedName || 'Campus Student',
      department: 'College of Arts & Sciences',
      classYear: "Class of '26",
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: isEdu,
      karmaScore: 50,
      primaryNode: 'Library North Atrium',
      authProvider: 'password',
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    const targetEmail = customEmail || 'nishanth.s.3005@gmail.com';
    const namePart = customName || targetEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const googleUser: User = {
      id: `user-google-${targetEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
      email: targetEmail,
      name: formattedName || 'Google User',
      department: 'Software Engineering',
      classYear: "Class of '25",
      studentId: `STU-G-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: true,
      karmaScore: 100,
      primaryNode: 'Engineering Block C',
      authProvider: 'google',
      avatarUrl: undefined,
    };

    setCurrentUser(googleUser);
    return { success: true };
  };

  const signUp = async (data: {
    name: string;
    email: string;
    password: string;
    department: string;
    classYear: string;
    studentId?: string;
  }) => {
    if (!data.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!data.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const isEdu = data.email.toLowerCase().endsWith('.edu');

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      department: data.department || 'Undergraduate Studies',
      classYear: data.classYear || "Class of '26",
      studentId: data.studentId?.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: isEdu,
      karmaScore: 50,
      primaryNode: 'Library North Atrium',
      authProvider: 'password',
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const updateProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loginWithPassword,
        loginWithGoogle,
        signUp,
        logout,
        switchUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
