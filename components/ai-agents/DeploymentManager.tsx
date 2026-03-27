"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Rocket, GitBranch, Globe, Server, Lock, Unlock, Play, Pause, RefreshCw, Download, Upload, Settings } from "lucide-react"

interface Deployment {
  id: string
  agent: string
  version: string
  environment: "development" | "staging" | "production"
  status: "active" | "deploying" | "paused" | "failed"
  deployedAt: string
  deployedBy: string
  endpoints: string[]
  metrics: {
    uptime: string
    requests: number
    avgResponseTime: number
    errorRate: number
  }
}

export default function DeploymentManager() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployLogs, setDeployLogs] = useState<string[]>([])
  const [newDeployment, setNewDeployment] = useState({
    agent: "",
    version: "",
    environment: "staging" as const,
    notes: "",
  })

  const deployments: Deployment[] = [
    {
      id: "1",
      agent: "Cazza Sales Assistant",
      version: "v2.1.0",
      environment: "production",
      status: "active",
      deployedAt: "2024-03-27 10:30",
      deployedBy: "admin@cazza.ai",
      endpoints: ["https://api.cazza.ai/v1/agents/sales", "https://api.cazza.ai/v1/agents/sales/query"],
      metrics: {
        uptime: "99.8%",
        requests: 15420,
        avgResponseTime: 1.2,
        errorRate: 0.2,
      },
    },
    {
      id: "2",
      agent: "Cazza Financial Advisor",
      version: "v1.3.2",
      environment: "production",
      status: "active",
      deployedAt: "2024-03-26 14:15",
      deployedBy: "admin@cazza.ai",
      endpoints: ["https://api.cazza.ai/v1/agents/finance"],
      metrics: {
        uptime: "99.5%",
        requests: 8920,
        avgResponseTime: 1.8,
        errorRate: 0.5,
      },
    },
    {
      id: "3",
      agent: "Cazza Marketing Analyst",
      version: "v1.2.5",
      environment: "staging",
      status: "deploying",
      deployedAt: "2024-03-27 15:45",
      deployedBy: "dev@cazza.ai",
      endpoints: ["https://staging.api.cazza.ai/v1/agents/marketing"],
      metrics: {
        uptime: "100%",
        requests: 1250,
        avgResponseTime: 1.5,
        errorRate: 0.1,
      },
    },
    {
      id: "4",
      agent: "Cazza Sales Assistant",
      version: "v2.0.9",
      environment: "development",
      status: "paused",
      deployedAt: "2024-03-25 09:20",
      deployedBy: "dev@cazza.ai",
      endpoints: ["http://localhost:8000/v1/agents/sales"],
      metrics: {
        uptime: "95.2%",
        requests: 450,
        avgResponseTime: 2.1,
        errorRate: 1.2,
      },
    },
  ]

  const agents = [
    { id: "cazza_sales_assistant", name: "Cazza Sales Assistant", versions: ["v2.1.0", "v2.0.9", "v1.9.4"] },
    { id: "cazza_financial_advisor", name: "Cazza Financial Advisor", versions: ["v1.3.2", "v1.3.1", "v1.2.8"] },
    { id: "cazza_marketing_analyst", name: "Cazza Marketing Analyst", versions: ["v1.2.5", "v1.2.4", "v1.1.9"] },
  ]

  const filteredDeployments = selectedEnvironment === "all" 
    ? deployments 
    : deployments.filter(d => d.environment === selectedEnvironment)

  const getStatusBadge = (status: Deployment["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "deploying":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Deploying</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
    }
  }

  const getEnvironmentBadge = (environment: Deployment["environment"]) => {
    switch (environment) {
      case "production":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Production</Badge>
      case "staging":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Staging</Badge>
      case "development":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Development</Badge>
    }
  }

  const simulateDeployment = () => {
    if (!newDeployment.agent || !newDeployment.version) {
      alert("Please select an agent and version")
      return
    }

    setIsDeploying(true)
    setDeployLogs([])

    const logs = [
      "Starting deployment process...",
      "Validating agent configuration...",
      "Checking dependencies...",
      "Building agent package...",
      "Running tests...",
      "Deploying to staging environment...",
      "Waiting for health checks...",
      "Deployment completed successfully!",
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < logs.length) {
        setDeployLogs(prev => [...prev, logs[index]])
        index++
      } else {
        clearInterval(interval)
        setIsDeploying(false)
        
        // Reset form
        setNewDeployment({
          agent: "",
          version: "",
          environment: "staging",
          notes: "",
        })
        
        alert("Deployment completed successfully!")
      }
    }, 1000)
  }

  const handleRollback = (deploymentId: string) => {
    if (confirm("Are you sure you want to rollback this deployment?")) {
      console.log("Rolling back deployment:", deploymentId)
      alert("Rollback initiated. Check deployment logs for progress.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Deployment Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Deployment Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Deployment</CardTitle>
            <CardDescription>
              Deploy a new version of an AI agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deploy-agent">Select Agent</Label>
              <Select 
                value={newDeployment.agent} 
                onValueChange={(value) => setNewDeployment({...newDeployment, agent: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent" />
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

            <div className="space-y-2">
              <Label htmlFor="deploy-version">Version</Label>
              <Select 
                value={newDeployment.version} 
                onValueChange={(value) => setNewDeployment({...newDeployment, version: value})}
                disabled={!newDeployment.agent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {agents
                    .find(a => a.id === newDeployment.agent)
                    ?.versions.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deploy-environment">Environment</Label>
              <Select 
                value={newDeployment.environment} 
                onValueChange={(value: any) => setNewDeployment({...newDeployment, environment: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deploy-notes">Release Notes (Optional)</Label>
              <Textarea
                id="deploy-notes"
                placeholder="Describe what's new in this version..."
                rows={3}
                value={newDeployment.notes}
                onChange={(e) => setNewDeployment({...newDeployment, notes: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-rollback" />
              <Label htmlFor="auto-rollback">Enable auto-rollback on failure</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="notify-team" defaultChecked />
              <Label htmlFor="notify-team">Notify team on completion</Label>
            </div>

            <Button 
              onClick={simulateDeployment} 
              className="w-full gap-2"
              disabled={isDeploying || !newDeployment.agent || !newDeployment.version}
            >
              <Rocket className="h-4 w-4" />
              {isDeploying ? "Deploying..." : "Deploy Agent"}
            </Button>
          </CardContent>
        </Card>

        {/* Deployment Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Logs</CardTitle>
            <CardDescription>
              Real-time deployment progress and logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto rounded-lg bg-gray-900 text-gray-100 p-4 font-mono text-sm">
              {deployLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No deployment logs yet. Start a deployment to see logs here.
                </div>
              ) : (
                deployLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-green-400">$</span> {log}
                  </div>
                ))
              )}
              {isDeploying && (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">●</div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3 w-3" />
                Download Logs
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="h-3 w-3" />
                Share Logs
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => setDeployLogs([])}
              >
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedEnvironment === "all" ? "default" : "outline"}
          onClick={() => setSelectedEnvironment("all")}
        >
          All Environments
        </Button>
        <Button
          variant={selectedEnvironment === "development" ? "default" : "outline"}
          onClick={() => setSelectedEnvironment("development")}
          className="gap-1"
        >
          <Server className="h-4 w-4" />
          Development
        </Button>
        <Button
          variant={selectedEnvironment === "staging" ? "default" : "outline"}
          onClick={() => setSelectedEnvironment("staging")}
          className="gap-1"
        >
          <GitBranch className="h-4 w-4" />
          Staging
        </Button>
        <Button
          variant={selectedEnvironment === "production" ? "default" : "outline"}
          onClick={() => setSelectedEnvironment("production")}
          className="gap-1"
        >
          <Globe className="h-4 w-4" />
          Production
        </Button>
      </div>

      {/* Deployments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Deployments</CardTitle>
          <CardDescription>
            Manage and monitor all agent deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deployed At</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell className="font-medium">{deployment.agent}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      {deployment.version}
                    </div>
                  </TableCell>
                  <TableCell>{getEnvironmentBadge(deployment.environment)}</TableCell>
                  <TableCell>{getStatusBadge(deployment.status)}</TableCell>
                  <TableCell>
                    <div>{deployment.deployedAt}</div>
                    <div className="text-sm text-muted-foreground">by {deployment.deployedBy}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Uptime:</span>
                        <span className="font-medium">{deployment.metrics.uptime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Requests:</span>
                        <span className="font-medium">{deployment.metrics.requests.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Response Time:</span>
                        <span className="font-medium">{deployment.metrics.avgResponseTime}s</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Settings className="h-3 w-3" />
                        Configure
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRollback(deployment.id)}
                        className="gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Rollback
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredDeployments.length === 0 && (
            <div className="text-center py-12">
              <Rocket className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">No Deployments Found</h3>
              <p className="text-muted-foreground mt-2">
                {selectedEnvironment !== "all" 
                  ? `No deployments in ${selectedEnvironment} environment`
                  : "No deployments yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Across all environments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deployments.filter(d => d.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.4%</div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Available endpoints for your deployed agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments
              .filter(d => d.status === "active")
              .map((deployment) => (
                <div key={deployment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{deployment.agent}</h4>
                      <div className="text-sm text-muted-foreground">
                        {deployment.version} • {deployment.environment}
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Secured
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {deployment.endpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <code className="text-sm">{endpoint}</code>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Play className="h-3 w-3" />
                      Test Endpoint
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Settings className="h-3 w-3" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Unlock className="h-3 w-3" />
                      API Keys
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}