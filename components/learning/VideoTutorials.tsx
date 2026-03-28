"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  X,
  Zap,
  ChartBar,
  ChevronRight,
} from "lucide-react";

export type VideoTutorial = {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: 'getting-started' | 'integrations' | 'ai-agents' | 'analytics' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chapters: {
    time: number; // seconds
    title: string;
    description: string;
  }[];
  learningObjectives: string[];
};

interface VideoTutorialsProps {
  onClose?: () => void;
}

const tutorialCategories = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'integrations', label: 'Integrations', icon: ChevronRight },
  { id: 'ai-agents', label: 'AI Agents', icon: Award },
  { id: 'analytics', label: 'Analytics', icon: ChartBar },
  { id: 'advanced', label: 'Advanced', icon: Zap },
];

const mockTutorials: VideoTutorial[] = [
  {
    id: 'tutorial-1',
    title: 'Welcome to Cazza.ai',
    description: 'Learn how to navigate the dashboard and understand key features',
    duration: 420,
    category: 'getting-started',
    difficulty: 'beginner',
    chapters: [
      { time: 0, title: 'Introduction', description: 'Welcome and overview' },
      { time: 60, title: 'Dashboard Tour', description: 'Navigating the main interface' },
      { time: 180, title: 'Key Features', description: 'Understanding core functionality' },
    ],
    learningObjectives: [
      'Navigate the Cazza.ai dashboard',
      'Understand core features',
      'Access help resources',
    ],
  },
  {
    id: 'tutorial-2',
    title: 'Connecting Xero Integration',
    description: 'Step-by-step guide to connect your Xero account',
    duration: 600,
    category: 'integrations',
    difficulty: 'beginner',
    chapters: [
      { time: 0, title: 'Prerequisites', description: 'What you need before starting' },
      { time: 90, title: 'Xero Setup', description: 'Configuring Xero API access' },
      { time: 240, title: 'Connection Process', description: 'Step-by-step connection' },
    ],
    learningObjectives: [
      'Connect Xero to Cazza.ai',
      'Configure API permissions',
      'Test data synchronization',
    ],
  },
];

const mockUserProgress = [
  { videoId: 'tutorial-1', completed: true, progress: 100 },
  { videoId: 'tutorial-2', completed: false, progress: 65 },
];

export function VideoTutorials({ onClose }: VideoTutorialsProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<VideoTutorial>(mockTutorials[0]);
  const [activeTab, setActiveTab] = useState('tutorials');
  const [userProgress, setUserProgress] = useState(mockUserProgress);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  const currentProgress = userProgress.find(p => p.videoId === selectedTutorial.id)?.progress || 0;
  const isCompleted = userProgress.find(p => p.videoId === selectedTutorial.id)?.completed || false;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsCompleted = () => {
    setUserProgress(prev => 
      prev.map(progress => 
        progress.videoId === selectedTutorial.id
          ? { ...progress, completed: true, progress: 100 }
          : progress
      )
    );
  };

  const getCategoryTutorials = (categoryId: string) => {
    return mockTutorials.filter(tutorial => tutorial.category === categoryId);
  };

  const totalTutorials = mockTutorials.length;
  const completedTutorials = userProgress.filter(p => p.completed).length;
  const overallProgress = (completedTutorials / totalTutorials) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">Learning Center</h2>
          <p className="text-muted-foreground">Master Cazza.ai with interactive tutorials</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold">Progress: {completedTutorials}/{totalTutorials}</div>
            <div className="text-sm text-muted-foreground">{Math.round(overallProgress)}% complete</div>
          </div>
          <Progress value={overallProgress} className="w-32" />
        </div>
        
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tutorials" className="space-y-4 mt-4">
              {tutorialCategories.map(category => {
                const tutorials = getCategoryTutorials(category.id);
                if (tutorials.length === 0) return null;
                
                const completedInCategory = tutorials.filter(t => 
                  userProgress.find(p => p.videoId === t.id && p.completed)
                ).length;
                
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </h3>
                      <Badge variant="outline">
                        {completedInCategory}/{tutorials.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {tutorials.map(tutorial => {
                        const progress = userProgress.find(p => p.videoId === tutorial.id);
                        const isSelected = selectedTutorial.id === tutorial.id;
                        
                        return (
                          <Card
                            key={tutorial.id}
                            className={`cursor-pointer transition-all hover:border-primary ${
                              isSelected ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedTutorial(tutorial)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <div className="w-16 h-12 rounded bg-muted flex items-center justify-center">
                                    <Play className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  {progress?.completed && (
                                    <div className="absolute -top-1 -right-1">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm line-clamp-1">
                                      {tutorial.title}
                                    </h4>
                                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                                      {tutorial.difficulty}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(tutorial.duration)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>
                    Track your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Completion</span>
                      <span className="font-semibold">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Tutorial Progress</h4>
                    {mockTutorials.map(tutorial => {
                      const progress = userProgress.find(p => p.videoId === tutorial.id);
                      return (
                        <div key={tutorial.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{tutorial.title}</span>
                            <span className="text-sm">{progress?.progress || 0}%</span>
                          </div>
                          <Progress value={progress?.progress || 0} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedTutorial.title}</CardTitle>
                  <CardDescription>{selectedTutorial.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
                    {selectedTutorial.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(selectedTutorial.duration)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Video placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg mb-2">Video Tutorial</div>
                  <div className="text-muted-foreground">
                    "{selectedTutorial.title}" would play here
                  </div>
                </div>
              </div>
              
              {/* Chapters */}
              <div className="space-y-4">
                <h4 className="font-semibold">Chapters</h4>
                <div className="space-y-2">
                  {selectedTutorial.chapters.map((chapter, index) => {
                    const isCompleted = completedChapters.includes(chapter.title);
                    
                    return (
                      <div
                        key={chapter.title}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{chapter.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(chapter.time)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Learning Objectives */}
              <div className="space-y-4">
                <h4 className="font-semibold">What You'll Learn</h4>
                <ul className="space-y-2">
                  {selectedTutorial.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="completed"
                    checked={isCompleted}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        markAsCompleted();
                      }
                    }}
                  />
                  <Label htmlFor="completed" className="cursor-pointer">
                    Mark as completed
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress value={currentProgress} className="w-32" />
                  <span className="text-sm text-muted-foreground">
                    {Math.round(currentProgress)}% watched
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}