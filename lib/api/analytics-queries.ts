import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  analyticsService,
  RevenueDataPoint,
  CACChannel,
  ROIAnalysis,
  PlatformPerformance,
  RealTimeMetric,
} from './analytics';

// Check if we should use mock data (for development without backend)
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Mock API functions - fallback when backend is not available
const mockApi = {
  // Revenue data
  fetchRevenueData: async (timeRange: string): Promise<RevenueDataPoint[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : timeRange === '1y' ? 365 : 30;
    const data: RevenueDataPoint[] = [];
    
    let baseRevenue = 50000;
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      const revenue = baseRevenue + Math.random() * 15000 - 5000;
      const expenses = revenue * (0.3 + Math.random() * 0.2);
      const profit = revenue - expenses;
      const growth = i > 0 ? ((revenue - baseRevenue) / baseRevenue) * 100 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        profit: Math.round(profit),
        growth: parseFloat(growth.toFixed(2)),
      });
      
      baseRevenue = revenue;
    }
    
    return data;
  },

  // CAC data
  fetchCACData: async (): Promise<CACChannel[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        channel: 'Google Ads',
        spend: 12500,
        customers: 250,
        cac: 50,
        ltv: 300,
        roi: 500,
      },
      {
        id: '2',
        channel: 'Facebook',
        spend: 8500,
        customers: 200,
        cac: 42.5,
        ltv: 280,
        roi: 559,
      },
      {
        id: '3',
        channel: 'LinkedIn',
        spend: 6000,
        customers: 75,
        cac: 80,
        ltv: 450,
        roi: 463,
      },
      {
        id: '4',
        channel: 'Email',
        spend: 2000,
        customers: 150,
        cac: 13.33,
        ltv: 200,
        roi: 1400,
      },
      {
        id: '5',
        channel: 'Organic',
        spend: 1000,
        customers: 100,
        cac: 10,
        ltv: 180,
        roi: 1700,
      },
    ];
  },

  // ROI data
  fetchROIData: async (): Promise<ROIAnalysis[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        category: 'Marketing Campaigns',
        investment: 50000,
        return: 175000,
        roi: 250,
        duration: 6,
        risk: 'medium' as const,
      },
      {
        id: '2',
        category: 'Product Development',
        investment: 150000,
        return: 450000,
        roi: 200,
        duration: 12,
        risk: 'low' as const,
      },
      {
        id: '3',
        category: 'Sales Team',
        investment: 200000,
        return: 800000,
        roi: 300,
        duration: 12,
        risk: 'medium' as const,
      },
      {
        id: '4',
        category: 'Infrastructure',
        investment: 75000,
        return: 150000,
        roi: 100,
        duration: 24,
        risk: 'low' as const,
      },
      {
        id: '5',
        category: 'R&D',
        investment: 100000,
        return: 250000,
        roi: 150,
        duration: 18,
        risk: 'high' as const,
      },
    ];
  },

  // Platform performance data
  fetchPlatformData: async (): Promise<PlatformPerformance[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        platform: 'Shopify',
        revenue: 125000,
        users: 12500,
        conversion: 3.2,
        growth: 12.5,
        cac: 42.5,
        ltv: 320,
        sessions: 390625,
        bounceRate: 42.1,
      },
      {
        id: '2',
        platform: 'Amazon',
        revenue: 98000,
        users: 24500,
        conversion: 1.8,
        growth: 8.2,
        cac: 38.2,
        ltv: 280,
        sessions: 5444444,
        bounceRate: 65.3,
      },
      {
        id: '3',
        platform: 'Etsy',
        revenue: 45000,
        users: 7500,
        conversion: 2.1,
        growth: 15.8,
        cac: 28.5,
        ltv: 240,
        sessions: 357142,
        bounceRate: 48.7,
      },
      {
        id: '4',
        platform: 'WooCommerce',
        revenue: 32000,
        users: 4200,
        conversion: 2.8,
        growth: 5.4,
        cac: 35.2,
        ltv: 310,
        sessions: 150000,
        bounceRate: 38.9,
      },
    ];
  },

  // Real-time metrics
  fetchRealtimeMetrics: async (): Promise<RealTimeMetric[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const data: RealTimeMetric[] = [];
    const now = Date.now();
    
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - (i * 60000);
      const baseRevenue = 1000 + Math.random() * 500;
      const baseUsers = 50 + Math.random() * 30;
      const baseOrders = 5 + Math.random() * 3;
      
      data.push({
        timestamp,
        revenue: Math.round(baseRevenue),
        users: Math.round(baseUsers),
        orders: Math.round(baseOrders),
        conversion: parseFloat(((baseOrders / baseUsers) * 100).toFixed(2)),
        avgOrderValue: parseFloat((baseRevenue / baseOrders).toFixed(2)),
      });
    }
    
    return data;
  },

  // Update CAC channel
  updateCACChannel: async (channelData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating channel:', channelData);
    return { success: true, data: channelData };
  },

  // Delete CAC channel
  deleteCACChannel: async (channelId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting channel:', channelId);
    return { success: true, channelId };
  },
};

// Helper function to choose between real API and mock API
const getApiFunction = <T extends (...args: any[]) => any>(
  realFn: T,
  mockFn: T
): T => {
  return ((...args: Parameters<T>) => {
    if (USE_MOCK_API) {
      console.log('Using mock API for development');
      return mockFn(...args);
    }
    try {
      return realFn(...args);
    } catch (error) {
      console.warn('Real API call failed, falling back to mock:', error);
      return mockFn(...args);
    }
  }) as T;
};

// React Query hooks
export const useRevenueData = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ['revenue', timeRange],
    queryFn: getApiFunction(
      () => analyticsService.getRevenueData(timeRange),
      () => mockApi.fetchRevenueData(timeRange)
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: USE_MOCK_API ? 0 : 2, // Don't retry mock API failures
  });
};

export const useCACData = () => {
  return useQuery({
    queryKey: ['cac'],
    queryFn: getApiFunction(
      () => analyticsService.getCACData(),
      () => mockApi.fetchCACData()
    ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: USE_MOCK_API ? 0 : 2,
  });
};

export const useROIData = () => {
  return useQuery({
    queryKey: ['roi'],
    queryFn: getApiFunction(
      () => analyticsService.getROIData(),
      () => mockApi.fetchROIData()
    ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: USE_MOCK_API ? 0 : 2,
  });
};

export const usePlatformData = () => {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: getApiFunction(
      () => analyticsService.getPlatformData(),
      () => mockApi.fetchPlatformData()
    ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: USE_MOCK_API ? 0 : 2,
  });
};

export const useRealtimeMetrics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['realtime'],
    queryFn: getApiFunction(
      () => analyticsService.getRealtimeMetrics(),
      () => mockApi.fetchRealtimeMetrics()
    ),
    staleTime: 0, // Always stale for real-time data
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: enabled ? 10000 : false, // Refetch every 10 seconds if enabled
    refetchIntervalInBackground: true,
    enabled,
    retry: USE_MOCK_API ? 0 : 1,
  });
};

export const useUpdateCACChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: getApiFunction(
      (data: any) => {
        if (data.id) {
          return analyticsService.updateCACChannel(data.id, data);
        }
        return analyticsService.createCACChannel(data);
      },
      mockApi.updateCACChannel
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cac'] });
    },
  });
};

export const useDeleteCACChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: getApiFunction(
      (id: string) => analyticsService.deleteCACChannel(id),
      mockApi.deleteCACChannel
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cac'] });
    },
  });
};

// WebSocket simulation hook
export const useWebSocket = (url: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['websocket', url],
    queryFn: async () => {
      if (!enabled) return { connected: false, latency: null };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        connected: true,
        latency: Math.floor(Math.random() * 100) + 20,
        lastUpdate: Date.now(),
      };
    },
    refetchInterval: enabled ? 30000 : false,
    enabled,
  });
};