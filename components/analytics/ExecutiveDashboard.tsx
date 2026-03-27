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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  ShoppingCart,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";
import { formatCurrency, formatNumber, formatPercentage, formatDate } from "@/lib/utils";

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  status: 'on-track' | 'at-risk' | 'off-track';
  unit?: string;
}

interface Initiative {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'at-risk' | 'completed';
  owner: string;
  dueDate: string;
}

interface ExecutiveDashboardProps {
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  department?: 'all' | 'sales' | 'marketing' | 'product' | 'finance';
}

const generateKPIs = (): KPI[] => [
  {
    id: '1',
    name: 'Monthly Recurring Revenue',
    value: 125000,
    target: 120000,
    change: 12.5,
    trend: 'up',
    status: 'on-track',
    unit: '$',
  },
  {
    id: '2',
    name: 'Customer Acquisition Cost',
    value: 450,
    target: 400,
    change: -8.2,
    trend: 'down',
    status: 'at-risk',
    unit: '$',
  },
  {
    id: '3',
    name: 'Customer Lifetime Value',
    value: 3200,
    target: 3000,
    change: 15.3,
    trend: 'up',
    status: 'on-track',
    unit: '$',
  },
  {
    id: '4',
    name: 'Net Revenue Retention',
    value: 112,
    target: 110,
    change: 3.2,
    trend: 'up',
    status: 'on-track',
    unit: '%',
  },
  {
    id: '5',
    name: 'Active Customers',
    value: 1248,
    target: 1200,
    change: 8.7,
    trend: 'up',
    status: 'on-track',
  },
  {
    id: '6',
    name: 'Gross Margin',
    value: 68,
    target: 65,
    change: 5.1,
    trend: 'up',
    status: 'on-track',
    unit: '%',
  },
];

const generateInitiatives = (): Initiative[] => [
  {
    id: '1',
    name: 'Q1 Product Launch',
    description: 'Launch new enterprise features',
    progress: 85,
    status: 'on-track',
    owner: 'Product Team',
    dueDate: '2024-03-31',
  },
  {
    id: '2',
    name: 'Market Expansion',
    description: 'Enter European markets',
    progress: 45,
    status: 'delayed',
    owner: 'Marketing Team',
    dueDate: '2024-06-30',
  },
  {
    id: '3',
    name: 'Cost Optimization',
    description: 'Reduce cloud infrastructure costs by 15%',
    progress: 60,
    status: 'at-risk',
    owner: 'Engineering Team',
    dueDate: '2024-04-15',
  },
  {
    id: '4',
    name: 'Team Expansion',
    description: 'Hire 10 new engineers',
    progress: 30,
    status: 'on-track',
    owner: 'HR Team',
    dueDate: '2024-05-31',
  },
  {
    id: '5',
    name: 'Customer Success Program',
    description: 'Implement new onboarding flow',
    progress: 90,
    status: 'completed',
    owner: 'Customer Success',
    dueDate: '2024-02-28',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 98000, target: 95000 },
  { month: 'Feb', revenue: 112000, target: 105000 },
  { month: 'Mar', revenue: 125000, target: 120000 },
  { month: 'Apr', revenue: 118000, target: 115000 },
  { month: 'May', revenue: 132000, target: 125000 },
  { month: 'Jun', revenue: 145000, target: 135000 },
];

const segmentData = [
  { name: 'Enterprise', value: 42, color: '#0088FE' },
  { name: 'SMB', value: 35, color: '#00C49F' },
  { name: 'Startup', value: 23, color: '#FFBB28' },
];

const riskData = [
  { category: 'Market Risk', score: 65, trend: 'up' },
  { category: 'Operational Risk', score: 42, trend: 'down' },
  { category: 'Financial Risk', score: 28, trend: 'neutral' },
  { category: 'Compliance Risk', score: 55, trend: 'up' },
  { category: 'Technology Risk', score: 38, trend: 'down' },
];

export default function ExecutiveDashboard({
  timeRange = 'month',
  department = 'all'
}: ExecutiveDashboardProps) {
  const [kpis, setKpis] = useState<KPI[]>(generateKPIs());
  const [initiatives, setInitiatives] = useState<Initiative[]>(generateInitiatives());
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const overallProgress = initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length;
  const onTrackKPIs = kpis.filter(k => k.status === 'on-track').length;
  const atRiskKPIs = kpis.filter(k => k.status === 'at-risk').length;
  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
  const revenueGrowth = ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue) * 100;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setKpis(generateKPIs());
      setInitiatives(generateInitiatives());
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExportDashboard = () => {
    const data = {
      kpis,
      initiatives,
      revenueData,
      segmentData,
      riskData,
      timestamp: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at-risk':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'off-track':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'off-track':
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time business performance and strategic overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" onClick={handleExportDashboard}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="risks">Risks & Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Performance</CardTitle>
                <CardDescription>Monthly revenue vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Actual Revenue" />
                    <Bar dataKey="target" fill="#82ca9d" name="Target" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Revenue distribution by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* KPI Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>
                {onTrackKPIs} of {kpis.length} KPIs on track • Overall progress: {overallProgress.toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => (
                  <Card key={kpi.id} className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{kpi.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getStatusColor(kpi.status)}>
                              {getStatusIcon(kpi.status)}
                              <span className="ml-1">{kpi.status.replace('-', ' ')}</span>
                            </Badge>
                            <span className={`text-sm font-medium flex items-center ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                              {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                              {kpi.change > 0 ? '+' : ''}{kpi.change}%
                            </span>
                          </div>
                        </div>
                        <Target className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {kpi.unit === '$' ? formatCurrency(kpi.value) : kpi.unit === '%' ? `${kpi.value}%` : formatNumber(kpi.value)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Target: {kpi.unit === '$' ? formatCurrency(kpi.target) : kpi.unit === '%' ? `${kpi.target}%` : formatNumber(kpi.target)}
                          </span>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{((kpi.value / kpi.target) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Q1 2024 Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                      <p className="text-sm text-green-500 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{revenueGrowth.toFixed(1)}% growth
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Gross Profit</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalRevenue * 0.68)}</p>
                      <p className="text-sm text-green-500">68% margin</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Operating Expenses</span>
                      <span className="font-medium">{formatCurrency(totalRevenue * 0.42)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Net Income</span>
                      <span className="font-bold text-green-500">{formatCurrency(totalRevenue * 0.26)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cash Flow</span>
                      <span className="font-medium">{formatCurrency(totalRevenue * 0.32)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
                <CardDescription>Operational performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'LTV:CAC Ratio', value: 7.1, target: 3.0, status: 'excellent' },
                    { name: 'Payback Period', value: 8, target: 12, unit: 'months', status: 'good' },
                    { name: 'Burn Rate', value: 45000, target: 50000, unit: '$', status: 'good' },
                    { name: 'Runway', value: 24, target: 18, unit: 'months', status: 'excellent' },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <Badge variant={
                          metric.status === 'excellent' ? 'default' :
                          metric.status === 'good' ? 'secondary' : 'destructive'
                        }>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {metric.unit === '$' ? formatCurrency(metric.value) : metric.value}{metric.unit || ''}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Target: {metric.unit === '$' ? formatCurrency(metric.target) : metric.target}{metric.unit || ''}
                        </span>
                      </div>
                      <Progress
                        value={(metric.value / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Initiatives</CardTitle>
              <CardDescription>
                Track progress on key business initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {initiatives.map((initiative) => (
                  <Card key={initiative.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{initiative.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{initiative.description}</p>
                        </div>
                        <Badge className={getStatusColor(initiative.status)}>
                          {getStatusIcon(initiative.status)}
                          <span className="ml-1">{initiative.status.replace('-', ' ')}</span>
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{initiative.owner}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>Due: {formatDate(initiative.dueDate)}</span>
                            </div>
                          </div>
                          <span className="font-medium">{initiative.progress}% complete</span>
                        </div>

                        <Progress value={initiative.progress} className="h-2" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Started: {formatDate('2024-01-01')}</span>
                          <span>{Math.ceil((new Date(initiative.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Current risk exposure by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskData.map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{risk.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            risk.score > 60 ? 'destructive' :
                            risk.score > 40 ? 'secondary' : 'default'
                          }>
                            Score: {risk.score}
                          </Badge>
                          {risk.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : risk.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          ) : null}
                        </div>
                      </div>
                      <Progress
                        value={risk.score}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opportunities</CardTitle>
                <CardDescription>Potential growth areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Market Expansion', potential: 45, effort: 'medium', timeline: '6-12 months' },
                    { name: 'Product Upsell', potential: 32, effort: 'low', timeline: '3-6 months' },
                    { name: 'Cost Reduction', potential: 28, effort: 'high', timeline: '12+ months' },
                    { name: 'New Features', potential: 52, effort: 'medium', timeline: '6-9 months' },
                  ].map((opp, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{opp.name}</h4>
                          <Badge variant="outline">{opp.potential}% potential</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>Effort: {opp.effort}</span>
                            <span>Timeline: {opp.timeline}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Explore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Mitigation Actions</CardTitle>
              <CardDescription>Active measures to reduce exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { action: 'Diversify supplier base', risk: 'Operational', status: 'in-progress', impact: 'high' },
                  { action: 'Implement fraud detection', risk: 'Financial', status: 'completed', impact: 'medium' },
                  { action: 'Update compliance policies', risk: 'Compliance', status: 'planned', impact: 'high' },
                  { action: 'Backup system migration', risk: 'Technology', status: 'in-progress', impact: 'critical' },
                  { action: 'Market research initiative', risk: 'Market', status: 'planned', impact: 'medium' },
                  { action: 'Insurance coverage review', risk: 'Financial', status: 'completed', impact: 'low' },
                ].map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{item.action}</h4>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.risk} Risk</Badge>
                          <Badge variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'in-progress' ? 'secondary' : 'outline'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Impact:</span>
                          <span className={`font-medium ${
                            item.impact === 'critical' ? 'text-red-500' :
                            item.impact === 'high' ? 'text-orange-500' :
                            item.impact === 'medium' ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {item.impact}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}