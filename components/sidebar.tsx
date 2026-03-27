"use client";

import { useState } from "react";
import {
  Home,
  BarChart3,
  MessageSquare,
  Settings,
  CreditCard,
  FileText,
  Users,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bot,
  Zap,
  Database,
  Globe,
  Mail,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfile } from "@/components/auth/user-profile";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: MessageSquare, label: "Chat", badge: "New" },
  { icon: FileText, label: "Documents" },
  { icon: CreditCard, label: "Finance" },
  { icon: Users, label: "Team" },
  { icon: Settings, label: "Settings" },
];

const connectedPlatforms = [
  { icon: Globe, label: "Web", color: "bg-blue-500" },
  { icon: Mail, label: "Email", color: "bg-red-500" },
  { icon: Calendar, label: "Calendar", color: "bg-green-500" },
  { icon: Database, label: "Xero", color: "bg-purple-500", connected: true },
  { icon: Zap, label: "Stripe", color: "bg-indigo-500" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-lg">Cazza.ai</h1>
              <p className="text-xs text-muted-foreground">AI Business Assistant</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </li>
          ))}
        </ul>

        <Separator className="my-6" />

        {/* Connected Platforms */}
        {!collapsed && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Connected Platforms
            </h3>
            <div className="space-y-2">
              {connectedPlatforms.map((platform) => (
                <div
                  key={platform.label}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${platform.color}`}>
                      <platform.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm">{platform.label}</span>
                  </div>
                  {platform.connected ? (
                    <Badge variant="default" className="text-xs">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Connect
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!collapsed && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">AI Usage</span>
              <span className="text-xs text-muted-foreground">85%</span>
            </div>
            <div className="h-1 w-full bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary w-4/5" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              1,247 tasks completed this month
            </p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t">
        <UserProfile />
        <div className={cn("flex items-center p-4", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}