import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle, AlertCircle, FileText, CreditCard, Users, Calendar } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "invoice",
    title: "Invoice #INV-2024-001 processed",
    description: "Client: Acme Corp • Amount: £2,500",
    time: "10 minutes ago",
    icon: FileText,
    color: "text-green-500",
    status: "completed",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment received from TechStart Ltd",
    description: "Amount: £1,850 • Method: Bank Transfer",
    time: "1 hour ago",
    icon: CreditCard,
    color: "text-blue-500",
    status: "completed",
  },
  {
    id: 3,
    type: "team",
    title: "New team member added",
    description: "Sarah Johnson joined as Project Manager",
    time: "2 hours ago",
    icon: Users,
    color: "text-purple-500",
    status: "pending",
  },
  {
    id: 4,
    type: "meeting",
    title: "Upcoming board meeting",
    description: "Tomorrow at 2:00 PM • Duration: 2 hours",
    time: "3 hours ago",
    icon: Calendar,
    color: "text-orange-500",
    status: "scheduled",
  },
  {
    id: 5,
    type: "alert",
    title: "Low inventory alert",
    description: "Product XYZ stock below minimum threshold",
    time: "5 hours ago",
    icon: AlertCircle,
    color: "text-red-500",
    status: "attention",
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your business</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.color.replace('text-', 'bg-')}/10`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {activity.status === "attention" && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  <Badge
                    variant={
                      activity.status === "completed"
                        ? "default"
                        : activity.status === "attention"
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}