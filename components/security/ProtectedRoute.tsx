'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { secureAuthService } from '@/lib/security/auth';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Required authentication level
   * - 'any': Any authenticated user
   * - 'user': Regular user role
   * - 'admin': Admin role
   * - 'none': No authentication required (public route)
   */
  requiredRole?: 'any' | 'user' | 'admin' | 'none';
  /**
   * Redirect path when authentication fails
   */
  redirectTo?: string;
  /**
   * Show loading state while checking authentication
   */
  showLoading?: boolean;
  /**
   * Custom unauthorized component
   */
  unauthorizedComponent?: React.ReactNode;
  /**
   * Additional permissions required
   */
  requiredPermissions?: string[];
}

/**
 * ProtectedRoute component
 * 
 * Wraps content that requires authentication and/or specific roles.
 * Automatically redirects to login if user is not authenticated.
 * Checks role-based access control (RBAC) and permissions.
 */
export function ProtectedRoute({
  children,
  requiredRole = 'any',
  redirectTo = '/login',
  showLoading = true,
  unauthorizedComponent,
  requiredPermissions = [],
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
    
    // Set up interval to periodically check auth status
    const interval = setInterval(checkAuthentication, 60 * 1000); // Every minute
    
    return () => clearInterval(interval);
  }, [pathname]);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated via server-side validation
      const { authenticated, user } = await secureAuthService.initialize();
      
      setIsAuthenticated(authenticated);
      
      if (authenticated && user) {
        setUserRole(user.role);
        setUserPermissions(user.permissions || []);
        
        // Check if user has required role
        if (requiredRole !== 'none' && !hasRequiredRole(user.role)) {
          handleUnauthorized();
          return;
        }
        
        // Check if user has required permissions
        if (requiredPermissions.length > 0 && !hasRequiredPermissions(user.permissions || [])) {
          handleUnauthorized();
          return;
        }
      } else if (requiredRole !== 'none') {
        // Not authenticated but authentication is required
        handleUnauthorized();
        return;
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      handleUnauthorized();
    } finally {
      setIsLoading(false);
    }
  };

  const hasRequiredRole = (role: string): boolean => {
    switch (requiredRole) {
      case 'any':
        return true;
      case 'user':
        return role === 'user' || role === 'admin';
      case 'admin':
        return role === 'admin';
      case 'none':
        return true;
      default:
        return false;
    }
  };

  const hasRequiredPermissions = (permissions: string[]): boolean => {
    return requiredPermissions.every(permission => 
      permissions.includes(permission)
    );
  };

  const handleUnauthorized = () => {
    if (requiredRole === 'none') {
      return; // Public route, no redirect needed
    }
    
    // Store the attempted URL for redirect after login
    if (typeof window !== 'undefined' && pathname !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', pathname);
    }
    
    // Redirect to login page
    router.push(`${redirectTo}?from=${encodeURIComponent(pathname)}`);
  };

  // Show loading state
  if (isLoading && showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (requiredRole !== 'none' && !isAuthenticated) {
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md p-6">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You need to be authenticated to access this page.
          </p>
          <div className="pt-4">
            <button
              onClick={() => router.push(redirectTo)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole !== 'none' && isAuthenticated && userRole) {
    if (!hasRequiredRole(userRole)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4 max-w-md p-6">
            <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-8 w-8 text-warning" />
            </div>
            <h2 className="text-2xl font-bold">Insufficient Permissions</h2>
            <p className="text-muted-foreground">
              You don't have the required role to access this page.
              Required: {requiredRole}, Your role: {userRole}
            </p>
            <div className="pt-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0 && isAuthenticated) {
    if (!hasRequiredPermissions(userPermissions)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4 max-w-md p-6">
            <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-8 w-8 text-warning" />
            </div>
            <h2 className="text-2xl font-bold">Insufficient Permissions</h2>
            <p className="text-muted-foreground">
              You don't have the required permissions to access this page.
              Required: {requiredPermissions.join(', ')}
            </p>
            <div className="pt-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required role/permissions
  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function ProtectedPage(props: P) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook to check authentication and permissions
 */
export function useAuthGuard(options: {
  requiredRole?: ProtectedRouteProps['requiredRole'];
  requiredPermissions?: string[];
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, [pathname]);

  const checkAuthorization = async () => {
    try {
      setIsLoading(true);
      
      const { authenticated, user } = await secureAuthService.initialize();
      
      if (!authenticated && options.requiredRole !== 'none') {
        setIsAuthorized(false);
        redirectToLogin();
        return;
      }
      
      if (authenticated && user) {
        // Check role
        if (options.requiredRole && options.requiredRole !== 'none') {
          const hasRole = checkRole(user.role, options.requiredRole);
          if (!hasRole) {
            setIsAuthorized(false);
            redirectToUnauthorized();
            return;
          }
        }
        
        // Check permissions
        if (options.requiredPermissions && options.requiredPermissions.length > 0) {
          const hasPermissions = options.requiredPermissions.every(permission =>
            (user.permissions || []).includes(permission)
          );
          if (!hasPermissions) {
            setIsAuthorized(false);
            redirectToUnauthorized();
            return;
          }
        }
      }
      
      setIsAuthorized(true);
    } catch (error) {
      console.error('Authorization check failed:', error);
      setIsAuthorized(false);
      redirectToLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const checkRole = (userRole: string, requiredRole: string): boolean => {
    switch (requiredRole) {
      case 'any':
        return true;
      case 'user':
        return userRole === 'user' || userRole === 'admin';
      case 'admin':
        return userRole === 'admin';
      default:
        return false;
    }
  };

  const redirectToLogin = () => {
    if (typeof window !== 'undefined' && pathname !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push(`${options.redirectTo || '/login'}?from=${encodeURIComponent(pathname)}`);
    }
  };

  const redirectToUnauthorized = () => {
    router.push('/unauthorized');
  };

  return {
    isAuthorized,
    isLoading,
    checkAuthorization,
  };
}

/**
 * Component for role-based content rendering
 */
interface RoleBasedRenderProps {
  children: React.ReactNode;
  requiredRole: ProtectedRouteProps['requiredRole'];
  fallback?: React.ReactNode;
}

export function RoleBasedRender({ 
  children, 
  requiredRole, 
  fallback 
}: RoleBasedRenderProps) {
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const { authenticated, user } = await secureAuthService.initialize();
      
      if (authenticated && user) {
        const userHasRole = checkUserRole(user.role, requiredRole);
        setHasRole(userHasRole);
      } else {
        setHasRole(false);
      }
    } catch (error) {
      console.error('Role check failed:', error);
      setHasRole(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserRole = (userRole: string, requiredRole: string): boolean => {
    switch (requiredRole) {
      case 'any':
        return true;
      case 'user':
        return userRole === 'user' || userRole === 'admin';
      case 'admin':
        return userRole === 'admin';
      default:
        return false;
    }
  };

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  if (!hasRole) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}

/**
 * Component for permission-based content rendering
 */
interface PermissionBasedRenderProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
}

export function PermissionBasedRender({ 
  children, 
  requiredPermissions, 
  fallback 
}: PermissionBasedRenderProps) {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { authenticated, user } = await secureAuthService.initialize();
      
      if (authenticated && user) {
        const userPermissions = user.permissions || [];
        const hasAllPermissions = requiredPermissions.every(permission =>
          userPermissions.includes(permission)
        );
        setHasPermissions(hasAllPermissions);
      } else {
        setHasPermissions(false);
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      setHasPermissions(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading skeleton
  }

  if (!hasPermissions) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}

/**
 * Utility hook for getting current user info
 */
export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { authenticated, user: userData } = await secureAuthService.initialize();
      if (authenticated && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    switch (role) {
      case 'admin':
        return user.role === 'admin';
      case 'user':
        return user.role === 'user' || user.role === 'admin';
      default:
        return user.role === role;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return (user.permissions || []).includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => 
      (user.permissions || []).includes(permission)
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => 
      (user.permissions || []).includes(permission)
    );
  };

  return {
    user,
    isLoading,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    reload: loadUser,
  };
}