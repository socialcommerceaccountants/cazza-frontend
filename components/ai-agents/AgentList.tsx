"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Brain, Play, Edit, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Agent {
  id: string
  name: string
  description: string
  type: string
  status: "active" | "training" | "inactive"
  lastTrained: string
  trainingSessions: number
  accuracy: number
}

interface AgentListProps {
  agents: Agent[]
  onTrainAgent: (agentId: string) => void
  onCreateAgent: () => void
}

export default function AgentList({ agents, onTrainAgent, onCreateAgent }: AgentListProps) {
  const getStatusBadge = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "training":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Training</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAgentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      sales_assistant: "Sales Assistant",
      financial_advisor: "Financial Advisor",
      marketing_analyst: "Marketing Analyst",
      customer_support: "Customer Support",
      operations_manager: "Operations Manager",
      custom: "Custom",
    }
    return typeMap[type] || type
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Agents</CardTitle>
            <CardDescription>
              Manage your AI agents and their training sessions
            </CardDescription>
          </div>
          <Button onClick={onCreateAgent} className="gap-2">
            <Brain className="h-4 w-4" />
            New Agent
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Trained</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-sm text-muted-foreground">{agent.description}</div>
                </TableCell>
                <TableCell>{getAgentTypeLabel(agent.type)}</TableCell>
                <TableCell>{getStatusBadge(agent.status)}</TableCell>
                <TableCell>{agent.lastTrained}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${agent.accuracy}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{agent.accuracy}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onTrainAgent(agent.id)}
                      className="gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Train
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          Test Agent
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {agents.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">No AI Agents</h3>
            <p className="text-muted-foreground mt-2">
              Create your first AI agent to get started with automated business intelligence.
            </p>
            <Button onClick={onCreateAgent} className="mt-4">
              Create First Agent
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}