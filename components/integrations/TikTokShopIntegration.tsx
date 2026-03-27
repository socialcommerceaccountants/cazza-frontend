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
  TrendingUp,
  Video,
  ShoppingBag,
  Users,
  DollarSign,
  Globe,
  Smartphone,
  BarChart,
  Tag
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

interface TikTokShop {
  id: string;
  name: string;
  region: string;
  currency: string;
  connectedAt: string;
  lastSync: string | null;
  status: 'active' | 'pending' | 'suspended';
}

interface TikTokProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'out_of_stock' | 'draft';
  lastSynced: string;
}

interface TikTokConnectionStatus {
  isConnected: boolean;
  shops: TikTokShop[];
  products: TikTokProduct[];
  syncStatus: 'success' | 'failed' | 'in_progress' | 'idle';
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalRevenue: number;
    audienceReach: number;
  };
  apiLimits: {
    remaining: number;
    resetTime: string;
    limit: number;
  };
}

export default function TikTokShopIntegration() {
  const [status, setStatus] = useState<TikTokConnectionStatus>({
    isConnected: false,
    shops: [],
    products: [],
    syncStatus: 'idle',
    stats: {
      totalProducts: 0,
      activeProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      audienceReach: 0,
    },
    apiLimits: {
      remaining: 1000,
      resetTime: new Date(Date.now() + 3600000).toISOString(),
      limit: 5000,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTikTokStatus();
  }, []);

  const fetchTikTokStatus = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/integrations/tiktok/status');
      // setStatus(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setStatus({
          isConnected: Math.random() > 0.5,
          shops: Math.random() > 0.5 ? [
            {
              id: 'shop-1',
              name: 'Fashion Trends UK',
              region: 'United Kingdom',
              currency: 'GBP',
              connectedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
              lastSync: new Date().toISOString(),
              status: 'active',
            },
          ] : [],
          products: [
            {
              id: 'product-1',
              name: 'Summer Dress - Floral Pattern',
              sku: 'TTS-DRESS-001',
              price: 49.99,
              stock: 45,
              status: 'active',
              lastSynced: new Date().toISOString(),
            },
            {
              id: 'product-2',
              name: 'Wireless Earbuds Pro',
              sku: 'TTS-EARBUDS-002',
              price: 89.99,
              stock: 0,
              status: 'out_of_stock',
              lastSynced: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: 'product-3',
              name: 'Fitness Tracker Watch',
              sku: 'TTS-WATCH-003',
              price: 129.99,
              stock: 12,
              status: 'active',
              lastSynced: new Date().toISOString(),
            },
          ],
          syncStatus: 'idle',
          stats: {
            totalProducts: 23,
            activeProducts: 18,
            totalOrders: 456,
            totalRevenue: 28950,
            audienceReach: 125000,
          },
          apiLimits: {
            remaining: 875,
            resetTime: new Date(Date.now() + 1800000).toISOString(),
            limit: 5000,
          },
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch TikTok Shop status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load TikTok Shop connection status',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // TODO: Implement actual TikTok OAuth flow
      // const response = await apiClient.get('/api/integrations/tiktok/auth-url');
      // window.location.href = response.data.url;
      
      // Mock OAuth flow
      toast({
        title: 'Redirecting to TikTok',
        description: 'You will be redirected to TikTok to authorize access',
      });

      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          shops: [
            {
              id: 'new-shop',
              name: 'New TikTok Shop',
              region: 'United Kingdom',
              currency: 'GBP',
              connectedAt: new Date().toISOString(),
              lastSync: null,
              status: 'active',
            },
          ],
        }));
        setIsConnecting(false);
        toast({
          title: 'Connected to TikTok Shop',
          description: 'Successfully connected to TikTok Shop API',
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to TikTok Shop',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (shopId?: string) => {
    try {
      // TODO: Implement actual disconnect
      // await apiClient.post('/api/integrations/tiktok/disconnect', { shopId });
      
      if (shopId) {
        // Disconnect specific shop
        setStatus(prev => ({
          ...prev,
          shops: prev.shops.filter(shop => shop.id !== shopId),
        }));
        toast({
          title: 'Shop Disconnected',
          description: 'Successfully disconnected from TikTok Shop',
        });
      } else {
        // Disconnect all
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          shops: [],
        }));
        toast({
          title: 'Disconnected',
          description: 'Successfully disconnected from TikTok Shop',
        });
      }
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: 'Failed to disconnect from TikTok Shop',
        variant: 'destructive',
      });
    }
  };

  const handleSync = async (type: 'products' | 'orders' | 'all' = 'all') => {
    try {
      setIsSyncing(true);
      setStatus(prev => ({ ...prev, syncStatus: 'in_progress' }));
      
      // TODO: Implement actual sync
      // await apiClient.post('/api/integrations/tiktok/sync', { type });
      
      // Mock sync
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          syncStatus: 'success',
          shops: prev.shops.map(shop => ({
            ...shop,
            lastSync: new Date().toISOString(),
          })),
          products: prev.products.map(product => ({
            ...product,
            lastSynced: new Date().toISOString(),
            stock: product.stock > 0 ? product.stock - Math.floor(Math.random() * 5) : 0,
            status: product.stock > 0 ? 'active' : 'out_of_stock',
          })),
          stats: {
            ...prev.stats,
            totalProducts: prev.stats.totalProducts + (type === 'products' || type === 'all' ? 1 : 0),
            totalOrders: prev.stats.totalOrders + (type === 'orders' || type === 'all' ? Math.floor(Math.random() * 10) : 0),
            totalRevenue: prev.stats.totalRevenue + (type === 'orders' || type === 'all' ? Math.floor(Math.random() * 500) : 0),
          },
        }));
        setIsSyncing(false);
        toast({
          title: 'Sync Complete',
          description: `Successfully synced ${type} from TikTok Shop`,
        });
      }, 3000);
    } catch (error) {
      setStatus(prev => ({ ...prev, syncStatus: 'failed' }));
      setIsSyncing(false);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync data from TikTok Shop',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<TikTokProduct>) => {
    try {
      // TODO: Implement product update
      // await apiClient.put(`/api/integrations/tiktok/products/${productId}`, updates);
      
      setStatus(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === productId
            ? { ...product, ...updates, lastSynced: new Date().toISOString() }
            : product
        ),
      }));
      
      toast({
        title: 'Product Updated',
        description: 'Successfully updated product in TikTok Shop',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update product in TikTok Shop',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TikTok Shop</h1>
          <p className="text-muted-foreground">
            Social commerce integration for TikTok Shop
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchTikTokStatus} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {status.isConnected && (
            <>
              <Button onClick={() => handleSync('products')} variant="outline" disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Products
              </Button>
              <Button onClick={() => handleSync('all')} disabled={isSyncing}>
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
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Connection
              </CardTitle>
              <CardDescription>
                Manage your TikTok Shop connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${status.isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <TrendingUp className={`h-5 w-5 ${status.isConnected ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-medium">TikTok Shop Integration</div>
                    <div className="text-sm text-muted-foreground">
                      {status.isConnected ? 'API Connected' : 'Not Connected'}
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
                      <h3 className="font-medium">Connected Shops</h3>
                      <p className="text-sm text-muted-foreground">
                        {status.shops.length} TikTok Shop(s) connected
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Disconnect All
                    </Button>
                  </div>

                  {status.shops.map((shop) => (
                    <div key={shop.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ShoppingBag className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{shop.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {shop.region} • {shop.currency}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            shop.status === 'active' ? 'bg-green-100 text-green-800' :
                            shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {shop.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDisconnect(shop.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Connected:</span>
                          <div>{new Date(shop.connectedAt).toLocaleDateString()}</div>
                        </div>
                        {shop.lastSync && (
                          <div>
                            <span className="text-muted-foreground">Last Sync:</span>
                            <div>{new Date(shop.lastSync).toLocaleDateString()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        API Rate Limits
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {status.apiLimits.remaining}/{status.apiLimits.limit}
                      </Badge>
                    </div>
                    <Progress 
                      value={(status.apiLimits.remaining / status.apiLimits.limit) * 100} 
                      className="mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Resets in {Math.round((new Date(status.apiLimits.resetTime).getTime() - Date.now()) / 60000)} minutes
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium mb-2">Not Connected to TikTok Shop</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your TikTok Shop to sync products, orders, and social commerce data
                  </p>
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    size="lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Connect to TikTok Shop'}
                  </Button>
                </div>
              )}

              {status.syncStatus === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Syncing data from TikTok Shop...</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
              )}
            </CardContent>
            {status.shops.some(s => s.lastSync) && (
              <CardFooter className="text-sm text-muted-foreground">
                Last sync: {new Date(Math.max(...status.shops.map(s => s.lastSync ? new Date(s.lastSync).getTime() : 0))).toLocaleString()}
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Product Management
              </CardTitle>
              <CardDescription>
                Manage products synced from                TikTok Shop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Synced Products</h3>
                  <p className="text-sm text-muted-foreground">
                    {status.products.length} products • {status.stats.activeProducts} active
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSync('products')}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Refresh Products
                </Button>
              </div>

              <div className="space-y-3">
                {status.products.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} • £{product.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {product.status === 'active' ? 'In Stock' :
                           product.status === 'out_of_stock' ? 'Out of Stock' : 'Draft'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateProduct(product.id, { stock: product.stock + 10 })}
                        >
                          Restock
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Stock:</span>
                        <div className="font-medium">{product.stock} units</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Synced:</span>
                        <div>{new Date(product.lastSynced).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Product Sync Features</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatic inventory sync
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Price synchronization
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Product image sync
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Variant management
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Bulk product updates
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time stock updates
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
                <BarChart className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Total Products</span>
                  </div>
                  <span className="font-bold">{status.stats.totalProducts}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-green-500" />
                    <span>Active Products</span>
                  </div>
                  <span className="font-bold">{status.stats.activeProducts}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Total Orders</span>
                  </div>
                  <span className="font-bold">{status.stats.totalOrders}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Total Revenue</span>
                  </div>
                  <span className="font-bold">£{status.stats.totalRevenue.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-pink-500" />
                    <span>Audience Reach</span>
                  </div>
                  <span className="font-bold">{status.stats.audienceReach.toLocaleString()}</span>
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
                <Tag className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <BarChart className="h-4 w-4 mr-2" />
                Analytics Dashboard
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Sync Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Social Commerce
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Platform Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Live Shopping:</span>
                    <span>Supported</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video Integration:</span>
                    <span>Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creator Commerce:</span>
                    <span>Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Region:</span>
                    <span>United Kingdom</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">UK Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  All TikTok Shop transactions are automatically processed with UK VAT rates and tax compliance.
                </p>
              </div>

              <Alert>
                <Video className="h-4 w-4" />
                <AlertTitle>TikTok Shop API</AlertTitle>
                <AlertDescription className="text-sm">
                  This integration uses the official TikTok Shop API for secure and reliable data synchronization.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}