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
    const url = integrationType 
      ? `/integrations/status?integration_type=${encodeURIComponent(integrationType)}`
      : '/integrations/status';
    return await apiClient.get<IntegrationStatusResponse>(url);
  }

  /**
   * Sync integration data
   */
  async sync(integrationType: string, fullSync: boolean = false): Promise<SyncResponse> {
    return await apiClient.post<SyncResponse>(`/integrations/${integrationType}/sync`, {
      full_sync: fullSync,
    });
  }

  /**
   * Get sync history
   */
  async getSyncHistory(
    integrationType?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ success: boolean; data: SyncHistory }> {
    let url = `/integrations/sync-history?limit=${limit}&offset=${offset}`;
    if (integrationType) {
      url += `&integration_type=${encodeURIComponent(integrationType)}`;
    }
    
    return await apiClient.get<{ success: boolean; data: SyncHistory }>(url);
  }

  /**
   * Retry a failed sync
   */
  async retrySync(syncId: number): Promise<SyncResponse> {
    return await apiClient.post<any>(`/integrations/sync/${syncId}/retry`);
  }

  /**
   * Xero Integration
   */

  /**
   * Get Xero authorization URL
   */
  async getXeroAuthUrl(): Promise<XeroAuthResponse> {
    return await apiClient.get<any>('/integrations/xero/auth-url');
  }

  /**
   * Get Xero tenants
   */
  async getXeroTenants(): Promise<XeroTenantsResponse> {
    return await apiClient.get<any>('/integrations/xero/tenants');
  }

  /**
   * Disconnect Xero tenant
   */
  async disconnectXeroTenant(tenantId: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.post<any>(`/integrations/xero/tenants/${tenantId}/disconnect`);
  }

  /**
   * Shopify Integration
   */

  /**
   * Get Shopify authorization URL
   */
  async getShopifyAuthUrl(): Promise<XeroAuthResponse> {
    return await apiClient.get<any>('/integrations/shopify/auth-url');
  }

  /**
   * TikTok Shop Integration
   */

  /**
   * Get TikTok Shop authorization URL
   */
  async getTikTokAuthUrl(): Promise<XeroAuthResponse> {
    return await apiClient.get<any>('/integrations/tiktok/auth-url');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; integrations: Record<string, string>; timestamp: string }> {
    return await apiClient.get<any>('/integrations/health');
  }
}

export const integrationAPI = new IntegrationAPI();