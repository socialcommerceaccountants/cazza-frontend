import { ClientManagement } from "@/components/clients/ClientManagement";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function ClientsPage() {
  return (
    <DashboardLayout
      title="Client Management"
      description="Manage your clients, subscriptions, and billing"
      showBreadcrumb={true}
      showQuickActions={true}
    >
      <ClientManagement />
    </DashboardLayout>
  );
}