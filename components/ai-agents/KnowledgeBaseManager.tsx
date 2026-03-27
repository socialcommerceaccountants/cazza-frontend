"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, FileText, Database, Globe, Edit, Trash2, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  type: "document" | "database" | "web" | "manual"
  tags: string[]
  agent: string
  lastUpdated: string
  size: string
  status: "active" | "pending" | "archived"
}

export default function KnowledgeBaseManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    type: "document" as const,
    tags: [] as string[],
    agent: "",
  })

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: "1",
      title: "Sales Conversation Patterns",
      content: "Common sales conversation patterns and responses...",
      type: "document",
      tags: ["sales", "conversation", "patterns"],
      agent: "Cazza Sales Assistant",
      lastUpdated: "2024-03-27",
      size: "2.4 MB",
      status: "active",
    },
    {
      id: "2",
      title: "Financial Regulations Database",
      content: "Updated financial regulations and compliance guidelines...",
      type: "database",
      tags: ["finance", "regulations", "compliance"],
      agent: "Cazza Financial Advisor",
      lastUpdated: "2024-03-26",
      size: "15.7 MB",
      status: "active",
    },
    {
      id: "3",
      title: "Marketing Campaign Examples",
      content: "Successful marketing campaign examples and analysis...",
      type: "web",
      tags: ["marketing", "campaigns", "examples"],
      agent: "Cazza Marketing Analyst",
      lastUpdated: "2024-03-25",
      size: "5.2 MB",
      status: "active",
    },
    {
      id: "4",
      title: "Customer Support Guidelines",
      content: "Internal customer support guidelines and procedures...",
      type: "manual",
      tags: ["support", "guidelines", "procedures"],
      agent: "All Agents",
      lastUpdated: "2024-03-24",
      size: "1.8 MB",
      status: "active",
    },
    {
      id: "5",
      title: "Industry News Feed",
      content: "Latest industry news and trends for context...",
      type: "web",
      tags: ["news", "trends", "industry"],
      agent: "All Agents",
      lastUpdated: "2024-03-23",
      size: "3.5 MB",
      status: "pending",
    },
  ]

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesType
  })

  const handleAddItem = () => {
    if (!newItem.title || !newItem.content) {
      alert("Please fill in all required fields")
      return
    }

    // In a real implementation, this would call an API
    console.log("Adding new knowledge item:", newItem)
    
    // Reset form
    setNewItem({
      title: "",
      content: "",
      type: "document",
      tags: [],
      agent: "",
    })
    setIsAddingItem(false)
    
    alert("Knowledge item added successfully!")
  }

  const getTypeIcon = (type: KnowledgeItem["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "web":
        return <Globe className="h-4 w-4" />
      case "manual":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: KnowledgeItem["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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
                placeholder="Search knowledge base..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Knowledge Type</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSelectedType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedType("document")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("database")}>
                    <Database className="mr-2 h-4 w-4" />
                    Databases
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("web")}>
                    <Globe className="mr-2 h-4 w-4" />
                    Web Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("manual")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Manual Entries
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setIsAddingItem(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Knowledge
              </Button>
            </div>
          </div>
          
          {selectedType !== "all" && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                <button 
                  onClick={() => setSelectedType("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
              <span className="text-sm text-muted-foreground">
                Showing {filteredItems.length} items
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Knowledge Form */}
      {isAddingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Knowledge</CardTitle>
            <CardDescription>
              Add new information to your AI agents' knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter knowledge title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Knowledge Type *</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                >
                  <option value="document">Document</option>
                  <option value="database">Database</option>
                  <option value="web">Web Content</option>
                  <option value="manual">Manual Entry</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Enter knowledge content..."
                rows={6}
                value={newItem.content}
                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="sales, marketing, finance"
                value={newItem.tags.join(", ")}
                onChange={(e) => setNewItem({
                  ...newItem, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agent">Associated Agent</Label>
              <Input
                id="agent"
                placeholder="Cazza Sales Assistant (optional)"
                value={newItem.agent}
                onChange={(e) => setNewItem({...newItem, agent: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add to Knowledge Base
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>
            All knowledge items available to your AI agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {item.content.substring(0, 100)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.agent}</TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">No Knowledge Items Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery ? "Try a different search term" : "Add your first knowledge item to get started"}
              </p>
              <Button onClick={() => setIsAddingItem(true)} className="mt-4">
                Add Knowledge Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Knowledge Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["document", "database", "web", "manual"].map((type) => {
                const count = knowledgeItems.filter(item => item.type === type).length
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.6 MB</div>
            <p className="text-xs text-muted-foreground">
              Total knowledge base size
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}