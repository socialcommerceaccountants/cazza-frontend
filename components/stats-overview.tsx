import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, CheckCircle } from "lucide-react";

const stats = [
  {
    title: "Monthly Revenue",
    value: "£42,850",
    change: "+12.5%",
    trending: "up",
    icon: DollarSign,
    color: "text-green-500",
    progress: 75,
  },
  {
    title: "Active Users",
    value: "1,247",
    change: "+8.2%",
    trending: "up",
    icon: Users,
    color: "text-blue-500",
    progress: 60,
  },
  {
    title: "Task Completion",
    value: "89%",
    change: "+3.1%",
    trending: "up",
    icon: CheckCircle,
    color: "text-purple-500",
    progress: 89,
  },
  {
    title: "Avg. Response Time",
    value: "2.4s",
    change: "-0.8s",
    trending: "down",
    icon: Clock,
    color: "text-orange-500",
    progress: 85,
  },
];

export default function StatsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Key metrics for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color.replace('text-', 'bg-')}/10`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trending === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={stat.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 100%</span>
                  <span>{stat.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}