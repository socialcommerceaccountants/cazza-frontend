/**
 * Progressive Feature Discovery System for Cazza.ai
 * 
 * Feature unlocking based on user progress
 * Contextual tooltips and guides
 * Achievement system for feature mastery
 */

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type FeatureCategory = 'core' | 'integrations' | 'ai-agents' | 'analytics' | 'advanced';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProgress {
  userId: string;
  completedTutorials: string[];
  connectedIntegrations: string[];
  createdAgents: number;
  completedTasks: number;
  daysActive: number;
  lastActive: Date;
  achievements: string[];
  featureUsage: Record<string, number>; // featureId -> usage count
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  difficulty: DifficultyLevel;
  icon: string;
  requiredRole: UserRole;
  prerequisites: string[]; // feature IDs or achievement IDs
  unlockConditions: {
    type: 'tutorial' | 'integration' | 'usage' | 'time' | 'achievement';
    value: string | number;
  }[];
  tutorialId?: string;
  tooltip: {
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  achievements: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirements: {
    type: 'feature_usage' | 'tutorial_completion' | 'integration_count' | 'agent_count' | 'streak';
    value: number;
    featureId?: string;
  }[];
  reward?: {
    type: 'feature_unlock' | 'badge' | 'credit';
    value: string | number;
  };
}

export interface GuidedTour {
  id: string;
  name: string;
  description: string;
  features: string[]; // feature IDs
  steps: TourStep[];
  estimatedTime: number; // minutes
  prerequisites: string[];
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  targetElement?: string; // CSS selector or data attribute
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    type: 'click' | 'input' | 'navigate';
    target: string;
    value?: string;
  };
}

// Feature Definitions
export const features: Feature[] = [
  {
    id: 'dashboard-overview',
    name: 'Dashboard Overview',
    description: 'Main dashboard with key metrics and quick actions',
    category: 'core',
    difficulty: 'beginner',
    icon: 'LayoutDashboard',
    requiredRole: 'viewer',
    prerequisites: [],
    unlockConditions: [
      { type: 'time', value: 0 }, // Available immediately
    ],
    tooltip: {
      title: 'Welcome to your dashboard!',
      content: 'This is your command center. Track key metrics and access all features from here.',
      position: 'bottom',
    },
    achievements: ['first-login'],
  },
  {
    id: 'xero-integration',
    name: 'Xero Integration',
    description: 'Connect Xero for automated accounting and financial insights',
    category: 'integrations',
    difficulty: 'beginner',
    icon: 'Calculator',
    requiredRole: 'admin',
    prerequisites: ['dashboard-overview'],
    unlockConditions: [
      { type: 'tutorial', value: 'tutorial-2' }, // Xero tutorial
      { type: 'time', value: 1 }, // 1 day after signup
    ],
    tutorialId: 'tutorial-2',
    tooltip: {
      title: 'Automate your accounting',
      content: 'Connect Xero to sync invoices, track expenses, and get financial insights automatically.',
      position: 'right',
    },
    achievements: ['integration-master', 'financial-wizard'],
  },
  {
    id: 'ai-agent-builder',
    name: 'AI Agent Builder',
    description: 'Create custom AI agents to automate business processes',
    category: 'ai-agents',
    difficulty: 'intermediate',
    icon: 'Bot',
    requiredRole: 'admin',
    prerequisites: ['dashboard-overview'],
    unlockConditions: [
      { type: 'tutorial', value: 'tutorial-3' }, // AI Agent tutorial
      { type: 'usage', value: 5 }, // Used dashboard 5+ times
    ],
    tutorialId: 'tutorial-3',
    tooltip: {
      title: 'Build your first AI agent',
      content: 'Create custom AI assistants to handle customer support, data analysis, and more.',
      position: 'top',
    },
    achievements: ['ai-pioneer', 'automation-expert'],
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Deep dive into business metrics with custom reports and forecasting',
    category: 'analytics',
    difficulty: 'intermediate',
    icon: 'BarChart',
    requiredRole: 'admin',
    prerequisites: ['dashboard-overview', 'xero-integration'],
    unlockConditions: [
      { type: 'tutorial', value: 'tutorial-4' }, // Analytics tutorial
      { type: 'integration', value: 'xero' }, // Xero connected
      { type: 'time', value: 7 }, // 7 days active
    ],
    tutorialId: 'tutorial-4',
    tooltip: {
      title: 'Unlock powerful insights',
      content: 'Access advanced analytics, custom reports, and predictive forecasting tools.',
      position: 'left',
    },
    achievements: ['data-analyst', 'insight-master'],
  },
  {
    id: 'multi-agent-workflows',
    name: 'Multi-Agent Workflows',
    description: 'Create complex workflows with multiple AI agents working together',
    category: 'advanced',
    difficulty: 'advanced',
    icon: 'Workflow',
    requiredRole: 'owner',
    prerequisites: ['ai-agent-builder', 'advanced-analytics'],
    unlockConditions: [
      { type: 'usage', value: 50 }, // Used AI agents 50+ times
      { type: 'achievement', value: 'automation-expert' },
      { type: 'time', value: 30 }, // 30 days active
    ],
    tooltip: {
      title: 'Master automation',
      content: 'Create sophisticated workflows where multiple AI agents collaborate on complex tasks.',
      position: 'bottom',
    },
    achievements: ['workflow-architect', 'automation-master'],
  },
  {
    id: 'predictive-modeling',
    name: 'Predictive Modeling',
    description: 'Build and train custom ML models for business forecasting',
    category: 'advanced',
    difficulty: 'advanced',
    icon: 'TrendingUp',
    requiredRole: 'owner',
    prerequisites: ['advanced-analytics', 'multi-agent-workflows'],
    unlockConditions: [
      { type: 'usage', value: 100 }, // Used analytics 100+ times
      { type: 'achievement', value: 'data-analyst' },
      { type: 'time', value: 60 }, // 60 days active
    ],
    tooltip: {
      title: 'Predict the future',
      content: 'Build custom machine learning models to forecast sales, customer behavior, and market trends.',
      position: 'top',
    },
    achievements: ['ml-engineer', 'prediction-pro'],
  },
];

// Achievement Definitions
export const achievements: Achievement[] = [
  {
    id: 'first-login',
    name: 'First Steps',
    description: 'Successfully logged in for the first time',
    icon: 'Footprints',
    points: 10,
    requirements: [
      { type: 'feature_usage', value: 1, featureId: 'dashboard-overview' },
    ],
    reward: { type: 'badge', value: 'newbie' },
  },
  {
    id: 'integration-master',
    name: 'Integration Master',
    description: 'Connected 3 or more integrations',
    icon: 'Puzzle',
    points: 50,
    requirements: [
      { type: 'integration_count', value: 3 },
    ],
    reward: { type: 'feature_unlock', value: 'advanced-analytics' },
  },
  {
    id: 'financial-wizard',
    name: 'Financial Wizard',
    description: 'Processed 100+ transactions through connected accounting software',
    icon: 'Coins',
    points: 75,
    requirements: [
      { type: 'feature_usage', value: 100, featureId: 'xero-integration' },
    ],
  },
  {
    id: 'ai-pioneer',
    name: 'AI Pioneer',
    description: 'Created your first AI agent',
    icon: 'Rocket',
    points: 100,
    requirements: [
      { type: 'agent_count', value: 1 },
    ],
    reward: { type: 'badge', value: 'ai-enthusiast' },
  },
  {
    id: 'automation-expert',
    name: 'Automation Expert',
    description: 'Automated 50+ tasks with AI agents',
    icon: 'Zap',
    points: 150,
    requirements: [
      { type: 'feature_usage', value: 50, featureId: 'ai-agent-builder' },
    ],
    reward: { type: 'feature_unlock', value: 'multi-agent-workflows' },
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Generated 25+ custom reports',
    icon: 'BarChart',
    points: 125,
    requirements: [
      { type: 'feature_usage', value: 25, featureId: 'advanced-analytics' },
    ],
    reward: { type: 'feature_unlock', value: 'predictive-modeling' },
  },
  {
    id: 'insight-master',
    name: 'Insight Master',
    description: 'Achieved 90%+ accuracy on predictions',
    icon: 'Lightbulb',
    points: 200,
    requirements: [
      { type: 'feature_usage', value: 100, featureId: 'advanced-analytics' },
    ],
  },
  {
    id: 'workflow-architect',
    name: 'Workflow Architect',
    description: 'Created a workflow with 3+ connected agents',
    icon: 'Network',
    points: 250,
    requirements: [
      { type: 'feature_usage', value: 25, featureId: 'multi-agent-workflows' },
    ],
  },
  {
    id: 'automation-master',
    name: 'Automation Master',
    description: 'Saved 100+ hours through automation',
    icon: 'Crown',
    points: 500,
    requirements: [
      { type: 'feature_usage', value: 1000, featureId: 'multi-agent-workflows' },
    ],
    reward: { type: 'credit', value: 100 }, // $100 platform credit
  },
  {
    id: 'ml-engineer',
    name: 'ML Engineer',
    description: 'Trained a custom ML model with 95%+ accuracy',
    icon: 'Brain',
    points: 300,
    requirements: [
      { type: 'feature_usage', value: 50, featureId: 'predictive-modeling' },
    ],
  },
  {
    id: 'prediction-pro',
    name: 'Prediction Pro',
    description: 'Made 1000+ successful predictions',
    icon: 'Target',
    points: 400,
    requirements: [
      { type: 'feature_usage', value: 1000, featureId: 'predictive-modeling' },
    ],
  },
];

// Guided Tours
export const guidedTours: GuidedTour[] = [
  {
    id: 'tour-getting-started',
    name: 'Getting Started Tour',
    description: 'Learn the basics of Cazza.ai in 5 minutes',
    features: ['dashboard-overview'],
    estimatedTime: 5,
    prerequisites: [],
    steps: [
      {
        id: 'step-1',
        title: 'Welcome to Cazza.ai!',
        content: 'This is your dashboard. From here, you can access all features and track your business metrics.',
        position: 'center',
      },
      {
        id: 'step-2',
        title: 'Navigation Sidebar',
        content: 'Use the sidebar to navigate between different sections: Dashboard, AI Agents, Integrations, Analytics, and Settings.',
        targetElement: '[data-tour="sidebar"]',
        position: 'right',
      },
      {
        id: 'step-3',
        title: 'Quick Actions',
        content: 'These cards give you quick access to common tasks. Click any card to get started.',
        targetElement: '[data-tour="quick-actions"]',
        position: 'bottom',
      },
      {
        id: 'step-4',
        title: 'Metrics Overview',
        content: 'Track your key business metrics here. Data will appear as you connect integrations.',
        targetElement: '[data-tour="metrics"]',
        position: 'top',
      },
      {
        id: 'step-5',
        title: 'Next Steps',
        content: 'Ready to continue? Click "Start Onboarding" to set up your first integration.',
        position: 'center',
        action: {
          type: 'navigate',
          target: '/onboarding',
        },
      },
    ],
  },
  {
    id: 'tour-first-integration',
    name: 'First Integration Tour',
    description: 'Connect your first business tool',
    features: ['xero-integration'],
    estimatedTime: 10,
    prerequisites: ['tour-getting-started'],
    steps: [
      {
        id: 'step-1',
        title: 'Integration Hub',
        content: 'This is where you connect all your business tools. Let\'s start with Xero for accounting.',
        targetElement: '[data-tour="integrations-page"]',
        position: 'center',
      },
      {
        id: 'step-2',
        title: 'Connect Xero',
        content: 'Click the Xero card to start the connection process.',
        targetElement: '[data-tour="xero-card"]',
        position: 'bottom',
        action: {
          type: 'click',
          target: '[data-tour="xero-card"]',
        },
      },
      {
        id: 'step-3',
        title: 'Authorization',
        content: 'You\'ll be redirected to Xero to authorize the connection. Make sure you\'re logged into your Xero account.',
        position: 'center',
      },
      {
        id: 'step-4',
        title: 'Data Sync',
        content: 'Once connected, Cazza.ai will start syncing your financial data. This may take a few minutes.',
        position: 'center',
      },
      {
        id: 'step-5',
        title: 'Success!',
        content: 'Great job! Your Xero data is now flowing into Cazza.ai. Check your dashboard for updated metrics.',
        position: 'center',
        action: {
          type: 'navigate',
          target: '/',
        },
      },
    ],
  },
  {
    id: 'tour-first-ai-agent',
    name: 'First AI Agent Tour',
    description: 'Create your first AI-powered assistant',
    features: ['ai-agent-builder'],
    estimatedTime: 15,
    prerequisites: ['tour-first-integration'],
    steps: [
      {
        id: 'step-1',
        title: 'AI Agents',
        content: 'AI Agents automate tasks and provide insights. Let\'s create your first agent.',
        targetElement: '[data-tour="ai-agents-page"]',
        position: 'center',
      },
      {
        id: 'step-2',
        title: 'Create Agent',
        content: 'Click "Create Agent" to start building.',
        targetElement: '[data-tour="create-agent-button"]',
        position: 'bottom',
        action: {
          type: 'click',
          target: '[data-tour="create-agent-button"]',
        },
      },
      {
        id: 'step-3',
        title: 'Agent Configuration',
        content: 'Give your agent a name and select its purpose. For example, "Sales Assistant" to help with customer queries.',
        targetElement: '[data-tour="agent-config"]',
        position: 'right',
      },
      {
        id: 'step-4',
        title: 'Training Data',
        content: 'Provide examples of questions and answers to train your agent. The more examples, the smarter it becomes.',
        targetElement: '[data-tour="training-data"]',
        position: 'top',
      },
      {
        id: 'step-5',
        title: 'Deploy Agent',
        content: 'Click "Deploy" to activate your agent. It will start learning and improving over time.',
        targetElement: '[data-tour="deploy-button"]',
        position: 'bottom',
        action: {
          type: 'click',
          target: '[data-tour="deploy-button"]',
        },
      },
    ],
  },
];

/**
 * Check if a feature is unlocked for a user
 */
export function isFeatureUnlocked(featureId: string, userProgress: UserProgress, userRole: UserRole): boolean {
  const feature = features.find(f => f.id === featureId);
  if (!feature) return false;

  // Check role requirement
  const roleHierarchy = ['owner', 'admin', 'member', 'viewer'];
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(feature.requiredRole);
  if (userRoleIndex > requiredRoleIndex) return false;

  // Check prerequisites
  for (const prereq of feature.prerequisites) {
    if (!isFeatureUnlocked(prereq, userProgress, userRole)) {
      return false;
    }
  }

  // Check unlock conditions
  for (const condition of feature.unlockConditions) {
    switch (condition.type) {
      case 'tutorial':
        if (!userProgress.completedTutorials.includes(condition.value as string)) {
          return false;
        }
        break;
      
      case 'integration':
        if (!userProgress.connectedIntegrations.includes(condition.value as string)) {
          return false;
        }
        break;
      
      case 'usage':
        const usageCount = userProgress.featureUsage[condition.value as string] || 0;
        if (usageCount < (condition.value as number)) {
          return false;
        }
        break;
      
      case 'time':
        const daysSinceSignup = Math.floor(
          (new Date().getTime() - userProgress.lastActive.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceSignup < (condition.value as number)) {
          return false;
        }
        break;
      
      case 'achievement':
        if (!userProgress.achievements.includes(condition.value as string)) {
          return false;
        }
        break;
    }
  }

  return true;
}

/**
 * Get all unlocked features for a user
 */
export function getUnlockedFeatures(userProgress: UserProgress, userRole: UserRole): Feature[] {
  return features.filter(feature => isFeatureUnlocked(feature.id, userProgress, userRole));
}

/**
 * Get locked features for a user
 */
export function getLockedFeatures(userProgress: UserProgress, userRole: UserRole): Feature[] {
  return features.filter(feature => !isFeatureUnlocked(feature.id, userProgress, userRole));
}

/**
 * Get next features to unlock
 */
export function getNextFeaturesToUnlock(userProgress: UserProgress, userRole: UserRole, limit = 3): Feature[] {
  const lockedFeatures = getLockedFeatures(userProgress, userRole);
  
  // Sort by difficulty and prerequisites met
  return lockedFeatures
    .filter(feature => {
      // Check if all prerequisites are met
      return feature.prerequisites.every(prereq => 
        isFeatureUnlocked(prereq, userProgress, userRole)
      );
    })
    .sort((a, b) => {
      // Sort by difficulty level
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    })
    .slice(0, limit);
}

/**
 * Check achievement progress
 */
export function getAchievementProgress(achievementId: string, userProgress: UserProgress): {
  completed: boolean;
  progress: number;
  requirements: Array<{ description: string; completed: boolean; current: number; required: number }>;
} {
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) {
    return { completed: false, progress: 0, requirements: [] };
  }

  const requirements = achievement.requirements.map(req => {
    let current = 0;
    let completed = false;
    let description = '';

    switch (req.type) {
      case 'feature_usage':
        current = userProgress.featureUsage[req.featureId!] || 0;
        completed = current >= req.value;
        description = `Use ${req.featureId?.replace('-', ' ')} ${req.value} times`;
        break;
      
      case 'tutorial_completion':
        current = userProgress.completedTutorials.length;
        completed = current >= req.value;
        description = `Complete ${req.value} tutorials`;
        break;
      
      case 'integration_count':
        current = userProgress.connectedIntegrations.length;
        completed = current >= req.value;
        description = `Connect ${req.value} integrations`;
        break;
      
      case 'agent_count':
        current = userProgress.createdAgents;
        completed = current >= req.value;
        description = `Create ${req.value} AI agents`;
        break;
      
      case 'streak':
        current = userProgress.daysActive;
        completed = current >= req.value;
        description = `Be active for ${req.value} days`;
        break;
    }

    return {
      description,
      completed,
      current,
      required: req.value,
    };
  });

  const completed = requirements.every(req => req.completed);
  const progress = requirements.length > 0 
    ? (requirements.filter(req => req.completed).length / requirements.length) * 100
    : 0;

  return { completed, progress, requirements };
}

/**
 * Get all achievements with progress
 */
export function getAllAchievementsWithProgress(userProgress: UserProgress): Array<{
  achievement: Achievement;
  completed: boolean;
  progress: number;
}> {
  return achievements.map(achievement => {
    const progress = getAchievementProgress(achievement.id, userProgress);
    return {
      achievement,
      completed: progress.completed,
      progress: progress.progress,
    };
  });
}

/**
 * Get available guided tours
 */
export function getAvailableTours(userProgress: UserProgress): GuidedTour[] {
  return guidedTours.filter(tour => {
    // Check prerequisites
    return tour.prerequisites.every(prereqId => {
      // Check if it's a tour prerequisite
      if (prereqId.startsWith('tour-')) {
        return userProgress.completedTutorials.includes(prereqId);
      }
      // Check if it's a feature prerequisite
      return true; // Simplified - in production, check feature unlock status
    });
  });
}

/**
 * Start a guided tour
 */
export function startTour(tourId: string): void {
  const tour = guidedTours.find(t => t.id === tourId);
  if (!tour) return;

  // In production, this would dispatch a Redux action or update context
  console.log(`Starting tour: ${tour.name}`);
  
  // Store tour state in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('active_tour', tourId);
    localStorage.setItem('tour_step', '0');
  }
}

/**
 * Complete a tour step
 */
export function completeTourStep(tourId: string, stepId: string): void {
  // In production, this would update tour progress
  console.log(`Completed step ${stepId} in tour ${tourId}`);
}

/**
 * Complete a tour
 */
export function completeTour(tourId: string, userProgress: UserProgress): UserProgress {
  // Add tour to completed tutorials
  const updatedProgress = {
    ...userProgress,
    completedTutorials: [...userProgress.completedTutorials, tourId],
  };

  // Clear active tour
  if (typeof window !== 'undefined') {
    localStorage.removeItem('active_tour');
    localStorage.removeItem('tour_step');
  }

  return updatedProgress;
}

/**
 * Show contextual tooltip for a feature
 */
export function showFeatureTooltip(featureId: string): void {
  const feature = features.find(f => f.id === featureId);
  if (!feature) return;

  // In production, this would show a tooltip component
  console.log(`Showing tooltip for ${feature.name}: ${feature.tooltip.content}`);
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(featureId: string, userProgress: UserProgress): UserProgress {
  const currentUsage = userProgress.featureUsage[featureId] || 0;
  
  return {
    ...userProgress,
    featureUsage: {
      ...userProgress.featureUsage,
      [featureId]: currentUsage + 1,
    },
    lastActive: new Date(),
  };
}

/**
 * Initialize user progress
 */
export function initializeUserProgress(userId: string): UserProgress {
  return {
    userId,
    completedTutorials: [],
    connectedIntegrations: [],
    createdAgents: 0,
    completedTasks: 0,
    daysActive: 1,
    lastActive: new Date(),
    achievements: [],
    featureUsage: {},
  };
}

/**
 * Get user's progress summary
 */
export function getProgressSummary(userProgress: UserProgress) {
  const unlockedFeatures = features.filter(f => 
    isFeatureUnlocked(f.id, userProgress, 'owner') // Using owner role for maximum features
  );
  
  const completedAchievements = achievements.filter(a => 
    getAchievementProgress(a.id, userProgress).completed
  );

  return {
    totalFeatures: features.length,
    unlockedFeatures: unlockedFeatures.length,
    unlockedPercentage: Math.round((unlockedFeatures.length / features.length) * 100),
    totalAchievements: achievements.length,
    completedAchievements: completedAchievements.length,
    achievementPoints: completedAchievements.reduce((sum, a) => sum + a.points, 0),
    daysActive: userProgress.daysActive,
    nextFeatures: getNextFeaturesToUnlock(userProgress, 'owner', 3),
  };
}