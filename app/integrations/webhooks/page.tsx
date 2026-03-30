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
import { Webhook, Zap, CheckCircle, AlertCircle, RefreshCw, Link, Trash2, Play, Shield } from "lucide-react";

interface WebhookConfig {
  id: number;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  delivery_count: number;
  success_count: number;
  failure_count: number;
  success_rate: number;
  last_delivery_at: string | null;
  created_at: string;
}

interface WebhookStats {
  summary: {
    total_webhooks: number;
    active_webhooks: number;
    total_deliveries: number;
    successful_deliveries: number;
    failed_deliveries: number;
    success_rate: number;
  };
  event_stats: Record<string, { total: number; success: number }>;
}

export default function WebhooksIntegrationPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [webhookName, setWebhookName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>(["order.created", "order.updated"]);
  const [webhookSecret, setWebhookSecret] = useState("");

  useEffect(() => {
    fetchWebhooksData();
  }, []);

  const fetchWebhooksData = async () => {
    try {
      // Fetch webhooks
      const webhooksResponse = await fetch("/api/integrations/webhooks");
      const webhooksData = await webhooksResponse.json();
      if (webhooksData.success) {
        setWebhooks(webhooksData.webhooks);
      }

      // Fetch stats
      const statsResponse = await fetch("/api/integrations/webhooks/stats?days=30");
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch webhooks data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!webhookName || !webhookUrl) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/integrations/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: webhookName,
          url: webhookUrl,
          events: webhookEvents,
          secret: webhookSecret || undefined,
          enabled: true,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Webhook created successfully!");
        setCreateDialogOpen(false);
        resetForm();
        fetchWebhooksData();
      } else {
        alert(`Creation failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Creation failed");
    }
  };

  const testWebhook = async (webhookId: number) => {
    try {
      const response = await fetch(`/api/integrations/webhooks/${webhookId}/test`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(`Webhook test ${data.status === "success" ? "passed" : "failed"}`);
        fetchWebhooksData();
      } else {
        alert(`Test failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert("Test failed");
    }
  };

  const toggleWebhook = async (webhookId: number, enabled: boolean) => {
    try {
      const endpoint = enabled ? "enable" : "disable";
      const response = await fetch(`/api/integrations/webhooks/${webhookId}/${endpoint}`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(`Webhook ${enabled ? "enabled" : "disabled"} successfully`);
        fetchWebhooksData();
      } else {
        alert(`Operation failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Operation failed");
    }
  };

  const resetForm = () => {
    setWebhookName("");
    setWebhookUrl("");
    setWebhookEvents(["order.created", "order.updated"]);
    setWebhookSecret("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading webhooks integration...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeWebhooks = webhooks.filter(webhook => webhook.enabled);
  const inactiveWebhooks = webhooks.filter(webhook => !webhook.enabled);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground">
            Third-party integration webhooks for Zapier, Make.com, and custom apps
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Zap className="mr-2 h-4 w-4" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Configure a webhook endpoint for third-party integrations
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="webhook-name">Webhook Name *</Label>
                <Input
                  id="webhook-name"
                  placeholder="Zapier Order Sync"
                  value={webhookName}
                  onChange={(e) => setWebhookName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhook-url">Endpoint URL *</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your webhook endpoint URL (Zapier, Make.com, custom app)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhook-secret">Secret Key (Optional)</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="Leave blank to auto-generate"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used for signature verification. Auto-generated if left blank.
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Events to Subscribe</Label>
                <div className="space-y-2">
                  {["order.created", "order.updated", "product.created", "product.updated", "customer.created", "customer.updated"].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`event-${event}`}
                        checked={webhookEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWebhookEvents([...webhookEvents, event]);
                          } else {
                            setWebhookEvents(webhookEvents.filter(e => e !== event));
                          }
                        }}
                      />
                      <Label htmlFor={`event-${event}`} className="text-sm font-normal">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createWebhook}>
                Create Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.summary.total_webhooks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.summary.active_webhooks || 0} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.summary.total_deliveries || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.summary.success_rate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.summary.successful_deliveries || 0} successful
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compatibility</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Zapier, Make.com, IFTTT, Custom
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="events">Event Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Webhooks</CardTitle>
              <CardDescription>
                Your configured webhook endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeWebhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">
                        {webhook.name}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {webhook.url}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.slice(0, 2).map((event, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {event.split('.')[0]}
                            </Badge>
                          ))}
                          {webhook.events.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{webhook.events.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={webhook.success_rate} className="w-16 mr-2" />
                          <span className="text-sm">{webhook.success_rate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testWebhook(webhook.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleWebhook(webhook.id, false)}
                          >
                            Disable
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {inactiveWebhooks.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-8 mb-4">Inactive Webhooks</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Disabled</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inactiveWebhooks.map((webhook) => (
                        <TableRow key={webhook.id}>
                          <TableCell className="font-medium">
                            {webhook.name}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {webhook.url}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(webhook.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleWebhook(webhook.id, true)}
                              >
                                Enable
                              </Button>
                            </div>
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

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Statistics</CardTitle>
              <CardDescription>
                Delivery performance and event breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Delivery Performance</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Total Deliveries</p>
                      <p className="text-2xl font-bold">{stats?.summary.total_deliveries || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Successful</p>
                      <p className="text-2xl font-bold text-green-600">{stats?.summary.successful_deliveries || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{stats?.summary.failed_deliveries || 0}</p>
                    </div>
                  </div>
                  <Progress value={stats?.summary.success_rate || 0} className="w-full mt-4" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Event Breakdown</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Total Deliveries</TableHead>
                        <TableHead>Successful</TableHead>
                        <TableHead>Success Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.event_stats && Object.entries(stats.event_stats).map(([event, data]) => (
                        <TableRow key={event}>
                          <TableCell className="font-medium">{event}</TableCell>
                          <TableCell>{data.total}</TableCell>
                          <TableCell>{data.success}</TableCell>
                          <TableCell>
                            {data.total > 0 ? ((data.success / data.total) * 100).toFixed(1) : 0}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Retry Failed Deliveries</h3>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Automatic Retry System</AlertTitle>
                    <AlertDescription>
                      Failed webhook deliveries are automatically retried up to 3 times. You can also manually retry failed deliveries.
                    </AlertDescription>
                  </Alert>
                  <div className="mt-4">
                    <Button>Retry Failed Deliveries</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Webhook Events</CardTitle>
              <CardDescription>
                Manually trigger webhook events for testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Events</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {["order.created", "order.updated", "product.created", "product.updated", "customer.created", "customer.updated"].map((event) => (
                      <Card key={event}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{event}</p>
                              <p className="text-sm text-muted-foreground">
                                Trigger {event.replace('.', ' ')} event
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement event triggering
                                alert(`Would trigger ${event} event`);
                              }}
                            >
                              Trigger
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Custom Event</h3>
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertTitle>Custom Webhook Testing</AlertTitle>
                    <AlertDescription>
                      Create custom test payloads to verify your webhook endpoints.
                    </AlertDescription>
                  </Alert>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="custom-event">Event Type</Label>
                    <Input id="custom-event" placeholder="custom.event" />
                    <Label htmlFor="custom-payload">Payload (JSON)</Label>
                    <textarea
                      id="custom-payload"
                      className="w-full min-h-32 p-2 border rounded-md"
                      placeholder='{"test": true, "message": "Hello World"}'
                    />
                    <Button className="mt-2">Trigger Custom Event</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}