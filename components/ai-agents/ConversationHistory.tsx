"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Download,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import context7API from "@/lib/context7-api"
import { useAuthStore } from "@/lib/store/auth-store"

interface Conversation {
  id: string
  agent: string
  userQuery: string
  agentResponse: string
  timestamp: string
  duration: string
  satisfaction: "positive" | "neutral" | "negative"
  confidence: number
  tags: string[]
}

const agents = [
  { id: "all", name: "All Agents" },
  { id: "cazza_sales_assistant", name: "Cazza Sales Assistant" },
  { id: "cazza_financial_advisor", name: "Cazza Financial Advisor" },
  { id: "cazza_marketing_analyst", name: "Cazza Marketing Analyst" },
]

export default function ConversationHistory() {
  const { token } = useAuthStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedSatisfaction, setSelectedSatisfaction] = useState("all")
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null)
  const [newFeedback, setNewFeedback] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true)
      if (token) context7API.setToken(token)
      const data = await context7API.getConversations({
        agent_id: selectedAgent !== "all" ? selectedAgent : undefined,
        limit: 50,
      })
      // Normalise API shape to our local interface
      setConversations(
        (data as Conversation[]).map((c) => ({
          id: c.id,
          agent: c.agent,
          userQuery: c.userQuery,
          agentResponse: c.agentResponse,
          timestamp: c.timestamp,
          duration: c.duration,
          satisfaction: c.satisfaction ?? "neutral",
          confidence: c.confidence ?? 0,
          tags: c.tags ?? [],
        }))
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load conversations"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [token, selectedAgent, toast])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.userQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.agentResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesAgent =
      selectedAgent === "all" ||
      conv.agent === agents.find((a) => a.id === selectedAgent)?.name
    const matchesSatisfaction =
      selectedSatisfaction === "all" || conv.satisfaction === selectedSatisfaction
    return matchesSearch && matchesAgent && matchesSatisfaction
  })

  const handleCopyResponse = async (response: string) => {
    try {
      await navigator.clipboard.writeText(response)
      toast({ title: "Copied", description: "Response copied to clipboard." })
    } catch {
      toast({ title: "Copy failed", description: "Could not copy to clipboard.", variant: "destructive" })
    }
  }

  const handleSubmitFeedback = async (conversationId: string) => {
    if (!newFeedback.trim()) {
      toast({ title: "Empty feedback", description: "Please enter feedback before submitting.", variant: "destructive" })
      return
    }

    try {
      setIsSubmittingFeedback(true)
      // Feedback endpoint — the backend stores it against the conversation
      // context7API does not yet expose this endpoint, so we use apiClient directly
      const { apiClient } = await import("@/lib/api/client")
      await apiClient.post(`/conversations/${conversationId}/feedback`, {
        feedback: newFeedback.trim(),
      })
      setNewFeedback("")
      setExpandedConversation(null)
      toast({ title: "Feedback submitted", description: "Thank you for helping improve the agent." })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit feedback"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const getSatisfactionIcon = (satisfaction: Conversation["satisfaction"]) => {
    switch (satisfaction) {
      case "positive": return <ThumbsUp className="h-4 w-4 text-green-600" />
      case "negative": return <ThumbsDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-gray-400" /></div>
    }
  }

  const getSatisfactionBadge = (satisfaction: Conversation["satisfaction"]) => {
    switch (satisfaction) {
      case "positive": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Positive</Badge>
      case "negative": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Negative</Badge>
      default: return <Badge variant="outline">Neutral</Badge>
    }
  }

  const positiveCount = conversations.filter((c) => c.satisfaction === "positive").length
  const negativeCount = conversations.filter((c) => c.satisfaction === "negative").length
  const neutralCount = conversations.filter((c) => c.satisfaction === "neutral").length
  const total = conversations.length || 1

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value || "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSatisfaction} onValueChange={(value) => setSelectedSatisfaction(value || "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Satisfaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Satisfaction</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>High Confidence Only</DropdownMenuItem>
                  <DropdownMenuItem>Recent (Last 24h)</DropdownMenuItem>
                  <DropdownMenuItem>Long Conversations</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedAgent !== "all" && (
              <Badge variant="outline" className="gap-1">
                Agent: {agents.find((a) => a.id === selectedAgent)?.name}
                <button onClick={() => setSelectedAgent("all")} className="ml-1 hover:text-destructive" aria-label="Clear">×</button>
              </Badge>
            )}
            {selectedSatisfaction !== "all" && (
              <Badge variant="outline" className="gap-1">
                Satisfaction: {selectedSatisfaction}
                <button onClick={() => setSelectedSatisfaction("all")} className="ml-1 hover:text-destructive" aria-label="Clear">×</button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="gap-1">
                Search: &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive" aria-label="Clear">×</button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversation List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Card key={conversation.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{conversation.agent}</div>
                        <div className="text-sm text-muted-foreground">
                          {conversation.timestamp} • {conversation.duration} • {conversation.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSatisfactionBadge(conversation.satisfaction)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setExpandedConversation(
                            expandedConversation === conversation.id ? null : conversation.id
                          )
                        }
                      >
                        {expandedConversation === conversation.id ? "Collapse" : "Expand"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {conversation.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-1">User Query</div>
                      <div>{conversation.userQuery}</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-600 mb-1">AI Agent Response</div>
                      <div>{conversation.agentResponse}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => handleCopyResponse(conversation.agentResponse)}
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Regenerate
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={conversation.satisfaction === "positive" ? "default" : "outline"}
                        aria-label="Positive"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={conversation.satisfaction === "negative" ? "destructive" : "outline"}
                        aria-label="Negative"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {expandedConversation === conversation.id && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-3">Provide Feedback</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="How could this response be improved? What was good or bad about it?"
                          rows={3}
                          value={newFeedback}
                          onChange={(e) => setNewFeedback(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setExpandedConversation(null)} disabled={isSubmittingFeedback}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleSubmitFeedback(conversation.id)} disabled={isSubmittingFeedback}>
                            {isSubmittingFeedback ? (
                              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
                            ) : (
                              "Submit Feedback"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredConversations.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No Conversations Found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery ? "Try a different search term" : "No conversations match your filters"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => { setSearchQuery(""); setSelectedAgent("all"); setSelectedSatisfaction("all") }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Loaded from last 50 records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Positive</span>
                </div>
                <span className="font-medium">{Math.round((positiveCount / total) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-gray-400" /></div>
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="font-medium">{Math.round((neutralCount / total) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Negative</span>
                </div>
                <span className="font-medium">{Math.round((negativeCount / total) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export as JSON
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export for Training
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
