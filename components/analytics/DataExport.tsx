"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Database,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Settings,
  Eye,
  EyeOff,
  Share2,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

interface ExportJob {
  id: string;
  name: string;
  format: 'csv' | 'excel' | 'pdf' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileSize?: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: string;
  includes: string[];
  schedule?: string;
  lastRun?: string;
}

interface DataExportProps {
  onExport?: (config: ExportConfig) => void;
  onSchedule?: (schedule: ScheduleConfig) => void;
}

interface ExportConfig {
  format: string;
  dataTypes: string[];
  dateRange: { start: string; end: string };
  filters: Record<string, any>;
  includeMetadata: boolean;
  compression: boolean;
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: string;
  dataTypes: string[];
}

const generateExportJobs = (): ExportJob[] => [
  {
    id: '1',
    name: 'Revenue Report Q1 2024',
    format: 'excel',
    status: 'completed',
    progress: 100,
    fileSize: 2457600,
    createdAt: '2024-03-25 09:30:00',
    completedAt: '2024-03-25 09:32:15',
    downloadUrl: '#',
  },
  {
    id: '2',
    name: 'User Analytics',
    format: 'csv',
    status: 'processing',
    progress: 65,
    fileSize: 0,
    createdAt: '2024-03-27 14:15:00',
  },
  {
    id: '3',
    name: 'Executive Dashboard',
    format: 'pdf',
    status: 'pending',
    progress: 0,
    fileSize: 0,
    createdAt: '2024-03-27 14:20:00',
  },
  {
    id: '4',
    name: 'Full Database Backup',
    format: 'json',
    status: 'failed',
    progress: 42,
    fileSize: 0,
    createdAt: '2024-03-26 23:00:00',
  },
];

const exportTemplates: ExportTemplate[] = [
  {
    id: '1',
    name: 'Daily Sales Report',
    description: 'Daily revenue and transaction summary',
    format: 'excel',
    includes: ['revenue', 'transactions', 'products'],
    schedule: 'daily 08:00',
    lastRun: '2024-03-27 08:00:00',
  },
  {
    id: '2',
    name: 'Weekly User Analytics',
    description: 'Weekly user engagement and retention',
    format: 'csv',
    includes: ['users', 'sessions', 'engagement'],
    schedule: 'weekly monday 09:00',
    lastRun: '2024-03-25 09:00:00',
  },
  {
    id: '3',
    name: 'Monthly Financials',
    description: 'Complete financial statements',
    format: 'pdf',
    includes: ['revenue', 'expenses', 'profit', 'balance'],
    schedule: 'monthly 1st 10:00',
    lastRun: '2024-03-01 10:00:00',
  },
  {
    id: '4',
    name: 'Quarterly Executive Report',
    description: 'Executive dashboard with insights',
    format: 'pdf',
    includes: ['kpis', 'metrics', 'forecasts', 'risks'],
    schedule: 'quarterly 15th 14:00',
    lastRun: '2024-01-15 14:00:00',
  },
];

const dataTypes = [
  { id: 'revenue', name: 'Revenue Data', description: 'Sales and revenue transactions' },
  { id: 'users', name: 'User Data', description: 'User profiles and activity' },
  { id: 'transactions', name: 'Transactions', description: 'Purchase and payment records' },
  { id: 'products', name: 'Product Data', description: 'Product catalog and inventory' },
  { id: 'analytics', name: 'Analytics', description: 'Usage and engagement metrics' },
  { id: 'financials', name: 'Financials', description: 'Financial statements and reports' },
  { id: 'kpis', name: 'KPIs', description: 'Key performance indicators' },
  { id: 'forecasts', name: 'Forecasts', description: 'Predictive analytics and forecasts' },
];

const exportFormats = [
  { id: 'csv', name: 'CSV', icon: FileText, description: 'Comma-separated values', color: 'text-blue-500' },
  { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format', color: 'text-green-500' },
  { id: 'pdf', name: 'PDF', icon: FileText, description: 'Portable Document Format', color: 'text-red-500' },
  { id: 'json', name: 'JSON', icon: Database, description: 'JavaScript Object Notation', color: 'text-yellow-500' },
  { id: 'png', name: 'PNG', icon: FileImage, description: 'Image export for charts', color: 'text-purple-500' },
];

export default function DataExport({ onExport, onSchedule }: DataExportProps) {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(generateExportJobs());
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['revenue', 'users']);
  const [exportFormat, setExportFormat] = useState<string>('excel');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-03-31' });
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [compression, setCompression] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [scheduleFrequency, setScheduleFrequency] = useState<string>('weekly');
  const [scheduleTime, setScheduleTime] = useState<string>('09:00');
  const [recipients, setRecipients] = useState<string>('admin@example.com, team@example.com');
  
  const handleDataTypeToggle = (dataTypeId: string) => {
    setSelectedDataTypes(prev =>
      prev.includes(dataTypeId)
        ? prev.filter(id => id !== dataTypeId)
        : [...prev, dataTypeId]
    );
  };
  
  const handleExport = () => {
    if (selectedDataTypes.length === 0) {
      alert('Please select at least one data type to export');
      return;
    }
    
    setIsExporting(true);
    setExportProgress(0);
    
    const config: ExportConfig = {
      format: exportFormat,
      dataTypes: selectedDataTypes,
      dateRange,
      filters: {},
      includeMetadata,
      compression,
    };
    
    onExport?.(config);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          // Add to export jobs
          const newJob: ExportJob = {
            id: `job-${Date.now()}`,
            name: `Export ${new Date().toLocaleDateString()}`,
            format: exportFormat as any,
            status: 'completed',
            progress: 100,
            fileSize: Math.floor(Math.random() * 5000000) + 1000000,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            downloadUrl: '#',
          };
          
          setExportJobs([newJob, ...exportJobs]);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const handleScheduleExport = () => {
    const schedule: ScheduleConfig = {
      frequency: scheduleFrequency as any,
      time: scheduleTime,
      recipients: recipients.split(',').map(email => email.trim()),
      format: exportFormat,
      dataTypes: selectedDataTypes,
    };
    
    onSchedule?.(schedule);
    
    alert(`Export scheduled for ${scheduleFrequency} at ${scheduleTime}`);
  };
  
  const handleDownload = (job: ExportJob) => {
    if (job.status === 'completed' && job.downloadUrl) {
      // In a real app, this would trigger the download
      alert(`Downloading ${job.name} (${formatFileSize(job.fileSize || 0)})`);
    }
  };
  
  const handleRetry = (jobId: string) => {
    setExportJobs(jobs =>
      jobs.map(job =>
        job.id === jobId
          ? { ...job, status: 'processing', progress: 0 }
          : job
      )
    );
    
    // Simulate retry
    setTimeout(() => {
      setExportJobs(jobs =>
        jobs.map(job =>
          job.id === jobId
            ? { ...job, status: 'completed', progress: 100 }
            : job
        )
      );
    }, 3000);
  };
  
  const handleCancel = (jobId: string) => {
    setExportJobs(jobs =>
      jobs.map(job =>
        job.id === jobId
          ? { ...job, status: 'failed', progress: 0 }
          : job
      )
    );
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getFormatIcon = (format: string) => {
    const formatInfo = exportFormats.find(f => f.id === format);
    return formatInfo ? <formatInfo.icon className={`h-4 w-4 ${formatInfo.color}`} /> : null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
          <p className="text-muted-foreground">
            Export analytics data in multiple formats with scheduling
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="export">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Reports</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Export Configuration</CardTitle>
                <CardDescription>Select data types and configure export settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Type Selection */}
                <div>
                  <h3 className="font-medium mb-3">Select Data Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataTypes.map((dataType) => (
                      <div
                        key={dataType.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedDataTypes.includes(dataType.id)
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleDataTypeToggle(dataType.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedDataTypes.includes(dataType.id)}
                                onCheckedChange={() => handleDataTypeToggle(dataType.id)}
                              />
                              <span className="font-medium">{dataType.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {dataType.description}
                            </p>
                          </div>
                          <Badge variant="outline">
                            ~{Math.floor(Math.random() * 5000) + 1000} records
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Date Range */}
                <div>
                  <h3 className="font-medium mb-3">Date Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Export Options */}
                <div>
                  <h3 className="font-medium mb-3">Export Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="metadata">Include Metadata</Label>
                        <p className="text-sm text-muted-foreground">
                          Export date, filters, and configuration
                        </p>
                      </div>
                      <Switch
                        id="metadata"
                        checked={includeMetadata}
                        onCheckedChange={setIncludeMetadata}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compression">Enable Compression</Label>
                        <p className="text-sm text-muted-foreground">
                          Compress files to reduce size
                        </p>
                      </div>
                      <Switch
                        id="compression"
                        checked={compression}
                        onCheckedChange={setCompression}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
                <CardDescription>Configure format and start export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format Selection */}
                <div>
                  <h3 className="font-medium mb-3">Export Format</h3>
                  <div className="space-y-3">
                    {exportFormats.map((format) => (
                      <div
                        key={format.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          exportFormat === format.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setExportFormat(format.id)}
                      >
                        <div className="flex items-center gap-3">
                          <format.icon className={`h-5 w-5 ${format.color}`} />
                          <div>
                            <p className="font-medium">{format.name}</p>
                            <p className="text-sm text-muted-foreground">{format.description}</p>
                          </div>
                          {exportFormat === format.id && (
                            <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Export Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Export Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Selected Data Types</span>
                      <span className="font-medium">{selectedDataTypes.length} of {dataTypes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Date Range</span>
                      <span className="font-medium">{dateRange.start} to {dateRange.end}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Size</span>
                      <span className="font-medium">
                        {formatFileSize(selectedDataTypes.length * 500000 + 1000000)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Format</span>
                      <span className="font-medium flex items-center gap-2">
                        {getFormatIcon(exportFormat)}
                        {exportFormat.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Export Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleExport}
                  disabled={isExporting || selectedDataTypes.length === 0}
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting... ({exportProgress}%)
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
                
                {isExporting && (
                  <div className="space-y-2">
                    <Progress value={exportProgress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Preparing export...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Configuration</CardTitle>
                <CardDescription>Configure automatic report delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recipients">Recipients</Label>
                    <Textarea
                      id="recipients"
                      placeholder="Enter email addresses separated by commas"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Reports will be sent to these email addresses
                    </p>
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleScheduleExport}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Export
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Templates</CardTitle>
                <CardDescription>Pre-configured report schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportTemplates.map((template) => (
                    <Card key={template.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Schedule:</span>
                            <span className="font-medium">{template.schedule}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Run:</span>
                            <span className="font-medium">{template.lastRun}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Includes:</span>
                            <span className="font-medium">{template.includes.length} data types</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-3 w-3 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Recent and scheduled exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(job.status)}
                          <h4 className="font-medium">{job.name}</h4>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getFormatIcon(job.format)}
                            {job.format.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(job.createdAt)}
                          {job.completedAt && ` • Completed: ${formatDate(job.completedAt)}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {job.status === 'completed' && job.fileSize && (
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(job.fileSize)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {job.status === 'processing' && (
                      <div className="space-y-2 mb-3">
                        <Progress value={job.progress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          Exporting... {job.progress}%
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          job.status === 'completed' ? 'default' :
                          job.status === 'processing' ? 'secondary' :
                          job.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {job.status}
                        </Badge>
                        
                        {job.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(job.id)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        )}
                        
                        {job.status === 'processing' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(job.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                      
                      {job.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(job)}
                        >
                          <Download className="h-3 w-3 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
