import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl: string;
}

export const MOCK_USERS: Record<UserRole, User> = {
  super_admin: {
    id: 'usr-1',
    name: 'Dr. Rajesh Kumar',
    email: 'superadmin@bit.edu',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  admin: {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'admin.allocations@bit.edu',
    role: 'admin',
    department: 'Campus Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
  },
  staff: {
    id: 'usr-3',
    name: 'Prof. Amit Sharma',
    email: 'amit.sharma@bit.edu',
    role: 'staff',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  student: {
    id: 'usr-4',
    name: 'Dharun S.',
    email: 'dharun.cs24@bit.edu',
    role: 'student',
    department: 'Information Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
  }
};

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(MOCK_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser(MOCK_USERS[role]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
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
