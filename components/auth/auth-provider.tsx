'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/store/auth-store';
import { authService, UserProfile } from '@/lib/api/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  // Initialize auth on mount
  useEffect(() => {
    auth.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Proactively refresh the token before it expires
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.token) return;

    const checkAndRefresh = async () => {
      try {
        const parts = auth.token!.split('.');
        if (parts.length !== 3) return;
        const payload = JSON.parse(atob(parts[1]));
        const expiresAt: number = payload.exp * 1000;
        const timeUntilExpiry = expiresAt - Date.now();

        if (timeUntilExpiry <= 0) {
          // Token already expired — log out
          await auth.logout();
          return;
        }

        // Refresh when fewer than 5 minutes remain
        if (timeUntilExpiry < 5 * 60 * 1000) {
          const refreshToken =
            typeof window !== 'undefined'
              ? localStorage.getItem('refresh_token')
              : null;

          if (refreshToken) {
            try {
              const response = await authService.refreshToken(refreshToken);
              authService.saveToStorage(response);
              // Sync new token into Zustand store without full re-initialisation
              await auth.initialize();
            } catch {
              // Refresh failed — force logout
              await auth.logout();
            }
          } else {
            // No refresh token available — logout when near expiry
            await auth.logout();
          }
        }
      } catch {
        // Malformed token — log out silently
        await auth.logout();
      }
    };

    // Check immediately, then every minute
    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 60 * 1000);
    return () => clearInterval(interval);
  }, [auth.isAuthenticated, auth.token]);

  const value: AuthContextType = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    updateProfile: auth.updateProfile,
    clearError: auth.clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { redirectTo?: string; requireAuth?: boolean } = {}
) {
  const { redirectTo = '/login', requireAuth = true } = options;

  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && requireAuth && !isAuthenticated && typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuthContext();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const userPermissions: string[] = (user as UserProfile & { permissions?: string[] }).permissions ?? [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean =>
    permissions.some(hasPermission);

  const hasAllPermissions = (permissions: string[]): boolean =>
    permissions.every(hasPermission);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };
}
