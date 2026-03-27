"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Globe, 
  Building,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
  status: "active" | "inactive" | "pending";
  subscription: "free" | "basic" | "pro" | "enterprise";
  revenue: number;
  lastActivity: string;
  joinDate: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@techcorp.com",
    company: "TechCorp Ltd",
    phone: "+44 7911 123456",
    website: "techcorp.com",
    status: "active",
    subscription: "pro",
    revenue: 42500,
    lastActivity: "2 hours ago",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@creative.co",
    company: "Creative Solutions",
    phone: "+44 7922 234567",
    website: "creative.co",
    status: "active",
    subscription: "enterprise",
    revenue: 89200,
    lastActivity: "1 day ago",
    joinDate: "2023-11-20",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@startup.io",
    company: "Startup Innovations",
    phone: "+44 7933 345678",
    website: "startup.io",
    status: "pending",
    subscription: "basic",
    revenue: 12500,
    lastActivity: "3 days ago",
    joinDate: "2024-02-10",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma@retailgroup.com",
    company: "Retail Group",
    phone: "+44 7944 456789",
    website: "retailgroup.com",
    status: "active",
    subscription: "pro",
    revenue: 56700,
    lastActivity: "5 hours ago",
    joinDate: "2023-09-05",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james@consulting.co",
    company: "Wilson Consulting",
    phone: "+44 7955 567890",
    website: "wilsonconsulting.co",
    status: "inactive",
    subscription: "free",
    revenue: 0,
    lastActivity: "2 weeks ago",
    joinDate: "2024-01-30",
  },
  {
    id: "6",
    name: "Lisa Brown",
    email: "lisa@digitalagency.com",
    company: "Digital Agency",
    phone: "+44 7966 678901",
    website: "digitalagency.com",
    status: "active",
    subscription: "enterprise",
    revenue: 112300,
    lastActivity: "1 hour ago",
    joinDate: "2023-08-12",
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert@manufacturing.co",
    company: "Precision Manufacturing",
    phone: "+44 7977 789012",
    website: "precisionmfg.co",
    status: "pending",
    subscription: "basic",
    revenue: 8500,
    lastActivity: "4 days ago",
    joinDate: "2024-02-25",
  },
  {
    id: "8",
    name: "Olivia Martinez",
    email: "olivia@healthtech.com",
    company: "HealthTech Solutions",
    phone: "+44 7988 890123",
    website: "healthtech.com",
    status: "active",
    subscription: "pro",
    revenue: 68900,
    lastActivity: "Yesterday",
    joinDate: "2023-10-18",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
};

const subscriptionColors = {
  free: "bg-gray-100 text-gray-800",
  basic: "bg-blue-100 text-blue-800",
  pro: "bg-purple-100 text-purple-800",
  enterprise: "bg-emerald-100 text-emerald-800",
};

export function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesSubscription = subscriptionFilter === "all" || client.subscription === subscriptionFilter;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const stats = {
    total: mockClients.length,
    active: mockClients.filter(c => c.status === "active").length,
    pending: mockClients.filter(c => c.status === "pending").length,
    revenue: mockClients.reduce((sum, client) => sum + client.revenue, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your clients, subscriptions, and billing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name, email, or company..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSubscriptionFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Clients ({filteredClients.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                Manage all your clients in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.company}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{client.website}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[client.status]}>
                            {client.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {client.status === "inactive" && <XCircle className="h-3 w-3 mr-1" />}
                            {client.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={subscriptionColors[client.subscription]}>
                            {client.subscription.charAt(0).toUpperCase() + client.subscription.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(client.revenue)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{client.lastActivity}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No clients found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Client</CardTitle>
            <CardDescription>Quickly onboard a new client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Client Profile
            </Button>
            <p className="text-sm text-muted-foreground">
              Or invite via email link
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Actions</CardTitle>
            <CardDescription>Manage multiple clients at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Bulk Email
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Generate Invoices
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-ups
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest client interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">Updated subscription</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SW</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Sarah Williams</p>
                  <p className="text-xs text-muted-foreground">New support ticket</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1d ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>LB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Lisa Brown</p>
                  <p className="text-xs text-muted-foreground">Payment received</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">3d ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}