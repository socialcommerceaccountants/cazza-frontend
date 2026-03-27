import { apiClient } from './client';

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
}

export interface CACChannel {
  id: string;
  channel: string;
  spend: number;
  customers: number;
  cac: number;
  ltv: number;
  roi: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ROIAnalysis {
  id: string;
  category: string;
  investment: number;
  return: number;
  roi: number;
  duration: number;
  risk: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformPerformance {
  id: string;
  platform: string;
  revenue: number;
  users: number;
  conversion: number;
  growth: number;
  cac: number;
  ltv: number;
  sessions: number;
  bounceRate: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RealTimeMetric {
  timestamp: number;
  revenue: number;
  users: number;
  orders: number;
  conversion: number;
  avgOrderValue: number;
}

export interface TimeRange {
  start: string;
  end: string;
  label: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  growthRate: number;
  activeUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  customerCount: number;
}

class AnalyticsService {
  // Revenue analytics
  async getRevenueData(timeRange: string = '30d'): Promise<RevenueDataPoint[]> {
    return apiClient.get<RevenueDataPoint[]>(`/analytics/revenue?range=${timeRange}`);
  }

  async getRevenueSummary(timeRange: string = '30d'): Promise<{
    total: number;
    average: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    return apiClient.get(`/analytics/revenue/summary?range=${timeRange}`);
  }

  // CAC analytics
  async getCACData(): Promise<CACChannel[]> {
    return apiClient.get<CACChannel[]>('/analytics/cac');
  }

  async createCACChannel(data: Omit<CACChannel, 'id'>): Promise<CACChannel> {
    return apiClient.post<CACChannel>('/analytics/cac', data);
  }

  async updateCACChannel(id: string, data: Partial<CACChannel>): Promise<CACChannel> {
    return apiClient.put<CACChannel>(`/analytics/cac/${id}`, data);
  }

  async deleteCACChannel(id: string): Promise<void> {
    return apiClient.delete(`/analytics/cac/${id}`);
  }

  // ROI analytics
  async getROIData(): Promise<ROIAnalysis[]> {
    return apiClient.get<ROIAnalysis[]>('/analytics/roi');
  }

  async createROIAnalysis(data: Omit<ROIAnalysis, 'id'>): Promise<ROIAnalysis> {
    return apiClient.post<ROIAnalysis>('/analytics/roi', data);
  }

  async updateROIAnalysis(id: string, data: Partial<ROIAnalysis>): Promise<ROIAnalysis> {
    return apiClient.put<ROIAnalysis>(`/analytics/roi/${id}`, data);
  }

  // Platform performance
  async getPlatformData(): Promise<PlatformPerformance[]> {
    return apiClient.get<PlatformPerformance[]>('/analytics/platforms');
  }

  async getPlatformPerformance(platformId: string): Promise<PlatformPerformance> {
    return apiClient.get<PlatformPerformance>(`/analytics/platforms/${platformId}`);
  }

  // Real-time metrics
  async getRealtimeMetrics(): Promise<RealTimeMetric[]> {
    return apiClient.get<RealTimeMetric[]>('/analytics/realtime');
  }

  async getRealtimeSummary(): Promise<{
    currentRevenue: number;
    currentUsers: number;
    currentOrders: number;
    peakHour: string;
    trend: 'up' | 'down' | 'stable';
  }> {
    return apiClient.get('/analytics/realtime/summary');
  }

  // Analytics summary
  async getAnalyticsSummary(timeRange: string = '30d'): Promise<AnalyticsSummary> {
    return apiClient.get<AnalyticsSummary>(`/analytics/summary?range=${timeRange}`);
  }

  // Export data
  async exportAnalyticsData(format: 'csv' | 'json' | 'xlsx', timeRange: string = '30d'): Promise<Blob> {
    const response = await fetch(
      `${apiClient['baseURL']}/${process.env.NEXT_PUBLIC_API_VERSION || 'v1'}/analytics/export?format=${format}&range=${timeRange}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Custom query
  async queryAnalytics(query: {
    metrics: string[];
    dimensions?: string[];
    filters?: Record<string, any>;
    timeRange?: string;
    limit?: number;
  }): Promise<any> {
    return apiClient.post('/analytics/query', query);
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// React Query hooks for analytics
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useRevenueData = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ['revenue', timeRange],
    queryFn: () => analyticsService.getRevenueData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useCACData = () => {
  return useQuery({
    queryKey: ['cac'],
    queryFn: () => analyticsService.getCACData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateCACChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CACChannel, 'id'>) => analyticsService.createCACChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cac'] });
    },
  });
};

export const useUpdateCACChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CACChannel> }) =>
      analyticsService.updateCACChannel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cac'] });
    },
  });
};

export const useDeleteCACChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => analyticsService.deleteCACChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cac'] });
    },
  });
};

export const useROIData = () => {
  return useQuery({
    queryKey: ['roi'],
    queryFn: () => analyticsService.getROIData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const usePlatformData = () => {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: () => analyticsService.getPlatformData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useRealtimeMetrics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['realtime'],
    queryFn: () => analyticsService.getRealtimeMetrics(),
    staleTime: 0, // Always stale for real-time data
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: enabled ? 10000 : false, // Refetch every 10 seconds if enabled
    refetchIntervalInBackground: true,
    enabled,
    retry: 1,
  });
};

export const useAnalyticsSummary = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ['analytics-summary', timeRange],
    queryFn: () => analyticsService.getAnalyticsSummary(timeRange),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};