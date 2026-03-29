'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  secureAuthService, 
  UserProfile, 
  useAuthStatus,
  useSecureLogout 
} from '@/lib/security/auth';
import { CSRFProvider } from './CSRFProvider';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
  
  // Derived state
  isAdmin: boolean;
  isUser: boolean;
  hasCompany: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SecureAuthProviderProps {
  children: ReactNode;
  /**
   * Whether to require authentication for the entire app
   */
  requireAuth?: boolean;
  /**
   * Public routes that don't require authentication
   */
  publicRoutes?: string[];
  /**
   * Redirect path when authentication fails
   */
  loginPath?: string;
}

/**
 * Secure Authentication Provider
 * 
 * Replaces the old AuthProvider with secure authentication using:
 * - HttpOnly cookies instead of localStorage
 * - Server-side token validation
 * - CSRF protection
 * - Automatic token refresh
 */
export function SecureAuthProvider({
  children,
  requireAuth = true,
  publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'],
  loginPath = '/login',
}: SecureAuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use React Query for auth status
  const { 
    data: authStatus, 
    isLoading: isAuthLoading,
    refetch: refetchAuthStatus 
  } = useAuthStatus();
  
  const logoutMutation = useSecureLogout();

  // Initialize authentication
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!isLoading && requireAuth) {
      checkRouteAccess();
    }
  }, [pathname, isLoading, authStatus]);

  const initializeAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Auth status is fetched by React Query
      // We'll update local state when it loads
    } catch (err) {
      console.error('Auth initialization failed:', err);
      setError('Failed to initialize authentication');
    } finally {
      setIsLoading(false);
    }
  };

  // Update local state when auth status changes
  useEffect(() => {
    if (authStatus) {
      setUser(authStatus.user || null);
    }
  }, [authStatus]);

  const checkRouteAccess = () => {
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    const isAuthenticated = authStatus?.authenticated || false;

    // Redirect to login if not authenticated and route is not public
    if (!isAuthenticated && !isPublicRoute && requireAuth) {
      const redirectUrl = `${loginPath}?from=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }

    // Redirect to dashboard if authenticated and trying to access login/register
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await secureAuthService.login({ email, password });
      
      // Refresh auth status
      await refetchAuthStatus();
      
      // Redirect to home or stored redirect URL
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      router.push(redirectTo);
      sessionStorage.removeItem('redirectAfterLogin');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; company?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await secureAuthService.register(data);
      
      // Refresh auth status
      await refetchAuthStatus();
      
      // Redirect to home
      router.push('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await logoutMutation.mutateAsync();
      
      // Clear local state
      setUser(null);
      
      // Redirect to login
      router.push(loginPath);
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear local state and redirect
      setUser(null);
      router.push(loginPath);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await secureAuthService.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshAuth = async () => {
    await refetchAuthStatus();
  };

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  const hasCompany = !!user?.company;

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated: !!authStatus?.authenticated,
    isLoading: isLoading || isAuthLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    clearError,
    refreshAuth,
    
    // Derived state
    isAdmin,
    isUser,
    hasCompany,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use secure authentication context
 */
export function useSecureAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  
  return context;
}

/**
 * Main provider that combines Auth and CSRF protection
 */
interface SecurityProviderProps {
  children: ReactNode;
  authProps?: Omit<SecureAuthProviderProps, 'children'>;
}

export function SecurityProvider({ children, authProps }: SecurityProviderProps) {
  return (
    <CSRFProvider>
      <SecureAuthProvider {...authProps}>
        {children}
      </SecureAuthProvider>
    </CSRFProvider>
  );
}

/**
 * Loading component for authentication
 */
export function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <div className="space-y-2">
          <p className="font-medium">Loading authentication</p>
          <p className="text-sm text-muted-foreground">
            Securing your session...
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Component to display authentication status
 */
export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useSecureAuth();
  
  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-muted rounded-full">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
        <span>Auth: Loading...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-warning/10 text-warning rounded-full">
        <div className="h-2 w-2 rounded-full bg-warning"></div>
        <span>Auth: Not logged in</span>
      </div>
    );
  }
  
  const userInitial = user?.name?.charAt(0) || 'U';
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-success/10 text-success rounded-full">
      <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
        <span className="text-xs font-medium">{userInitial}</span>
      </div>
      <span>Auth: {user?.name || 'User'}</span>
    </div>
  );
}

/**
 * Hook to check if current user has specific role
 */
export function useRoleCheck(requiredRole: 'admin' | 'user' | 'any') {
  const { user, isLoading } = useSecureAuth();
  
  const hasRole = (): boolean => {
    if (!user || isLoading) return false;
    
    switch (requiredRole) {
      case 'admin':
        return user.role === 'admin';
      case 'user':
        return user.role === 'user' || user.role === 'admin';
      case 'any':
        return true;
      default:
        return false;
    }
  };
  
  return {
    hasRole: hasRole(),
    isLoading,
    user,
  };
}

/**
 * Hook to check if current user has specific permissions
 */
export function usePermissionCheck(requiredPermissions: string[]) {
  const { user, isLoading } = useSecureAuth();
  
  const hasPermissions = (): boolean => {
    if (!user || isLoading) return false;
    
    const userPermissions = user.permissions || [];
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || isLoading) return false;
    
    const userPermissions = user.permissions || [];
    return permissions.some(permission => 
      userPermissions.includes(permission)
    );
  };
  
  return {
    hasPermissions: hasPermissions(),
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(permissions),
    isLoading,
    user,
  };
}

/**
 * Component that only renders if user has specific role
 */
interface RoleGuardProps {
  children: ReactNode;
  requiredRole: 'admin' | 'user' | 'any';
  fallback?: ReactNode;
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { hasRole, isLoading } = useRoleCheck(requiredRole);
  
  if (isLoading) {
    return null;
  }
  
  if (!hasRole) {
    return <>{fallback || null}</>;
  }
  
  return <>{children}</>;
}

/**
 * Component that only renders if user has specific permissions
 */
interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: string[];
  fallback?: ReactNode;
}

export function PermissionGuard({ children, requiredPermissions, fallback }: PermissionGuardProps) {
  const { hasPermissions, isLoading } = usePermissionCheck(requiredPermissions);
  
  if (isLoading) {
    return null;
  }
  
  if (!hasPermissions) {
    return <>{fallback || null}</>;
  }
  
  return <>{children}</>;
}