import { apiClient } from './client';

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
    company?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  refreshToken?: string;
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

class AuthService {
  // Authentication endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Logout even if API call fails
      console.warn('Logout API call failed, clearing local auth anyway');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  }

  async verifyToken(token: string): Promise<{ valid: boolean; user?: UserProfile }> {
    return apiClient.post('/auth/verify', { token });
  }

  // User profile endpoints
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/users/me');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/users/me', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post('/users/change-password', data);
  }

  // Password reset endpoints
  async requestPasswordReset(data: ResetPasswordRequest): Promise<void> {
    return apiClient.post('/auth/forgot-password', data);
  }

  async resetPassword(data: VerifyResetTokenRequest): Promise<void> {
    return apiClient.post('/auth/reset-password', data);
  }

  // Social login (if supported)
  async socialLogin(provider: string, code: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`/auth/${provider}/callback`, { code });
  }

  // Check if user is authenticated (client-side only)
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Get token from storage (client-side only)
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // Set token in storage (client-side only)
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  // Clear auth storage (client-side only)
  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
  }

  // Initialize auth from storage (client-side only)
  initializeFromStorage(): { token: string | null; user: UserProfile | null } {
    if (typeof window === 'undefined') return { token: null, user: null };

    const token = localStorage.getItem('auth_token');
    let user = null;

    try {
      const userStr = localStorage.getItem('user_profile');
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Failed to parse user profile from storage:', error);
    }

    return { token, user };
  }

  // Save auth to storage (client-side only)
  saveToStorage(authData: AuthResponse): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('auth_token', authData.token);
    if (authData.refreshToken) {
      localStorage.setItem('refresh_token', authData.refreshToken);
    }
    localStorage.setItem('user_profile', JSON.stringify(authData.user));
  }
}

// Create singleton instance
export const authService = new AuthService();

// React Query hooks for authentication
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      authService.saveToStorage(data);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      authService.saveToStorage(data);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      authService.clearAuth();
      queryClient.clear();
      queryClient.removeQueries();
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getProfile(),
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(data));
      }
    },
  });
};