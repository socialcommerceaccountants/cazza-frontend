"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard-header";
import ModuleGrid from "@/components/module-grid";
import ChatbotInterface from "@/components/chatbot-interface";
import StatsOverview from "@/components/stats-overview";
import RecentActivity from "@/components/recent-activity";
import { WelcomeOverlay } from "@/components/onboarding/WelcomeOverlay";
import { QuickStartGuide } from "@/components/onboarding/QuickStartGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Rocket, Sparkles, BookOpen, Video, Zap, Target } from "lucide-react";
import { isDemoModeActive, getQuickDemoData } from "@/lib/demo-data-generator";
import { getProgressSummary, initializeUserProgress } from "@/lib/feature-discovery";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [userProgress, setUserProgress] = useState(() => initializeUserProgress("user-123")); // Mock user ID

  useEffect(() => {
    // Check if user is new (no localStorage entry)
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem('has_seen_welcome');
      const isFirstVisit = !hasSeenWelcome;
      
      // Check demo mode
      const demoActive = isDemoModeActive();
      setIsDemoMode(demoActive);
      
      // Show welcome overlay for first-time visitors
      if (isFirstVisit) {
        setShowWelcome(true);
      }
      
      // Load demo data if in demo mode
      if (demoActive) {
        const demoData = getQuickDemoData();
        console.log("Demo mode active, data:", demoData);
        // In production, this would update the app state
      }
    }
  }, []);

  const progressSummary = getProgressSummary(userProgress);

  return (
    <>
      <div className="p-8 space-y-8">
        {/* Enhanced Header with Progress */}
        <div className="space-y-6">
          <DashboardHeader />
          
          {isDemoMode && (
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-semibold">Demo Mode Active</div>
                      <div className="text-sm text-muted-foreground">
                        Exploring with sample data. <button 
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            localStorage.removeItem('cazza_demo_mode');
                            window.location.reload();
                          }}
                        >
                          Exit demo
                        </button>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white dark:bg-gray-800">
                    <Rocket className="h-3 w-3 mr-1" />
                    Try All Features
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Quick Start Bar */}
          {progressSummary.unlockedPercentage < 50 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Continue Your Setup</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete setup to unlock all features
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="space-y-2 min-w-32">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{progressSummary.unlockedPercentage}%</span>
                      </div>
                      <Progress value={progressSummary.unlockedPercentage} />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowQuickStart(true)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Quick Start
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={() => setShowWelcome(true)}
                    >
                      Continue Setup
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Feature Discovery Highlights */}
        {progressSummary.nextFeatures.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Next Features to Unlock
              </CardTitle>
              <CardDescription>
                Complete tasks to unlock these powerful features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {progressSummary.nextFeatures.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="p-4 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <div className="text-primary font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        <Badge className={`
                          ${feature.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : ''}
                          ${feature.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${feature.difficulty === 'advanced' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {feature.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ModuleGrid />
            <StatsOverview />
          </div>
          <div className="space-y-8">
            <ChatbotInterface />
            <RecentActivity />
            
            {/* Learning Resources Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Resources
                </CardTitle>
                <CardDescription>
                  Master Cazza.ai with these resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowQuickStart(true)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Tutorials
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('/onboarding', '_self')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Interactive Onboarding
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      localStorage.setItem('cazza_demo_mode', 'true');
                      window.location.reload();
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try Demo Mode
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your progress</span>
                    <span className="font-semibold">{progressSummary.unlockedPercentage}%</span>
                  </div>
                  <Progress value={progressSummary.unlockedPercentage} className="mt-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>{progressSummary.unlockedFeatures} features unlocked</span>
                    <span>{progressSummary.achievementPoints} achievement points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Welcome Overlay for new users */}
      {showWelcome && (
        <WelcomeOverlay 
          onClose={() => setShowWelcome(false)} 
          showDemoOption={true}
        />
      )}
      
      {/* Quick Start Guide */}
      {showQuickStart && (
        <QuickStartGuide onClose={() => setShowQuickStart(false)} />
      )}
    </>
  );
}