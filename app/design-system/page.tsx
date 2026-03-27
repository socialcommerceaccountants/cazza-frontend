import { DesignSystemShowcase } from "@/components/design-system/DesignSystemShowcase";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DesignSystemPage() {
  return (
    <DashboardLayout
      title="Design System"
      description="Component library and design guidelines for Cazza.ai"
      showBreadcrumb={true}
      showQuickActions={false}
    >
      <DesignSystemShowcase />
    </DashboardLayout>
  );
}