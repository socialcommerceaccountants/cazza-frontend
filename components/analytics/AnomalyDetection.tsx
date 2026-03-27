"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  Filter,
  Settings,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Mail,
  MessageSquare,
  Slack,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

interface Anomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved' | 'ignored';
  detectedAt: string;
  resolvedAt?: string;
  description: string;
  affectedSystems?: string[];
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  severity: string;
  enabled: boolean;
  notifications: string[];
  lastTriggered?: string;
}

interface AlertChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms';
  status: 'active' | 'inactive' | 'error';
  lastTested?: string;
}

interface AnomalyDetectionProps {
  onAlert?: (anomaly: Anomaly) => void;
  onRuleChange?: (rule: AlertRule) => void;
}

const generateAnomalies = (): Anomaly[] => [
  {
    id: '1',
    metric: 'Revenue',
    value: 85000,
    expected: 125000,
    deviation: -32,
    severity: 'critical',
    status: 'investigating',
    detectedAt: '2024-03-27 14:30:00',
    description: 'Revenue dropped significantly below expected range',
    affectedSystems: ['Sales', 'Billing'],
  },
  {
    id: '2',
    metric: 'User Signups',
    value: 245,
    expected: 180,
    deviation: 36,
    severity: 'high',
    status: 'new',
    detectedAt: '2024-03-27 13:15:00',
    description: 'Unusual spike in user registrations',
    affectedSystems: ['Authentication', 'Database'],
  },
  {
    id: '3',
    metric: 'API Response Time',
    value: 850,
    expected: 200,
    deviation: 325,
    severity: 'high',
    status: 'resolved',
    detectedAt: '2024-03-27 10:45:00',
    resolvedAt: '2024-03-27 11:30:00',
    description: 'API latency increased significantly',
    affectedSystems: ['API Gateway', 'Backend Services'],
  },
  {
    id: '4',
    metric: 'Error Rate',
    value: 8.5,
    expected: 2.0,
    deviation: 325,
    severity: 'medium',
    status: 'new',
    detectedAt: '2024-03-27 09:20:00',
    description: 'Increased error rate in payment processing',
    affectedSystems: ['Payment Gateway', 'Transaction Service'],
  },
  {
    id: '5',
    metric: 'Server Load',
    value: 92,
    expected: 65,
    deviation: 41,
    severity: 'critical',
    status: 'investigating',
    detectedAt: '2024-03-26 23:45:00',
    description: 'Server CPU usage above critical threshold',
    affectedSystems: ['Production Servers', 'Database Cluster'],
  },
];

const alertRules: AlertRule[] = [
  {
    id: '1',
    name: 'Revenue Drop Alert',
    metric: 'revenue',
    condition: 'below',
    threshold: 90,
    severity: 'critical',
    enabled: true,
    notifications: ['email', 'slack'],
    lastTriggered: '2024-03-27 14:30:00',
  },
  {
    id: '2',
    name: 'High Error Rate',
    metric: 'error_rate',
    condition: 'above',
    threshold: 5,
    severity: 'high',
    enabled: true,
    notifications: ['email', 'slack'],
    lastTriggered: '2024-03-27 09:20:00',
  },
  {
    id: '3',
    name: 'Server Load Critical',
    metric: 'server_load',
    condition: 'above',
    threshold: 85,
    severity: 'critical',
    enabled: true,
    notifications: ['email', 'slack', 'sms'],
    lastTriggered: '2024-03-26 23:45:00',
  },
  {
    id: '4',
    name: 'User Growth Spike',
    metric: 'user_signups',
    condition: 'above',
    threshold: 30,
    severity: 'medium',
    enabled: true,
    notifications: ['email'],
    lastTriggered: '2024-03-27 13:15:00',
  },
  {
    id: '5',
    name: 'API Latency Alert',
    metric: 'api_latency',
    condition: 'above',
    threshold: 500,
    severity: 'high',
    enabled: false,
    notifications: ['email'],
  },
];

const alertChannels: AlertChannel[] = [
  {
    id: '1',
    name: 'Email Notifications',
    type: 'email',
    status: 'active',
    lastTested: '2024-03-27 10:00:00',
  },
  {
    id: '2',
    name: 'Slack #alerts',
    type: 'slack',
    status: 'active',
    lastTested: '2024-03-27 10:00:00',
  },
  {
    id: '3',
    name: 'Webhook Integration',
    type: 'webhook',
    status: 'inactive',
    lastTested: '2024-03-26 15:30:00',
  },
  {
    id: '4',
    name: 'SMS Alerts',
    type: 'sms',
    status: 'error',
    lastTested: '2024-03-27 09:45:00',
  },
];

const metrics = [
  { id: 'revenue', name: 'Revenue', unit: '$' },
  { id: 'user_signups', name: 'User Signups', unit: '' },
  { id: 'api_latency', name: 'API Latency', unit: 'ms' },
  { id: 'error_rate', name: 'Error Rate', unit: '%' },
  { id: 'server_load', name: 'Server Load', unit: '%' },
  { id: 'conversion_rate', name: 'Conversion Rate', unit: '%' },
  { id: 'active_users', name: 'Active Users', unit: '' },
  { id: 'transaction_volume', name: 'Transaction Volume', unit: '' },
];

export default function AnomalyDetection({ onAlert, onRuleChange }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(generateAnomalies());
  const [rules, setRules] = useState<AlertRule[]>(alertRules);
  const [channels, setChannels] = useState<AlertChannel[]>(alertChannels);
  const [activeTab, setActiveTab] = useState<string>("anomalies");
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    name: '',
    metric: 'revenue',
    condition: 'above',
    threshold: 0,
    severity: 'medium',
    enabled: true,
    notifications: ['email'],
  });
  
  const newAnomalies = anomalies.filter(a => a.status === 'new').length;
  const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length;
  const resolvedAnomalies = anomalies.filter(a => a.status === 'resolved').length;
  const activeRules = rules.filter(r => r.enabled).length;
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ignored': return <EyeOff className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };
  
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'slack': return <Slack className="h-4 w-4" />;
      case 'webhook': return <Zap className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };
  
  const getChannelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleResolveAnomaly = (id: string) => {
    setAnomalies(anoms =>
      anoms.map(anom =>
        anom.id === id
          ? { ...anom, status: 'resolved', resolvedAt: new Date().toISOString() }
          : anom
      )
    );
  };
  
  const handleIgnoreAnomaly = (id: string) => {
    setAnomalies(anoms =>
      anoms.map(anom =>
        anom.id === id
          ? { ...anom, status: 'ignored' }
          : anom
      )
    );
  };
  
  const handleToggleRule = (id: string) => {
    setRules(rules =>
      rules.map(rule =>
        rule.id === id
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };
  
  const handleAddRule = () => {
    if (!newRule.name || newRule.threshold === undefined) {
      alert('Please fill in all required fields');
      return;
    }
    
    const rule: AlertRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name!,
      metric: newRule.metric!,
      condition: newRule.condition!,
      threshold: newRule.threshold!,
      severity: newRule.severity!,
      enabled: newRule.enabled!,
      notifications: newRule.notifications!,
    };
    
    setRules([...rules, rule]);
    onRuleChange?.(rule);
    
    // Reset form
    setNewRule({
      name: '',
      metric: 'revenue',
      condition: 'above',
      threshold: 0,
      severity: 'medium',
      enabled: true,
      notifications: ['email'],
    });
    
    alert('Alert rule added successfully');
  };
  
  const handleTestChannel = (id: string) => {
    setChannels(channels =>
      channels.map(channel =>
        channel.id === id
          ? { ...channel, status: 'active', lastTested: new Date().toISOString() }
          : channel
      )
    );
    
    alert('Test alert sent successfully');
  };
  
  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    alert(`Anomaly detection ${!isMonitoring ? 'enabled' : 'disabled'}`);
  };
  
  const handleSimulateAnomaly = () => {
    const metrics = ['Revenue', 'User Signups', 'API Response Time', 'Error Rate', 'Server Load'];
    const metric = metrics[Math.floor(Math.random() * metrics.length)];
    const value = Math.floor(Math.random() * 100000) + 50000;
    const expected = value * (0.7 + Math.random() * 0.6);
    const deviation = ((value - expected) / expected) * 100;
    
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const newAnomaly: Anomaly = {
      id: `anom-${Date.now()}`,
      metric,
      value,
      expected,
      deviation: parseFloat(deviation.toFixed(1)),
      severity,
      status: 'new',
      detectedAt: new Date().toISOString(),
      description: `Simulated anomaly detected in ${metric}`,
      affectedSystems: ['Simulation'],
    };
    
    setAnomalies([newAnomaly, ...anomalies]);
    onAlert?.(newAnomaly);
    
    alert(`Simulated ${severity} anomaly detected in ${metric}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anomaly Detection</h1>
          <p className="text-muted-foreground">
            Real-time anomaly detection and alerting system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="monitoring"
              checked={isMonitoring}
              onCheckedChange={handleToggleMonitoring}
            />
            <Label htmlFor="monitoring" className="flex items-center gap-2">
              {isMonitoring ? (
                <>
                  <Bell className="h-4 w-4 text-green-500" />
                  Monitoring Active
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 text-gray-500" />
                  Monitoring Paused
                </>
              )}
            </Label>
          </div>
          
          <Button variant="outline" onClick={handleSimulateAnomaly}>
            <Zap className="h-4 w-4 mr-2" />
            Simulate Anomaly
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Anomalies</p>
                <p className="text-2xl font-bold">{newAnomalies}</p>
              </div>
              <div className="bg-red-100 text-red-600 rounded-full p-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{criticalAnomalies}</p>
              </div>
              <div className="bg-orange-100 text-orange-600 rounded-full p-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{resolvedAnomalies}</p>
              </div>
              <div className="bg-green-100 text-green-600 rounded-full p-2">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{activeRules}</p>
              </div>
              <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                <Settings className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="anomalies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>
                {anomalies.length} anomalies detected • {newAnomalies} require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <Card key={anomaly.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(anomaly.status)}
                            <h4 className="font-medium">{anomaly.metric}</h4>
                            <Badge className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Detected: {formatDate(anomaly.detectedAt)}
                            {anomaly.resolvedAt && ` • Resolved: ${formatDate(anomaly.resolvedAt)}`}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {anomaly.status === 'new' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolveAnomaly(anomaly.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIgnoreAnomaly(anomaly.id)}
                              >
                                <EyeOff className="h-3 w-3 mr-1" />
                                Ignore
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">Actual Value</p>
                            <p className="text-xl font-bold">
                              {anomaly.metric === 'Revenue' ? formatCurrency(anomaly.value) : 
                               anomaly.metric === 'API Response Time' ? `${anomaly.value}ms` :
                               anomaly.metric === 'Error Rate' || anomaly.metric === 'Server Load' ? `${anomaly.value}%` :
                               formatNumber(anomaly.value)}
                            </p>
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">Expected Value</p>
                            <p className="text-xl font-bold">
                              {anomaly.metric === 'Revenue' ? formatCurrency(anomaly.expected) : 
                               anomaly.metric === 'API Response Time' ? `${anomaly.expected}ms` :
                               anomaly.metric === 'Error Rate' || anomaly.metric === 'Server Load' ? `${anomaly.expected}%` :
                               formatNumber(anomaly.expected)}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Description</p>
                          <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                        </div>
                        
                        {anomaly.affectedSystems && anomaly.affectedSystems.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Affected Systems</p>
                            <div className="flex flex-wrap gap-2">
                              {anomaly.affectedSystems.map((system, index) => (
                                <Badge key={index} variant="outline">
                                  {system}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Rules</CardTitle>
                <CardDescription>Configure conditions for anomaly detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <Card key={rule.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{rule.name}</h4>
                              <Badge variant={rule.enabled ? 'default' : 'outline'}>
                                {rule.enabled ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {rule.metric} {rule.condition} {rule.threshold}
                              {rule.lastTriggered && ` • Last triggered: ${formatDate(rule.lastTriggered)}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => handleToggleRule(rule.id)}
                            />
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Severity:</span>
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Notifications:</span>
                            <div className="flex items-center gap-1">
                              {rule.notifications.map((notif, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  {getChannelIcon(notif)}
                                  {notif}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Rule</CardTitle>
                <CardDescription>Create a new alert rule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      placeholder="e.g., Revenue Drop Alert"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="metric">Metric</Label>
                      <Select
                        value={newRule.metric}
                        onValueChange={(value) => setNewRule({ ...newRule, metric: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          {metrics.map((metric) => (
                            <SelectItem key={metric.id} value={metric.id}>
                              {metric.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={newRule.condition}
                        onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above">Above</SelectItem>
                          <SelectItem value="below">Below</SelectItem>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="changes_by">Changes By</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Threshold</Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={newRule.threshold}
                        onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <Select
                        value={newRule.severity}
                        onValueChange={(value) => setNewRule({ ...newRule, severity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {['email', 'slack', 'webhook', 'sms'].map((channel) => (
                        <Badge
                          key={channel}
                          variant={
                            newRule.notifications?.includes(channel) ? 'default' : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            const notifications = newRule.notifications || [];
                            setNewRule({
                              ...newRule,
                              notifications: notifications.includes(channel)
                                ? notifications.filter(n => n !== channel)
                                : [...notifications, channel],
                            });
                          }}
                        >
                          {getChannelIcon(channel)}
                          <span className="ml-1">{channel}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={handleAddRule}>
                    <Bell className="h-4 w-4 mr-2" />
                    Add Alert Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Configure how alerts are delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {channels.map((channel) => (
                  <Card key={channel.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel.type)}
                          <h4 className="font-medium">{channel.name}</h4>
                        </div>
                        <Badge className={getChannelStatusColor(channel.status)}>
                          {channel.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{channel.type}</span>
                        </div>
                        
                        {channel.lastTested && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Tested:</span>
                            <span className="font-medium">{formatDate(channel.lastTested)}</span>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleTestChannel(channel.id)}
                        >
                          <Zap className="h-3 w-3 mr-2" />
                          Test Channel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}