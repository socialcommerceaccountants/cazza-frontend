"use client";

import React, { useState, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string | null;
  syncStatus: 'success' | 'failed' | 'in_progress' | 'idle';
  icon: React.ReactNode;
  color: string;
  configUrl: string;
  disconnectUrl: string;
  syncUrl: string;
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

export default function IntegrationDashboard() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      id: 'xero',
      name: 'Xero Accounting',
      description: 'UK accounting integration with automatic transaction sync',
      status: 'disconnected',
      lastSync: null,
      syncStatus: 'idle',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-blue-500',
      configUrl: '/api/integrations/xero/auth',
      disconnectUrl: '/api/integrations/xero/disconnect',
      syncUrl: '/api/integrations/xero/sync',
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce integration with order and product sync',
      status: 'disconnected',
      lastSync: null,
      syncStatus: 'idle',
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'bg-green-500',
      configUrl: '/api/integrations/shopify/auth',
      disconnectUrl: '/api/integrations/shopify/disconnect',
      syncUrl: '/api/integrations/shopify/sync',
    },
    {
      id: 'tiktok-shop',
      name: 'TikTok Shop',
      description: 'Social commerce integration for TikTok Shop',
      status: 'disconnected',
      lastSync: null,
      syncStatus: 'idle',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-black',
      configUrl: '/api/integrations/tiktok/auth',
      disconnectUrl: '/api/integrations/tiktok/disconnect',
      syncUrl: '/api/integrations/tiktok/sync',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      status: 'disconnected',
      lastSync: null,
      syncStatus: 'idle',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-purple-500',
      configUrl: '/api/integrations/stripe/auth',
      disconnectUrl: '/api/integrations/stripe/disconnect',
      syncUrl: '/api/integrations/stripe/sync',
    },
  ]);

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrationStatus();
    fetchSyncLogs();
  }, []);

  const fetchIntegrationStatus = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/integrations/status');
      // setIntegrations(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setIntegrations(prev => prev.map(integration => ({
          ...integration,
          status: Math.random() > 0.5 ? 'connected' : 'disconnected',
          lastSync: Math.random() > 0.5 ? new Date().toISOString() : null,
          syncStatus: Math.random() > 0.7 ? 'success' : 'idle',
          stats: Math.random() > 0.5 ? {
            totalSynced: Math.floor(Math.random() * 1000),
            lastSyncTime: new Date().toISOString(),
            errors: Math.floor(Math.random() * 10)
          } : undefined
        })));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch integration status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load integration status',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const fetchSyncLogs = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/integrations/sync-logs');
      // setSyncLogs(response.data);
      
      // Mock data for now
      setSyncLogs([
        {
          id: '1',
          integrationId: 'xero',
          status: 'success',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          duration: 45,
          recordsProcessed: 125,
          errors: [],
        },
        {
          id: '2',
          integrationId: 'shopify',
          status: 'failed',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          duration: 120,
          recordsProcessed: 89,
          errors: ['API rate limit exceeded'],
        },
        {
          id: '3',
          integrationId: 'tiktok-shop',
          status: 'success',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          duration: 30,
          recordsProcessed: 56,
          errors: [],
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch sync logs:', error);
    }
  };

  const handleConnect = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    try {
      // TODO: Implement actual OAuth flow
      // window.location.href = integration.configUrl;
      
      toast({
        title: 'Redirecting to OAuth',
        description: `Connecting to ${integration.name}...`,
      });

      // Mock connection
      setTimeout(() => {
        setIntegrations(prev => prev.map(i => 
          i.id === integrationId 
            ? { ...i, status: 'connected', lastSync: new Date().toISOString() }
            : i
        ));
        toast({
          title: 'Connected',
          description: `Successfully connected to ${integration.name}`,
        });
      }, 1500);
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect to ${integration.name}`,
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    try {
      // TODO: Implement actual disconnect
      // await apiClient.post(integration.disconnectUrl);
      
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, status: 'disconnected', lastSync: null }
          : i
      ));
      
      toast({
        title: 'Disconnected',
        description: `Successfully disconnected from ${integration.name}`,
      });
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: `Failed to disconnect from ${integration.name}`,
        variant: 'destructive',
      });
    }
  };

  const handleSync = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    try {
      // Update UI immediately
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, syncStatus: 'in_progress' }
          : i
      ));

      // TODO: Implement actual sync
      // await apiClient.post(integration.syncUrl);
      
      // Mock sync completion
      setTimeout(() => {
        setIntegrations(prev => prev.map(i => 
          i.id === integrationId 
            ? { 
                ...i, 
                syncStatus: 'success', 
                lastSync: new Date().toISOString(),
                stats: {
                  totalSynced: (i.stats?.totalSynced || 0) + Math.floor(Math.random() * 100),
                  lastSyncTime: new Date().toISOString(),
                  errors: Math.floor(Math.random() * 3)
                }
              }
            : i
        ));
        
        // Add to sync logs
        const newLog: SyncLog = {
          id: Date.now().toString(),
          integrationId,
          status: 'success',
          timestamp: new Date().toISOString(),
          duration: Math.floor(Math.random() * 60) + 10,
          recordsProcessed: Math.floor(Math.random() * 200) + 50,
          errors: [],
        };
        setSyncLogs(prev => [newLog, ...prev]);
        
        toast({
          title: 'Sync Complete',
          description: `Successfully synced ${integration.name}`,
        });
      }, 2000);
    } catch (error) {
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, syncStatus: 'failed' }
          : i
      ));
      
      toast({
        title: 'Sync Failed',
        description: `Failed to sync ${integration.name}`,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const getSyncBadge = (status: IntegrationStatus['syncStatus']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Synced</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Syncing...</Badge>;
      case 'idle':
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalCount = integrations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect and manage your business integrations
          </p>
        </div>
        <Button onClick={fetchIntegrationStatus} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}/{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              {connectedCount === totalCount ? 'All integrations connected' : `${totalCount - connectedCount} disconnected`}
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
              {syncLogs.filter(log => new Date(log.timestamp) > new Date(Date.now() - 86400000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {syncLogs.filter(log => log.status === 'success').length} successful
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
              {integrations.reduce((sum, i) => sum + (i.stats?.totalSynced || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all integrations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + (i.stats?.errors || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
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
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <Card key={integration.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${integration.color}`}>
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
                            : 'Never'
                          }
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
                        <Progress value={50} className="w-24" />
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
                      <Button 
                        onClick={() => handleConnect(integration.id)}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
              <CardDescription>
                Recent synchronization activity across all integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No sync logs available
                </div>
              ) : (
                <div className="space-y-4">
                  {syncLogs.map((log) => {
                    const integration = integrations.find(i => i.id === log.integrationId);
                    return (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${integration?.color || 'bg-gray-100'}`}>
                            {integration?.icon || <Database className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">{integration?.name || 'Unknown Integration'}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()} • {log.duration}s • {log.recordsProcessed} records
                            </div>
                            {log.errors.length > 0 && (
                              <div className="text-sm text-red-600 mt-1">
                                {log.errors.join(', ')}
                              </div>
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
              <CardDescription>
                Configure global integration settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Sync</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync data every hour
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Error Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when syncs fail
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Retention</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep sync logs for 90 days
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  All integration credentials are encrypted and stored securely. 
                  We never store your raw API keys or passwords.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}