"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Filter, TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

interface PlatformMetric {
  platform: string;
  revenue: number;
  users: number;
  conversion: number;
  growth: number;
  cac: number;
  ltv: number;
  sessions: number;
  bounceRate: number;
}

interface TimeSeriesData {
  date: string;
  [platform: string]: any;
}

const PLATFORMS = [
  { id: "shopify", name: "Shopify", color: "#96bf48" },
  { id: "amazon", name: "Amazon", color: "#ff9900" },
  { id: "etsy", name: "Etsy", color: "#f56400" },
  { id: "woocommerce", name: "WooCommerce", color: "#96588a" },
  { id: "bigcommerce", name: "BigCommerce", color: "#121212" },
  { id: "wix", name: "Wix", color: "#0c6cf2" },
];

const generateMockMetrics = (): PlatformMetric[] => [
  {
    platform: "Shopify",
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
    platform: "Amazon",
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
    platform: "Etsy",
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
    platform: "WooCommerce",
    revenue: 32000,
    users: 4200,
    conversion: 2.8,
    growth: 5.4,
    cac: 35.2,
    ltv: 310,
    sessions: 150000,
    bounceRate: 38.9,
  },
  {
    platform: "BigCommerce",
    revenue: 28000,
    users: 3200,
    conversion: 3.1,
    growth: 9.7,
    cac: 45.8,
    ltv: 290,
    sessions: 103225,
    bounceRate: 41.2,
  },
  {
    platform: "Wix",
    revenue: 18000,
    users: 2500,
    conversion: 2.5,
    growth: 18.3,
    cac: 32.4,
    ltv: 260,
    sessions: 100000,
    bounceRate: 45.6,
  },
];

const generateTimeSeriesData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const platforms = ["Shopify", "Amazon", "Etsy", "WooCommerce"];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split("T")[0];
    
    const entry: TimeSeriesData = { date: dateStr };
    
    platforms.forEach(platform => {
      const baseRevenue = platform === "Shopify" ? 4000 : 
                         platform === "Amazon" ? 3200 : 
                         platform === "Etsy" ? 1500 : 1000;
      const variation = Math.random() * 0.3 - 0.15;
      entry[platform] = Math.round(baseRevenue * (1 + variation));
    });
    
    data.push(entry);
  }
  
  return data;
};

export default function PlatformPerformance() {
  const [metrics, setMetrics] = useState<PlatformMetric[]>(generateMockMetrics());
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>(generateTimeSeriesData());
  const [activeTab, setActiveTab] = useState<"overview" | "revenue" | "users" | "conversion">("overview");
  const [selectedMetric, setSelectedMetric] = useState<keyof PlatformMetric>("revenue");
  const [sortBy, setSortBy] = useState<keyof PlatformMetric>("revenue");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Shopify", "Amazon", "Etsy"]);

  const sortedMetrics = [...metrics].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
  });

  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalUsers = metrics.reduce((sum, m) => sum + m.users, 0);
  const avgConversion = metrics.reduce((sum, m) => sum + m.conversion, 0) / metrics.length;
  const avgGrowth = metrics.reduce((sum, m) => sum + m.growth, 0) / metrics.length;

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const metric = metrics.find(m => m.platform === label);
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4 min-w-[200px]">
          <p className="font-medium text-foreground">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">Revenue: {formatCurrency(metric?.revenue || 0)}</p>
            <p className="text-sm">Users: {formatNumber(metric?.users || 0)}</p>
            <p className="text-sm">Conversion: {metric?.conversion}%</p>
            <p className="text-sm">Growth: {metric?.growth}%</p>
            <p className="text-sm">CAC: {formatCurrency(metric?.cac || 0)}</p>
            <p className="text-sm">LTV: {formatCurrency(metric?.ltv || 0)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getPlatformColor = (platform: string) => {
    const platformConfig = PLATFORMS.find(p => p.name === platform);
    return platformConfig?.color || "#6b7280";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Performance
            </CardTitle>
            <CardDescription>
              Compare performance across e-commerce platforms
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(totalUsers)}</p>
              </div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Conversion</p>
                <p className="text-2xl font-bold">{avgConversion.toFixed(2)}%</p>
              </div>
              <ShoppingCart className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Growth</p>
                <p className="text-2xl font-bold text-green-500">+{avgGrowth.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Platform Filter</h4>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Select platforms to compare:</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(platform => (
              <Badge
                key={platform.id}
                variant={selectedPlatforms.includes(platform.name) ? "default" : "outline"}
                className="cursor-pointer"
                style={{
                  backgroundColor: selectedPlatforms.includes(platform.name) ? platform.color : undefined,
                  borderColor: platform.color,
                }}
                onClick={() => handlePlatformToggle(platform.name)}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Revenue Comparison</h4>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as keyof PlatformMetric)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="conversion">Conversion</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="ltv">LTV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                      <XAxis 
                        dataKey="platform" 
                        stroke="hsl(var(--foreground))"
                      />
                      <YAxis 
                        stroke="hsl(var(--foreground))"
                        tickFormatter={(value) => formatCurrency(value, true)}
                      />
                      <Tooltip content={<MetricTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                        {sortedMetrics.map((entry, index) => (
                          <Cell key={`revenue-${index}`} fill={getPlatformColor(entry.platform)} />
                        ))}
                      </Bar>
                      <Bar dataKey="ltv" name="LTV" radius={[4, 4, 0, 0]}>
                        {sortedMetrics.map((entry, index) => (
                          <Cell key={`ltv-${index}`} fill={getPlatformColor(entry.platform)} opacity={0.7} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Revenue Trends (Last 30 Days)</h4>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--foreground))"
                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      />
                      <YAxis 
                        stroke="hsl(var(--foreground))"
                        tickFormatter={(value) => formatCurrency(value, true)}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-4">
                                <p className="font-medium text-foreground">
                                  {new Date(label).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                                {payload.map((entry: any, index: number) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {formatCurrency(entry.value)}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      {selectedPlatforms.map(platform => (
                        <Line
                          key={platform}
                          type="monotone"
                          dataKey={platform}
                          stroke={getPlatformColor(platform)}
                          strokeWidth={2}
                          dot={{ r: 2 }}
                          activeDot={{ r: 4 }}
                          name={platform}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="mt-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedMetrics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => formatCurrency(value, true)}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="platform" 
                    stroke="hsl(var(--foreground))"
                    width={100}
                  />
                  <Tooltip content={<MetricTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                    {sortedMetrics.map((entry, index) => (
                      <Cell key={`revenue-${index}`} fill={getPlatformColor(entry.platform)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="platform" 
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip content={<MetricTooltip />} />
                  <Legend />
                  <Bar dataKey="users" name="Users" radius={[4, 4, 0, 0]}>
                    {sortedMetrics.map((entry, index) => (
                      <Cell key={`users-${index}`} fill={getPlatformColor(entry.platform)} />
                    ))}
                  </Bar>
                  <Bar dataKey="sessions" name="Sessions" radius={[4, 4, 0, 0]}>
                    {sortedMetrics.map((entry, index) => (
                      <Cell key={`sessions-${index}`} fill={getPlatformColor(entry.platform)} opacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="conversion" className="mt-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="platform" 
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<MetricTooltip />} />
                  <Legend />
                  <Bar dataKey="conversion" name="Conversion Rate" radius={[4, 4, 0, 0]}>
                    {sortedMetrics.map((entry, index) => (
                      <Cell key={`conversion-${index}`} fill={getPlatformColor(entry.platform)} />
                    ))}
                  </Bar>
                  <Bar dataKey="bounceRate" name="Bounce Rate" radius={[4, 4, 0, 0]}>
                    {sortedMetrics.map((entry, index) => (
                      <Cell key={`bounce-${index}`} fill={getPlatformColor(entry.platform)} opacity={0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">Top Performing Platforms</h4>
            <div className="space-y-3">
              {sortedMetrics.slice(0, 3).map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getPlatformColor(metric.platform) }}
                    />
                    <span className="font-medium">{metric.platform}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(metric.revenue)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(metric.users)} users · {metric.conversion}% conversion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">Efficiency Metrics</h4>
            <div className="space-y-3">
              {sortedMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{metric.platform}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">LTV:CAC</p>
                      <p className={`font-medium ${metric.ltv / metric.cac >= 3 ? "text-green-500" : "text-yellow-500"}`}>
                        {(metric.ltv / metric.cac).toFixed(1)}:1
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className={`font-medium ${((metric.ltv - metric.cac) / metric.cac * 100) >= 200 ? "text-green-500" : "text-yellow-500"}`}>
                        {((metric.ltv - metric.cac) / metric.cac * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}