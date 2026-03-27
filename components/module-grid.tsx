import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  CreditCard,
  Users,
  Calendar,
  BarChart3,
  Zap,
  Database,
  Globe,
  Mail,
  Bell,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    title: "AI Chat Assistant",
    description: "Ask questions about your business data and get instant insights",
    icon: MessageSquare,
    color: "bg-blue-500",
    status: "active",
    tasks: 24,
  },
  {
    title: "Document Processing",
    description: "Upload and analyze contracts, invoices, and reports",
    icon: FileText,
    color: "bg-green-500",
    status: "active",
    tasks: 18,
  },
  {
    title: "Financial Dashboard",
    description: "Real-time financial metrics and cash flow analysis",
    icon: CreditCard,
    color: "bg-purple-500",
    status: "connected",
    platform: "Xero",
    tasks: 42,
  },
  {
    title: "Team Collaboration",
    description: "Manage tasks, projects, and team communication",
    icon: Users,
    color: "bg-orange-500",
    status: "inactive",
    tasks: 8,
  },
  {
    title: "Calendar Sync",
    description: "Sync meetings and schedule optimization",
    icon: Calendar,
    color: "bg-red-500",
    status: "pending",
    tasks: 0,
  },
  {
    title: "Analytics Hub",
    description: "Business intelligence and performance tracking",
    icon: BarChart3,
    color: "bg-indigo-500",
    status: "active",
    tasks: 36,
  },
];

const platformConnections = [
  { icon: Database, label: "Xero", connected: true },
  { icon: Zap, label: "Stripe", connected: false },
  { icon: Globe, label: "Web", connected: true },
  { icon: Mail, label: "Email", connected: true },
  { icon: Bell, label: "Slack", connected: false },
];

export default function ModuleGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Modules</h2>
          <p className="text-muted-foreground">Manage your connected business tools</p>
        </div>
        <Button variant="outline">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${module.color}`}>
                    <module.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {module.platform && `Connected to ${module.platform}`}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    module.status === "active"
                      ? "default"
                      : module.status === "connected"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {module.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {module.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {module.tasks} active {module.tasks === 1 ? "task" : "tasks"}
                </span>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Platform Connections</CardTitle>
          <CardDescription>
            Connect your business tools to unlock AI automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {platformConnections.map((platform) => (
              <div
                key={platform.label}
                className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-3 ${
                  platform.connected ? "bg-primary/10" : "bg-muted"
                }`}>
                  <platform.icon className={`h-6 w-6 ${
                    platform.connected ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <span className="text-sm font-medium mb-2">{platform.label}</span>
                <Badge
                  variant={platform.connected ? "default" : "outline"}
                  className="text-xs"
                >
                  {platform.connected ? "Connected" : "Connect"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}