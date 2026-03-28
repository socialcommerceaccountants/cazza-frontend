"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  CheckCircle, 
  Clock, 
  Zap, 
  Target, 
  Users, 
  BookOpen, 
  Video, 
  ArrowRight,
  Sparkles,
  BarChart,
  Bot,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickStartGuideProps {
  onClose: () => void;
}

const learningPaths = [
  {
    id: "business-owner",
    title: "Business Owner",
    description: "Maximize ROI and streamline operations",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    steps: [
      { title: "Connect accounting software", completed: false },
      { title: "Set up financial dashboard", completed: false },
      { title: "Create sales forecasting agent", completed: false },
      { title: "Automate invoice processing", completed: false },
    ],
    estimatedTime: "20 min",
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    description: "Optimize campaigns and track performance",
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    steps: [
      { title: "Connect social media accounts", completed: false },
      { title: "Set up campaign tracking", completed: false },
      { title: "Create content calendar agent", completed: false },
      { title: "Analyze ROI across channels", completed: false },
    ],
    estimatedTime: "25 min",
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    description: "Automate processes and improve efficiency",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
    steps: [
      { title: "Connect project management tools", completed: false },
      { title: "Set up workflow automation", completed: false },
      { title: "Create task assignment agent", completed: false },
      { title: "Monitor team productivity", completed: false },
    ],
    estimatedTime: "30 min",
  },
];

const quickTasks = [
  {
    id: "task-1",
    title: "Complete your business profile",
    description: "Tell us about your company to personalize your experience",
    icon: Users,
    time: "2 min",
    path: "/onboarding",
    completed: false,
  },
  {
    id: "task-2",
    title: "Watch the dashboard tour",
    description: "5-minute video showing key features and navigation",
    icon: Video,
    time: "5 min",
    path: "#tutorials",
    completed: false,
  },
  {
    id: "task-3",
    title: "Connect your first integration",
    description: "Sync data from your accounting or CRM software",
    icon: Globe,
    time: "5 min",
    path: "/integrations",
    completed: false,
  },
  {
    id: "task-4",
    title: "Set your first business goal",
    description: "Define what success looks like for your business",
    icon: Target,
    time: "3 min",
    path: "/settings",
    completed: false,
  },
  {
    id: "task-5",
    title: "Create your first AI agent",
    description: "Automate a repetitive task with AI",
    icon: Bot,
    time: "10 min",
    path: "/ai-agents",
    completed: false,
  },
  {
    id: "task-6",
    title: "Explore analytics dashboard",
    description: "Review your business metrics and insights",
    icon: BarChart,
    time: "5 min",
    path: "/analytics",
    completed: false,
  },
];

const videoTutorials = [
  {
    id: "video-1",
    title: "Welcome to Cazza.ai",
    description: "Get started with the basics",
    duration: "7:30",
    category: "Getting Started",
    thumbnail: "🎬",
  },
  {
    id: "video-2",
    title: "Mastering the Dashboard",
    description: "Navigate like a pro",
    duration: "10:15",
    category: "Navigation",
    thumbnail: "📊",
  },
  {
    id: "video-3",
    title: "AI Agents Explained",
    description: "Create your first automation",
    duration: "15:20",
    category: "AI Features",
    thumbnail: "🤖",
  },
  {
    id: "video-4",
    title: "Advanced Analytics",
    description: "Unlock powerful insights",
    duration: "12:45",
    category: "Analytics",
    thumbnail: "📈",
  },
];

export function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const totalTasks = quickTasks.length;
  const completedCount = completedTasks.length;
  const progress = (completedCount / totalTasks) * 100;

  const handleTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const handleTaskClick = (task: typeof quickTasks[0]) => {
    handleTaskComplete(task.id);
    if (task.path.startsWith("/")) {
      router.push(task.path);
      onClose();
    } else if (task.path === "#tutorials") {
      setActiveTab("tutorials");
    }
  };

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
    setActiveTab("tasks");
  };

  const getPathById = (id: string) => {
    return learningPaths.find(path => path.id === id);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
                <CardDescription>
                  Get up to speed with Cazza.ai in minutes
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          <CardContent className="p-6 space-y-8">
            {/* Progress Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Your Progress</h3>
                  <p className="text-muted-foreground">
                    Complete tasks to unlock features and achievements
                  </p>
                </div>
                <Badge variant="outline">
                  {completedCount}/{totalTasks} completed
                </Badge>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span className="text-muted-foreground">Pending</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Learning Paths */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Choose Your Learning Path</h3>
                  <p className="text-muted-foreground">
                    Follow a guided path based on your role
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learningPaths.map((path) => {
                  const PathIcon = path.icon;
                  const isSelected = selectedPath === path.id;
                  
                  return (
                    <Card
                      key={path.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary' : 'hover:border-primary'
                      }`}
                      onClick={() => handlePathSelect(path.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-lg ${path.bgColor} flex items-center justify-center`}>
                              <PathIcon className={`h-6 w-6 ${path.color}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold">{path.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {path.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {path.steps.map((step, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0">
                                  {step.completed ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                                  )}
                                </div>
                                <span className={step.completed ? 'line-through text-muted-foreground' : ''}>
                                  {step.title}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {path.estimatedTime}
                            </Badge>
                            
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {selectedPath && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      Following {getPathById(selectedPath)?.title} path
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The tasks below are prioritized for your role. Complete them to master Cazza.ai faster.
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="tasks">Quick Tasks</TabsTrigger>
                <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
                <TabsTrigger value="resources">Learning Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickTasks.map((task) => {
                    const TaskIcon = task.icon;
                    const isCompleted = completedTasks.includes(task.id);
                    
                    return (
                      <Card
                        key={task.id}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''
                        }`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isCompleted 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900' 
                                : 'bg-primary/10 text-primary'
                            }`}>
                              <TaskIcon className="h-5 w-5" />
                            </div>
                            
                            <div className="space-y-1 flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {task.description}
                                  </p>
                                </div>
                                {isCompleted && (
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between pt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {task.time}
                                </Badge>
                                
                                {!isCompleted && (
                                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                                    Start
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="tutorials" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoTutorials.map((tutorial) => (
                    <Card key={tutorial.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-32 bg-muted flex items-center justify-center text-4xl">
                            {tutorial.thumbnail}
                          </div>
                          
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{tutorial.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {tutorial.description}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {tutorial.duration}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <Badge variant="secondary" className="text-xs">
                                {tutorial.category}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Video className="h-4 w-4 mr-2" />
                                Watch
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Tutorials
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Documentation</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive guides and API references
                    </p>
                    <Button variant="outline" size="sm">
                      Open Documentation
                    </Button>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Community Forum</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect with other Cazza.ai users and experts
                    </p>
                    <Button variant="outline" size="sm">
                      Join Community
                    </Button>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Live Support</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get help from our support team in real-time
                    </p>
                    <Button variant="outline" size="sm">
                      Chat with Support
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>

        <CardFooter className="border-t p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="text-sm text-muted-foreground">
              Need help? <button className="text-primary hover:underline">Contact support</button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => {
                if (selectedPath) {
                  // Start the selected learning path
                  console.log(`Starting ${selectedPath} learning path`);
                }
                onClose();
                router.push("/onboarding");
              }}>
                Start Learning Path
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}