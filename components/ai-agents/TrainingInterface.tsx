"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Database, Link, Play, StopCircle, CheckCircle } from "lucide-react"

export default function TrainingInterface() {
  const [trainingMethod, setTrainingMethod] = useState("upload")
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [selectedAgent, setSelectedAgent] = useState("")
  const [trainingData, setTrainingData] = useState("")

  const agents = [
    { id: "cazza_sales_assistant", name: "Cazza Sales Assistant" },
    { id: "cazza_financial_advisor", name: "Cazza Financial Advisor" },
    { id: "cazza_marketing_analyst", name: "Cazza Marketing Analyst" },
  ]

  const handleStartTraining = () => {
    if (!selectedAgent) {
      alert("Please select an agent to train")
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + 5
      })
    }, 500)
  }

  const handleStopTraining = () => {
    setIsTraining(false)
    setTrainingProgress(0)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to your backend
      console.log("File selected:", file.name)
      // For demo purposes, we'll just show a success message
      alert(`File "${file.name}" ready for training`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Training</CardTitle>
          <CardDescription>
            Train your AI agents with custom data using Context7 API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agent Selection */}
          <div className="space-y-2">
            <Label htmlFor="agent">Select Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent to train" />
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

          {/* Training Method Tabs */}
          <Tabs value={trainingMethod} onValueChange={setTrainingMethod}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2">
                <FileText className="h-4 w-4" />
                Direct Text
              </TabsTrigger>
              <TabsTrigger value="database" className="gap-2">
                <Database className="h-4 w-4" />
                Database
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Link className="h-4 w-4" />
                API Integration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 pt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">Upload Training Data</h3>
                <p className="text-muted-foreground mt-2">
                  Upload documents, spreadsheets, or text files for training
                </p>
                <div className="mt-6">
                  <Input
                    type="file"
                    id="training-file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                    accept=".txt,.pdf,.doc,.docx,.csv,.json"
                  />
                  <Label htmlFor="training-file">
                    <Button asChild variant="outline">
                      <span>Choose Files</span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supports: TXT, PDF, DOC, DOCX, CSV, JSON (Max 100MB)
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="training-text">Training Text</Label>
                <Textarea
                  id="training-text"
                  placeholder="Paste or type training data here..."
                  rows={10}
                  value={trainingData}
                  onChange={(e) => setTrainingData(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter text that you want the AI agent to learn from
                </p>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4 pt-4">
              <div className="rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Connect to Database</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="db-type">Database Type</Label>
                    <Select defaultValue="postgres">
                      <SelectTrigger>
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgres">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="sqlite">SQLite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db-connection">Connection String</Label>
                    <Input
                      id="db-connection"
                      placeholder="postgresql://user:password@localhost:5432/database"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db-query">SQL Query</Label>
                    <Textarea
                      id="db-query"
                      placeholder="SELECT * FROM conversations WHERE date >= '2024-01-01'"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4 pt-4">
              <div className="rounded-lg border p-6">
                <h3 className="font-semibold mb-4">API Integration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API Endpoint</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com/data"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key (Optional)</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-params">Parameters (JSON)</Label>
                    <Textarea
                      id="api-params"
                      placeholder='{"limit": 100, "format": "json"}'
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Training Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Training Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how the agent should learn from this data
                </p>
              </div>
              <div className="flex gap-2">
                {isTraining ? (
                  <Button onClick={handleStopTraining} variant="destructive" className="gap-2">
                    <StopCircle className="h-4 w-4" />
                    Stop Training
                  </Button>
                ) : (
                  <Button onClick={handleStartTraining} className="gap-2" disabled={!selectedAgent}>
                    <Play className="h-4 w-4" />
                    Start Training
                  </Button>
                )}
              </div>
            </div>

            {isTraining && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training in progress...</span>
                  <span>{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} />
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Data Processing
                  </Badge>
                  <Badge variant={trainingProgress > 25 ? "default" : "outline"} className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Model Training
                  </Badge>
                  <Badge variant={trainingProgress > 75 ? "default" : "outline"} className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Validation
                  </Badge>
                  <Badge variant={trainingProgress === 100 ? "default" : "outline"} className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Deployment
                  </Badge>
                </div>
              </div>
            )}

            {/* Advanced Options */}
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-3">Advanced Training Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                  />
                  <p className="text-xs text-muted-foreground">Creativity level (0-1)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="epochs">Training Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue="10"
                  />
                  <p className="text-xs text-muted-foreground">Number of training passes</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    min="1"
                    max="1000"
                    defaultValue="32"
                  />
                  <p className="text-xs text-muted-foreground">Samples per batch</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Training Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Training Sessions</CardTitle>
          <CardDescription>
            History of training sessions for all agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { agent: "Cazza Sales Assistant", date: "2024-03-27", duration: "45m", status: "completed", accuracy: "+2.3%" },
              { agent: "Cazza Financial Advisor", date: "2024-03-26", duration: "1h 20m", status: "completed", accuracy: "+1.8%" },
              { agent: "Cazza Marketing Analyst", date: "2024-03-25", duration: "30m", status: "failed", accuracy: "N/A" },
              { agent: "Cazza Sales Assistant", date: "2024-03-24", duration: "55m", status: "completed", accuracy: "+3.1%" },
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${
                    session.status === "completed" ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <div>
                    <div className="font-medium">{session.agent}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.date} • {session.duration}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    session.status === "completed" ? "text-green-600" : "text-red-600"
                  }`}>
                    {session.status === "completed" ? session.accuracy : "Failed"}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {session.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}