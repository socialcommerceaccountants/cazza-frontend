import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalyticsPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTimeRange: '7d' | '30d' | '90d' | '1y';
  chartType: 'line' | 'bar' | 'area';
  autoRefresh: boolean;
  refreshInterval: number;
  visibleMetrics: string[];
}

interface AnalyticsState {
  preferences: AnalyticsPreferences;
  lastUpdated: number | null;
  isConnected: boolean;
  error: string | null;
  
  // Actions
  setPreferences: (preferences: Partial<AnalyticsPreferences>) => void;
  updateLastUpdated: () => void;
  setConnectionStatus: (connected: boolean) => void;
  setError: (error: string | null) => void;
  resetPreferences: () => void;
}

const defaultPreferences: AnalyticsPreferences = {
  theme: 'system',
  defaultTimeRange: '30d',
  chartType: 'line',
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  visibleMetrics: ['revenue', 'users', 'conversion', 'growth'],
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      lastUpdated: null,
      isConnected: false,
      error: null,
      
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      updateLastUpdated: () =>
        set({ lastUpdated: Date.now() }),
      
      setConnectionStatus: (connected) =>
        set({ isConnected: connected }),
      
      setError: (error) =>
        set({ error }),
      
      resetPreferences: () =>
        set({ preferences: defaultPreferences }),
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);