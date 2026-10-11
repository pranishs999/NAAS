/**
 * User Entity & Session Types
 * Source: architecture.md §2, security.md §2
 */

export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  isDemoUser: boolean;
}

export interface Session {
  id: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  lastReauthAt?: string | null;
}
