import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      description="Manage your account, preferences, and integrations"
      showBreadcrumb={true}
      showQuickActions={false}
    >
      <SettingsPanel />
    </DashboardLayout>
  );
}