"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { formatCurrency, formatNumber, formatTime } from "@/lib/utils";

interface RealTimeMetric {
  timestamp: number;
  revenue: number;
  users: number;
  orders: number;
  conversion: number;
  avgOrderValue: number;
}

interface WebSocketStatus {
  connected: boolean;
  lastUpdate: number | null;
  error: string | null;
  latency: number | null;
}

interface Alert {
  id: string;
  type: "info" | "warning" | "critical";
  message: string;
  timestamp: number;
  resolved: boolean;
}

const generateInitialData = (): RealTimeMetric[] => {
  const data: RealTimeMetric[] = [];
  const now = Date.now();
  
  for (let i = 29; i >= 0; i--) {
    const timestamp = now - (i * 60000); // 1 minute intervals
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
};

const generateAlerts = (): Alert[] => [
  {
    id: "1",
    type: "warning",
    message: "Conversion rate dropped below 2%",
    timestamp: Date.now() - 300000,
    resolved: false,
  },
  {
    id: "2",
    type: "info",
    message: "Traffic spike detected (+35%)",
    timestamp: Date.now() - 600000,
    resolved: true,
  },
  {
    id: "3",
    type: "critical",
    message: "Payment gateway latency increased",
    timestamp: Date.now() - 900000,
    resolved: false,
  },
];

export default function RealTimeMetrics() {
  const [data, setData] = useState<RealTimeMetric[]>(generateInitialData());
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>({
    connected: false,
    lastUpdate: null,
    error: null,
    latency: null,
  });
  const [activeTab, setActiveTab] = useState<"metrics" | "alerts" | "performance">("metrics");
  const [isSimulating, setIsSimulating] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setWsStatus(prev => ({ ...prev, connected: true, error: null }));
      
      // Simulate latency measurement
      setTimeout(() => {
        setWsStatus(prev => ({ ...prev, latency: Math.floor(Math.random() * 100) + 20 }));
      }, 1000);
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  const startSimulation = () => {
    if (isSimulating) {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
      setIsSimulating(false);
      return;
    }

    setIsSimulating(true);
    simulationIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const lastMetric = data[data.length - 1];
      
      // Generate new metric with some randomness
      const newMetric: RealTimeMetric = {
        timestamp: now,
        revenue: Math.max(0, lastMetric.revenue + Math.random() * 200 - 100),
        users: Math.max(0, lastMetric.users + Math.random() * 10 - 5),
        orders: Math.max(0, lastMetric.orders + Math.random() * 2 - 1),
        conversion: parseFloat(Math.max(0.5, Math.min(5, lastMetric.conversion + Math.random() * 0.5 - 0.25)).toFixed(2)),
        avgOrderValue: parseFloat(Math.max(50, Math.min(300, lastMetric.avgOrderValue + Math.random() * 20 - 10)).toFixed(2)),
      };

      setData(prev => {
        const newData = [...prev.slice(1), newMetric];
        return newData;
      });

      setWsStatus(prev => ({ 
        ...prev, 
        lastUpdate: now,
        latency: Math.floor(Math.random() * 50) + 20,
      }));

      // Occasionally generate alerts
      if (Math.random() < 0.1) {
        const alertTypes: Alert["type"][] = ["info", "warning", "critical"];
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const messages = {
          info: ["Traffic increase detected", "New user segment identified", "Performance optimization available"],
          warning: ["Conversion rate fluctuation", "Cart abandonment increased", "Page load time increased"],
          critical: ["Payment gateway error", "Database connection issue", "API rate limit exceeded"],
        };

        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type,
          message: messages[type][Math.floor(Math.random() * messages[type].length)],
          timestamp: now,
          resolved: false,
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 2000); // Update every 2 seconds
  };

  const handleRefresh = () => {
    setData(generateInitialData());
    setWsStatus(prev => ({ ...prev, lastUpdate: Date.now() }));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const avgConversion = data.reduce((sum, item) => sum + item.conversion, 0) / data.length;
  const currentMetric = data[data.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.dataKey === "revenue" ? formatCurrency(entry.value) : 
                           entry.dataKey === "conversion" ? `${entry.value}%` : 
                           entry.dataKey === "avgOrderValue" ? formatCurrency(entry.value) : 
                           formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {wsStatus.connected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              Real-time Metrics
            </CardTitle>
            <CardDescription>
              Live dashboard with WebSocket-powered updates
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={wsStatus.connected ? "default" : "destructive"}
              className={wsStatus.connected ? "bg-green-500" : "bg-red-500"}
            >
              {wsStatus.connected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={startSimulation}
              className={isSimulating ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSimulating ? "animate-spin" : ""}`} />
              {isSimulating ? "Stop Sim" : "Start Sim"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(currentMetric.revenue)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={(currentMetric.revenue / 1500) * 100} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">Per minute</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{formatNumber(currentMetric.users)}</p>
              </div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2">
              <Progress value={(currentMetric.users / 100) * 100} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">Online now</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orders/Min</p>
                <p className="text-2xl font-bold">{currentMetric.orders}</p>
              </div>
              <ShoppingCart className="h-5 w-5 text-purple-500" />
            </div>
            <div className="mt-2">
              <Progress value={(currentMetric.orders / 10) * 100} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">Last minute</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-2xl font-bold">{currentMetric.conversion}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={currentMetric.conversion * 20} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">Rate</p>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order</p>
                <p className="text-2xl font-bold">{formatCurrency(currentMetric.avgOrderValue)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={(currentMetric.avgOrderValue / 300) * 100} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">Value</p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last update: {wsStatus.lastUpdate ? formatTime(wsStatus.lastUpdate) : "Never"}
              </span>
            </div>
            {wsStatus.latency && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${wsStatus.latency < 50 ? "bg-green-500" : wsStatus.latency < 100 ? "bg-yellow-500" : "bg-red-500"}`} />
                <span className="text-sm text-muted-foreground">Latency: {wsStatus.latency}ms</span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Showing last 30 minutes of data
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="mt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => formatTime(value, "HH:mm")}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    yAxisId="left"
                    tickFormatter={(value) => formatCurrency(value, true)}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                    name="Revenue"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgOrderValue"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                    name="Avg Order Value"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversion"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                    name="Conversion %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No active alerts</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-4 ${alert.resolved ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-5 w-5 mt-0.5 ${
                          alert.type === "info" ? "text-blue-500" :
                          alert.type === "warning" ? "text-yellow-500" :
                          "text-red-500"
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getAlertColor(alert.type)}>
                              {alert.type.toUpperCase()}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                RESOLVED
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatTime(alert.timestamp)}
                          </p>
                        </div>
                      </div>
                      {!alert.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => formatTime(value, "HH:mm")}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    name="Active Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">Session Summary (Last 30min)</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Revenue</span>
                <span className="font-bold">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Users</span>
                <span className="font-bold">{formatNumber(totalUsers)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Orders</span>
                <span className="font-bold">{totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Conversion</span>
                <span className="font-bold">{avgConversion.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">WebSocket Connection</span>
                <Badge variant={wsStatus.connected ? "default" : "destructive"} className={wsStatus.connected ? "bg-green-500" : "bg-red-500"}>
                  {wsStatus.connected ? "Healthy" : "Error"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Freshness</span>
                <span className="text-sm font-medium">
                  {wsStatus.lastUpdate ? `${Math.floor((Date.now() - wsStatus.lastUpdate) / 1000)}s ago` : "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Alerts</span>
                <span className="font-bold">
                  {alerts.filter(a => !a.resolved).length} / {alerts.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Simulation</span>
                <Badge variant="outline" className={isSimulating ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                  {isSimulating ? "Running" : "Stopped"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}