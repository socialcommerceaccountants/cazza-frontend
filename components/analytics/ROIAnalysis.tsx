"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Target, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface ROIData {
  category: string;
  investment: number;
  return: number;
  roi: number;
  duration: number; // in months
  risk: "low" | "medium" | "high";
}

interface ROIProjection {
  month: number;
  cumulativeReturn: number;
  cumulativeInvestment: number;
  netValue: number;
}

const generateMockData = (): ROIData[] => [
  {
    category: "Marketing Campaigns",
    investment: 50000,
    return: 175000,
    roi: 250,
    duration: 6,
    risk: "medium",
  },
  {
    category: "Product Development",
    investment: 150000,
    return: 450000,
    roi: 200,
    duration: 12,
    risk: "low",
  },
  {
    category: "Sales Team",
    investment: 200000,
    return: 800000,
    roi: 300,
    duration: 12,
    risk: "medium",
  },
  {
    category: "Infrastructure",
    investment: 75000,
    return: 150000,
    roi: 100,
    duration: 24,
    risk: "low",
  },
  {
    category: "R&D",
    investment: 100000,
    return: 250000,
    roi: 150,
    duration: 18,
    risk: "high",
  },
];

const COLORS = {
  low: "#10b981", // green
  medium: "#f59e0b", // amber
  high: "#ef4444", // red
};

const RADAR_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export default function ROIAnalysis() {
  const [data, setData] = useState<ROIData[]>(generateMockData());
  const [projections, setProjections] = useState<ROIProjection[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "breakdown" | "radar">("overview");

  useEffect(() => {
    generateProjections();
  }, [data]);

  const generateProjections = () => {
    const maxDuration = Math.max(...data.map(d => d.duration));
    const projectionsData: ROIProjection[] = [];
    
    let cumulativeReturn = 0;
    let cumulativeInvestment = 0;
    
    for (let month = 1; month <= maxDuration; month++) {
      let monthlyReturn = 0;
      let monthlyInvestment = 0;
      
      data.forEach(item => {
        if (month <= item.duration) {
          const monthlyRate = item.return / item.duration;
          monthlyReturn += monthlyRate;
          monthlyInvestment += item.investment / item.duration;
        }
      });
      
      cumulativeReturn += monthlyReturn;
      cumulativeInvestment += monthlyInvestment;
      
      projectionsData.push({
        month,
        cumulativeReturn: parseFloat(cumulativeReturn.toFixed(2)),
        cumulativeInvestment: parseFloat(cumulativeInvestment.toFixed(2)),
        netValue: parseFloat((cumulativeReturn - cumulativeInvestment).toFixed(2)),
      });
    }
    
    setProjections(projectionsData);
  };

  const totalInvestment = data.reduce((sum, item) => sum + item.investment, 0);
  const totalReturn = data.reduce((sum, item) => sum + item.return, 0);
  const overallROI = totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;
  const avgROI = data.reduce((sum, item) => sum + item.roi, 0) / data.length;
  const paybackPeriod = projections.find(p => p.netValue >= 0)?.month || 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <p className="font-medium text-foreground">{payload[0].payload.category}</p>
          <p className="text-sm">Investment: {formatCurrency(payload[0].payload.investment)}</p>
          <p className="text-sm">Return: {formatCurrency(payload[0].payload.return)}</p>
          <p className="text-sm">ROI: {payload[0].payload.roi}%</p>
          <p className="text-sm">Duration: {payload[0].payload.duration} months</p>
          <p className="text-sm">
            Risk:{" "}
            <Badge
              variant="outline"
              className={
                payload[0].payload.risk === "low"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : payload[0].payload.risk === "medium"
                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }
            >
              {payload[0].payload.risk}
            </Badge>
          </p>
        </div>
      );
    }
    return null;
  };

  const getRiskColor = (risk: string) => {
    return COLORS[risk as keyof typeof COLORS] || "#6b7280";
  };

  const radarData = data.map(item => ({
    subject: item.category,
    roi: item.roi,
    efficiency: (item.return / item.investment / item.duration) * 100,
    risk: item.risk === "low" ? 100 : item.risk === "medium" ? 66 : 33,
    duration: 100 - (item.duration / 24) * 100, // Invert so shorter = better
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ROI Analysis
            </CardTitle>
            <CardDescription>
              Analyze return on investment across business categories
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={overallROI >= 100 ? "default" : "secondary"}
              className={
                overallROI >= 200
                  ? "bg-green-500"
                  : overallROI >= 100
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }
            >
              Overall ROI: {overallROI.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvestment)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalReturn)}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. ROI</p>
                <p className={`text-2xl font-bold ${avgROI >= 100 ? "text-green-500" : "text-yellow-500"}`}>
                  {avgROI.toFixed(1)}%
                </p>
              </div>
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold">
                  {paybackPeriod > 0 ? `${paybackPeriod} months` : "N/A"}
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          if (value === "overview" || value === "breakdown" || value === "radar") {
            setActiveTab(value);
          }
        }}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Breakdown
            </TabsTrigger>
            <TabsTrigger value="radar" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Radar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[400px]">
                <h4 className="font-medium mb-4">Investment Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="investment"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">ROI by Category</h4>
                  <div className="space-y-4">
                    {data.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.category}</span>
                            <Badge
                              variant="outline"
                              className={
                                item.risk === "low"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : item.risk === "medium"
                                  ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                              }
                            >
                              {item.risk}
                            </Badge>
                          </div>
                          <span className={`font-bold ${item.roi >= 100 ? "text-green-500" : "text-yellow-500"}`}>
                            {item.roi}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(item.roi, 300)}
                          max={300}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Investment: {formatCurrency(item.investment)}</span>
                          <span>Return: {formatCurrency(item.return)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="mt-4">
            <div className="h-[400px]">
              <h4 className="font-medium mb-4">ROI vs Duration Analysis</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="roi"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RADAR_COLORS[index % RADAR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="duration"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RADAR_COLORS[index % RADAR_COLORS.length]} opacity={0.7} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="radar" className="mt-4">
            <div className="h-[400px]">
              <h4 className="font-medium mb-4">Multi-dimensional Analysis</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="ROI"
                    dataKey="roi"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Efficiency"
                    dataKey="efficiency"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Risk (inverted)"
                    dataKey="risk"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">Investment Recommendations</h4>
            <ul className="space-y-2 text-sm">
              {data
                .sort((a, b) => b.roi - a.roi)
                .slice(0, 3)
                .map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{item.category}</span>
                    <Badge
                      variant="secondary"
                      className={
                        item.roi >= 200
                          ? "bg-green-500/20 text-green-500"
                          : item.roi >= 100
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }
                    >
                      ROI: {item.roi}%
                    </Badge>
                  </li>
                ))}
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">Risk Assessment</h4>
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          item.risk === "low"
                            ? "bg-green-500"
                            : item.risk === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: item.risk === "low" ? "33%" : item.risk === "medium" ? "66%" : "100%" }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {item.risk === "low" ? "Low" : item.risk === "medium" ? "Medium" : "High"}
                    </span>
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