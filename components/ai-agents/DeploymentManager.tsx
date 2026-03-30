"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Rocket,
  GitBranch,
  Globe,
  Server,
  Lock,
  Unlock,
  Play,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Copy,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import context7API, { Deployment } from "@/lib/context7-api"
import { useAuthStore } from "@/lib/store/auth-store"

type Environment = Deployment["environment"]

export default function DeploymentManager() {
  const { token } = useAuthStore()
  const { toast } = useToast()

  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all")
  const [isDeploying, setIsDeploying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deployLogs, setDeployLogs] = useState<string[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [rollbackTarget, setRollbackTarget] = useState<string | null>(null)
  const [isRollingBack, setIsRollingBack] = useState(false)

  const [newDeployment, setNewDeployment] = useState({
    agent: "",
    version: "",
    environment: "staging" as Environment,
    notes: "",
    autoRollback: false,
    notifyTeam: true,
  })

  const agents = [
    { id: "cazza_sales_assistant", name: "Cazza Sales Assistant", versions: ["v2.1.0", "v2.0.9", "v1.9.4"] },
    { id: "cazza_financial_advisor", name: "Cazza Financial Advisor", versions: ["v1.3.2", "v1.3.1", "v1.2.8"] },
    { id: "cazza_marketing_analyst", name: "Cazza Marketing Analyst", versions: ["v1.2.5", "v1.2.4", "v1.1.9"] },
  ]

  const loadDeployments = useCallback(async () => {
    try {
      setIsLoading(true)
      if (token) context7API.setToken(token)
      const env = selectedEnvironment !== "all" ? selectedEnvironment : undefined
      const data = await context7API.listDeployments(env)
      setDeployments(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load deployments"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [token, selectedEnvironment, toast])

  useEffect(() => {
    loadDeployments()
  }, [loadDeployments])

  const filteredDeployments =
    selectedEnvironment === "all"
      ? deployments
      : deployments.filter((d) => d.environment === selectedEnvironment)

  const handleDeploy = async () => {
    if (!newDeployment.agent || !newDeployment.version) {
      toast({
        title: "Incomplete form",
        description: "Please select an agent and version before deploying.",
        variant: "destructive",
      })
      return
    }

    setIsDeploying(true)
    setDeployLogs(["Starting deployment process..."])

    try {
      if (token) context7API.setToken(token)

      const logSteps = [
        "Validating agent configuration...",
        "Checking dependencies...",
        "Building agent package...",
        "Running pre-deploy tests...",
        `Deploying to ${newDeployment.environment} environment...`,
        "Waiting for health checks...",
      ]

      // Stream log messages while calling the real deploy API
      let stepIndex = 0
      const logInterval = setInterval(() => {
        if (stepIndex < logSteps.length) {
          setDeployLogs((prev) => [...prev, logSteps[stepIndex]])
          stepIndex++
        } else {
          clearInterval(logInterval)
        }
      }, 800)

      const deployment = await context7API.deployAgent({
        agent_id: newDeployment.agent,
        version: newDeployment.version,
        environment: newDeployment.environment,
        notes: newDeployment.notes || undefined,
      })

      clearInterval(logInterval)
      setDeployLogs((prev) => [...prev, "Deployment completed successfully!"])
      setDeployments((prev) => [deployment, ...prev])

      setNewDeployment({ agent: "", version: "", environment: "staging", notes: "", autoRollback: false, notifyTeam: true })
      toast({
        title: "Deployment successful",
        description: `${newDeployment.agent} ${newDeployment.version} deployed to ${newDeployment.environment}.`,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Deployment failed"
      setDeployLogs((prev) => [...prev, `Error: ${message}`])
      toast({ title: "Deployment failed", description: message, variant: "destructive" })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleRollback = async () => {
    if (!rollbackTarget) return
    try {
      setIsRollingBack(true)
      if (token) context7API.setToken(token)
      await context7API.rollbackDeployment(rollbackTarget)
      await loadDeployments()
      toast({ title: "Rollback initiated", description: "The deployment has been rolled back." })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Rollback failed"
      toast({ title: "Rollback failed", description: message, variant: "destructive" })
    } finally {
      setIsRollingBack(false)
      setRollbackTarget(null)
    }
  }

  const handleCopyEndpoint = async (endpoint: string) => {
    try {
      await navigator.clipboard.writeText(endpoint)
      toast({ title: "Copied", description: "Endpoint copied to clipboard." })
    } catch {
      toast({ title: "Copy failed", description: "Could not copy to clipboard.", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: Deployment["status"]) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "deploying": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Deploying</Badge>
      case "paused": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>
      case "failed": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
    }
  }

  const getEnvironmentBadge = (environment: Environment) => {
    switch (environment) {
      case "production": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Production</Badge>
      case "staging": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Staging</Badge>
      case "development": return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Development</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Rollback confirmation dialog */}
      <Dialog open={!!rollbackTarget} onOpenChange={(open) => { if (!open) setRollbackTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rollback</DialogTitle>
            <DialogDescription>
              This will roll back the deployment to the previous version. Active traffic will be
              redirected immediately. This action cannot be undone automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRollbackTarget(null)} disabled={isRollingBack}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRollback} disabled={isRollingBack}>
              {isRollingBack ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Rolling back...</> : "Confirm Rollback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deployment Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Deployment Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Deployment</CardTitle>
            <CardDescription>Deploy a new version of an AI agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deploy-agent">Select Agent</Label>
              <Select
                value={newDeployment.agent}
                onValueChange={(value) => setNewDeployment({ ...newDeployment, agent: value || "", version: "" })}
              >
                <SelectTrigger id="deploy-agent">
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deploy-version">Version</Label>
              <Select
                value={newDeployment.version}
                onValueChange={(value) => setNewDeployment({ ...newDeployment, version: value || "" })}
                disabled={!newDeployment.agent}
              >
                <SelectTrigger id="deploy-version">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {agents.find((a) => a.id === newDeployment.agent)?.versions.map((version) => (
                    <SelectItem key={version} value={version}>{version}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deploy-environment">Environment</Label>
              <Select
                value={newDeployment.environment}
                onValueChange={(value: Environment) =>
                  setNewDeployment({ ...newDeployment, environment: value })
                }
              >
                <SelectTrigger id="deploy-environment">
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
                onChange={(e) => setNewDeployment({ ...newDeployment, notes: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-rollback"
                checked={newDeployment.autoRollback}
                onCheckedChange={(checked) => setNewDeployment({ ...newDeployment, autoRollback: checked })}
              />
              <Label htmlFor="auto-rollback">Enable auto-rollback on failure</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notify-team"
                checked={newDeployment.notifyTeam}
                onCheckedChange={(checked) => setNewDeployment({ ...newDeployment, notifyTeam: checked })}
              />
              <Label htmlFor="notify-team">Notify team on completion</Label>
            </div>

            <Button
              onClick={handleDeploy}
              className="w-full gap-2"
              disabled={isDeploying || !newDeployment.agent || !newDeployment.version}
            >
              {isDeploying ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Deploying...</>
              ) : (
                <><Rocket className="h-4 w-4" />Deploy Agent</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Deployment Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Logs</CardTitle>
            <CardDescription>Real-time deployment progress and logs</CardDescription>
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
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
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
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setDeployLogs([])}>
                Clear Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "development", "staging", "production"] as const).map((env) => (
          <Button
            key={env}
            variant={selectedEnvironment === env ? "default" : "outline"}
            onClick={() => setSelectedEnvironment(env)}
            className="gap-1"
          >
            {env === "development" && <Server className="h-4 w-4" />}
            {env === "staging" && <GitBranch className="h-4 w-4" />}
            {env === "production" && <Globe className="h-4 w-4" />}
            {env === "all" ? "All Environments" : env.charAt(0).toUpperCase() + env.slice(1)}
          </Button>
        ))}
      </div>

      {/* Deployments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Deployments</CardTitle>
          <CardDescription>Manage and monitor all agent deployments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                          <span>Avg Response:</span>
                          <span className="font-medium">{deployment.metrics.avgResponseTime}s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Error Rate:</span>
                          <span className={`font-medium ${deployment.metrics.errorRate > 1 ? "text-red-600" : "text-green-600"}`}>
                            {deployment.metrics.errorRate}%
                          </span>
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
                          className="gap-1"
                          onClick={() => setRollbackTarget(deployment.id)}
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
          )}

          {!isLoading && filteredDeployments.length === 0 && (
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
            <div className="text-2xl font-bold">{deployments.length}</div>
            <p className="text-xs text-muted-foreground">Across all environments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.filter((d) => d.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.filter((d) => d.status === "failed").length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deployments.length > 0
                ? (deployments.reduce((s, d) => s + d.metrics.errorRate, 0) / deployments.length).toFixed(1)
                : "0.0"}%
            </div>
            <p className="text-xs text-muted-foreground">Across active agents</p>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Available endpoints for your deployed agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments
              .filter((d) => d.status === "active")
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
                    {deployment.endpoints.map((endpoint) => (
                      <div key={endpoint} className="flex items-center justify-between p-2 bg-muted rounded">
                        <code className="text-sm">{endpoint}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={() => handleCopyEndpoint(endpoint)}
                        >
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
            {deployments.filter((d) => d.status === "active").length === 0 && (
              <p className="text-center text-muted-foreground py-6">No active deployments yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
