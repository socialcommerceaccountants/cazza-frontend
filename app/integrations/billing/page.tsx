import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, Users, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Billing & Subscriptions | Cazza.ai",
  description: "Manage your billing, subscriptions, and payment methods",
};

export default function BillingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Grow Plan</div>
                <p className="text-xs text-muted-foreground">£79/month</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Users</span>
                    <span className="font-medium">3/3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Transactions</span>
                    <span className="font-medium">2,450/5,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Storage</span>
                    <span className="font-medium">1.2/10 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£79.00</div>
                <p className="text-xs text-muted-foreground">Due on April 15, 2026</p>
                <div className="mt-4">
                  <Button className="w-full">Pay Now</Button>
                  <Button variant="outline" className="w-full mt-2">View Invoice</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Calls</span>
                    <span className="text-sm font-medium">12,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Queries</span>
                    <span className="text-sm font-medium">845</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm font-medium">1.2 GB</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">View Detailed Usage</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">March 2026 Invoice</p>
                    <p className="text-sm text-muted-foreground">Issued: Mar 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£79.00</p>
                    <Badge className="bg-green-50 text-green-700">Paid</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">February 2026 Invoice</p>
                    <p className="text-sm text-muted-foreground">Issued: Feb 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£79.00</p>
                    <Badge className="bg-green-50 text-green-700">Paid</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">January 2026 Invoice</p>
                    <p className="text-sm text-muted-foreground">Issued: Jan 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£79.00</p>
                    <Badge className="bg-green-50 text-green-700">Paid</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Upgrade, downgrade, or cancel your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle>Start</CardTitle>
                      <CardDescription>For small businesses</CardDescription>
                      <div className="text-3xl font-bold">£39<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ 1 user</li>
                        <li>✓ 1,000 transactions/month</li>
                        <li>✓ Basic AI features</li>
                        <li>✓ Email support</li>
                      </ul>
                      <Button className="w-full mt-4" variant="outline">Current Plan</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary">
                    <CardHeader>
                      <CardTitle>Grow</CardTitle>
                      <CardDescription>Most popular</CardDescription>
                      <div className="text-3xl font-bold">£79<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ 3 users</li>
                        <li>✓ 5,000 transactions/month</li>
                        <li>✓ Advanced AI features</li>
                        <li>✓ Priority support</li>
                        <li>✓ Team collaboration</li>
                      </ul>
                      <Button className="w-full mt-4">Current Plan</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Scale</CardTitle>
                      <CardDescription>For growing teams</CardDescription>
                      <div className="text-3xl font-bold">£199<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ 10 users</li>
                        <li>✓ 25,000 transactions/month</li>
                        <li>✓ All AI features</li>
                        <li>✓ 24/7 support</li>
                        <li>✓ Advanced analytics</li>
                        <li>✓ Custom integrations</li>
                      </ul>
                      <Button className="w-full mt-4" variant="outline">Upgrade</Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between items-center border-t pt-6">
                  <div>
                    <p className="font-medium">Need help choosing?</p>
                    <p className="text-sm text-muted-foreground">Contact our sales team for custom plans</p>
                  </div>
                  <Button variant="outline">Contact Sales</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-8 w-8" />
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>Default</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Download past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your invoice history will appear here once you have active subscriptions.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Monitor your platform usage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed usage analytics will be available once you start using the platform.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
