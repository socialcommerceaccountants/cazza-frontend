"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Filter, Settings, Eye, EyeOff, Maximize2 } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

interface ChartData {
  date: string;
  value: number;
  category: string;
  subcategory?: string;
  forecast?: number;
  confidence?: number;
}

interface AdvancedChartsProps {
  data?: ChartData[];
  title?: string;
  description?: string;
  chartTypes?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const generateAdvancedData = (): ChartData[] => {
  const data: ChartData[] = [];
  const categories = ['Revenue', 'Users', 'Engagement', 'Conversion', 'Retention'];
  const subcategories = ['Organic', 'Paid', 'Referral', 'Direct'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i - 1));
    
    categories.forEach(category => {
      subcategories.forEach(subcategory => {
        const baseValue = Math.random() * 1000 + 500;
        const value = baseValue * (0.8 + Math.random() * 0.4);
        const forecast = value * (1 + (Math.random() * 0.2 - 0.1));
        const confidence = 0.7 + Math.random() * 0.3;
        
        data.push({
          date: date.toISOString().split("T")[0],
          value: Math.round(value),
          category,
          subcategory,
          forecast: Math.round(forecast),
          confidence: parseFloat(confidence.toFixed(2)),
        });
      });
    });
  }
  
  return data;
};

const generatePieData = () => {
  return [
    { name: 'Revenue', value: 4000, color: '#0088FE' },
    { name: 'Expenses', value: 3000, color: '#00C49F' },
    { name: 'Profit', value: 2000, color: '#FFBB28' },
    { name: 'Tax', value: 1000, color: '#FF8042' },
    { name: 'Investment', value: 800, color: '#8884D8' },
  ];
};

const generateRadarData = () => {
  return [
    { subject: 'Revenue', A: 120, B: 110, fullMark: 150 },
    { subject: 'Users', A: 98, B: 130, fullMark: 150 },
    { subject: 'Engagement', A: 86, B: 130, fullMark: 150 },
    { subject: 'Conversion', A: 99, B: 100, fullMark: 150 },
    { subject: 'Retention', A: 85, B: 90, fullMark: 150 },
    { subject: 'Satisfaction', A: 65, B: 85, fullMark: 150 },
  ];
};

export default function AdvancedCharts({ 
  data, 
  title = "Advanced Analytics",
  description = "Interactive charts with multiple visualization options",
  chartTypes = ["line", "bar", "area", "scatter", "pie", "radar"]
}: AdvancedChartsProps) {
  const [chartData, setChartData] = useState<ChartData[]>(data || generateAdvancedData());
  const [activeChart, setActiveChart] = useState<string>(chartTypes[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showForecast, setShowForecast] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const categories = Array.from(new Set(chartData.map(item => item.category)));
  const filteredData = selectedCategory === "all" 
    ? chartData 
    : chartData.filter(item => item.category === selectedCategory);
  
  const aggregatedData = filteredData.reduce((acc, item) => {
    const existing = acc.find(a => a.date === item.date);
    if (existing) {
      existing.value += item.value;
    } else {
      acc.push({ date: item.date, value: item.value });
    }
    return acc;
  }, [] as { date: string; value: number }[]);
  
  const handleExport = (format: 'csv' | 'png' | 'json') => {
    switch (format) {
      case 'csv':
        const headers = ["Date", "Category", "Subcategory", "Value", "Forecast", "Confidence"];
        const csvContent = [
          headers.join(","),
          ...chartData.map(item => [
            item.date,
            item.category,
            item.subcategory || '',
            item.value,
            item.forecast || '',
            item.confidence || ''
          ].join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `advanced-charts-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        break;
        
      case 'png':
        // In a real implementation, this would use html2canvas or similar
        alert("PNG export would be implemented with html2canvas");
        break;
        
      case 'json':
        const jsonContent = JSON.stringify(chartData, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: "application/json" });
        const jsonUrl = window.URL.createObjectURL(jsonBlob);
        const jsonA = document.createElement("a");
        jsonA.href = jsonUrl;
        jsonA.download = `advanced-charts-${new Date().toISOString().split("T")[0]}.json`;
        jsonA.click();
        break;
    }
  };
  
  const renderChart = () => {
    switch (activeChart) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={aggregatedData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {showForecast && aggregatedData.some(d => d['forecast']) && (
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={aggregatedData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
              {showForecast && aggregatedData.some(d => d['forecast']) && (
                <Bar dataKey="forecast" fill="#82ca9d" opacity={0.7} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={aggregatedData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="date" type="category" />
              <YAxis dataKey="value" />
              <ZAxis dataKey="confidence" range={[60, 400]} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Scatter name="Data Points" data={filteredData} fill="#8884d8">
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        const pieData = generatePieData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "radar":
        const radarData = generateRadarData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Current"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Target"
                dataKey="B"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Select a chart type</p>
          </div>
        );
    }
  };
  
  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Switch
                  id="forecast"
                  checked={showForecast}
                  onCheckedChange={setShowForecast}
                />
                <Label htmlFor="forecast">Show Forecast</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
                <Label htmlFor="grid">Show Grid</Label>
              </div>
            </div>
          </div>
          
          {/* Chart Type Selector */}
          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList className="grid grid-cols-6 w-full max-w-2xl">
              {chartTypes.map(type => (
                <TabsTrigger key={type} value={type} className="capitalize">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeChart} className="mt-4">
              {renderChart()}
            </TabsContent>
          </Tabs>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(aggregatedData.reduce((sum, item) => sum + item.value, 0))}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Average Daily</p>
              <p className="text-2xl font-bold">
                {formatCurrency(aggregatedData.reduce((sum, item) => sum + item.value, 0) / aggregatedData.length)}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Peak Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(Math.max(...aggregatedData.map(item => item.value)))}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Data Points</p>
              <p className="text-2xl font-bold">{formatNumber(filteredData.length)}</p>
            </div>
          </div>
          
          {/* Export Options */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Export as:</p>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('png')}>
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
              JSON
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}