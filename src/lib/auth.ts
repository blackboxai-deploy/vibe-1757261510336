"use client";

import { User } from './types';

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@bank.com',
    name: 'John Admin',
    role: 'admin',
    department: 'Administration',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'officer@bank.com',
    name: 'Jane Officer',
    role: 'loan_officer',
    department: 'Loan Department',
    isActive: true,
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'service@bank.com',
    name: 'Mike Service',
    role: 'customer_service',
    department: 'Customer Service',
    isActive: true,
    createdAt: new Date('2023-03-01'),
    lastLogin: new Date()
  }
];

export class AuthService {
  private static STORAGE_KEY = 'banking_auth_user';

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - in real app, this would be a secure API call
    if (password !== 'password123') {
      return { success: false, error: 'Invalid credentials' };
    }

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' };
    }

    // Store user in localStorage (in real app, use secure token storage)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    return { success: true, user };
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(requiredRole: User['role']): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'admin': 3,
      'loan_officer': 2,
      'customer_service': 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  static canAccess(resource: string, action: 'read' | 'write' | 'delete'): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Define permissions based on role
    const permissions: Record<User['role'], Record<string, string[]>> = {
      admin: {
        customers: ['read', 'write', 'delete'],
        loans: ['read', 'write', 'delete'],
        payments: ['read', 'write', 'delete'],
        users: ['read', 'write', 'delete'],
        reports: ['read', 'write'],
        settings: ['read', 'write']
      },
      loan_officer: {
        customers: ['read', 'write'],
        loans: ['read', 'write'],
        payments: ['read', 'write'],
        reports: ['read'],
        settings: ['read']
      },
      customer_service: {
        customers: ['read', 'write'],
        loans: ['read'],
        payments: ['read', 'write'],
        reports: ['read']
      }
    };

    const userPermissions = permissions[user.role][resource] || [];
    return userPermissions.includes(action);
  }
}

export const useAuth = () => {
  const getCurrentUser = () => AuthService.getCurrentUser();
  const isAuthenticated = () => AuthService.isAuthenticated();
  const hasRole = (role: User['role']) => AuthService.hasRole(role);
  const canAccess = (resource: string, action: 'read' | 'write' | 'delete') => 
    AuthService.canAccess(resource, action);

  return {
    getCurrentUser,
    isAuthenticated,
    hasRole,
    canAccess,
    login: AuthService.login,
    logout: AuthService.logout
  };
};