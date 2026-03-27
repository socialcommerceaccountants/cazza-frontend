import TikTokShopIntegration from '@/components/integrations/TikTokShopIntegration';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TikTok Shop Integration - Cazza.ai',
  description: 'Connect and manage your TikTok Shop social commerce integration.',
};

export default function TikTokShopIntegrationPage() {
  return (
    <div className="container mx-auto py-6">
      <TikTokShopIntegration />
    </div>
  );
}