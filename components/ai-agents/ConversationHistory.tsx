"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, MessageSquare, ThumbsUp, ThumbsDown, Copy, RefreshCw, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export default function ConversationHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedSatisfaction, setSelectedSatisfaction] = useState("all")
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null)
  const [newFeedback, setNewFeedback] = useState("")

  const agents = [
    { id: "all", name: "All Agents" },
    { id: "cazza_sales_assistant", name: "Cazza Sales Assistant" },
    { id: "cazza_financial_advisor", name: "Cazza Financial Advisor" },
    { id: "cazza_marketing_analyst", name: "Cazza Marketing Analyst" },
  ]

  const conversations: Conversation[] = [
    {
      id: "1",
      agent: "Cazza Sales Assistant",
      userQuery: "What's the best approach for following up with a prospect who showed interest but hasn't responded?",
      agentResponse: "I recommend a multi-channel follow-up approach: 1) Send a personalized email 2-3 days after initial contact, 2) Make a brief phone call a week later focusing on value, 3) Connect on LinkedIn with a relevant article. Space contacts 3-5 days apart and always provide additional value in each touchpoint.",
      timestamp: "2024-03-27 14:30",
      duration: "2.4s",
      satisfaction: "positive",
      confidence: 92,
      tags: ["sales", "follow-up", "prospecting"],
    },
    {
      id: "2",
      agent: "Cazza Financial Advisor",
      userQuery: "How should I allocate my investment portfolio for moderate risk tolerance?",
      agentResponse: "For moderate risk tolerance, consider: 50% in diversified stocks (mix of large-cap, mid-cap, and international), 30% in bonds (government and corporate), 15% in real estate/REITs, and 5% in cash equivalents. Rebalance quarterly and consider dollar-cost averaging for new investments.",
      timestamp: "2024-03-27 13:15",
      duration: "3.1s",
      satisfaction: "positive",
      confidence: 88,
      tags: ["finance", "investing", "portfolio"],
    },
    {
      id: "3",
      agent: "Cazza Marketing Analyst",
      userQuery: "What are the key metrics to track for a new social media campaign?",
      agentResponse: "Focus on: 1) Engagement rate (likes, comments, shares), 2) Click-through rate (CTR), 3) Conversion rate, 4) Cost per acquisition (CPA), 5) Return on ad spend (ROAS), 6) Audience growth rate, and 7) Content resonance score. Track daily for first 2 weeks, then weekly.",
      timestamp: "2024-03-27 11:45",
      duration: "1.8s",
      satisfaction: "neutral",
      confidence: 85,
      tags: ["marketing", "analytics", "social-media"],
    },
    {
      id: "4",
      agent: "Cazza Sales Assistant",
      userQuery: "How do I handle price objections from enterprise clients?",
      agentResponse: "For enterprise price objections: 1) Reframe to value (ROI calculation), 2) Offer tiered pricing options, 3) Provide case studies showing ROI, 4) Consider annual billing discounts, 5) Bundle services, 6) Offer pilot programs. Always focus on business outcomes rather than features.",
      timestamp: "2024-03-26 16:20",
      duration: "2.8s",
      satisfaction: "positive",
      confidence: 90,
      tags: ["sales", "pricing", "enterprise"],
    },
    {
      id: "5",
      agent: "Cazza Financial Advisor",
      userQuery: "What tax implications should I consider for cryptocurrency investments?",
      agentResponse: "Cryptocurrency tax considerations: 1) Capital gains tax on sales (short-term vs long-term), 2) Mining income is taxable as ordinary income, 3) Staking rewards are taxable, 4) Airdrops are taxable at fair market value, 5) Wash sale rules may not apply (check local regulations), 6) Keep detailed records of all transactions.",
      timestamp: "2024-03-26 14:10",
      duration: "4.2s",
      satisfaction: "negative",
      confidence: 82,
      tags: ["finance", "crypto", "tax"],
    },
  ]

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.userQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.agentResponse.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesAgent = selectedAgent === "all" || conv.agent === agents.find(a => a.id === selectedAgent)?.name
    const matchesSatisfaction = selectedSatisfaction === "all" || conv.satisfaction === selectedSatisfaction
    return matchesSearch && matchesAgent && matchesSatisfaction
  })

  const getSatisfactionIcon = (satisfaction: Conversation["satisfaction"]) => {
    switch (satisfaction) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-600" />
      case "neutral":
        return <div className="h-4 w-4 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-gray-400" />
        </div>
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-600" />
    }
  }

  const getSatisfactionBadge = (satisfaction: Conversation["satisfaction"]) => {
    switch (satisfaction) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Positive</Badge>
      case "neutral":
        return <Badge variant="outline">Neutral</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Negative</Badge>
    }
  }

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response)
    // In a real app, you might show a toast notification
    alert("Response copied to clipboard!")
  }

  const handleSubmitFeedback = (conversationId: string) => {
    if (!newFeedback.trim()) {
      alert("Please enter feedback")
      return
    }
    
    console.log("Submitting feedback for conversation", conversationId, ":", newFeedback)
    setNewFeedback("")
    setExpandedConversation(null)
    alert("Feedback submitted successfully!")
  }

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
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-[180px]">
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
              
              <Select value={selectedSatisfaction} onValueChange={setSelectedSatisfaction}>
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
                  <DropdownMenuItem>Tag Filter</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedAgent !== "all" && (
              <Badge variant="outline" className="gap-1">
                Agent: {agents.find(a => a.id === selectedAgent)?.name}
                <button 
                  onClick={() => setSelectedAgent("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedSatisfaction !== "all" && (
              <Badge variant="outline" className="gap-1">
                Satisfaction: {selectedSatisfaction}
                <button 
                  onClick={() => setSelectedSatisfaction("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="gap-1">
                Search: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversation List */}
      <div className="space-y-4">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Conversation Header */}
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
                      onClick={() => setExpandedConversation(
                        expandedConversation === conversation.id ? null : conversation.id
                      )}
                    >
                      {expandedConversation === conversation.id ? "Collapse" : "Expand"}
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {conversation.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Conversation Content */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">User Query</div>
                    <div className="text-gray-900">{conversation.userQuery}</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-600 mb-1">AI Agent Response</div>
                    <div className="text-gray-900">{conversation.agentResponse}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleCopyResponse(conversation.agentResponse)}
                    >
                      <Copy className="h-3 w-3" />
                      Copy Response
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
                      className="gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={conversation.satisfaction === "negative" ? "destructive" : "outline"}
                      className="gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Feedback Form (Expanded) */}
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
                        <Button
                          variant="outline"
                          onClick={() => setExpandedConversation(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => handleSubmitFeedback(conversation.id)}>
                          Submit Feedback
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
                onClick={() => {
                  setSearchQuery("")
                  setSelectedAgent("all")
                  setSelectedSatisfaction("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-600">+42</span>
              <span className="text-muted-foreground">today</span>
            </div>
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
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                  </div>
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="font-medium">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Negative</span>
                </div>
                <span className="font-medium">8%</span>
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