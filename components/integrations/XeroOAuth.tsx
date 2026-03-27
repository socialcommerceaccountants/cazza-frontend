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
  CreditCard,
  Building,
  FileText,
  PoundSterling,
  Shield,
  Info
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

interface XeroTenant {
  id: string;
  name: string;
  connectedAt: string;
  expiresAt: string;
  lastRefreshed: string;
}

interface XeroConnectionStatus {
  isConnected: boolean;
  tenants: XeroTenant[];
  lastSync: string | null;
  syncStatus: 'success' | 'failed' | 'in_progress' | 'idle';
  ukCompliance: {
    vatRegistered: boolean;
    vatNumber: string | null;
    companyNumber: string | null;
    taxYearEnd: string;
  };
}

export default function XeroOAuth() {
  const [status, setStatus] = useState<XeroConnectionStatus>({
    isConnected: false,
    tenants: [],
    lastSync: null,
    syncStatus: 'idle',
    ukCompliance: {
      vatRegistered: false,
      vatNumber: null,
      companyNumber: null,
      taxYearEnd: '2024-03-31',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchXeroStatus();
  }, []);

  const fetchXeroStatus = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/integrations/xero/status');
      // setStatus(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setStatus({
          isConnected: Math.random() > 0.5,
          tenants: Math.random() > 0.5 ? [
            {
              id: 'tenant-1',
              name: 'Demo Company Ltd',
              connectedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
              expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
              lastRefreshed: new Date().toISOString(),
            },
            {
              id: 'tenant-2',
              name: 'Test Business Ltd',
              connectedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
              expiresAt: new Date(Date.now() + 86400000 * 45).toISOString(),
              lastRefreshed: new Date(Date.now() - 86400000).toISOString(),
            },
          ] : [],
          lastSync: Math.random() > 0.5 ? new Date().toISOString() : null,
          syncStatus: 'idle',
          ukCompliance: {
            vatRegistered: true,
            vatNumber: 'GB123456789',
            companyNumber: '12345678',
            taxYearEnd: '2024-03-31',
          },
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch Xero status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Xero connection status',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // TODO: Implement actual Xero OAuth flow
      // const response = await apiClient.get('/api/integrations/xero/auth-url');
      // window.location.href = response.data.url;
      
      // Mock OAuth flow
      toast({
        title: 'Redirecting to Xero',
        description: 'You will be redirected to Xero to authorize access',
      });

      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          tenants: [
            {
              id: 'new-tenant',
              name: 'New Company Ltd',
              connectedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 86400000 * 60).toISOString(),
              lastRefreshed: new Date().toISOString(),
            },
          ],
        }));
        setIsConnecting(false);
        toast({
          title: 'Connected to Xero',
          description: 'Successfully connected to Xero Accounting',
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Xero',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (tenantId?: string) => {
    try {
      // TODO: Implement actual disconnect
      // await apiClient.post('/api/integrations/xero/disconnect', { tenantId });
      
      if (tenantId) {
        // Disconnect specific tenant
        setStatus(prev => ({
          ...prev,
          tenants: prev.tenants.filter(tenant => tenant.id !== tenantId),
        }));
        toast({
          title: 'Tenant Disconnected',
          description: 'Successfully disconnected from Xero tenant',
        });
      } else {
        // Disconnect all
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          tenants: [],
        }));
        toast({
          title: 'Disconnected',
          description: 'Successfully disconnected from Xero',
        });
      }
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: 'Failed to disconnect from Xero',
        variant: 'destructive',
      });
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setStatus(prev => ({ ...prev, syncStatus: 'in_progress' }));
      
      // TODO: Implement actual sync
      // await apiClient.post('/api/integrations/xero/sync');
      
      // Mock sync
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          syncStatus: 'success',
          lastSync: new Date().toISOString(),
        }));
        setIsSyncing(false);
        toast({
          title: 'Sync Complete',
          description: 'Successfully synced data from Xero',
        });
      }, 3000);
    } catch (error) {
      setStatus(prev => ({ ...prev, syncStatus: 'failed' }));
      setIsSyncing(false);
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync data from Xero',
        variant: 'destructive',
      });
    }
  };

  const handleRefreshToken = async (tenantId: string) => {
    try {
      // TODO: Implement token refresh
      // await apiClient.post('/api/integrations/xero/refresh', { tenantId });
      
      toast({
        title: 'Token Refreshed',
        description: 'Successfully refreshed Xero access token',
      });
      
      // Update UI
      setStatus(prev => ({
        ...prev,
        tenants: prev.tenants.map(tenant => 
          tenant.id === tenantId 
            ? { 
                ...tenant, 
                lastRefreshed: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 86400000 * 60).toISOString(),
              }
            : tenant
        ),
      }));
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Failed to refresh Xero token',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xero Accounting</h1>
          <p className="text-muted-foreground">
            UK accounting integration with automatic transaction sync
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchXeroStatus} variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {status.isConnected && (
            <Button onClick={handleSync} disabled={isSyncing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Connection Status
              </CardTitle>
              <CardDescription>
                Manage your Xero accounting connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${status.isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <CreditCard className={`h-5 w-5 ${status.isConnected ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-medium">Xero Accounting</div>
                    <div className="text-sm text-muted-foreground">
                      {status.isConnected ? 'Connected' : 'Not Connected'}
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
                      <h3 className="font-medium">Connected Organisations</h3>
                      <p className="text-sm text-muted-foreground">
                        {status.tenants.length} Xero organisation(s) connected
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

                  {status.tenants.map((tenant) => (
                    <div key={tenant.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Connected {new Date(tenant.connectedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRefreshToken(tenant.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDisconnect(tenant.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Token expires:</span>
                          <div>{new Date(tenant.expiresAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last refreshed:</span>
                          <div>{new Date(tenant.lastRefreshed).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium mb-2">Not Connected to Xero</h3>
                  <p className="text-muted-foreground mb-6">
                    Connect your Xero account to sync transactions and manage UK accounting
                  </p>
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    size="lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Connect to Xero'}
                  </Button>
                </div>
              )}

              {status.syncStatus === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Syncing data from Xero...</span>
                    <span>50%</span>
                  </div>
                  <Progress value={50} />
                </div>
              )}
            </CardContent>
            {status.lastSync && (
              <CardFooter className="text-sm text-muted-foreground">
                Last sync: {new Date(status.lastSync).toLocaleString()}
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                UK Accounting Standards
              </CardTitle>
              <CardDescription>
                Compliance with UK accounting and tax regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>UK Compliance Ready</AlertTitle>
                <AlertDescription>
                  This integration automatically handles UK VAT rates, corporation tax thresholds, 
                  and HMRC reporting requirements.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <PoundSterling className="h-4 w-4 mr-2" />
                    VAT Settings
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>VAT Registered:</span>
                      <span className={status.ukCompliance.vatRegistered ? 'text-green-600' : 'text-amber-600'}>
                        {status.ukCompliance.vatRegistered ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {status.ukCompliance.vatNumber && (
                      <div className="flex justify-between">
                        <span>VAT Number:</span>
                        <span className="font-mono">{status.ukCompliance.vatNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Standard Rate:</span>
                      <span>20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration Threshold:</span>
                      <span>£90,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Company Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    {status.ukCompliance.companyNumber && (
                      <div className="flex justify-between">
                        <span>Company Number:</span>
                        <span className="font-mono">{status.ukCompliance.companyNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax Year End:</span>
                      <span>{status.ukCompliance.taxYearEnd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Corporation Tax (Small):</span>
                      <span>19%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Corporation Tax (Main):</span>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Automated Features</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatic VAT calculation on transactions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    UK tax year alignment (April 6 - April 5)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    HMRC-compliant invoice formatting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Making Tax Digital (MTD) ready
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automatic bank feed reconciliation
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Access Scope</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read accounting transactions
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read organisation settings
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read contacts and invoices
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Read bank transactions
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Data Protection</h4>
                <p className="text-sm text-muted-foreground">
                  All Xero credentials are encrypted and stored securely. 
                  We only request read-only access to your accounting data.
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription className="text-sm">
                  Disconnecting will remove access to your Xero data. 
                  Historical data already synced will be retained according to your data retention settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <FileText className="h-4 w-4 mr-2" />
                Export Transactions
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <Settings className="h-4 w-4 mr-2" />
                Configure Sync Rules
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!status.isConnected}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Sync Errors
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Xero Developer Portal
              </Button>
            </CardContent>
          </Card>

          {status.isConnected && status.lastSync && (
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last Successful Sync:</span>
                    <span className="font-medium">
                      {new Date(status.lastSync).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge className={
                      status.syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                      status.syncStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      status.syncStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {status.syncStatus === 'success' ? 'Up to date' :
                       status.syncStatus === 'failed' ? 'Sync failed' :
                       status.syncStatus === 'in_progress' ? 'Syncing...' : 'Ready'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Connected Tenants:</span>
                    <span className="font-medium">{status.tenants.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}