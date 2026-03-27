import { useAuthStore } from '@/lib/store/auth-store';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/${process.env.NEXT_PUBLIC_API_VERSION || 'v1'}${endpoint}`;
    
    // Get auth token from store
    const authStore = typeof window !== 'undefined' ? useAuthStore.getState() : null;
    const token = authStore?.token;
    
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);

      // Handle unauthorized responses
      if (response.status === 401) {
        if (typeof window !== 'undefined' && authStore) {
          authStore.logout();
          window.location.href = '/login';
        }
        throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      // Handle other error responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network errors or other fetch failures
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // HTTP methods
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

  // File upload helper
  async upload<T>(endpoint: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: Record<string, string> = {};
    const authStore = typeof window !== 'undefined' ? useAuthStore.getState() : null;
    const token = authStore?.token;
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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
      throw new ApiError(`Upload failed: ${response.statusText}`, response.status);
    }

    return response.json();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// React hook for API client (optional, for components that need direct access)
export const useApiClient = () => {
  return apiClient;
};