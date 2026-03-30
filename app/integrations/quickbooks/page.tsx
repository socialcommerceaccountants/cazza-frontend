"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, AlertCircle, Link, FileText, PoundSterling, Building } from "lucide-react";

interface QuickBooksRealm {
  realm_id: string;
  company_name: string;
  connected_at: string;
  expires_at: string;
  is_valid: boolean;
}

interface QuickBooksStatus {
  type: string;
  name: string;
  is_connected: boolean;
  connected_at: string | null;
  last_sync: string | null;
  details: {
    realms: QuickBooksRealm[];
    uk_compliance: {
      vat_registered: boolean;
      vat_number: string | null;
      company_number: string | null;
      tax_year_end: string | null;
      mtd_compliant: boolean;
    };
  };
}

export default function QuickBooksIntegrationPage() {
  const [status, setStatus] = useState<QuickBooksStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchQuickBooksStatus();
  }, []);

  const fetchQuickBooksStatus = async () => {
    try {
      const response = await fetch("/api/integrations/status?integration_type=quickbooks");
      const data = await response.json();
      if (data.success) {
        setStatus(data.data.integrations[0]);
      }
    } catch (error) {
      console.error("Failed to fetch QuickBooks status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthUrl = async () => {
    try {
      const response = await fetch("/api/integrations/quickbooks/auth-url");
      const data = await response.json();
      if (data.success) {
        setAuthUrl(data.auth_url);
        // Redirect to QuickBooks auth page
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error("Failed to get auth URL:", error);
    }
  };

  const syncQuickBooks = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/integrations/quickbooks/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_sync: false }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Successfully synced ${data.records_processed} records`);
        fetchQuickBooksStatus();
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

  const disconnectRealm = async (realmId: string) => {
    if (!confirm("Are you sure you want to disconnect this QuickBooks company?")) {
      return;
    }

    try {
      const response = await fetch(`/api/integrations/quickbooks/realms/${realmId}/disconnect`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert("Successfully disconnected");
        fetchQuickBooksStatus();
      } else {
        alert(`Disconnect failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Disconnect failed:", error);
      alert("Disconnect failed");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading QuickBooks integration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QuickBooks Online</h1>
          <p className="text-muted-foreground">
            UK accounting integration with MTD compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {status?.is_connected ? (
            <>
              <Button variant="outline" onClick={syncQuickBooks} disabled={syncing}>
                {syncing ? "Syncing..." : "Sync Now"}
              </Button>
              <Button onClick={getAuthUrl} variant="default">
                <Link className="mr-2 h-4 w-4" />
                Connect Another Company
              </Button>
            </>
          ) : (
            <Button onClick={getAuthUrl} size="lg">
              <Link className="mr-2 h-4 w-4" />
              Connect QuickBooks
            </Button>
          )}
        </div>
      </div>

      {!status?.is_connected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect QuickBooks Online</CardTitle>
            <CardDescription>
              Connect your UK QuickBooks Online account to sync invoices, calculate VAT, and submit MTD returns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">UK MTD Compliance</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatic VAT calculation and Making Tax Digital submission
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Invoice Sync</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real-time invoice synchronization and payment reconciliation
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <PoundSterling className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Tax Reporting</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  UK tax year reporting and corporation tax calculations
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button onClick={getAuthUrl} size="lg" className="w-full">
                <Link className="mr-2 h-4 w-4" />
                Connect with QuickBooks Online
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                You'll be redirected to QuickBooks to authorize access
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Companies</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.details.realms.length}</div>
                <p className="text-xs text-muted-foreground">
                  QuickBooks companies
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MTD Ready</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status.details.uk_compliance.mtd_compliant ? "Yes" : "No"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Making Tax Digital compliance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VAT Registered</CardTitle>
                <PoundSterling className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status.details.uk_compliance.vat_registered ? "Yes" : "No"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {status.details.uk_compliance.vat_number || "No VAT number"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {status.last_sync ? new Date(status.last_sync).toLocaleDateString() : "Never"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {status.last_sync ? new Date(status.last_sync).toLocaleTimeString() : "No sync yet"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="companies" className="space-y-4">
            <TabsList>
              <TabsTrigger value="companies">Connected Companies</TabsTrigger>
              <TabsTrigger value="vat">VAT & MTD</TabsTrigger>
              <TabsTrigger value="sync">Sync History</TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>QuickBooks Companies</CardTitle>
                  <CardDescription>
                    Your connected QuickBooks Online companies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Connected</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {status.details.realms.map((realm) => (
                        <TableRow key={realm.realm_id}>
                          <TableCell className="font-medium">
                            {realm.company_name || "Unknown Company"}
                          </TableCell>
                          <TableCell>
                            {new Date(realm.connected_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(realm.expires_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={realm.is_valid ? "default" : "destructive"}>
                              {realm.is_valid ? "Connected" : "Expired"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => disconnectRealm(realm.realm_id)}
                            >
                              Disconnect
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>UK VAT & MTD Compliance</CardTitle>
                  <CardDescription>
                    Making Tax Digital compliance status and VAT information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">VAT Registration</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">VAT Number</p>
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
                          <p className="text-sm font-medium">Tax Year End</p>
                          <p className="text-sm text-muted-foreground">
                            {status.details.uk_compliance.tax_year_end || "Not set"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">MTD Status</p>
                          <Badge variant={status.details.uk_compliance.mtd_compliant ? "default" : "secondary"}>
                            {status.details.uk_compliance.mtd_compliant ? "Compliant" : "Not Compliant"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Next VAT Return</h3>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>MTD Submission Required</AlertTitle>
                        <AlertDescription>
                          Your next VAT return is due by the end of the quarter. Use the VAT calculator to prepare your submission.
                        </AlertDescription>
                      </Alert>
                      <div className="mt-4 flex space-x-2">
                        <Button>Calculate VAT Return</Button>
                        <Button variant="outline">Submit to HMRC</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sync History</CardTitle>
                  <CardDescription>
                    Recent data synchronization activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Sync</p>
                        <p className="text-sm text-muted-foreground">
                          {status.last_sync ? new Date(status.last_sync).toLocaleString() : "Never synced"}
                        </p>
                      </div>
                      <Button onClick={syncQuickBooks} disabled={syncing}>
                        {syncing ? "Syncing..." : "Sync Now"}
                      </Button>
                    </div>
                    <Progress value={75} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Next automatic sync in 2 hours
                    </p>
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