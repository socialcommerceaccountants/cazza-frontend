import { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AIAgentDashboard from "@/components/ai-agents/AIAgentDashboard"

export const metadata: Metadata = {
  title: "Test AI Agents | Cazza.ai",
  description: "Test the AI agent training interface",
}

export default function TestAIAgentsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Test AI Agent Training Interface</h1>
          <p className="text-muted-foreground mt-2">
            This is a test page to verify all AI agent training components work correctly
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Test Instructions</h2>
          <ul className="list-disc pl-5 text-blue-700 space-y-1">
            <li>Verify all tabs load correctly (Agents, Training, Knowledge Base, etc.)</li>
            <li>Check that mock data displays properly in tables</li>
            <li>Test interactive elements (buttons, filters, search)</li>
            <li>Verify responsive design on different screen sizes</li>
            <li>Check that all components import correctly without errors</li>
          </ul>
        </div>
        
        <AIAgentDashboard />
        
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Test Results</h2>
          <p className="text-green-700">
            If you can see the AI Agent Training dashboard above with all tabs and components,
            the implementation is working correctly!
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}