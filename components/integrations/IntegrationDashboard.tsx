"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Settings,
  AlertTriangle,
  Database,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Globe,
  Shield,
  Loader2,
  Zap,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string | null;
  syncStatus: 'success' | 'failed' | 'in_progress' | 'idle';
  syncProgress?: number;
  stats?: {
    totalSynced: number;
    lastSyncTime: string;
    errors: number;
  };
}

interface SyncLog {
  id: string;
  integrationId: string;
  status: 'success' | 'failed' | 'in_progress';
  timestamp: string;
  duration: number;
  recordsProcessed: number;
  errors: string[];
}

// Static metadata (icons, colours, URLs) — not fetched from server
const INTEGRATION_META: Record<string, {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  // Either an API path to fetch OAuth URL from, or a local config page to navigate to
  authUrl?: string;
  configPage?: string;
  syncUrl: string;
  disconnectUrl: string;
}> = {
  xero: {
    name: 'Xero Accounting',
    description: 'UK accounting integration with automatic transaction sync',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-blue-500',
    authUrl: '/integrations/xero/auth-url',
    syncUrl: '/integrations/xero/sync',
    disconnectUrl: '/integrations/xero/disconnect',
  },
  quickbooks: {
    name: 'QuickBooks Online',
    description: 'UK accounting with MTD compliance and VAT returns',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-green-600',
    configPage: '/integrations/quickbooks',
    syncUrl: '/integrations/quickbooks/sync',
    disconnectUrl: '/integrations/quickbooks/disconnect',
  },
  shopify: {
    name: 'Shopify',
    description: 'E-commerce integration with order and product sync',
    icon: <ShoppingCart className="h-5 w-5" />,
    color: 'bg-green-500',
    authUrl: '/integrations/shopify/auth-url',
    syncUrl: '/integrations/shopify/sync',
    disconnectUrl: '/integrations/shopify/disconnect',
  },
  woocommerce: {
    name: 'WooCommerce',
    description: 'WordPress e-commerce with UK/EU VAT support',
    icon: <ShoppingCart className="h-5 w-5" />,
    color: 'bg-orange-500',
    configPage: '/integrations/woocommerce',
    syncUrl: '/integrations/woocommerce/sync',
    disconnectUrl: '/integrations/woocommerce/disconnect',
  },
  'tiktok-shop': {
    name: 'TikTok Shop',
    description: 'Social commerce integration for TikTok Shop',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-black',
    authUrl: '/integrations/tiktok/auth-url',
    syncUrl: '/integrations/tiktok/sync',
    disconnectUrl: '/integrations/tiktok/disconnect',
  },
  stripe: {
    name: 'Stripe Billing',
    description: 'Payment processing and subscription management',
    icon: <CreditCard className="h-5 w-5" />,
    color: 'bg-purple-500',
    configPage: '/integrations/billing',
    syncUrl: '/integrations/stripe/sync',
    disconnectUrl: '/integrations/stripe/disconnect',
  },
  paddle: {
    name: 'Paddle',
    description: 'Merchant of record with global tax compliance',
    icon: <Globe className="h-5 w-5" />,
    color: 'bg-red-500',
    configPage: '/integrations/billing',
    syncUrl: '/integrations/paddle/sync',
    disconnectUrl: '/integrations/paddle/disconnect',
  },
  webhooks: {
    name: 'Webhooks',
    description: 'Zapier, Make.com, and custom app integrations',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-yellow-500',
    configPage: '/integrations/webhooks',
    syncUrl: '/integrations/webhooks/sync',
    disconnectUrl: '/integrations/webhooks/disconnect',
  },
};

const INTEGRATION_IDS = Object.keys(INTEGRATION_META);

export default function IntegrationDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, IntegrationStatus>>({});
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchIntegrationStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<IntegrationStatus[]>('/integrations/status');
      const map: Record<string, IntegrationStatus> = {};
      for (const item of data) map[item.id] = item;
      // Ensure all known integrations appear even if backend returns subset
      for (const id of INTEGRATION_IDS) {
        if (!map[id]) {
          map[id] = {
            id,
            name: INTEGRATION_META[id].name,
            description: INTEGRATION_META[id].description,
            status: 'disconnected',
            lastSync: null,
            syncStatus: 'idle',
          };
        }
      }
      setStatuses(map);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load integration status';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchSyncLogs = useCallback(async () => {
    try {
      const data = await apiClient.get<SyncLog[]>('/integrations/sync-history?limit=20');
      setSyncLogs(data);
    } catch {
      // Non-critical — don't surface a toast for log failures
    }
  }, []);

  useEffect(() => {
    fetchIntegrationStatus();
    fetchSyncLogs();
  }, [fetchIntegrationStatus, fetchSyncLogs]);

  const handleConnect = async (integrationId: string) => {
    const meta = INTEGRATION_META[integrationId];
    if (!meta) return;

    // Integrations with a dedicated config page navigate there directly
    if (meta.configPage) {
      router.push(meta.configPage);
      return;
    }

    // OAuth-based integrations: fetch auth URL from backend, then redirect
    try {
      const { url } = await apiClient.get<{ url: string }>(meta.authUrl!);
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to connect to ${meta.name}`;
      toast({ title: 'Connection Failed', description: message, variant: 'destructive' });
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    const meta = INTEGRATION_META[integrationId];
    if (!meta) return;
    try {
      await apiClient.post(meta.disconnectUrl);
      setStatuses((prev) => ({
        ...prev,
        [integrationId]: { ...prev[integrationId], status: 'disconnected', lastSync: null, syncStatus: 'idle' },
      }));
      toast({ title: 'Disconnected', description: `Successfully disconnected from ${meta.name}.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to disconnect from ${meta.name}`;
      toast({ title: 'Disconnect Failed', description: message, variant: 'destructive' });
    }
  };

  const handleSync = async (integrationId: string) => {
    const meta = INTEGRATION_META[integrationId];
    if (!meta) return;

    // Optimistically mark as in-progress
    setStatuses((prev) => ({
      ...prev,
      [integrationId]: { ...prev[integrationId], syncStatus: 'in_progress', syncProgress: 0 },
    }));

    try {
      await apiClient.post(meta.syncUrl);

      // Poll until complete
      const poll = setInterval(async () => {
        try {
          const updated = await apiClient.get<IntegrationStatus[]>(`/integrations/status?type=${integrationId}`);
          const item = updated[0];
          if (!item) { clearInterval(poll); return; }

          if (item.syncStatus === 'success' || item.syncStatus === 'failed') {
            clearInterval(poll);
            setStatuses((prev) => ({ ...prev, [integrationId]: { ...item, syncProgress: undefined } }));
            fetchSyncLogs();
            if (item.syncStatus === 'success') {
              toast({ title: 'Sync Complete', description: `${meta.name} synced successfully.` });
            } else {
              toast({ title: 'Sync Failed', description: `${meta.name} sync encountered errors.`, variant: 'destructive' });
            }
          } else {
            // Increment estimated progress
            setStatuses((prev) => ({
              ...prev,
              [integrationId]: {
                ...prev[integrationId],
                syncProgress: Math.min((prev[integrationId].syncProgress ?? 0) + 10, 90),
              },
            }));
          }
        } catch {
          clearInterval(poll);
          setStatuses((prev) => ({ ...prev, [integrationId]: { ...prev[integrationId], syncStatus: 'failed', syncProgress: undefined } }));
          toast({ title: 'Sync Failed', description: 'Lost connection during sync.', variant: 'destructive' });
        }
      }, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to sync ${meta.name}`;
      setStatuses((prev) => ({ ...prev, [integrationId]: { ...prev[integrationId], syncStatus: 'failed', syncProgress: undefined } }));
      toast({ title: 'Sync Failed', description: message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>;
      case 'disconnected': return <Badge variant="outline">Disconnected</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const getSyncBadge = (status: IntegrationStatus['syncStatus']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Synced</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'in_progress': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Syncing…</Badge>;
      case 'idle': return <Badge variant="outline">Idle</Badge>;
    }
  };

  const integrationList = INTEGRATION_IDS.map((id) => ({
    id,
    ...INTEGRATION_META[id],
    ...(statuses[id] ?? {
      status: 'disconnected' as const,
      lastSync: null,
      syncStatus: 'idle' as const,
    }),
  }));

  const connectedCount = integrationList.filter((i) => i.status === 'connected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect and manage your business integrations</p>
        </div>
        <Button onClick={fetchIntegrationStatus} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}/{integrationList.length}</div>
            <p className="text-xs text-muted-foreground">
              {connectedCount === integrationList.length
                ? 'All integrations connected'
                : `${integrationList.length - connectedCount} disconnected`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24h Syncs</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {syncLogs.filter((l) => new Date(l.timestamp) > new Date(Date.now() - 86400000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {syncLogs.filter((l) => l.status === 'success').length} successful
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Globe className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrationList.reduce((s, i) => s + (i.stats?.totalSynced ?? 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrationList.reduce((s, i) => s + (i.stats?.errors ?? 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {integrationList.map((integration) => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${integration.color}`}>
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">Last sync:</span>
                          <span>
                            {integration.lastSync
                              ? new Date(integration.lastSync).toLocaleString()
                              : 'Never'}
                          </span>
                        </div>
                        {integration.stats && (
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">Records synced:</span>
                            <span>{integration.stats.totalSynced.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="mb-2">{getSyncBadge(integration.syncStatus)}</div>
                        {integration.syncStatus === 'in_progress' && (
                          <Progress value={integration.syncProgress ?? 0} className="w-24" />
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex space-x-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSync(integration.id)}
                            disabled={integration.syncStatus === 'in_progress'}
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${integration.syncStatus === 'in_progress' ? 'animate-spin' : ''}`} />
                            Sync Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleConnect(integration.id)} className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
              <CardDescription>Recent synchronisation activity across all integrations</CardDescription>
            </CardHeader>
            <CardContent>
              {syncLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No sync logs available</div>
              ) : (
                <div className="space-y-4">
                  {syncLogs.map((log) => {
                    const meta = INTEGRATION_META[log.integrationId];
                    return (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg text-white ${meta?.color ?? 'bg-gray-400'}`}>
                            {meta?.icon ?? <Database className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">{meta?.name ?? 'Unknown Integration'}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()} • {log.duration}s • {log.recordsProcessed} records
                            </div>
                            {log.errors.length > 0 && (
                              <div className="text-sm text-red-600 mt-1">{log.errors.join(', ')}</div>
                            )}
                          </div>
                        </div>
                        <div>
                          {log.status === 'success' ? (
                            <Badge className="bg-green-100 text-green-800">Success</Badge>
                          ) : log.status === 'failed' ? (
                            <Badge className="bg-red-100 text-red-800">Failed</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure global integration settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Sync</h3>
                    <p className="text-sm text-muted-foreground">Automatically sync data every hour</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Error Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive alerts when syncs fail</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Retention</h3>
                    <p className="text-sm text-muted-foreground">Keep sync logs for 90 days</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  All integration credentials are encrypted and stored securely. We never store your
                  raw API keys or passwords.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
