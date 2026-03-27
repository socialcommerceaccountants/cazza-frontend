/**
 * Integration API Client
 * Handles integration management and data synchronization.
 */
import { apiClient } from './client';

export interface IntegrationStatus {
  type: string;
  name: string;
  is_connected: boolean;
  connected_at: string | null;
  last_sync: string | null;
  details: Record<string, any>;
}

export interface SyncLog {
  id: number;
  integration_type: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration: number | null;
  records_processed: number;
  errors: string[];
}

export interface SyncHistory {
  total: number;
  offset: number;
  limit: number;
  syncs: SyncLog[];
}

export interface IntegrationStatusResponse {
  success: boolean;
  data: {
    integrations: IntegrationStatus[];
    sync_logs: SyncLog[];
    summary: {
      connected: number;
      total: number;
      last_sync: string | null;
    };
  };
}

export interface SyncResponse {
  success: boolean;
  sync_id: number;
  records_processed: number;
  duration: number;
  message: string;
  error?: string;
}

export interface XeroAuthResponse {
  success: boolean;
  auth_url: string;
}

export interface XeroTenant {
  tenant_id: string;
  tenant_name: string;
  connected_at: string;
  expires_at: string;
  last_refreshed: string;
}

export interface XeroTenantsResponse {
  success: boolean;
  tenants: XeroTenant[];
}

class IntegrationAPI {
  /**
   * Get integration status
   */
  async getStatus(integrationType?: string): Promise<IntegrationStatusResponse> {
    const params = integrationType ? { integration_type: integrationType } : undefined;
    const response = await apiClient.get('/integrations/status', { params });
    return response.data;
  }

  /**
   * Sync integration data
   */
  async sync(integrationType: string, fullSync: boolean = false): Promise<SyncResponse> {
    const response = await apiClient.post(`/integrations/${integrationType}/sync`, {
      full_sync: fullSync,
    });
    return response.data;
  }

  /**
   * Get sync history
   */
  async getSyncHistory(
    integrationType?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ success: boolean; data: SyncHistory }> {
    const params: any = { limit, offset };
    if (integrationType) {
      params.integration_type = integrationType;
    }
    
    const response = await apiClient.get('/integrations/sync-history', { params });
    return response.data;
  }

  /**
   * Retry a failed sync
   */
  async retrySync(syncId: number): Promise<SyncResponse> {
    const response = await apiClient.post(`/integrations/sync/${syncId}/retry`);
    return response.data;
  }

  /**
   * Xero Integration
   */

  /**
   * Get Xero authorization URL
   */
  async getXeroAuthUrl(): Promise<XeroAuthResponse> {
    const response = await apiClient.get('/integrations/xero/auth-url');
    return response.data;
  }

  /**
   * Get Xero tenants
   */
  async getXeroTenants(): Promise<XeroTenantsResponse> {
    const response = await apiClient.get('/integrations/xero/tenants');
    return response.data;
  }

  /**
   * Disconnect Xero tenant
   */
  async disconnectXeroTenant(tenantId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/integrations/xero/tenants/${tenantId}/disconnect`);
    return response.data;
  }

  /**
   * Shopify Integration
   */

  /**
   * Get Shopify authorization URL
   */
  async getShopifyAuthUrl(): Promise<XeroAuthResponse> {
    const response = await apiClient.get('/integrations/shopify/auth-url');
    return response.data;
  }

  /**
   * TikTok Shop Integration
   */

  /**
   * Get TikTok Shop authorization URL
   */
  async getTikTokAuthUrl(): Promise<XeroAuthResponse> {
    const response = await apiClient.get('/integrations/tiktok/auth-url');
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; integrations: Record<string, string>; timestamp: string }> {
    const response = await apiClient.get('/integrations/health');
    return response.data;
  }
}

export const integrationAPI = new IntegrationAPI();