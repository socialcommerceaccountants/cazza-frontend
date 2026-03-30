"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Store, ShoppingCart, Package, Users, PoundSterling, Globe, Link, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface WooCommerceStore {
  id: number;
  store_url: string;
  store_name: string;
  currency: string;
  vat_enabled: boolean;
  eu_vat_enabled: boolean;
  webhook_configured: boolean;
  last_sync_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface WooCommerceStatus {
  type: string;
  name: string;
  is_connected: boolean;
  connected_at: string | null;
  last_sync: string | null;
  details: {
    stores: WooCommerceStore[];
    uk_compliance: {
      vat_registered: boolean;
      vat_number: string | null;
      company_number: string | null;
      eu_vat_enabled: boolean;
    };
  };
}

export default function WooCommerceIntegrationPage() {
  const [status, setStatus] = useState<WooCommerceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [storeName, setStoreName] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchWooCommerceStatus();
  }, []);

  const fetchWooCommerceStatus = async () => {
    try {
      const response = await fetch("/api/integrations/status?integration_type=woocommerce");
      const data = await response.json();
      if (data.success) {
        setStatus(data.data.integrations[0]);
      }
    } catch (error) {
      console.error("Failed to fetch WooCommerce status:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectStore = async () => {
    if (!storeUrl || !consumerKey || !consumerSecret) {
      alert("Please fill in all required fields");
      return;
    }

    setConnecting(true);
    try {
      const response = await fetch("/api/integrations/woocommerce/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          store_url: storeUrl,
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
          store_name: storeName,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Store connected successfully!");
        setConnectDialogOpen(false);
        resetForm();
        fetchWooCommerceStatus();
      } else {
        alert(`Connection failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const syncStore = async (storeId: number) => {
    setSyncing(true);
    try {
      const response = await fetch("/api/integrations/woocommerce/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ store_id: storeId, full_sync: false }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Successfully synced ${data.records_processed} records`);
        fetchWooCommerceStatus();
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const disconnectStore = async (storeId: number) => {
    if (!confirm("Are you sure you want to disconnect this store?")) {
      return;
    }

    try {
      const response = await fetch(`/api/integrations/woocommerce/stores/${storeId}/disconnect`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert("Store disconnected successfully");
        fetchWooCommerceStatus();
      } else {
        alert(`Disconnect failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Disconnect failed:", error);
      alert("Disconnect failed");
    }
  };

  const resetForm = () => {
    setStoreUrl("");
    setConsumerKey("");
    setConsumerSecret("");
    setStoreName("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading WooCommerce integration...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeStores = status?.details.stores.filter(store => store.is_active) || [];
  const inactiveStores = status?.details.stores.filter(store => !store.is_active) || [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WooCommerce</h1>
          <p className="text-muted-foreground">
            WordPress e-commerce integration with UK VAT support
          </p>
        </div>
        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogTrigger>
            <Button size="lg">
              <Link className="mr-2 h-4 w-4" />
              Connect Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Connect WooCommerce Store</DialogTitle>
              <DialogDescription>
                Enter your WooCommerce store details to connect
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="store-url">Store URL *</Label>
                <Input
                  id="store-url"
                  placeholder="https://yourstore.com"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your WooCommerce store URL (include https://)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-name">Store Name (Optional)</Label>
                <Input
                  id="store-name"
                  placeholder="My WooCommerce Store"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="consumer-key">Consumer Key *</Label>
                <Input
                  id="consumer-key"
                  type="password"
                  placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  WooCommerce REST API Consumer Key
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="consumer-secret">Consumer Secret *</Label>
                <Input
                  id="consumer-secret"
                  type="password"
                  placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  WooCommerce REST API Consumer Secret
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={connectStore} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect Store"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!status?.is_connected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your WooCommerce Store</CardTitle>
            <CardDescription>
              Connect your WordPress WooCommerce store to sync orders, manage products, and calculate UK/EU VAT.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Order Sync</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real-time order synchronization and tracking
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <PoundSterling className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">UK/EU VAT</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatic VAT calculation for UK and EU customers
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Product Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Product catalog sync and inventory tracking
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={() => setConnectDialogOpen(true)} size="lg" className="w-full">
                <Link className="mr-2 h-4 w-4" />
                Connect WooCommerce Store
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                You'll need WooCommerce REST API credentials
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStores.length}</div>
                <p className="text-xs text-muted-foreground">
                  Connected WooCommerce stores
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VAT Enabled</CardTitle>
                <PoundSterling className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeStores.filter(store => store.vat_enabled).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Stores with VAT calculation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EU VAT</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeStores.filter(store => store.eu_vat_enabled).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Stores with EU VAT handling
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeStores.filter(store => store.webhook_configured).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Stores with real-time webhooks
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="stores" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="vat">VAT Reporting</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="stores" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Stores</CardTitle>
                  <CardDescription>
                    Your WooCommerce stores and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeStores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell className="font-medium">
                            {store.store_name || store.store_url}
                          </TableCell>
                          <TableCell>
                            <a
                              href={store.store_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {store.store_url.replace(/^https?:\/\//, '')}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{store.currency.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            {store.last_sync_at ? new Date(store.last_sync_at).toLocaleDateString() : "Never"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant={store.is_active ? "default" : "secondary"}>
                                {store.is_active ? "Active" : "Inactive"}
                              </Badge>
                              {store.vat_enabled && (
                                <Badge variant="outline" className="w-fit">VAT</Badge>
                              )}
                              {store.eu_vat_enabled && (
                                <Badge variant="outline" className="w-fit">EU VAT</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => syncStore(store.id)}
                                disabled={syncing}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => disconnectStore(store.id)}
                              >
                                Disconnect
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {inactiveStores.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mt-8 mb-4">Inactive Stores</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Store Name</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Disconnected</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inactiveStores.map((store) => (
                            <TableRow key={store.id}>
                              <TableCell className="font-medium">
                                {store.store_name || store.store_url}
                              </TableCell>
                              <TableCell>
                                <a
                                  href={store.store_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {store.store_url.replace(/^https?:\/\//, '')}
                                </a>
                              </TableCell>
                              <TableCell>
                                {new Date(store.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {/* TODO: Reconnect functionality */}}
                                >
                                  Reconnect
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>UK & EU VAT Reporting</CardTitle>
                  <CardDescription>
                    VAT calculation and reporting for your WooCommerce stores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">VAT Configuration</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">UK VAT Number</p>
                          <p className="text-sm text-muted-foreground">
                            {status.details.uk_compliance.vat_number || "Not registered"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Company Number</p>
                          <p className="text-sm text-muted-foreground">
                            {status.details.uk_compliance.company_number || "Not available"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">EU VAT Enabled</p>
                          <Badge variant={status.details.uk_compliance.eu_vat_enabled ? "default" : "secondary"}>
                            {status.details.uk_compliance.eu_vat_enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">VAT Registered</p>
                          <Badge variant={status.details.uk_compliance.vat_registered ? "default" : "secondary"}>
                            {status.details.uk_compliance.vat_registered ? "Registered" : "Not Registered"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">VAT Report</h3>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Quarterly VAT Return</AlertTitle>
                        <AlertDescription>
                          Generate VAT reports for HMRC submission. Reports include UK and EU sales breakdown.
                        </AlertDescription>
                      </Alert>
                      <div className="mt-4 flex space-x-2">
                        <Button>Generate VAT Report</Button>
                        <Button variant="outline">Export for HMRC</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Configuration</CardTitle>
                  <CardDescription>
                    Real-time webhooks for order and product updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Webhook Status</p>
                        <p className="text-sm text-muted-foreground">
                          {activeStores.filter(store => store.webhook_configured).length} of {activeStores.length} stores configured
                        </p>
                      </div>
                      <Button>Configure Webhooks</Button>
                    </div>
                    <Progress value={(activeStores.filter(store => store.webhook_configured).length / activeStores.length) * 100} className="w-full" />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Webhook Events</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Order created/updated</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Product updates</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Customer updates</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Inventory changes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}