import ShopifyIntegration from '@/components/integrations/ShopifyIntegration';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopify Integration - Cazza.ai',
  description: 'Connect and manage your Shopify e-commerce integration with order and product sync.',
};

export default function ShopifyIntegrationPage() {
  return (
    <div className="container mx-auto py-6">
      <ShopifyIntegration />
    </div>
  );
}