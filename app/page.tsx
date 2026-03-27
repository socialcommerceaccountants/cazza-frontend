import DashboardHeader from "@/components/dashboard-header";
import ModuleGrid from "@/components/module-grid";
import ChatbotInterface from "@/components/chatbot-interface";
import StatsOverview from "@/components/stats-overview";
import RecentActivity from "@/components/recent-activity";

export default function Home() {
  return (
    <div className="p-8 space-y-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ModuleGrid />
          <StatsOverview />
        </div>
        <div className="space-y-8">
          <ChatbotInterface />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}