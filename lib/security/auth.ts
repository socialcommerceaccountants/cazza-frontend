/**
 * Secure Authentication Library
 * 
 * This library provides secure authentication utilities that avoid common vulnerabilities:
 * - No localStorage token storage (uses HttpOnly cookies)
 * - No client-side JWT parsing (server-side validation only)
 * - CSRF protection for all mutating requests
 * - Secure token refresh with rotation
 */

import { secureApiClient } from './api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  // Note: Tokens are now set as HttpOnly cookies by the server
  // The response only contains the CSRF token for client-side storage
  csrfToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: string;
  avatar?: string;
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  company?: string;
  avatar?: string;
  preferences?: Record<string, any>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyResetTokenRequest {
  token: string;
  newPassword: string;
}

/**
 * Secure authentication service
 * 
 * Key differences from the old auth service:
 * 1. No localStorage usage - tokens are in HttpOnly cookies
 * 2. No client-side JWT parsing - server validates everything
 * 3. CSRF protection on all mutating requests
 * 4. Automatic token refresh handling
 */
class SecureAuthService {
  private csrfToken: string | null = null;
  private refreshInProgress: boolean = false;
  private refreshPromise: Promise<string | null> | null = null;

  /**
   * Set CSRF token (called after login/register)
   */
  setCSRFToken(token: string): void {
    this.csrfToken = token;
    // Store in memory only - NOT localStorage
  }

  /**
   * Get CSRF token for API requests
   */
  getCSRFToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Clear authentication state
   */
  clearAuth(): void {
    this.csrfToken = null;
    // Cookies are cleared by server on logout
  }

  /**
   * Check if user is authenticated
   * This now makes a server call to validate the HttpOnly cookie
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Server validates the HttpOnly cookie and returns auth status
      const response = await secureApiClient.get<{ authenticated: boolean }>('/auth/status');
      return response.authenticated;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return false;
    }
  }

  /**
   * Login with email and password
   * Server sets HttpOnly cookies for auth_token and csrf_token
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await secureApiClient.post<AuthResponse>('/auth/login', data);
    
    // Store CSRF token in memory (from response body)
    this.setCSRFToken(response.csrfToken);
    
    return response;
  }

  /**
   * Register new user
   * Server sets HttpOnly cookies for auth_token and csrf_token
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await secureApiClient.post<AuthResponse>('/auth/register', data);
    
    // Store CSRF token in memory (from response body)
    this.setCSRFToken(response.csrfToken);
    
    return response;
  }

  /**
   * Logout - clears server cookies and client state
   */
  async logout(): Promise<void> {
    try {
      await secureApiClient.post('/auth/logout');
    } catch (error) {
      // Logout even if API call fails
      console.warn('Logout API call failed, clearing local auth anyway');
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Refresh access token (handled automatically by api-client)
   * This is called internally when a 401 is received
   */
  async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshInProgress && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshInProgress = true;
    this.refreshPromise = (async () => {
      try {
        const response = await secureApiClient.post<{ csrfToken: string }>('/auth/refresh');
        this.setCSRFToken(response.csrfToken);
        return response.csrfToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearAuth();
        return null;
      } finally {
        this.refreshInProgress = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Verify token validity (server-side only)
   */
  async verifyToken(): Promise<{ valid: boolean; user?: UserProfile }> {
    return secureApiClient.get('/auth/verify');
  }

  // User profile endpoints
  async getProfile(): Promise<UserProfile> {
    return secureApiClient.get<UserProfile>('/users/me');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return secureApiClient.patch<UserProfile>('/users/me', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return secureApiClient.post('/users/change-password', data);
  }

  // Password reset endpoints
  async requestPasswordReset(data: ResetPasswordRequest): Promise<void> {
    return secureApiClient.post('/auth/forgot-password', data);
  }

  async resetPassword(data: VerifyResetTokenRequest): Promise<void> {
    return secureApiClient.post('/auth/reset-password', data);
  }

  // Social login (if supported)
  async socialLogin(provider: string, code: string): Promise<AuthResponse> {
    const response = await secureApiClient.post<AuthResponse>(`/auth/${provider}/callback`, { code });
    this.setCSRFToken(response.csrfToken);
    return response;
  }

  /**
   * Initialize authentication from server
   * Checks if user is authenticated and gets CSRF token if needed
   */
  async initialize(): Promise<{ authenticated: boolean; user?: UserProfile }> {
    try {
      const [authStatus, profile] = await Promise.all([
        this.isAuthenticated(),
        this.getProfile().catch(() => null)
      ]);

      if (authStatus && profile) {
        return { authenticated: true, user: profile };
      }

      return { authenticated: false };
    } catch (error) {
      console.error('Auth initialization failed:', error);
      return { authenticated: false };
    }
  }
}

// Create singleton instance
export const secureAuthService = new SecureAuthService();

// React Query hooks for secure authentication
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSecureLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => secureAuthService.login(data),
    onSuccess: (data) => {
      // Update user data in React Query cache
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['csrfToken'], data.csrfToken);
    },
  });
};

export const useSecureRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => secureAuthService.register(data),
    onSuccess: (data) => {
      // Update user data in React Query cache
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['csrfToken'], data.csrfToken);
    },
  });
};

export const useSecureLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => secureAuthService.logout(),
    onSuccess: () => {
      // Clear all queries and cache
      secureAuthService.clearAuth();
      queryClient.clear();
      queryClient.removeQueries();
    },
  });
};

export const useSecureProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => secureAuthService.getProfile(),
    enabled: false, // Will be enabled by auth status check
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

export const useSecureUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => secureAuthService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });
};

/**
 * Hook to check authentication status
 * Makes a server call to verify HttpOnly cookie
 */
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      const { authenticated, user } = await secureAuthService.initialize();
      return { authenticated, user };
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};