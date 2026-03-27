"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Target, Clock, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

export default function PerformanceMonitor() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedAgent, setSelectedAgent] = useState("all")

  const agents = [
    { id: "all", name: "All Agents" },
    { id: "cazza_sales_assistant", name: "Cazza Sales Assistant" },
    { id: "cazza_financial_advisor", name: "Cazza Financial Advisor" },
    { id: "cazza_marketing_analyst", name: "Cazza Marketing Analyst" },
  ]

  const performanceMetrics = {
    overall: {
      accuracy: 89.2,
      responseTime: 1.4,
      satisfaction: 4.6,
      trainingSessions: 25,
    },
    byAgent: {
      cazza_sales_assistant: {
        accuracy: 92.5,
        responseTime: 1.2,
        satisfaction: 4.8,
        trainingSessions: 12,
        queries: 542,
        improvements: "+3.2%",
      },
      cazza_financial_advisor: {
        accuracy: 88.3,
        responseTime: 1.8,
        satisfaction: 4.5,
        trainingSessions: 8,
        queries: 321,
        improvements: "+1.8%",
      },
      cazza_marketing_analyst: {
        accuracy: 85.7,
        responseTime: 1.5,
        satisfaction: 4.4,
        trainingSessions: 5,
        queries: 234,
        improvements: "+2.1%",
      },
    },
  }

  const recentTrainingSessions = [
    {
      agent: "Cazza Sales Assistant",
      date: "2024-03-27",
      duration: "45m",
      accuracyChange: "+2.3%",
      status: "success",
      tokens: "12.4k",
    },
    {
      agent: "Cazza Financial Advisor",
      date: "2024-03-26",
      duration: "1h 20m",
      accuracyChange: "+1.8%",
      status: "success",
      tokens: "18.7k",
    },
    {
      agent: "Cazza Marketing Analyst",
      date: "2024-03-25",
      duration: "30m",
      accuracyChange: "-0.5%",
      status: "partial",
      tokens: "8.9k",
    },
    {
      agent: "Cazza Sales Assistant",
      date: "2024-03-24",
      duration: "55m",
      accuracyChange: "+3.1%",
      status: "success",
      tokens: "15.2k",
    },
  ]

  const accuracyTrend = [85, 86, 87, 88, 89, 90, 91, 92, 91, 92, 93, 92]
  const responseTimeTrend = [2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.4, 1.3, 1.2, 1.2]
  const satisfactionTrend = [4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.8]

  const getAgentMetrics = () => {
    if (selectedAgent === "all") {
      return performanceMetrics.overall
    }
    return performanceMetrics.byAgent[selectedAgent as keyof typeof performanceMetrics.byAgent]
  }

  const currentMetrics = getAgentMetrics()

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent</label>
                <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="gap-2">
                <BarChart className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.accuracy}%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+2.1%</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.responseTime}s</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-green-600">-0.3s</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.satisfaction}/5</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+0.2</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.trainingSessions}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+3</span>
              <span className="text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Trend</CardTitle>
            <CardDescription>
              Agent accuracy over time ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-1 pt-4">
              {accuracyTrend.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t-lg"
                    style={{ height: `${(value - 80) * 4}px` }}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Accuracy (%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Response Time & Satisfaction</CardTitle>
            <CardDescription>
              Performance metrics comparison ({timeRange})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2 pt-4">
              {responseTimeTrend.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg"
                    style={{ height: `${value * 30}px` }}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Response Time (s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Satisfaction (/5)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Training Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Training Sessions</CardTitle>
          <CardDescription>
            Performance impact of recent training sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrainingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    session.status === "success" ? "bg-green-100" : 
                    session.status === "partial" ? "bg-yellow-100" : "bg-red-100"
                  }`}>
                    {session.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : session.status === "partial" ? (
                      <Target className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{session.agent}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.date} • {session.duration} • {session.tokens} tokens
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    session.accuracyChange.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}>
                    {session.accuracyChange}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Accuracy change
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
          <CardDescription>
            AI-powered suggestions to improve agent performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Increase Training Data Variety</h4>
                <p className="text-muted-foreground mt-1">
                  Add more diverse conversation examples to improve the Sales Assistant's 
                  ability to handle edge cases. Current training data shows gaps in 
                  handling customer objections.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">Priority: High</Badge>
                  <Badge variant="outline">Estimated Impact: +3-5% accuracy</Badge>
                </div>
              </div>
              <Button size="sm">Apply</Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Optimize Response Time</h4>
                <p className="text-muted-foreground mt-1">
                  Financial Advisor response time can be improved by caching common 
                  financial calculations and pre-processing frequently accessed data.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">Priority: Medium</Badge>
                  <Badge variant="outline">Estimated Impact: -0.5s response time</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline">Schedule</Button>
            </div>
            
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Update Knowledge Base</h4>
                <p className="text-muted-foreground mt-1">
                  Marketing Analyst knowledge base hasn't been updated with Q2 2024 
                  marketing trends. Adding recent case studies could improve relevance.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">Priority: Low</Badge>
                  <Badge variant="outline">Estimated Impact: +1-2% satisfaction</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}