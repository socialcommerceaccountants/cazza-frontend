import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, UserProfile } from '@/lib/api/auth';

interface AuthState {
  // State
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth from storage
      initialize: async () => {
        set({ isLoading: true });
        try {
          const { token, user } = authService.initializeFromStorage();
          
          if (token && user) {
            // Verify token is still valid
            try {
              const { valid } = await authService.verifyToken(token);
              if (valid) {
                set({
                  user,
                  token,
                  isAuthenticated: true,
                  error: null,
                });
              } else {
                // Token invalid, clear auth
                authService.clearAuth();
                set({
                  user: null,
                  token: null,
                  isAuthenticated: false,
                  error: null,
                });
              }
            } catch (error) {
              // Verification failed, clear auth
              authService.clearAuth();
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
              });
            }
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({ error: 'Failed to initialize authentication' });
        } finally {
          set({ isLoading: false });
        }
      },

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          
          authService.saveToStorage(response);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed. Please check your credentials.';
          set({ error: errorMessage, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Register action
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          
          authService.saveToStorage(response);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed. Please try again.';
          set({ error: errorMessage, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Logout API call failed:', error);
        } finally {
          authService.clearAuth();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Update profile action
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(data);
          
          // Update local storage
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_profile', JSON.stringify(updatedUser));
          }
          
          set({
            user: updatedUser,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to update profile';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear error action
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Only persist to localStorage on client side
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

// Helper hook to check auth status
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    initialize,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    setLoading,
  } = useAuthStore();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    initialize,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    setLoading,
    
    // Derived state
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    hasCompany: !!user?.company,
  };
};

// Hook for protected routes
export const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();

  if (typeof window !== 'undefined' && !isLoading && !isAuthenticated) {
    window.location.href = redirectTo;
  }

  return { isAuthenticated, isLoading };
};