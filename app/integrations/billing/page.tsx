"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, Globe, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BillingProvider {
  id: string;
  name: string;
  description: string;
  is_connected: boolean;
  connected_at: string | null;
  last_sync: string | null;
  stats?: {
    monthly_revenue: number;
    transaction_count: number;
    currency: string;
  };
}

export default function BillingIntegrationPage() {
  const { toast } = useToast();
  const [providers, setProviders] = useState<BillingProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBillingStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/integrations/status?integration_type=billing");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setProviders(data.data.integrations ?? []);
      }
    } catch {
      toast({ title: "Error", description: "Failed to load billing integration status.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBillingStatus();
  }, [fetchBillingStatus]);

  const handleConnect = async (providerId: string) => {
    try {
      const response = await fetch(`/api/integrations/${providerId}/auth-url`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success && data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error(data.error || "No auth URL returned");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection failed";
      toast({ title: "Connection Failed", description: message, variant: "destructive" });
    }
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      const response = await fetch(`/api/integrations/${providerId}/disconnect`, { method: "POST" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success) {
        toast({ title: "Disconnected", description: "Billing provider disconnected." });
        fetchBillingStatus();
      } else {
        throw new Error(data.error || "Disconnect failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Disconnect failed";
      toast({ title: "Disconnect Failed", description: message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const PROVIDER_META: Record<string, { icon: React.ReactNode; color: string }> = {
    stripe: { icon: <CreditCard className="h-5 w-5" />, color: "bg-purple-500" },
    paddle: { icon: <Globe className="h-5 w-5" />, color: "bg-red-500" },
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">
          Connect Stripe or Paddle to automate invoicing, subscription management, and revenue recognition.
        </p>
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Stripe */}
            {(() => {
              const stripe = providers.find(p => p.id === 'stripe');
              const meta = PROVIDER_META.stripe;
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${meta.color}`}>{meta.icon}</div>
                        <div>
                          <CardTitle>Stripe</CardTitle>
                          <CardDescription>Payment processing and subscription management</CardDescription>
                        </div>
                      </div>
                      {stripe?.is_connected
                        ? <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        : <Badge variant="outline">Disconnected</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stripe?.stats && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Revenue</p>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: stripe.stats.currency }).format(stripe.stats.monthly_revenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transactions</p>
                          <p className="font-semibold">{stripe.stats.transaction_count.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    <Separator />
                    {stripe?.is_connected ? (
                      <Button variant="outline" size="sm" onClick={() => handleDisconnect('stripe')}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleConnect('stripe')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect Stripe
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Paddle */}
            {(() => {
              const paddle = providers.find(p => p.id === 'paddle');
              const meta = PROVIDER_META.paddle;
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${meta.color}`}>{meta.icon}</div>
                        <div>
                          <CardTitle>Paddle</CardTitle>
                          <CardDescription>Merchant of record with global tax compliance</CardDescription>
                        </div>
                      </div>
                      {paddle?.is_connected
                        ? <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        : <Badge variant="outline">Disconnected</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paddle?.stats && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Revenue</p>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: paddle.stats.currency }).format(paddle.stats.monthly_revenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transactions</p>
                          <p className="font-semibold">{paddle.stats.transaction_count.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    <Separator />
                    {paddle?.is_connected ? (
                      <Button variant="outline" size="sm" onClick={() => handleDisconnect('paddle')}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleConnect('paddle')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect Paddle
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>UK Tax Compliance</AlertTitle>
            <AlertDescription>
              Billing integrations automatically reconcile with Xero for UK VAT reporting and Making Tax Digital submissions.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Combined revenue across all billing providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {providers.filter(p => p.is_connected && p.stats).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Connect a billing provider to see revenue data
                </div>
              ) : (
                <div className="space-y-4">
                  {providers.filter(p => p.is_connected && p.stats).map(provider => (
                    <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${PROVIDER_META[provider.id]?.color ?? 'bg-gray-400'}`}>
                          {PROVIDER_META[provider.id]?.icon}
                        </div>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Last sync: {provider.last_sync ? new Date(provider.last_sync).toLocaleString() : 'Never'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {provider.stats ? new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: provider.stats.currency,
                          }).format(provider.stats.monthly_revenue) : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {provider.stats?.transaction_count ?? 0} transactions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div className="flex space-x-2 mt-4">
                  <Button>Generate Report</Button>
                  <Button variant="outline">Export CSV</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Revenue Trends</h3>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Revenue chart will appear here</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Monthly recurring revenue trend over the last 12 months
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>UK VAT Note</AlertTitle>
                <AlertDescription>
                  Revenue figures shown are gross. VAT-inclusive reporting is available in the VAT Returns section.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
