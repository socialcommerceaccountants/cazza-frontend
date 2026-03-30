"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Building,
  Globe,
  Bell,
  Shield,
  Key,
  Database,
  Zap,
  Palette,
  Clock,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Save,
} , Zap from "lucide-react";

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  lastSync?: string;
  status: "active" | "error" | "pending";
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  type: "email" | "push" | "sms";
}

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "Sam",
    email: "sam@cazza.ai",
    company: "Cazza.ai",
    role: "Admin",
    timezone: "Europe/London",
    language: "en",
    bio: "Business owner focused on AI automation and efficiency.",
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: "email-tasks", label: "Task assignments", description: "When you're assigned a new task", enabled: true, type: "email" },
    { id: "email-updates", label: "Project updates", description: "Important project changes", enabled: true, type: "email" },
    { id: "push-messages", label: "New messages", description: "When you receive a direct message", enabled: true, type: "push" },
    { id: "email-reports", label: "Weekly reports", description: "Automated weekly performance reports", enabled: true, type: "email" },
    { id: "push-reminders", label: "Task reminders", description: "Upcoming task deadlines", enabled: false, type: "push" },
    { id: "sms-alerts", label: "Critical alerts", description: "System outages or security issues", enabled: false, type: "sms" },
  ]);

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: "xero", name: "Xero", icon: <Database className="h-5 w-5" />, description: "Accounting & finance", connected: true, lastSync: "10 min ago", status: "active" },
    { id: "stripe", name: "Stripe", icon: <Zap className="h-5 w-5" />, description: "Payment processing", connected: true, lastSync: "1 hour ago", status: "active" },
    { id: "google", name: "Google Workspace", icon: <Globe className="h-5 w-5" />, description: "Email & calendar", connected: true, lastSync: "5 min ago", status: "active" },
    { id: "slack", name: "Slack", icon: <Bell className="h-5 w-5" />, description: "Team communication", connected: false, status: "pending" },
    { id: "shopify", name: "Shopify", icon: <Building className="h-5 w-5" />, description: "E-commerce", connected: false, status: "pending" },
    { id: "hubspot", name: "HubSpot", icon: <User className="h-5 w-5" />, description: "CRM & marketing", connected: true, lastSync: "2 hours ago", status: "error" },
  ]);

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: "system",
    density: "comfortable",
    fontSize: "medium",
    reduceMotion: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Active</Badge>;
      case "error":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Error</Badge>;
      case "pending":
        return <Badge variant="outline" className="gap-1">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account, preferences, and integrations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Settings saved</span>
            </div>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="text-lg">SA</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        className="pl-10"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        className="pl-10"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value || "" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles (PST)</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value || "" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Control your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-semibold">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all your data in JSON format
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-semibold">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage your third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {integrations.map(integration => (
                <div
                  key={integration.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      {integration.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{integration.name}</h3>
                        {getStatusBadge(integration.status)}
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
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                        <Button
                          variant={integration.status === "error" ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleIntegration(integration.id)}
                        >
                          {integration.status === "error" ? "Reconnect" : "Disconnect"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => toggleIntegration(integration.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys and webhooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-semibold">API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    Use this key to authenticate API requests
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                    sk_live_•••••••••••••••••••••••••••••••
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-semibold">Webhook URL</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time updates from Cazza.ai
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                    https://api.cazza.ai/webhooks/your-unique-id
                  </code>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Display</CardTitle>
              <CardDescription>
                Customize how Cazza.ai looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light", description: "Clean, bright interface" },
                    { id: "dark", label: "Dark", description: "Easy on the eyes" },
                    { id: "system", label: "System", description: "Follows device settings" },
                  ].map(themeOption => (
                    <div
                      key={themeOption.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        appearance.theme === themeOption.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setAppearance({ ...appearance, theme: themeOption.id })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                          {appearance.theme === themeOption.id && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{themeOption.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {themeOption.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Interface Density</Label>
                  <Select
                    value={appearance.density}
                    onValueChange={(value) => setAppearance({ ...appearance, density: value || "" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={appearance.fontSize}
                    onValueChange={(value) => setAppearance({ ...appearance, fontSize: value || "" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <Label htmlFor="reduceMotion" className="font-medium cursor-pointer">
                    Reduce Motion
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduceMotion"
                  checked={appearance.reduceMotion}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, reduceMotion: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      3 devices currently signed in
                    </p>
                  </div>
                  <Button variant="outline">
                    View All
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Security Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-alerts" className="cursor-pointer">
                      New device login alerts
                    </Label>
                    <Switch id="login-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-alerts" className="cursor-pointer">
                      Password change alerts
                    </Label>
                    <Switch id="password-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="suspicious-alerts" className="cursor-pointer">
                      Suspicious activity alerts
                    </Label>
                    <Switch id="suspicious-alerts" defaultChecked />
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