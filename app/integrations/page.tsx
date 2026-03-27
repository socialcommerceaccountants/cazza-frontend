import IntegrationDashboard from '@/components/integrations/IntegrationDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations - Cazza.ai',
  description: 'Manage your business integrations with Xero, Shopify, TikTok Shop, and more.',
};

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-6">
      <IntegrationDashboard />
    </div>
  );
}