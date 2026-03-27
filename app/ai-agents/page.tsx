import { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AIAgentDashboard from "@/components/ai-agents/AIAgentDashboard"

export const metadata: Metadata = {
  title: "AI Agent Training | Cazza.ai",
  description: "Train and manage AI agents for your business",
}

export default function AIAgentsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Training</h1>
          <p className="text-muted-foreground mt-2">
            Train, manage, and deploy AI agents powered by Context7
          </p>
        </div>
        
        <AIAgentDashboard />
      </div>
    </DashboardLayout>
  )
}