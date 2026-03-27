import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Zap,
  Globe,
  Mail,
  Bell,
  Shield,
  BellRing,
  User,
  CreditCard,
  Key,
  Link,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const integrations = [
  {
    name: "Xero",
    icon: Database,
    description: "Accounting and financial data",
    connected: true,
    lastSync: "10 minutes ago",
  },
  {
    name: "Stripe",
    icon: Zap,
    description: "Payment processing",
    connected: false,
  },
  {
    name: "Google Workspace",
    icon: Globe,
    description: "Email and calendar",
    connected: true,
    lastSync: "1 hour ago",
  },
  {
    name: "Email",
    icon: Mail,
    description: "Business email accounts",
    connected: true,
    lastSync: "5 minutes ago",
  },
  {
    name: "Slack",
    icon: Bell,
    description: "Team communication",
    connected: false,
  },
];

const notificationSettings = [
  { label: "Email notifications", enabled: true },
  { label: "Push notifications", enabled: true },
  { label: "SMS alerts", enabled: false },
  { label: "Weekly reports", enabled: true },
  { label: "Monthly summaries", enabled: true },
];

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, integrations, and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect your business tools to Cazza.ai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <integration.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{integration.name}</h3>
                        {integration.connected ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Connected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      {integration.lastSync && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {integration.lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {integration.name === "Xero" && integration.connected ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Link className="h-4 w-4 mr-2" />
                          Reconnect
                        </Button>
                        <Button variant="destructive" size="sm">
                          Disconnect
                        </Button>
                      </>
                    ) : integration.connected ? (
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Link className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Xero Connection Details */}
          <Card>
            <CardHeader>
              <CardTitle>Xero Connection</CardTitle>
              <CardDescription>
                Manage your Xero accounting integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Connection Status</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">Connected</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last sync completed successfully
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-muted-foreground" />
                    <span>Every 15 minutes</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Connected Data</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-sm text-muted-foreground">Invoices</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-2xl font-bold">£42,850</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-sm text-muted-foreground">Contacts</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-2xl font-bold">7</p>
                    <p className="text-sm text-muted-foreground">Bank Accounts</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button>
                  <Database className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Transactions
                </Button>
                <Button variant="destructive">Disconnect Xero</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your profile settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Sam" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sam@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Cazza.ai" />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <Label htmlFor={setting.label} className="cursor-pointer">
                    {setting.label}
                  </Label>
                  <Switch id={setting.label} defaultChecked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}