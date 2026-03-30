"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Rocket, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Zap, 
  Users,
  BookOpen,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getQuickDemoData, toggleDemoMode } from "@/lib/demo-data-generator";

interface WelcomeOverlayProps {
  onClose: () => void;
  showDemoOption?: boolean;
}

const quickStartSteps = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Tell us about your business",
    icon: Users,
    completed: false,
    estimatedTime: "2 min",
    action: { type: "navigate", path: "/onboarding" },
  },
  {
    id: "integration",
    title: "Connect first integration",
    description: "Sync your accounting or e-commerce data",
    icon: Zap,
    completed: false,
    estimatedTime: "5 min",
    action: { type: "navigate", path: "/integrations" },
  },
  {
    id: "ai-agent",
    title: "Create your first AI agent",
    description: "Automate repetitive tasks",
    icon: Rocket,
    completed: false,
    estimatedTime: "10 min",
    action: { type: "navigate", path: "/ai-agents" },
  },
  {
    id: "tutorial",
    title: "Watch getting started tutorial",
    description: "Learn the basics in 5 minutes",
    icon: Video,
    completed: false,
    estimatedTime: "5 min",
    action: { type: "open", target: "tutorials" },
  },
  {
    id: "goal",
    title: "Set your first business goal",
    description: "Define what success looks like",
    icon: Target,
    completed: false,
    estimatedTime: "3 min",
    action: { type: "navigate", path: "/settings" },
  },
];

const featureHighlights = [
  {
    title: "AI-Powered Insights",
    description: "Get actionable recommendations based on your data",
    icon: Sparkles,
  },
  {
    title: "Automated Workflows",
    description: "Save hours with AI agents that handle repetitive tasks",
    icon: Zap,
  },
  {
    title: "Real-time Analytics",
    description: "Monitor business performance with live dashboards",
    icon: Target,
  },
  {
    title: "Team Collaboration",
    description: "Work together with role-based access control",
    icon: Users,
  },
];

export function WelcomeOverlay({ onClose, showDemoOption = true }: WelcomeOverlayProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showDemo, setShowDemo] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const totalSteps = quickStartSteps.length;
  const completedCount = completedSteps.length;
  const progress = (completedCount / totalSteps) * 100;

  useEffect(() => {
    // Check localStorage for existing progress
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('welcome_overlay_progress');
      if (savedProgress) {
        setCompletedSteps(JSON.parse(savedProgress));
      }
      
      const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
      if (hasSeenWelcome === 'true') {
        onClose();
      }
    }
  }, [onClose]);

  const handleStepComplete = (stepId: string) => {
    const newCompletedSteps = [...completedSteps, stepId];
    setCompletedSteps(newCompletedSteps);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_overlay_progress', JSON.stringify(newCompletedSteps));
    }
  };

  const handleStepAction = (step: typeof quickStartSteps[0]) => {
    handleStepComplete(step.id);
    
    switch (step.action.type) {
      case "navigate":
        router.push(step.action.path);
        break;
      case "open":
        // In production, this would open the tutorials modal
        console.log(`Opening ${step.action.target || 'tutorials'}`);
        break;
    }
  };

  const handleTryDemo = () => {
    toggleDemoMode(true);
    setShowDemo(true);
    
    // Generate demo data
    const demoData = getQuickDemoData();
    console.log("Demo data generated:", demoData);
    
    // In production, this would update the app state with demo data
    setTimeout(() => {
      onClose();
      router.refresh();
    }, 1000);
  };

  const handleGetStarted = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('has_seen_welcome', 'true');
    }
    onClose();
    router.push("/onboarding");
  };

  const handleSkip = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('has_seen_welcome', 'true');
    }
    onClose();
  };

  if (showDemo) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Demo Mode Activated</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Explore Cazza.ai with sample data
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Demo data loaded!</h3>
              <p className="text-muted-foreground">
                You're now exploring Cazza.ai with sample e-commerce data. 
                All features are unlocked for you to try.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Sample metrics and analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Mock AI agents and workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Example integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Interactive tutorials</span>
                </li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={onClose}>
              Start Exploring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="w-full" onClick={() => {
              toggleDemoMode(false);
              setShowDemo(false);
            }}>
              Exit Demo Mode
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Rocket className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Welcome to Cazza.ai! 🎉</CardTitle>
                <CardDescription>
                  Let's set up your AI business assistant
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <CardContent className="p-6 space-y-8">
            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Getting Started</h3>
                  <p className="text-muted-foreground">
                    Complete these steps to unlock all features
                  </p>
                </div>
                <Badge variant="outline">
                  {completedCount}/{totalSteps} completed
                </Badge>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickStartSteps.map((step) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const StepIcon = step.icon;
                  
                  return (
                    <Card
                      key={step.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''
                      }`}
                      onClick={() => !isCompleted && handleStepAction(step)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            <StepIcon className="h-5 w-5" />
                          </div>
                          
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{step.title}</h4>
                              {isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-2">
                              <Badge variant="outline" className="text-xs">
                                {step.estimatedTime}
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
            </div>
            
            <Separator />
            
            {/* Feature Highlights */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What you can do with Cazza.ai</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureHighlights.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg border"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FeatureIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Separator />
            
            {/* Demo Option */}
            {showDemoOption && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Not ready to connect your data?</h3>
                </div>
                
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">Try Demo Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Explore all features with sample data. No setup required.
                        </p>
                      </div>
                      <Button variant="default" onClick={handleTryDemo}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Launch Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </div>
        
        <CardFooter className="border-t p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="dont-show"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              />
              <label
                htmlFor="dont-show"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Don't show this again
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}