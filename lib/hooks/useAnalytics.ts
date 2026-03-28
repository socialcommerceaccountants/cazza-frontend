import { useCallback, useMemo } from 'react';
import { 
  useRevenueData, 
  useCACData, 
  useROIData, 
  usePlatformData, 
  useRealtimeMetrics,
  useUpdateCACChannel,
  useDeleteCACChannel,
  useWebSocket
} from '@/lib/api/analytics-queries';
import { useAnalyticsStore } from '@/lib/store/analytics-store';
import { RevenueDataPoint, CACChannel, ROIAnalysis, PlatformPerformance, RealTimeMetric } from '@/lib/api/analytics';

export interface UseAnalyticsOptions {
  timeRange?: string;
  enabled?: boolean;
  autoRefresh?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { timeRange = '30d', enabled = true, autoRefresh = true } = options;
  const preferences = useAnalyticsStore((state) => state.preferences);
  const setConnectionStatus = useAnalyticsStore((state) => state.setConnectionStatus);
  const setError = useAnalyticsStore((state) => state.setError);
  const updateLastUpdated = useAnalyticsStore((state) => state.updateLastUpdated);

  // Revenue data
  const revenueQuery = useRevenueData(timeRange);
  
  // CAC data
  const cacQuery = useCACData();
  
  // ROI data
  const roiQuery = useROIData();
  
  // Platform performance data
  const platformQuery = usePlatformData();
  
  // Real-time metrics
  const realtimeQuery = useRealtimeMetrics(enabled && autoRefresh && preferences.autoRefresh);
  
  // WebSocket connection
  const websocketQuery = useWebSocket('/analytics/ws', enabled && autoRefresh);

  // Mutation hooks
  const updateCACChannel = useUpdateCACChannel();
  const deleteCACChannel = useDeleteCACChannel();

  // Calculate derived metrics
  const revenueMetrics = useMemo(() => {
    if (!revenueQuery.data) return null;
    
    const data = revenueQuery.data;
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const avgGrowth = data.length > 1 
      ? data.slice(1).reduce((sum, item) => sum + item.growth, 0) / (data.length - 1)
      : 0;
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      avgGrowth,
      dataPoints: data.length,
      latestDate: data[data.length - 1]?.date,
      earliestDate: data[0]?.date,
    };
  }, [revenueQuery.data]);

  const cacMetrics = useMemo(() => {
    if (!cacQuery.data) return null;
    
    const data = cacQuery.data;
    const totalSpend = data.reduce((sum, item) => sum + item.spend, 0);
    const totalCustomers = data.reduce((sum, item) => sum + item.customers, 0);
    const overallCAC = totalCustomers > 0 ? totalSpend / totalCustomers : 0;
    const avgLTV = data.length > 0 ? data.reduce((sum, item) => sum + item.ltv, 0) / data.length : 0;
    const avgROI = data.length > 0 ? data.reduce((sum, item) => sum + item.roi, 0) / data.length : 0;
    
    return {
      totalSpend,
      totalCustomers,
      overallCAC,
      avgLTV,
      avgROI,
      channelCount: data.length,
      bestChannel: data.reduce((best, current) => 
        current.roi > best.roi ? current : best
      ),
      worstChannel: data.reduce((worst, current) => 
        current.roi < worst.roi ? current : worst
      ),
    };
  }, [cacQuery.data]);

  const roiMetrics = useMemo(() => {
    if (!roiQuery.data) return null;
    
    const data = roiQuery.data;
    const totalInvestment = data.reduce((sum, item) => sum + item.investment, 0);
    const totalReturn = data.reduce((sum, item) => sum + item.return, 0);
    const overallROI = totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;
    const avgROI = data.length > 0 ? data.reduce((sum, item) => sum + item.roi, 0) / data.length : 0;
    
    return {
      totalInvestment,
      totalReturn,
      overallROI,
      avgROI,
      categoryCount: data.length,
      bestInvestment: data.reduce((best, current) => 
        current.roi > best.roi ? current : best
      ),
      worstInvestment: data.reduce((worst, current) => 
        current.roi < worst.roi ? current : worst
      ),
    };
  }, [roiQuery.data]);

  const platformMetrics = useMemo(() => {
    if (!platformQuery.data) return null;
    
    const data = platformQuery.data;
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
    const avgConversion = data.length > 0 ? data.reduce((sum, item) => sum + item.conversion, 0) / data.length : 0;
    const avgGrowth = data.length > 0 ? data.reduce((sum, item) => sum + item.growth, 0) / data.length : 0;
    
    return {
      totalRevenue,
      totalUsers,
      avgConversion,
      avgGrowth,
      platformCount: data.length,
      topPlatform: data.reduce((top, current) => 
        current.revenue > top.revenue ? current : top
      ),
      fastestGrowing: data.reduce((fastest, current) => 
        current.growth > fastest.growth ? current : fastest
      ),
    };
  }, [platformQuery.data]);

  const realtimeMetrics = useMemo(() => {
    if (!realtimeQuery.data) return null;
    
    const data = realtimeQuery.data;
    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;
    
    const revenueChange = previous ? ((latest.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    const usersChange = previous ? ((latest.users - previous.users) / previous.users) * 100 : 0;
    const ordersChange = previous ? ((latest.orders - previous.orders) / previous.orders) * 100 : 0;
    
    return {
      current: latest,
      previous,
      revenueChange,
      usersChange,
      ordersChange,
      dataPoints: data.length,
      timeRange: data.length > 0 ? data[data.length - 1].timestamp - data[0].timestamp : 0,
    };
  }, [realtimeQuery.data]);

  // Combined loading state
  const isLoading = useMemo(() => {
    return revenueQuery.isLoading || cacQuery.isLoading || roiQuery.isLoading || 
           platformQuery.isLoading || realtimeQuery.isLoading;
  }, [revenueQuery.isLoading, cacQuery.isLoading, roiQuery.isLoading, 
      platformQuery.isLoading, realtimeQuery.isLoading]);

  // Combined error state
  const error = useMemo(() => {
    return revenueQuery.error || cacQuery.error || roiQuery.error || 
           platformQuery.error || realtimeQuery.error;
  }, [revenueQuery.error, cacQuery.error, roiQuery.error, 
      platformQuery.error, realtimeQuery.error]);

  // Combined data freshness
  const lastUpdated = useMemo(() => {
    const timestamps = [
      revenueQuery.dataUpdatedAt,
      cacQuery.dataUpdatedAt,
      roiQuery.dataUpdatedAt,
      platformQuery.dataUpdatedAt,
      realtimeQuery.dataUpdatedAt,
    ].filter(Boolean);
    
    return timestamps.length > 0 ? Math.max(...timestamps) : null;
  }, [revenueQuery.dataUpdatedAt, cacQuery.dataUpdatedAt, roiQuery.dataUpdatedAt, 
      platformQuery.dataUpdatedAt, realtimeQuery.dataUpdatedAt]);

  // Refresh all data
  const refreshAll = useCallback(() => {
    revenueQuery.refetch();
    cacQuery.refetch();
    roiQuery.refetch();
    platformQuery.refetch();
    realtimeQuery.refetch();
    updateLastUpdated();
  }, [revenueQuery, cacQuery, roiQuery, platformQuery, realtimeQuery, updateLastUpdated]);

  // Export data function
  const exportData = useCallback(async (format: 'csv' | 'json' | 'xlsx', dataType: string) => {
    try {
      // This would be implemented with the actual export API
      console.log(`Exporting ${dataType} as ${format}`);
      // In a real implementation, this would call the analyticsService.exportAnalyticsData
      return Promise.resolve();
    } catch (err) {
      setError(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [setError]);

  // Update connection status based on WebSocket
  useMemo(() => {
    if (websocketQuery.data) {
      setConnectionStatus(websocketQuery.data.connected);
    }
  }, [websocketQuery.data, setConnectionStatus]);

  // Update error state
  useMemo(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } else {
      setError(null);
    }
  }, [error, setError]);

  return {
    // Data
    revenue: {
      data: revenueQuery.data,
      metrics: revenueMetrics,
      isLoading: revenueQuery.isLoading,
      error: revenueQuery.error,
      refetch: revenueQuery.refetch,
    },
    cac: {
      data: cacQuery.data,
      metrics: cacMetrics,
      isLoading: cacQuery.isLoading,
      error: cacQuery.error,
      refetch: cacQuery.refetch,
    },
    roi: {
      data: roiQuery.data,
      metrics: roiMetrics,
      isLoading: roiQuery.isLoading,
      error: roiQuery.error,
      refetch: roiQuery.refetch,
    },
    platforms: {
      data: platformQuery.data,
      metrics: platformMetrics,
      isLoading: platformQuery.isLoading,
      error: platformQuery.error,
      refetch: platformQuery.refetch,
    },
    realtime: {
      data: realtimeQuery.data,
      metrics: realtimeMetrics,
      isLoading: realtimeQuery.isLoading,
      error: realtimeQuery.error,
      refetch: realtimeQuery.refetch,
    },
    
    // Mutations
    updateCACChannel,
    deleteCACChannel,
    
    // Combined states
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    refreshAll,
    exportData,
    
    // WebSocket
    websocket: websocketQuery.data,
    isWebSocketConnected: websocketQuery.data?.connected || false,
    
    // Preferences
    preferences,
  };
}

// Individual hook exports for specific use cases
export function useRevenueAnalytics(timeRange: string = '30d') {
  const query = useRevenueData(timeRange);
  const preferences = useAnalyticsStore((state) => state.preferences);
  
  const metrics = useMemo(() => {
    if (!query.data) return null;
    
    const data = query.data;
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const avgGrowth = data.length > 1 
      ? data.slice(1).reduce((sum, item) => sum + item.growth, 0) / (data.length - 1)
      : 0;
    
    return { totalRevenue, totalExpenses, totalProfit, avgGrowth };
  }, [query.data]);
  
  return {
    data: query.data,
    metrics,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    preferences,
  };
}

export function useCACAnalytics() {
  const query = useCACData();
  const updateMutation = useUpdateCACChannel();
  const deleteMutation = useDeleteCACChannel();
  
  const metrics = useMemo(() => {
    if (!query.data) return null;
    
    const data = query.data;
    const totalSpend = data.reduce((sum, item) => sum + item.spend, 0);
    const totalCustomers = data.reduce((sum, item) => sum + item.customers, 0);
    const overallCAC = totalCustomers > 0 ? totalSpend / totalCustomers : 0;
    const avgLTV = data.length > 0 ? data.reduce((sum, item) => sum + item.ltv, 0) / data.length : 0;
    const avgROI = data.length > 0 ? data.reduce((sum, item) => sum + item.roi, 0) / data.length : 0;
    
    return { totalSpend, totalCustomers, overallCAC, avgLTV, avgROI };
  }, [query.data]);
  
  return {
    data: query.data,
    metrics,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateChannel: updateMutation.mutate,
    deleteChannel: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useRealTimeAnalytics(enabled: boolean = true) {
  const query = useRealtimeMetrics(enabled);
  const preferences = useAnalyticsStore((state) => state.preferences);
  
  const metrics = useMemo(() => {
    if (!query.data || query.data.length === 0) return null;
    
    const data = query.data;
    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;
    
    const revenueChange = previous ? ((latest.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    const usersChange = previous ? ((latest.users - previous.users) / previous.users) * 100 : 0;
    const ordersChange = previous ? ((latest.orders - previous.orders) / previous.orders) * 100 : 0;
    
    return {
      current: latest,
      previous,
      revenueChange,
      usersChange,
      ordersChange,
      isIncreasing: revenueChange > 0,
    };
  }, [query.data]);
  
  return {
    data: query.data,
    metrics,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    preferences,
  };
}