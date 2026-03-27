"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Brain, Upload, BarChart, MessageSquare, Settings } from "lucide-react"
import AgentList from "./AgentList"
import TrainingInterface from "./TrainingInterface"
import KnowledgeBaseManager from "./KnowledgeBaseManager"
import PerformanceMonitor from "./PerformanceMonitor"
import ConversationHistory from "./ConversationHistory"
import DeploymentManager from "./DeploymentManager"

// Mock data for demonstration
const mockAgents = [
  {
    id: "cazza_sales_assistant",
    name: "Cazza Sales Assistant",
    description: "AI assistant for sales conversations and customer engagement",
    type: "sales_assistant",
    status: "active",
    lastTrained: "2024-03-26",
    trainingSessions: 12,
    accuracy: 92.5,
  },
  {
    id: "cazza_financial_advisor",
    name: "Cazza Financial Advisor",
    description: "AI advisor for financial analysis and investment recommendations",
    type: "financial_advisor",
    status: "active",
    lastTrained: "2024-03-25",
    trainingSessions: 8,
    accuracy: 88.3,
  },
  {
    id: "cazza_marketing_analyst",
    name: "Cazza Marketing Analyst",
    description: "AI analyst for marketing performance and campaign optimization",
    type: "marketing_analyst",
    status: "training",
    lastTrained: "2024-03-27",
    trainingSessions: 5,
    accuracy: 85.7,
  },
]

export default function AIAgentDashboard() {
  const [activeTab, setActiveTab] = useState("agents")
  const [agents, setAgents] = useState(mockAgents)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateAgent = () => {
    // TODO: Implement agent creation
    console.log("Create new agent")
  }

  const handleTrainAgent = (agentId: string) => {
    // TODO: Implement agent training
    console.log("Train agent:", agentId)
  }

  const handleUploadTrainingData = () => {
    // TODO: Implement training data upload
    console.log("Upload training data")
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {agents.length} total agents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.reduce((sum, agent) => sum + agent.trainingSessions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total training sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(agents.reduce((sum, agent) => sum + agent.accuracy, 0) / agents.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Today: 42 conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleCreateAgent} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Agent
        </Button>
        <Button onClick={handleUploadTrainingData} variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Training Data
        </Button>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configure Context7 API
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="space-y-4">
          <AgentList 
            agents={agents} 
            onTrainAgent={handleTrainAgent}
            onCreateAgent={handleCreateAgent}
          />
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <TrainingInterface />
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-4">
          <KnowledgeBaseManager />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceMonitor />
        </TabsContent>
        
        <TabsContent value="conversations" className="space-y-4">
          <ConversationHistory />
        </TabsContent>
        
        <TabsContent value="deployment" className="space-y-4">
          <DeploymentManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}