"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Globe,
  Bell,
  Webhook,
  Store
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

interface ShopifyStore {
  id: string;
  name: string;
  domain: string;
  plan: string;
  currency: string;
  connectedAt: string;
  lastSync: string | null;
}

interface ShopifyWebhook {
  id: string;
  topic: string;
  address: string;
  status: 'active' | 'failed' | 'pending';
  lastTriggered: string | null;
}

interface ShopifyConnectionStatus {
  isConnected: boolean;
  stores: ShopifyStore[];
  webhooks: ShopifyWebhook[];
  syncStatus: 'success' | 'failed' | 'in_progress' | 'idle';
  stats: {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenue: number;
  };
}

export default function ShopifyIntegration() {
  const [status, setStatus] = useState<ShopifyConnectionStatus>({
    isConnected: false,
    stores: [],
    webhooks: [],
    syncStatus: 'idle',
    stats: {
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      revenue: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchShopifyStatus();
  }, []);

  const fetchShopifyStatus = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/integrations/shopify/status');
      // setStatus(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setStatus({
          isConnected: Math.random() > 0.5,
          stores: Math.random() > 0.5 ? [
            {
              id: 'store-1',
              name: 'Demo Store',
              domain: 'demo-store.myshopify.com',
              plan: 'Shopify Plus',
              currency: 'GBP',
              connectedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
              lastSync: new Date().toISOString(),
            },
          ] : [],
          webhooks: [
            {
              id: 'webhook-1',
              topic: 'orders/create',
              address: 'https://api.cazza.ai/webhooks/shopify/orders',
              status: 'active',
              lastTriggered: new Date().toISOString(),
            },
            {
              id: 'webhook-2',
              topic: 'products/update',
              address: 'https://api.cazza.ai/webhooks/shopify/products',
              status: 'active',
              lastTriggered: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: 'webhook-3',
              topic: 'customers/create',
              address: 'https://api.cazza.ai/webhooks/shopify/customers',
              status: 'pending',
              lastTriggered: null,
            },
          ],
          syncStatus: 'idle',
          stats: {
            totalOrders: 1245,
            totalProducts: 89,
            totalCustomers: 567,
            revenue: 125000,
          },
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch Shopify status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Shopify connection status',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // TODO: Implement actual Shopify OAuth flow
      // const response = await apiClient.get('/api/integrations/shopify/auth-url');
      // window.location.href = response.data.url;
      
      // Mock OAuth flow
      toast({
        title: 'Redirecting to Shopify',
        description: 'You will be redirected to Shopify to install the app',
      });

      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          stores: [
            {
              id: 'new-store',
              name: 'New Shopify Store',
              domain: 'new-store.myshopify.com',
              plan: 'Shopify Basic',
              currency: 'GBP',
              connectedAt: new Date().toISOString(),
              lastSync: null,
            },
          ],
        }));
        setIsConnecting(false);
        toast({
          title: 'App Installed',
          description: 'Successfully installed Cazza.ai on your Shopify store',
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Installation Failed',
        description: 'Failed to install the Shopify app',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (storeId?: string) => {
    try {
      // TODO: Implement actual disconnect
      // await apiClient.post('/api/integrations/shopify/disconnect', { storeId });
      
      if (storeId) {
        // Disconnect specific store
        setStatus(prev => ({
          ...prev,
          stores: prev.stores.filter(store => store.id !== storeId),
        }));
        toast({
          title: 'Store Disconnected',
          description: 'Successfully disconnected from Shopify store',
        });
      } else {
        // Disconnect all
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          stores: [],
        }));
        toast({
          title: 'Disconnected',
          description: 'Successfully disconnected from Shopify',
        });
      }
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: 'Failed to disconnect from Shopify',
        variant: 'destructive',
      });
    }
  };

  const handleSync = async (fullSync: boolean = false) => {
    try {
      setIsSyncing(true);
      setStatus(prev => ({ ...prev, syncStatus: 'in_progress' }));
      
      // TODO: Implement actual sync
      // await apiClient.post('/api/integrations/shopify/sync', { fullSync });
      
      // Mock sync
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          syncStatus: 'success',
          stores: prev.stores.map(store => ({
            ...store,
            lastSync: new Date().toISOString(),
          })),
          stats: {
            ...prev.stats,
            totalOrders: prev.stats.totalOrders + Math.floor(Math.random() * 50),
            totalProducts: prev.stats.totalProducts + Math.floor(Math.random() * 5),
            totalCustomers: prev.stats.totalCustomers + Math.floor(Math.random() * 20),
            revenue: prev.stats.revenue + Math.floor(Math.random() * 5000),
          },
        }));
        setIsSyncing(false);
        toast({
          title: 'Sync Complete',
          description: `Successfully synced ${fullSync ? 'all' : 'recent'} data from Shopify`,
        });
      }, 3000);
    } catch (error) {
      setStatus(prev => ({ ...prev, syncStatus: 'failed' }));
      setIsSyncing(false);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync data from Shopify',
        variant: 'destructive',
      });
    }
  };

  const handleWebhookToggle = async (webhookId: string, enable: boolean) => {
    try {
      // TODO: Implement webhook management
      // await apiClient.post(`/api/integrations/shopify/webhooks/${webhookId}/toggle`, { enable });
      
      setStatus(prev => ({
        ...prev,
        webhooks: prev.webhooks.map(webhook =>
          webhook.id === webhookId
            ? { ...webhook, status: enable ? 'active' : 'pending' }
            : webhook
        ),
      }));
      
      toast({
        title: enable ? 'Webhook Enabled' : 'Webhook Disabled',
        description: `Successfully ${enable ? 'enabled' : 'disabled'} webhook`,
      });
    } catch (error) {
      toast({
        title: 'Operation Failed',
        description: 'Failed to update webhook',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopify</h1>
          <p className="text-muted-foreground">
            E-commerce integration with order and product sync
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchShopifyStatus} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {status.isConnected && (
            <>
              <Button onClick={() => handleSync(false)} variant="outline" disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Recent
              </Button>
              <Button onClick={() => handleSync(true)} disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Full Sync
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Store Connection
              </CardTitle>
              <CardDescription>
                Manage your Shopify store connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${status.isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <ShoppingCart className={`h-5 w-5 ${status.isConnected ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-medium">Shopify Integration</div>
                    <div className="text-sm text-muted-foreground">
                      {status.isConnected ? 'App Installed' : 'Not Connected'}
                    </div>
                  </div>
                </div>
                <div>
                  {status.isConnected ? (
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  ) : (
                    <Badge variant="outline">Disconnected</Badge>
                  )}
                </div>
              </div>

              {status.isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Connected Stores</h3>
                      <p className="text-sm text-muted-foreground">
                        {status.stores.length} Shopify store(s) connected
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Uninstall All
                    </Button>
                  </div>

                  {status.stores.map((store) => (
                    <div key={store.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Store className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{store.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {store.domain} • {store.plan}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://${store.domain}/admin`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDisconnect(store.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Currency:</span>
                          <div className="font-medium">{store.currency}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Connected:</span>
                          <div>{new Date(store.connectedAt).toLocaleDateString()}</div>
                        </div>
                        {store.lastSync && (
                          <>
                            <div>
                              <span className="text-muted-foreground">Last Sync:</span>
                              <div>{new Date(store.lastSync).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <div>
                                <Badge className="bg-green-100 text-green-800">Synced</Badge>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium mb-2">Not Connected to Shopify</h3>
                  <p className="text-muted-foreground mb-6">
                    Install the Cazza.ai app on your Shopify store to sync orders, products, and customers
                  </p>
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    size="lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    {isConnecting ? 'Installing...' : 'Install Shopify App'}
                  </Button>
                </div>
              )}

              {status.syncStatus === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Syncing data from Shopify...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
              )}
            </CardContent>
            {status.stores.some(s => s.lastSync) && (
              <CardFooter className="text-sm text-muted-foreground">
                Last sync: {new Date(Math.max(...status.stores.map(s => s.lastSync ? new Date(s.lastSync).getTime() : 0))).toLocaleString()}
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="h-5 w-5 mr-2" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Real-time event notifications from Shopify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertTitle>Real-time Updates</AlertTitle>
                <AlertDescription>
                  Webhooks enable instant synchronization when events occur in your Shopify store
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {status.webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        webhook.status === 'active' ? 'bg-green-100' :
                        webhook.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <Webhook className={`h-4 w-4 ${
                          webhook.status === 'active' ? 'text-green-600' :
                          webhook.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{webhook.topic}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {webhook.address}
                        </div>
                        {webhook.lastTriggered && (
                          <div className="text-xs text-muted-foreground">
                            Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        webhook.status === 'active' ?                        'bg-green-100 text-green-800' :
                        webhook.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {webhook.status === 'active' ? 'Active' :
                         webhook.status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWebhookToggle(webhook.id, webhook.status !== 'active')}
                      >
                        {webhook.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Available Webhook Topics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    orders/create
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    orders/updated
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    products/create
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    products/update
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    customers/create
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    customers/update
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Store Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Total Orders</span>
                  </div>
                  <span className="font-bold">{status.stats.totalOrders.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2 text-green-500" />
                    <span>Total Products</span>
                  </div>
                  <span className="font-bold">{status.stats.totalProducts.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Total Customers</span>
                  </div>
                  <span className="font-bold">{status.stats.totalCustomers.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Total Revenue</span>
                  </div>
                  <span className="font-bold">£{status.stats.revenue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Package className="h-4 w-4 mr-2" />
                Export Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Export Products
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Users className="h-4 w-4 mr-2" />
                Export Customers
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Configure Webhooks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                App Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Sync Configuration</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Auto-sync interval:</span>
                    <span>Every 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sync historical data:</span>
                    <span>90 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency conversion:</span>
                    <span>Enabled</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Data Mapping</h4>
                <p className="text-sm text-muted-foreground">
                  Shopify data is automatically mapped to UK accounting standards including VAT calculation and tax handling.
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Shopify App Required</AlertTitle>
                <AlertDescription className="text-sm">
                  This integration requires the Cazza.ai app to be installed from the Shopify App Store.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}