"use client";

import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnalyticsErrorBoundary } from "@/components/analytics/ErrorBoundary";
import LoadingSkeleton from "@/components/analytics/LoadingSkeleton";
import RevenueChart from "@/components/analytics/RevenueChart";
import CACCalculator from "@/components/analytics/CACCalculator";
import ROIAnalysis from "@/components/analytics/ROIAnalysis";
import PlatformPerformance from "@/components/analytics/PlatformPerformance";
import RealTimeMetrics from "@/components/analytics/RealTimeMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calculator, TrendingUp, PieChart, Activity, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});

function AnalyticsDashboardContent() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time insights and performance metrics for your business
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="cac" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            CAC
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            ROI
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsErrorBoundary>
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                <RevenueChart timeRange="30d" />
              </Suspense>
            </AnalyticsErrorBoundary>

            <AnalyticsErrorBoundary>
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                <PlatformPerformance />
              </Suspense>
            </AnalyticsErrorBoundary>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsErrorBoundary>
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                <CACCalculator />
              </Suspense>
            </AnalyticsErrorBoundary>

            <AnalyticsErrorBoundary>
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                <ROIAnalysis />
              </Suspense>
            </AnalyticsErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <RevenueChart timeRange="90d" />
            </Suspense>
          </AnalyticsErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
                <CardDescription>
                  Key metrics and trends analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold">$125,000</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="text-2xl font-bold text-green-500">+12.5%</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Revenue is trending upward with consistent month-over-month growth.</p>
                    <p className="mt-2">Top performing segments: Enterprise (42%), SMB (35%), Startup (23%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <CardDescription>
                  Quarterly performance patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Q1 2024</span>
                      <span className="font-medium">$98,500</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Q2 2024</span>
                      <span className="font-medium">$112,300</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Q3 2024</span>
                      <span className="font-medium">$125,000</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cac" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <CACCalculator />
            </Suspense>
          </AnalyticsErrorBoundary>
        </TabsContent>

        <TabsContent value="roi" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <ROIAnalysis />
            </Suspense>
          </AnalyticsErrorBoundary>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <RealTimeMetrics />
            </Suspense>
          </AnalyticsErrorBoundary>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Infrastructure monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="font-medium text-green-500">42ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Load</span>
                    <span className="font-medium text-green-500">24%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Hit Rate</span>
                    <span className="font-medium text-green-500">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  Current session metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <span className="font-medium">1,248</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Session Duration</span>
                    <span className="font-medium">4m 32s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pages per Session</span>
                    <span className="font-medium">5.2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Freshness</CardTitle>
                <CardDescription>
                  Update timestamps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Data</span>
                    <span className="font-medium">2s ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Metrics</span>
                    <span className="font-medium">5s ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platform Data</span>
                    <span className="font-medium">30s ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-8">
          <Card className="border-2 border-dashed">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Advanced Analytics Suite</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Access our comprehensive advanced analytics platform featuring predictive forecasting, 
                    custom report building, executive dashboards, and real-time anomaly detection.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <div className="border rounded-lg p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="font-medium">Predictive Analytics</p>
                      <p className="text-sm text-muted-foreground">AI-powered forecasting</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <p className="font-medium">Custom Reports</p>
                      <p className="text-sm text-muted-foreground">Drag-and-drop builder</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <p className="font-medium">Executive Dashboard</p>
                      <p className="text-sm text-muted-foreground">KPI tracking & insights</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Activity className="h-6 w-6 mx-auto mb-2 text-red-500" />
                      <p className="font-medium">Anomaly Detection</p>
                      <p className="text-sm text-muted-foreground">Real-time alerts</p>
                    </div>
                  </div>
                  <Link href="/analytics/advanced">
                    <Button size="lg" className="mt-4">
                      Launch Advanced Analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsErrorBoundary>
        <Suspense fallback={<LoadingSkeleton type="full" />}>
          <AnalyticsDashboardContent />
        </Suspense>
      </AnalyticsErrorBoundary>
    </QueryClientProvider>
  );
}