"use client";

import { useState, useRef, DragEvent } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Save,
  Trash2,
  Copy,
  Eye,
  Share2,
  Calendar,
  Mail,
  LayoutGrid,
  BarChart3,
  Table,
  Text,
  Image,
  GripVertical,
  Plus,
  Settings,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ReportWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text' | 'image';
  title: string;
  data?: any;
  size: 'small' | 'medium' | 'large';
  position: number;
  config?: any;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  widgets: ReportWidget[];
  createdAt: string;
  updatedAt: string;
}

interface ReportBuilderProps {
  initialTemplate?: ReportTemplate;
  onSave?: (report: ReportTemplate) => void;
  onExport?: (report: ReportTemplate, format: string) => void;
}

const defaultWidgets: ReportWidget[] = [
  {
    id: '1',
    type: 'metric',
    title: 'Total Revenue',
    size: 'small',
    position: 0,
    data: { value: 125000, change: 12.5, trend: 'up' },
  },
  {
    id: '2',
    type: 'metric',
    title: 'Active Users',
    size: 'small',
    position: 1,
    data: { value: 2480, change: 8.2, trend: 'up' },
  },
  {
    id: '3',
    type: 'metric',
    title: 'Conversion Rate',
    size: 'small',
    position: 2,
    data: { value: 3.2, change: -0.5, trend: 'down' },
  },
  {
    id: '4',
    type: 'chart',
    title: 'Revenue Trend',
    size: 'medium',
    position: 3,
    config: { type: 'line', timeRange: '30d' },
  },
  {
    id: '5',
    type: 'table',
    title: 'Top Performers',
    size: 'medium',
    position: 4,
    data: [
      { name: 'Product A', revenue: 45000, growth: 15 },
      { name: 'Product B', revenue: 38000, growth: 22 },
      { name: 'Product C', revenue: 29500, growth: 8 },
    ],
  },
  {
    id: '6',
    type: 'chart',
    title: 'Platform Distribution',
    size: 'large',
    position: 5,
    config: { type: 'pie', categories: ['Web', 'Mobile', 'Tablet'] },
  },
];

const widgetLibrary = [
  { type: 'metric', name: 'Metric Card', icon: BarChart3, description: 'Single metric with trend' },
  { type: 'chart', name: 'Line Chart', icon: BarChart3, description: 'Time series line chart' },
  { type: 'chart', name: 'Bar Chart', icon: BarChart3, description: 'Comparative bar chart' },
  { type: 'table', name: 'Data Table', icon: Table, description: 'Tabular data display' },
  { type: 'text', name: 'Text Block', icon: Text, description: 'Rich text content' },
  { type: 'image', name: 'Image', icon: Image, description: 'Image or logo' },
];

function SortableWidget({ widget, onEdit, onDelete }: { 
  widget: ReportWidget; 
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{widget.title}</h3>
              <Badge variant={widget.data.trend === 'up' ? 'default' : 'destructive'}>
                {widget.data.trend === 'up' ? '+' : ''}{widget.data.change}%
              </Badge>
            </div>
            <div className="text-3xl font-bold">
              {typeof widget.data.value === 'number' 
                ? (widget.data.value >= 1000 
                  ? formatCurrency(widget.data.value)
                  : widget.data.value.toFixed(1) + '%')
                : widget.data.value}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {widget.data.trend === 'up' ? 'Increased' : 'Decreased'} from previous period
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="p-4">
            <h3 className="font-medium mb-4">{widget.title}</h3>
            <div className="h-48 bg-muted rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{widget.config?.type || 'Chart'} Preview</p>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="p-4">
            <h3 className="font-medium mb-4">{widget.title}</h3>
            <div className="space-y-2">
              {widget.data?.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-bold">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="p-4">
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <p className="text-sm text-muted-foreground">
              This is a sample text block. You can edit this content to add insights, summaries, or commentary to your report.
            </p>
          </div>
        );

      case 'image':
        return (
          <div className="p-4">
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <div className="h-32 bg-muted rounded flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Image placeholder</span>
            </div>
          </div>
        );

      default:
        return <div>Unknown widget type</div>;
    }
  };

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-2',
    large: 'col-span-3',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${sizeClasses[widget.size]} relative group`}
    >
      <Card className="h-full">
        <div className="absolute top-2 left-2 cursor-move" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onEdit(widget.id)}
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onDelete(widget.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {renderWidgetContent()}
      </Card>
    </div>
  );
}

export default function ReportBuilder({ 
  initialTemplate,
  onSave,
  onExport 
}: ReportBuilderProps) {
  const [reportName, setReportName] = useState<string>("My Custom Report");
  const [reportDescription, setReportDescription] = useState<string>("A custom analytics report created with the drag-and-drop builder");
  const [widgets, setWidgets] = useState<ReportWidget[]>(initialTemplate?.widgets || defaultWidgets);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedTemplates, setSavedTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Executive Summary',
      description: 'High-level overview for executives',
      widgets: defaultWidgets.slice(0, 4),
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
    },
    {
      id: '2',
      name: 'Marketing Performance',
      description: 'Campaign and channel analysis',
      widgets: defaultWidgets.slice(2, 6),
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
    },
  ]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveWidget(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWidget(null);

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWidget = (type: string) => {
    const newWidget: ReportWidget = {
      id: `widget-${Date.now()}`,
      type: type as ReportWidget['type'],
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      size: 'medium',
      position: widgets.length,
      data: type === 'metric' ? { value: 0, change: 0, trend: 'neutral' } : undefined,
      config: type === 'chart' ? { type: 'line' } : undefined,
    };
    
    setWidgets([...widgets, newWidget]);
  };

  const handleDeleteWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const handleEditWidget = (id: string) => {
    setIsEditing(true);
    // In a real implementation, this would open a modal or sidebar
    console.log('Edit widget:', id);
  };

  const handleSaveReport = () => {
    const newTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      widgets: widgets.map((w, i) => ({ ...w, position: i })),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    setSavedTemplates([...savedTemplates, newTemplate]);
    onSave?.(newTemplate);
    
    // Show success message
    alert('Report saved successfully!');
  };

  const handleExportReport = (format: string) => {
    const report: ReportTemplate = {
      id: 'current',
      name: reportName,
      description: reportDescription,
      widgets,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    onExport?.(report, format);
    
    // Simulate export
    switch (format) {
      case 'pdf':
        alert('PDF export would be generated server-side');
        break;
      case 'excel':
        alert('Excel export would include all widget data');
        break;
      case 'csv':
        alert('CSV export would include tabular data');
        break;
    }
  };

  const handleLoadTemplate = (template: ReportTemplate) => {
    setReportName(template.name);
    setReportDescription(template.description);
    setWidgets(template.widgets);
  };

  const handleScheduleReport = () => {
    alert('Schedule report dialog would open here');
  };

  const handleShareReport = () => {
    alert('Share report dialog would open here');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Drag and drop widgets to create custom analytics reports
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleScheduleReport}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" onClick={handleShareReport}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleSaveReport}>
                <Save className="h-4 w-4 mr-2" />
                Save Report
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Report Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Input
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Enter report description"
                />
              </div>
            </div>

            {/* Widget Library */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Widget Library</h3>
                <Badge variant="outline">{widgetLibrary.length} widgets available</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {widgetLibrary.map((widget) => (
                  <div
                    key={widget.type}
                    className="border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleAddWidget(widget.type)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', widget.type);
                    }}
                  >
                    <widget.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{widget.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{widget.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Canvas */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Report Canvas</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{widgets.length} widgets</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="min-h-[600px] border-2 border-dashed border-muted rounded-lg p-4">
                  {widgets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Drag widgets here to build your report</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Or click on widgets in the library above to add them
                      </p>
                    </div>
                  ) : (
                    <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-3 gap-4">
                        {widgets.map((widget) => (
                          <SortableWidget
                            key={widget.id}
                            widget={widget}
                            onEdit={handleEditWidget}
                            onDelete={handleDeleteWidget}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </div>
                
                <DragOverlay>
                  {activeWidget ? (
                    <div className="opacity-50">
                      <Card className="w-64">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm font-medium">Dragging widget</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>

            {/* Saved Templates */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Saved Templates</h3>
                <Badge variant="outline">{savedTemplates.length} templates</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted transition-colors">
                    <CardContent className="p-4" onClick={() => handleLoadTemplate(template)}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="secondary">{template.widgets.length} widgets</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated: {template.updatedAt}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadTemplate(template);
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Export Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                  <CardContent 
                    className="p-4 text-center"
                    onClick={() => handleExportReport('pdf')}
                  >
                    <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">PDF Export</h4>
                    <p className="text-sm text-muted-foreground">High-quality printable report</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                  <CardContent 
                    className="p-4 text-center"
                    onClick={() => handleExportReport('excel')}
                  >
                    <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Table className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">Excel Export</h4>
                    <p className="text-sm text-muted-foreground">Spreadsheet with raw data</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                  <CardContent 
                    className="p-4 text-center"
                    onClick={() => handleExportReport('csv')}
                  >
                    <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">CSV Export</h4>
                    <p className="text-sm text-muted-foreground">Comma-separated values</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                  <CardContent 
                    className="p-4 text-center"
                    onClick={handleScheduleReport}
                  >
                    <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Mail className="h-6 w-6" />
                    </div>
                    <h4 className="font-medium mb-1">Email Delivery</h4>
                    <p className="text-sm text-muted-foreground">Schedule automatic reports</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}