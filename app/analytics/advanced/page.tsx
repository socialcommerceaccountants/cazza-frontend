"use client";

import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnalyticsErrorBoundary } from "@/components/analytics/ErrorBoundary";
import LoadingSkeleton from "@/components/analytics/LoadingSkeleton";
import AdvancedCharts from "@/components/analytics/AdvancedCharts";
import PredictiveAnalytics from "@/components/analytics/PredictiveAnalytics";
import ReportBuilder from "@/components/analytics/ReportBuilder";
import ExecutiveDashboard from "@/components/analytics/ExecutiveDashboard";
import DataExport from "@/components/analytics/DataExport";
import AnomalyDetection from "@/components/analytics/AnomalyDetection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  LayoutGrid, 
  Download, 
  AlertTriangle,
  PieChart,
  LineChart,
  Table,
  Filter,
  Settings,
} from "lucide-react";

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

function AdvancedAnalyticsContent() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics suite with predictive insights, custom reporting, and anomaly detection
        </p>
      </div>

      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="grid w-full max-w-4xl grid-cols-6">
          <TabsTrigger value="executive" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Executive
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <ExecutiveDashboard />
            </Suspense>
          </AnalyticsErrorBoundary>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsErrorBoundary>
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                <AdvancedCharts 
                  title="Revenue Analytics"
                  description="Multi-dimensional revenue analysis with forecasting"
                  chartTypes={["line", "bar", "area", "pie", "radar"]}
                />
              </Suspense>
            </AnalyticsErrorBoundary>

            <AnalyticsErrorBoundary>
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                <AdvancedCharts 
                  title="User Engagement"
                  description="User behavior and engagement metrics"
                  chartTypes={["scatter", "bar", "line", "area"]}
                />
              </Suspense>
            </AnalyticsErrorBoundary>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribution Analysis
                </CardTitle>
                <CardDescription>Revenue by segment and category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Pie Chart Visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Trend Analysis
                </CardTitle>
                <CardDescription>Seasonal patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Trend Line Visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Data Summary
                </CardTitle>
                <CardDescription>Key metrics and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Total Data Points</p>
                      <p className="text-2xl font-bold">12,548</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Avg. Value</p>
                      <p className="text-2xl font-bold">$4,250</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Data updated in real-time with 99.9% accuracy</p>
                    <p className="mt-2">Last refresh: 2 minutes ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <PredictiveAnalytics 
                title="Revenue Forecasting"
                description="90-day revenue predictions with confidence intervals"
                forecastHorizon={90}
              />
            </Suspense>
          </AnalyticsErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Forecasting accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mean Absolute Error</span>
                      <span className="font-medium">$1,250</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">R² Score</span>
                      <span className="font-medium">0.92</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Training Time</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast Insights</CardTitle>
                <CardDescription>Key takeaways from predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Positive Growth Trend</p>
                      <p className="text-sm text-muted-foreground">
                        Revenue expected to grow by 12-15% over next quarter
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Filter className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Seasonal Patterns</p>
                      <p className="text-sm text-muted-foreground">
                        Strong weekly and monthly seasonality detected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Risk Factors</p>
                      <p className="text-sm text-muted-foreground">
                        Market volatility may impact accuracy by ±5%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <ReportBuilder 
                onSave={(report) => {
                  console.log('Report saved:', report);
                  alert('Report saved successfully!');
                }}
                onExport={(report, format) => {
                  console.log(`Exporting report as ${format}:`, report);
                  alert(`Report exported as ${format.toUpperCase()}`);
                }}
              />
            </Suspense>
          </AnalyticsErrorBoundary>
        </TabsContent>

        <TabsContent value="export" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <DataExport 
                onExport={(config) => {
                  console.log('Export config:', config);
                  alert('Export started successfully!');
                }}
                onSchedule={(schedule) => {
                  console.log('Schedule config:', schedule);
                  alert('Export scheduled successfully!');
                }}
              />
            </Suspense>
          </AnalyticsErrorBoundary>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-8">
          <AnalyticsErrorBoundary>
            <Suspense fallback={<LoadingSkeleton type="full" />}>
              <AnomalyDetection 
                onAlert={(anomaly) => {
                  console.log('New anomaly detected:', anomaly);
                  // In a real app, this would trigger notifications
                }}
                onRuleChange={(rule) => {
                  console.log('Alert rule changed:', rule);
                }}
              />
            </Suspense>
          </AnalyticsErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
                <CardDescription>Last 30 days activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Alerts</span>
                    <span className="font-bold">124</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical</span>
                    <span className="font-bold text-red-500">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolved</span>
                    <span className="font-bold text-green-500">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Response Time</span>
                    <span className="font-bold">42m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Alert delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Slack</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS</span>
                    <span className="font-medium text-yellow-500">Limited</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhook</span>
                    <span className="font-medium text-red-500">Inactive</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitoring infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Detection Accuracy</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">False Positive Rate</span>
                    <span className="font-medium">2.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Uptime</span>
                    <span className="font-medium text-green-500">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Latency</span>
                    <span className="font-medium">~2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdvancedAnalyticsDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsErrorBoundary>
        <Suspense fallback={<LoadingSkeleton type="full" />}>
          <AdvancedAnalyticsContent />
        </Suspense>
      </AnalyticsErrorBoundary>
    </QueryClientProvider>
  );
}