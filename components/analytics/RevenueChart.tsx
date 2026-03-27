"use client";

import { useState, useEffect } from "react";
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
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RevenueData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
}

interface RevenueChartProps {
  data?: RevenueData[];
  timeRange?: "7d" | "30d" | "90d" | "1y";
}

const generateMockData = (timeRange: string = "30d"): RevenueData[] => {
  const data: RevenueData[] = [];
  const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : timeRange === "1y" ? 365 : 30;
  
  let baseRevenue = 50000;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    const revenue = baseRevenue + Math.random() * 15000 - 5000;
    const expenses = revenue * (0.3 + Math.random() * 0.2);
    const profit = revenue - expenses;
    const growth = i > 0 ? ((revenue - baseRevenue) / baseRevenue) * 100 : 0;
    
    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      profit: Math.round(profit),
      growth: parseFloat(growth.toFixed(2)),
    });
    
    baseRevenue = revenue;
  }
  
  return data;
};

export default function RevenueChart({ data, timeRange = "30d" }: RevenueChartProps) {
  const [chartData, setChartData] = useState<RevenueData[]>(data || generateMockData(timeRange));
  const [activeTab, setActiveTab] = useState<"line" | "bar">("line");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!data) {
      setChartData(generateMockData(timeRange));
    }
  }, [timeRange, data]);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);
  const avgGrowth = chartData.length > 1 
    ? chartData.slice(1).reduce((sum, item) => sum + item.growth, 0) / (chartData.length - 1)
    : 0;

  const handleExportCSV = () => {
    setIsExporting(true);
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
    setIsExporting(false);
  };

  const handleExportPNG = () => {
    setIsExporting(true);
    // In a real implementation, this would use html2canvas or similar
    setTimeout(() => {
      alert("PNG export would be implemented with html2canvas in production");
      setIsExporting(false);
    }, 500);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
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
              disabled={isExporting}
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
                    {chartData.map((entry, index) => (
                      <Cell key={`revenue-${index}`} fill="hsl(var(--chart-1))" />
                    ))}
                  </Bar>
                  <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses">
                    {chartData.map((entry, index) => (
                      <Cell key={`expenses-${index}`} fill="hsl(var(--chart-2))" />
                    ))}
                  </Bar>
                  <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Profit">
                    {chartData.map((entry, index) => (
                      <Cell key={`profit-${index}`} fill="hsl(var(--chart-3))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}