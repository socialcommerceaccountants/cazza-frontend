/**
 * Secure API Client
 * 
 * Enhanced API client with security features:
 * 1. Automatic CSRF token inclusion
 * 2. Token refresh on 401 responses
 * 3. No client-side token storage
 * 4. Secure error handling
 */

import { secureAuthService } from './auth';

export class SecureApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SecureApiError';
  }
}

class SecureApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Make a secure API request
   * - Automatically includes CSRF token for mutating requests
   * - Handles token refresh on 401 responses
   * - Implements retry logic with exponential backoff
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/${process.env.NEXT_PUBLIC_API_VERSION || 'v1'}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    // Add CSRF token for mutating requests (POST, PUT, PATCH, DELETE)
    const isMutatingRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET');
    if (isMutatingRequest) {
      const csrfToken = secureAuthService.getCSRFToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      } else {
        console.warn('CSRF token missing for mutating request');
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies
    };

    try {
      const response = await fetch(url, config);

      // Handle unauthorized responses (token expired)
      if (response.status === 401) {
        // Try to refresh token and retry once
        const newCsrfToken = await secureAuthService.refreshToken();
        
        if (newCsrfToken && this.retryCount < this.maxRetries) {
          this.retryCount++;
          
          // Update CSRF token in headers and retry
          if (isMutatingRequest) {
            headers['X-CSRF-Token'] = newCsrfToken;
          }
          
          const retryConfig = { ...config, headers };
          const retryResponse = await fetch(url, retryConfig);
          
          if (retryResponse.ok) {
            this.retryCount = 0;
            return this.handleResponse<T>(retryResponse);
          }
        }
        
        // Refresh failed or max retries exceeded
        throw new SecureApiError('Unauthorized - Please login again', 401, 'UNAUTHORIZED');
      }

      // Handle CSRF token validation failures
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.code === 'CSRF_TOKEN_INVALID') {
          // CSRF token invalid, clear auth and redirect to login
          secureAuthService.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login?error=session_expired';
          }
          throw new SecureApiError('Security validation failed - Please login again', 403, 'CSRF_TOKEN_INVALID');
        }
        throw new SecureApiError('Forbidden', 403, 'FORBIDDEN', errorData);
      }

      // Handle other error responses
      if (!response.ok) {
        return this.handleErrorResponse(response);
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof SecureApiError) {
        throw error;
      }
      
      // Network errors or other fetch failures
      throw new SecureApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'NETWORK_ERROR'
      );
    } finally {
      // Reset retry count after successful request or final failure
      if (this.retryCount >= this.maxRetries) {
        this.retryCount = 0;
      }
    }
  }

  /**
   * Handle successful response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Check for CSRF token in response (for login/register/refresh)
    const csrfToken = response.headers.get('X-CSRF-Token');
    if (csrfToken) {
      secureAuthService.setCSRFToken(csrfToken);
    }

    // Parse response body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  }

  /**
   * Handle error response
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    // Extract security-related error codes
    const securityErrorCodes = [
      'CSRF_TOKEN_INVALID',
      'CSRF_TOKEN_MISSING',
      'AUTH_TOKEN_EXPIRED',
      'AUTH_TOKEN_INVALID',
      'REFRESH_TOKEN_INVALID'
    ];

    if (securityErrorCodes.includes(errorData.code)) {
      // Security violation - clear auth state
      secureAuthService.clearAuth();
      
      if (typeof window !== 'undefined') {
        // Redirect to login with error message
        const params = new URLSearchParams({
          error: 'security_violation',
          code: errorData.code
        });
        window.location.href = `/login?${params.toString()}`;
      }
    }

    throw new SecureApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData.code,
      errorData.details
    );
  }

  // HTTP methods with automatic CSRF protection
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Secure file upload with CSRF protection
   */
  async upload<T>(endpoint: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const csrfToken = secureAuthService.getCSRFToken();
    const headers: Record<string, string> = {};
    
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const response = await fetch(
      `${this.baseURL}/${process.env.NEXT_PUBLIC_API_VERSION || 'v1'}${endpoint}`,
      {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new SecureApiError(`Upload failed: ${response.statusText}`, response.status);
    }

    // Check for CSRF token in response
    const newCsrfToken = response.headers.get('X-CSRF-Token');
    if (newCsrfToken) {
      secureAuthService.setCSRFToken(newCsrfToken);
    }

    return response.json();
  }

  /**
   * Health check - verify API connectivity and auth status
   */
  async healthCheck(): Promise<{ healthy: boolean; authenticated: boolean; csrfTokenValid: boolean }> {
    try {
      const response = await this.get<{ status: string; authenticated: boolean }>('/health');
      const csrfTokenValid = !!secureAuthService.getCSRFToken();
      
      return {
        healthy: response.status === 'ok',
        authenticated: response.authenticated || false,
        csrfTokenValid
      };
    } catch (error) {
      return {
        healthy: false,
        authenticated: false,
        csrfTokenValid: false
      };
    }
  }
}

// Create singleton instance
export const secureApiClient = new SecureApiClient();

/**
 * React hook for secure API client
 */
export const useSecureApiClient = () => {
  return secureApiClient;
};

/**
 * Hook for making secure API calls with React Query
 */
export const useSecureQuery = <T>(
  queryKey: any[],
  endpoint: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    retry?: boolean | number | ((failureCount: number, error: SecureApiError) => boolean);
  }
) => {
  const { enabled = true, staleTime, gcTime, retry } = options || {};

  return useQuery({
    queryKey,
    queryFn: () => secureApiClient.get<T>(endpoint),
    enabled,
    staleTime,
    gcTime,
    retry: retry ?? (failureCount, error) => {
      // Don't retry on authentication/authorization errors
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook for making secure mutations with React Query
 */
export const useSecureMutation = <T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    onSuccess?: (data: T, variables: V, context?: any) => void;
    onError?: (error: SecureApiError, variables: V, context?: any) => void;
    onSettled?: (data: T | undefined, error: SecureApiError | null, variables: V, context?: any) => void;
  }
) => {
  return useMutation({
    mutationFn,
    ...options,
  });
};