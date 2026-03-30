"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, FileText, Database, Globe, Edit, Trash2, Filter, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import context7API, { KnowledgeItem } from "@/lib/context7-api"
import { useAuthStore } from "@/lib/store/auth-store"

type KnowledgeType = KnowledgeItem["type"]

export default function KnowledgeBaseManager() {
  const { token } = useAuthStore()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    type: "document" as KnowledgeType,
    tags: [] as string[],
    agent: "",
  })

  const loadKnowledge = useCallback(async () => {
    try {
      setIsLoading(true)
      if (token) context7API.setToken(token)
      const items = await context7API.listKnowledgeItems()
      setKnowledgeItems(items)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load knowledge base"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [token, toast])

  useEffect(() => {
    loadKnowledge()
  }, [loadKnowledge])

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesType
  })

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !newItem.content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title and content.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      if (token) context7API.setToken(token)
      const created = await context7API.addKnowledgeItem({
        title: newItem.title.trim(),
        content: newItem.content.trim(),
        type: newItem.type,
        tags: newItem.tags,
        agent_id: newItem.agent || undefined,
      })
      setKnowledgeItems((prev) => [created, ...prev])
      setNewItem({ title: "", content: "", type: "document", tags: [], agent: "" })
      setIsAddingItem(false)
      toast({ title: "Knowledge item added", description: `"${created.title}" has been added.` })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add knowledge item"
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeIcon = (type: KnowledgeType) => {
    switch (type) {
      case "document": return <FileText className="h-4 w-4" />
      case "database": return <Database className="h-4 w-4" />
      case "web": return <Globe className="h-4 w-4" />
      case "manual": return <FileText className="h-4 w-4" />
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
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Knowledge Type</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSelectedType("all")}>All Types</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedType("document")}>
                    <FileText className="mr-2 h-4 w-4" /> Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("database")}>
                    <Database className="mr-2 h-4 w-4" /> Databases
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("web")}>
                    <Globe className="mr-2 h-4 w-4" /> Web Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("manual")}>
                    <FileText className="mr-2 h-4 w-4" /> Manual Entries
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
                <button onClick={() => setSelectedType("all")} className="ml-1 hover:text-destructive" aria-label="Clear filter">
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
            <CardDescription>Add new information to your AI agents&apos; knowledge base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kb-title">Title *</Label>
                <Input
                  id="kb-title"
                  placeholder="Enter knowledge title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-type">Knowledge Type *</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: KnowledgeType) =>
                    setNewItem({ ...newItem, type: value })
                  }
                >
                  <SelectTrigger id="kb-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="web">Web Content</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kb-content">Content *</Label>
              <Textarea
                id="kb-content"
                placeholder="Enter knowledge content..."
                rows={6}
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kb-tags">Tags (comma-separated)</Label>
              <Input
                id="kb-tags"
                placeholder="sales, marketing, finance"
                value={newItem.tags.join(", ")}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kb-agent">Associated Agent (optional)</Label>
              <Input
                id="kb-agent"
                placeholder="e.g. cazza_financial_advisor"
                value={newItem.agent}
                onChange={(e) => setNewItem({ ...newItem, agent: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingItem(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleAddItem} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add to Knowledge Base"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>All knowledge items available to your AI agents</CardDescription>
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
                        {item.content.substring(0, 100)}
                        {item.content.length > 100 ? "…" : ""}
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
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
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
                    <TableCell>{item.agent || "—"}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">No Knowledge Items Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Try a different search term"
                  : "Add your first knowledge item to get started"}
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
            <p className="text-xs text-muted-foreground">Across all agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(["document", "database", "web", "manual"] as KnowledgeType[]).map((type) => {
                const count = knowledgeItems.filter((item) => item.type === type).length
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
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {knowledgeItems.filter((i) => i.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {knowledgeItems.filter((i) => i.status === "pending").length} pending review
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
