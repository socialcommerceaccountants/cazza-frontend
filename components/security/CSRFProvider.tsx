'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { csrfTokenStorage, CSRFValidator, csrfUtils } from '@/lib/security/csrf.tsx';
import { secureApiClient } from '@/lib/security/api-client';

interface CSRFContextType {
  // State
  token: string | null;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshToken: () => Promise<string | null>;
  clearToken: () => void;
  validateToken: (token: string) => boolean;
  
  // Utilities
  getHeader: () => Record<string, string>;
  requiresProtection: (method: string) => boolean;
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined);

interface CSRFProviderProps {
  children: ReactNode;
  /**
   * Initial CSRF token (from server-side rendering)
   */
  initialToken?: string;
  /**
   * Whether to automatically refresh token on mount
   */
  autoRefresh?: boolean;
  /**
   * Refresh interval in milliseconds
   */
  refreshInterval?: number;
  /**
   * Whether to validate token format on load
   */
  validateOnLoad?: boolean;
}

/**
 * CSRF Provider Component
 * 
 * Manages CSRF token state and provides utilities for CSRF protection.
 * Should be used in conjunction with the secure API client.
 */
export function CSRFProvider({
  children,
  initialToken,
  autoRefresh = true,
  refreshInterval = 30 * 60 * 1000, // 30 minutes
  validateOnLoad = true,
}: CSRFProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize CSRF token
  useEffect(() => {
    initializeCSRF();
  }, []);

  // Set up automatic refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      if (isValid) {
        refreshToken().catch(console.error);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isValid]);

  const initializeCSRF = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let csrfToken: string | null = null;

      // Try to get token from storage
      csrfToken = csrfTokenStorage.getToken();

      // Use initial token if provided and storage is empty
      if (!csrfToken && initialToken) {
        csrfToken = initialToken;
        csrfTokenStorage.setToken(initialToken);
      }

      // Validate token format
      if (csrfToken && validateOnLoad) {
        const isValidFormat = CSRFValidator.validateFormat(csrfToken);
        if (!isValidFormat) {
          console.warn('Stored CSRF token has invalid format, clearing');
          csrfTokenStorage.clearToken();
          csrfToken = null;
        }
      }

      // If no token, try to fetch from server
      if (!csrfToken && autoRefresh) {
        csrfToken = await fetchCSRFToken();
      }

      setToken(csrfToken);
      setIsValid(!!csrfToken);
    } catch (err) {
      console.error('Failed to initialize CSRF:', err);
      setError(err instanceof Error ? err.message : 'CSRF initialization failed');
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCSRFToken = async (): Promise<string | null> => {
    try {
      // Use secure API client to get CSRF token
      const response = await secureApiClient.get<{ csrfToken: string }>('/auth/csrf-token');
      
      if (response.csrfToken && CSRFValidator.validateFormat(response.csrfToken)) {
        csrfTokenStorage.setToken(response.csrfToken);
        return response.csrfToken;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      return null;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newToken = await fetchCSRFToken();
      
      setToken(newToken);
      setIsValid(!!newToken);
      
      return newToken;
    } catch (err) {
      console.error('Failed to refresh CSRF token:', err);
      setError(err instanceof Error ? err.message : 'CSRF refresh failed');
      setIsValid(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearToken = () => {
    csrfTokenStorage.clearToken();
    setToken(null);
    setIsValid(false);
    setError(null);
  };

  const validateToken = (tokenToValidate: string): boolean => {
    return CSRFValidator.validateFormat(tokenToValidate);
  };

  const getHeader = (): Record<string, string> => {
    return CSRFValidator.createHeader();
  };

  const requiresProtection = (method: string): boolean => {
    return CSRFValidator.requiresProtection(method);
  };

  const value: CSRFContextType = {
    // State
    token,
    isValid,
    isLoading,
    error,
    
    // Actions
    refreshToken,
    clearToken,
    validateToken,
    
    // Utilities
    getHeader,
    requiresProtection,
  };

  return (
    <CSRFContext.Provider value={value}>
      {children}
    </CSRFContext.Provider>
  );
}

/**
 * Hook to use CSRF context
 */
export function useCSRF() {
  const context = useContext(CSRFContext);
  
  if (context === undefined) {
    throw new Error('useCSRF must be used within a CSRFProvider');
  }
  
  return context;
}

/**
 * Higher-order component to inject CSRF token into API calls
 */
export function withCSRFProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function CSRFProtectedComponent(props: P) {
    const { token, isValid, isLoading } = useCSRF();

    // Show loading state while CSRF token is being initialized
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">Loading security token...</span>
        </div>
      );
    }

    // Show warning if CSRF token is invalid
    if (!isValid) {
      return (
        <div className="p-4 border border-warning/20 bg-warning/5 rounded-md">
          <div className="flex items-center gap-2 text-warning">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Security Warning</span>
          </div>
          <p className="mt-2 text-sm text-warning/80">
            CSRF protection is not active. Some features may not work correctly.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * Component to display CSRF token status
 */
export function CSRFTokenStatus() {
  const { token, isValid, isLoading, error, refreshToken } = useCSRF();
  
  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-muted rounded-full">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
        <span>CSRF: Loading...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-destructive/10 text-destructive rounded-full">
        <div className="h-2 w-2 rounded-full bg-destructive"></div>
        <span>CSRF: Error</span>
      </div>
    );
  }
  
  if (!isValid || !token) {
    return (
      <button
        onClick={() => refreshToken()}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-warning/10 text-warning rounded-full hover:bg-warning/20 transition-colors"
      >
        <div className="h-2 w-2 rounded-full bg-warning"></div>
        <span>CSRF: Missing</span>
      </button>
    );
  }
  
  const tokenPreview = token.length > 8 
    ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
    : token;
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-success/10 text-success rounded-full">
      <div className="h-2 w-2 rounded-full bg-success"></div>
      <span title={token}>CSRF: {tokenPreview}</span>
    </div>
  );
}

/**
 * Hook to get CSRF header for API calls
 */
export function useCSRFHeader() {
  const { getHeader, isValid, refreshToken } = useCSRF();
  
  const getCSRFHeader = async (): Promise<Record<string, string>> => {
    if (!isValid) {
      // Try to refresh token if invalid
      await refreshToken();
    }
    
    return getHeader();
  };
  
  return {
    getCSRFHeader,
    isValid,
  };
}

/**
 * Hook to check if CSRF protection is required for a specific action
 */
export function useCSRFRequirement(method: string = 'POST') {
  const { requiresProtection, isValid, isLoading } = useCSRF();
  
  const isRequired = requiresProtection(method);
  const isReady = !isLoading && isValid;
  const isProtected = isRequired && isReady;
  
  return {
    isRequired,
    isReady,
    isProtected,
    missingProtection: isRequired && !isReady,
  };
}

/**
 * Component that automatically adds CSRF token to forms
 */
interface CSRFProtectedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  method?: string;
}

export function CSRFProtectedForm({ 
  children, 
  method = 'POST',
  ...formProps 
}: CSRFProtectedFormProps) {
  const { token, isValid } = useCSRF();
  const requiresCSRF = CSRFValidator.requiresProtection(method);
  
  return (
    <form method={method} {...formProps}>
      {requiresCSRF && isValid && token && (
        <input
          type="hidden"
          name="csrf_token"
          value={token}
        />
      )}
      {children}
    </form>
  );
}

/**
 * Hook to handle CSRF token extraction from responses
 */
export function useCSRFResponseHandler() {
  const { validateToken } = useCSRF();
  
  const handleResponse = async (response: Response): Promise<string | null> => {
    const token = await csrfUtils.extractFromFetchResponse(response);
    
    if (token && validateToken(token)) {
      csrfTokenStorage.setToken(token);
      return token;
    }
    
    return null;
  };
  
  return {
    handleResponse,
  };
}

/**
 * Utility to create CSRF-protected fetch wrapper
 */
export function createCSRFProtectedFetch() {
  return async function csrfProtectedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const method = init?.method || 'GET';
    const requiresCSRF = CSRFValidator.requiresProtection(method);
    
    const headers = new Headers(init?.headers);
    
    if (requiresCSRF) {
      const token = csrfTokenStorage.getToken();
      if (token) {
        headers.set('X-CSRF-Token', token);
      }
    }
    
    const response = await fetch(input, {
      ...init,
      headers,
      credentials: 'include',
    });
    
    // Extract CSRF token from response if present
    const csrfToken = await csrfUtils.extractFromFetchResponse(response);
    if (csrfToken && CSRFValidator.validateFormat(csrfToken)) {
      csrfTokenStorage.setToken(csrfToken);
    }
    
    return response;
  };
}

/**
 * React Query configuration with CSRF protection
 */
import { QueryClient, DefaultOptions } from '@tanstack/react-query';

export function createCSRFProtectedQueryClient(): QueryClient {
  const csrfFetch = createCSRFProtectedFetch();
  
  const defaultOptions: DefaultOptions = {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on CSRF or auth errors
        if (error?.status === 403 && error?.code === 'CSRF_TOKEN_INVALID') {
          return false;
        }
        if (error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on CSRF errors
        if (error?.status === 403 && error?.code === 'CSRF_TOKEN_INVALID') {
          return false;
        }
        return failureCount < 3;
      },
    },
  };
  
  return new QueryClient({
    defaultOptions,
  });
}

/**
 * Custom fetch hook with CSRF protection
 */
export function useCSRFProtectedFetch() {
  const csrfFetch = createCSRFProtectedFetch();
  
  return csrfFetch;
}