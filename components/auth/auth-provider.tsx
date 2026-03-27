'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/store/auth-store';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
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
  }, []);

  // Handle token refresh (optional - implement based on your backend)
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.token) return;

    // Check token expiration and refresh if needed
    const checkTokenExpiration = () => {
      try {
        const payload = JSON.parse(atob(auth.token!.split('.')[1]));
        const expiresAt = payload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // If token expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log('Token expiring soon, should refresh');
          // Implement token refresh logic here
        }
      } catch (error) {
        console.error('Failed to check token expiration:', error);
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

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

    // Redirect if not authenticated
    useEffect(() => {
      if (!isLoading && requireAuth && !isAuthenticated && typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    }, [isAuthenticated, isLoading, redirectTo, requireAuth]);

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Don't render if not authenticated (will redirect)
    if (requireAuth && !isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuthContext();

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Simple permission check - extend based on your needs
    if (user.role === 'admin') return true;
    
    // Add more permission logic here
    const userPermissions = user.permissions || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(hasPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };
}