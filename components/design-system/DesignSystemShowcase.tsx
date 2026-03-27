"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Plus,
  User,
  Mail,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Upload,
  Settings,
  Trash2,
  Edit,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export function DesignSystemShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cazza.ai Design System</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive design system for building consistent, accessible, and responsive interfaces
        </p>
      </div>

      <Tabs defaultValue="buttons" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
        </TabsList>

        {/* Buttons */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Primary, secondary, outline, ghost, and destructive buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Large</Button>
                <Button>Default</Button>
                <Button size="sm">Small</Button>
                <Button size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  With Icon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Groups</CardTitle>
              <CardDescription>
                Groups of related buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center rounded-lg border w-fit overflow-hidden">
                <Button variant="ghost" className="rounded-none border-r">Edit</Button>
                <Button variant="ghost" className="rounded-none border-r">Copy</Button>
                <Button variant="ghost" className="rounded-none">Delete</Button>
              </div>
              
              <div className="flex items-center gap-1 rounded-lg border p-1 w-fit">
                <Button size="sm" variant="ghost" className="rounded-md">Day</Button>
                <Button size="sm" className="rounded-md">Week</Button>
                <Button size="sm" variant="ghost" className="rounded-md">Month</Button>
                <Button size="sm" variant="ghost" className="rounded-md">Year</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>
                Inputs, selects, checkboxes, and radio buttons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Text Input</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email with Icon</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="email@example.com" className="pl-10" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password Input</Label>
                    <div className="relative">
                      <Input id="password" type="password" placeholder="••••••••" className="pr-10" />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textarea">Textarea</Label>
                    <Textarea id="textarea" placeholder="Enter your message" rows={3} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Dropdown</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Checkboxes</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="cursor-pointer">
                        Accept terms and conditions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" />
                      <Label htmlFor="newsletter" className="cursor-pointer">
                        Subscribe to newsletter
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Radio Group</Label>
                    <RadioGroup defaultValue="option1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option1" id="option1" />
                        <Label htmlFor="option1" className="cursor-pointer">Option 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option2" id="option2" />
                        <Label htmlFor="option2" className="cursor-pointer">Option 2</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option3" id="option3" />
                        <Label htmlFor="option3" className="cursor-pointer">Option 3</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch" className="cursor-pointer">
                      Toggle Switch
                    </Label>
                    <Switch id="switch" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards */}
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>
                  A simple card with title and description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here. This can include text, images, or other components.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Card with Actions</CardTitle>
                <CardDescription>
                  Includes interactive elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has action buttons in the footer.</p>
              </CardContent>
              <div className="flex items-center justify-between p-6 pt-0">
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </div>
            </Card>
            
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">Highlighted Card</CardTitle>
                <CardDescription>
                  For important information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses primary colors to draw attention to important content.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Badges</CardTitle>
              <CardDescription>
                Status indicators and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This is an informational alert.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is a destructive alert for errors.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Success
                </Badge>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Warning
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label>Progress Bar</Label>
                <Progress value={65} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>65% complete</span>
                  <span>13/20 tasks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Elements</CardTitle>
              <CardDescription>
                Menus, tabs, and breadcrumbs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Tabs</Label>
                <Tabs defaultValue="tab1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="p-4 border rounded-b-lg">
                    Content for tab 1
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-4">
                <Label>Breadcrumbs</Label>
                <nav className="flex items-center text-sm">
                  <ol className="flex items-center gap-2">
                    <li className="flex items-center gap-2">
                      <a href="#" className="text-muted-foreground hover:text-foreground">
                        Home
                      </a>
                      <ChevronDown className="h-4 w-4 text-muted-foreground rotate-270" />
                    </li>
                    <li className="flex items-center gap-2">
                      <a href="#" className="text-muted-foreground hover:text-foreground">
                        Settings
                      </a>
                      <ChevronDown className="h-4 w-4 text-muted-foreground rotate-270" />
                    </li>
                    <li>
                      <span className="text-foreground font-medium">Profile</span>
                    </li>
                  </ol>
                </nav>
              </div>
              
              <div className="space-y-4">
                <Label>Avatar</Label>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">SA</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Display */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Display Components</CardTitle>
              <CardDescription>
                Tables, lists, and data visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Separator</Label>
                <div className="space-y-4">
                  <p>Content above the separator</p>
                  <Separator />
                  <p>Content below the separator</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Data Grid Example</Label>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                    <div>Name</div>
                    <div>Status</div>
                    <div>Role</div>
                    <div>Actions</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 text-sm border-t">
                    <div className="font-medium">John Doe</div>
                    <div><Badge variant="default">Active</Badge></div>
                    <div>Admin</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 p-3 text-sm border-t">
                    <div className="font-medium">Jane Smith</div>
                    <div><Badge variant="outline">Inactive</Badge></div>
                    <div>User</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Responsive Design Section */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Design Guidelines</CardTitle>
          <CardDescription>
            Breakpoints and responsive patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">SM</span>
              </div>
              <h4 className="font-semibold">Small (sm)</h4>
              <p className="text-sm text-muted-foreground">
                &lt; 640px - Mobile devices
              </p>
              <ul className="text-sm space-y-1">
                <li>• Single column layouts</li>
                <li>• Stacked navigation</li>
                <li>• Touch-friendly targets</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">MD</span>
              </div>
              <h4 className="font-semibold">Medium (md)</h4>
              <p className="text-sm text-muted-foreground">
                640px - 768px - Tablets
              </p>
              <ul className="text-sm space-y-1">
                <li>• Two column grids</li>
                <li>• Sidebar navigation</li>
                <li>• Compact tables</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">LG</span>
              </div>
              <h4 className="font-semibold">Large (lg)</h4>
              <p className="text-sm text-muted-foreground">
                &gt; 768px - Desktops
              </p>
              <ul className="text-sm space-y-1">
                <li>• Multi-column layouts</li>
                <li>• Full navigation visible</li>
                <li>• Detailed data tables</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Accessibility Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Keyboard Navigation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  All interactive elements are keyboard accessible with proper focus states.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Screen Reader Support</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ARIA labels and semantic HTML for screen reader compatibility.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Color Contrast</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  WCAG AA compliant color ratios for text and interactive elements.
                </p>
              </div>
              
              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Reduced Motion</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Respects user preferences for reduced motion in animations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}