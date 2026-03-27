import XeroOAuth from '@/components/integrations/XeroOAuth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xero Integration - Cazza.ai',
  description: 'Connect and manage your Xero accounting integration with UK compliance.',
};

export default function XeroIntegrationPage() {
  return (
    <div className="container mx-auto py-6">
      <XeroOAuth />
    </div>
  );
}