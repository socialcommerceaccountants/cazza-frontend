"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRevenueAnalytics } from "@/lib/hooks/useAnalytics";
import { useToast } from "@/components/ui/use-toast";

interface RevenueChartProps {
  timeRange?: "7d" | "30d" | "90d" | "1y";
}

interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

export default function RevenueChart({ timeRange = "30d" }: RevenueChartProps) {
  const [activeTab, setActiveTab] = useState<"line" | "bar">("line");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: chartData, metrics, isLoading, error, refetch } = useRevenueAnalytics(timeRange);

  const totalRevenue = metrics?.totalRevenue ?? 0;
  const totalProfit = metrics?.totalProfit ?? 0;
  const avgGrowth = metrics?.avgGrowth ?? 0;

  const handleExportCSV = () => {
    if (!chartData?.length) return;

    setIsExporting(true);
    try {
      const headers = ["Date", "Revenue", "Expenses", "Profit", "Growth (%)"];
      const csvContent = [
        headers.join(","),
        ...chartData.map(item => [
          item.date,
          item.revenue,
          item.expenses,
          item.profit,
          item.growth
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-data-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = () => {
    toast({
      title: "PNG Export",
      description: "PNG export requires html2canvas. Contact support to enable this feature.",
    });
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground">{formatDate(label ?? "")}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
              {entry.dataKey === "growth" && "%"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Failed to load revenue data</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Track revenue, expenses, and profit over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting || !chartData?.length}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPNG}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Growth</p>
                <p className={`text-2xl font-bold ${avgGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {avgGrowth >= 0 ? "+" : ""}{avgGrowth.toFixed(2)}%
                </p>
              </div>
              {avgGrowth >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {!chartData?.length ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No revenue data available for this period
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "line" | "bar")}>
            <TabsList className="grid w-full max-w-xs grid-cols-2">
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="mt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--foreground))"
                      tickFormatter={(value) => formatDate(value, "MMM dd")}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      tickFormatter={(value) => formatCurrency(value, true)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="bar" className="mt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--foreground))"
                      tickFormatter={(value) => formatDate(value, "MMM dd")}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      tickFormatter={(value) => formatCurrency(value, true)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue">
                      {chartData.map((_, index) => (
                        <Cell key={`revenue-${index}`} fill="hsl(var(--chart-1))" />
                      ))}
                    </Bar>
                    <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses">
                      {chartData.map((_, index) => (
                        <Cell key={`expenses-${index}`} fill="hsl(var(--chart-2))" />
                      ))}
                    </Bar>
                    <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Profit">
                      {chartData.map((_, index) => (
                        <Cell key={`profit-${index}`} fill="hsl(var(--chart-3))" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
