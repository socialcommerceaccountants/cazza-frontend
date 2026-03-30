import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Upload, 
  Download, 
  MessageSquare, 
  Calendar, 
  FileText,
  Zap,
  Users
} , Zap from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  className?: string;
}

const actions = [
  {
    label: "New Task",
    icon: <Plus className="h-4 w-4" />,
    description: "Create a new task",
    variant: "default" as const,
  },
  {
    label: "Send Message",
    icon: <MessageSquare className="h-4 w-4" />,
    description: "Message clients",
    variant: "outline" as const,
  },
  {
    label: "Schedule",
    icon: <Calendar className="h-4 w-4" />,
    description: "Add to calendar",
    variant: "outline" as const,
  },
  {
    label: "Generate Report",
    icon: <FileText className="h-4 w-4" />,
    description: "Create report",
    variant: "outline" as const,
  },
  {
    label: "AI Assistant",
    icon: <Zap className="h-4 w-4" />,
    description: "Ask AI for help",
    variant: "outline" as const,
  },
  {
    label: "Invite Team",
    icon: <Users className="h-4 w-4" />,
    description: "Add team members",
    variant: "outline" as const,
  },
];

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Frequently used actions to save time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            >
              <div className="h-8 w-8 flex items-center justify-center">
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}