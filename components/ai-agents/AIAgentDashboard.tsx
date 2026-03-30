"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Brain, Upload, BarChart, MessageSquare, Settings, Loader2 } from "lucide-react"
import AgentList from "./AgentList"
import TrainingInterface from "./TrainingInterface"
import KnowledgeBaseManager from "./KnowledgeBaseManager"
import PerformanceMonitor from "./PerformanceMonitor"
import ConversationHistory from "./ConversationHistory"
import DeploymentManager from "./DeploymentManager"
import { useToast } from "@/components/ui/use-toast"
import context7API, { AIAgent } from "@/lib/context7-api"
import { useAuthStore } from "@/lib/store/auth-store"

// Map Context7 agent shape to AgentList's expected shape
interface AgentRow {
  id: string
  name: string
  description: string
  type: string
  status: "active" | "training" | "inactive"
  lastTrained: string
  trainingSessions: number
  accuracy: number
}

function toAgentRow(agent: AIAgent): AgentRow {
  return {
    id: agent.agent_id,
    name: agent.name,
    description: agent.description,
    type: agent.agent_type,
    status: agent.is_active ? "active" : "inactive",
    lastTrained: agent.updated_at
      ? new Date(agent.updated_at).toLocaleDateString()
      : "Never",
    trainingSessions: 0, // not available in base agent shape
    accuracy: 0,
  }
}

export default function AIAgentDashboard() {
  const { token } = useAuthStore()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("agents")
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadAgents = useCallback(async () => {
    try {
      setIsLoading(true)
      if (token) context7API.setToken(token)
      const data = await context7API.listAgents()
      setAgents(data.map(toAgentRow))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load agents"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [token, toast])

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  const handleCreateAgent = () => {
    // Navigate to training tab to create a new agent
    setActiveTab("training")
    toast({ title: "Create Agent", description: "Configure and train your new agent in the Training tab." })
  }

  const handleTrainAgent = (agentId: string) => {
    setActiveTab("training")
    toast({ title: "Train Agent", description: `Opening training for agent ${agentId}.` })
  }

  const handleUploadTrainingData = () => {
    setActiveTab("training")
    toast({ title: "Upload Training Data", description: "Use the Training tab to upload data." })
  }

  const activeCount = agents.filter((a) => a.status === "active").length
  const totalSessions = agents.reduce((sum, a) => sum + a.trainingSessions, 0)
  const avgAccuracy =
    agents.length > 0
      ? Math.round(agents.reduce((sum, a) => sum + a.accuracy, 0) / agents.length)
      : 0

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
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{activeCount}</div>
                <p className="text-xs text-muted-foreground">{agents.length} total agents</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalSessions}</div>
                <p className="text-xs text-muted-foreground">Total training sessions</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{avgAccuracy}%</div>
                <p className="text-xs text-muted-foreground">Across all agents</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">See Conversations tab</p>
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
        <Button variant="outline" className="gap-2" onClick={() => setActiveTab("deployment")}>
          <Settings className="h-4 w-4" />
          Manage Deployments
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
