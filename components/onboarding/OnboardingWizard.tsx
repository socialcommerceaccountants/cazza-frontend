"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Building, 
  Users, 
  Target, 
  Globe, 
  Mail, 
  Database,
  Zap,
  Shield,
  Bot,
  Sparkles
} , Zap from "lucide-react";

type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Company Profile",
    description: "Tell us about your business",
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Team Setup",
    description: "Add your team members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Business Goals",
    description: "Define your objectives",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Integrations",
    description: "Connect your tools",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "AI Preferences",
    description: "Customize your assistant",
    icon: <Bot className="h-5 w-5" />,
  },
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Education",
  "Real Estate",
  "Marketing",
  "Other",
];

const businessSizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501+", label: "501+ employees" },
];

const goals = [
  { id: "automation", label: "Automate repetitive tasks", description: "Save time on manual work" },
  { id: "analytics", label: "Better business insights", description: "Make data-driven decisions" },
  { id: "growth", label: "Scale operations", description: "Handle increased workload" },
  { id: "efficiency", label: "Improve efficiency", description: "Optimize processes" },
  { id: "revenue", label: "Increase revenue", description: "Boost sales and profits" },
  { id: "customer", label: "Enhance customer experience", description: "Improve client satisfaction" },
];

const integrations = [
  { id: "xero", name: "Xero", icon: <Database className="h-5 w-5" />, description: "Accounting & finance" },
  { id: "stripe", name: "Stripe", icon: <Zap className="h-5 w-5" />, description: "Payment processing" },
  { id: "google", name: "Google Workspace", icon: <Mail className="h-5 w-5" />, description: "Email & calendar" },
  { id: "slack", name: "Slack", icon: <Users className="h-5 w-5" />, description: "Team communication" },
  { id: "shopify", name: "Shopify", icon: <Building className="h-5 w-5" />, description: "E-commerce" },
  { id: "hubspot", name: "HubSpot", icon: <Target className="h-5 w-5" />, description: "CRM & marketing" },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [website, setWebsite] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [aiPersonality, setAiPersonality] = useState("professional");
  const [dataSharing, setDataSharing] = useState(true);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsComplete(true);
    setIsLoading(false);
    
    // Redirect after completion
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleIntegration = (integrationId: string) => {
    setSelectedIntegrations(prev =>
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Your Company Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={industry} onValueChange={(value) => setIndustry(value || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind.toLowerCase()}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessSize">Company Size *</Label>
              <Select value={businessSize} onValueChange={(value) => setBusinessSize(value || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {businessSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamMembers">How many team members will use Cazza.ai? *</Label>
              <Input
                id="teamMembers"
                type="number"
                min="1"
                placeholder="e.g., 5"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                required
              />
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Team Management Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Collaborative workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Activity tracking and reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Team performance analytics</span>
                </li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                You can invite team members after setup. Each member will receive an email invitation
                to join your Cazza.ai workspace.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">What are your main business goals? *</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Select all that apply. This helps us personalize your experience.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={goal.id}
                        checked={selectedGoals.includes(goal.id)}
                        onCheckedChange={() => toggleGoal(goal.id)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={goal.id} className="font-medium cursor-pointer">
                          {goal.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedGoals.length > 0 && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">Personalized recommendations</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your goals, we'll suggest relevant features and workflows to help you achieve them faster.
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Connect your business tools</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Select the tools you use. You can connect more later.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedIntegrations.includes(integration.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleIntegration(integration.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`integration-${integration.id}`}
                        checked={selectedIntegrations.includes(integration.id)}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            {integration.icon}
                          </div>
                          <Label htmlFor={`integration-${integration.id}`} className="font-medium cursor-pointer">
                            {integration.name}
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Connecting your tools allows Cazza.ai to automate workflows, sync data, and provide
                comprehensive insights across your business.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">AI Assistant Personality</h4>
              <p className="text-sm text-muted-foreground">
                Choose how your AI assistant communicates with you.
              </p>
              
              <RadioGroup value={aiPersonality} onValueChange={setAiPersonality} className="space-y-3">
                <div className="flex items-center space-x-2 space-y-0 rounded-lg border p-4">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="flex-1 cursor-pointer">
                    <div className="font-medium">Professional</div>
                    <div className="text-sm text-muted-foreground">
                      Formal, concise, business-focused communication
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 space-y-0 rounded-lg border p-4">
                  <RadioGroupItem value="friendly" id="friendly" />
                  <Label htmlFor="friendly" className="flex-1 cursor-pointer">
                    <div className="font-medium">Friendly</div>
                    <div className="text-sm text-muted-foreground">
                      Casual, approachable, conversational tone
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 space-y-0 rounded-lg border p-4">
                  <RadioGroupItem value="analytical" id="analytical" />
                  <Label htmlFor="analytical" className="flex-1 cursor-pointer">
                    <div className="font-medium">Analytical</div>
                    <div className="text-sm text-muted-foreground">
                      Data-driven, detailed, focused on insights
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Data Sharing for Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us improve Cazza.ai by sharing anonymous usage data
                  </p>
                </div>
                <Checkbox
                  id="dataSharing"
                  checked={dataSharing}
                  onCheckedChange={(checked) => setDataSharing(checked as boolean)}
                />
              </div>
              
              <div className="p-4 rounded-lg bg-muted text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Your privacy is protected</p>
                    <p className="text-muted-foreground mt-1">
                      We never share personal or sensitive business data. All shared data is anonymized
                      and used only to improve product features and performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Setup Complete! 🎉</CardTitle>
          <CardDescription>
            Your Cazza.ai workspace is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">
              Welcome to Cazza.ai! We're preparing your personalized dashboard...
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI is learning about your business</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Initializing workspace</span>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Setting up integrations</span>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Training AI assistant</span>
              <Badge variant="secondary">In progress</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Generating insights</span>
              <Badge variant="outline">Pending</Badge>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-center">
              Redirecting to your dashboard in 3 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Welcome to Cazza.ai</CardTitle>
          <CardDescription>
            Let's set up your AI business assistant in a few simple steps
          </CardDescription>
        </div>
        
        {/* Progress */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between pt-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center mb-2 ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                      ? "bg-green-100 text-green-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    step.id === currentStep ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {renderStepContent()}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1 || isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            disabled={isLoading}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!companyName || !industry || !businessSize)) ||
              (currentStep === 2 && !teamMembers) ||
              (currentStep === 3 && selectedGoals.length === 0) ||
              isLoading
            }
          >
            {currentStep === steps.length ? (
              <>
                {isLoading ? "Completing..." : "Complete Setup"}
                {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}