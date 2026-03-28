/**
 * Demo Data Generator for Cazza.ai
 * 
 * Generates realistic demo data for new users to explore features
 * Industry-specific templates (ecommerce, SaaS, agencies)
 * One-click demo mode toggle
 */

export type IndustryType = 'ecommerce' | 'saas' | 'agency' | 'consulting' | 'retail' | 'default';

export interface DemoDataConfig {
  industry: IndustryType;
  companySize: 'small' | 'medium' | 'large';
  includeIntegrations: boolean;
  timePeriod: 'week' | 'month' | 'quarter';
}

export interface DemoMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    churned: number;
  };
  conversions: {
    rate: number;
    total: number;
  };
  engagement: {
    activeUsers: number;
    sessions: number;
    avgSessionDuration: number;
  };
}

export interface DemoActivity {
  id: string;
  type: 'integration' | 'ai_agent' | 'analytics' | 'client' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: Record<string, any>;
}

export interface DemoClient {
  id: string;
  name: string;
  email: string;
  industry: string;
  status: 'active' | 'pending' | 'inactive';
  lifetimeValue: number;
  lastActivity: Date;
  tags: string[];
}

export interface DemoAIAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'training' | 'idle';
  tasksCompleted: number;
  accuracy: number;
  lastRun: Date;
}

export interface DemoIntegration {
  id: string;
  name: string;
  type: 'accounting' | 'ecommerce' | 'crm' | 'marketing' | 'communication' | 'analytics';
  status: 'connected' | 'pending' | 'disconnected';
  lastSync: Date;
  dataPoints: number;
}

/**
 * Main demo data generator function
 */
export function generateDemoData(config: DemoDataConfig) {
  const industryData = getIndustryTemplate(config.industry);
  const sizeMultiplier = getSizeMultiplier(config.companySize);
  
  return {
    metrics: generateMetrics(config, sizeMultiplier),
    activities: generateActivities(config, industryData, sizeMultiplier),
    clients: generateClients(config, industryData, sizeMultiplier),
    aiAgents: generateAIAgents(config, industryData),
    integrations: config.includeIntegrations ? generateIntegrations(config, industryData) : [],
    insights: generateInsights(config, industryData),
    recommendations: generateRecommendations(config, industryData),
  };
}

/**
 * Industry-specific templates
 */
function getIndustryTemplate(industry: IndustryType) {
  const templates = {
    ecommerce: {
      name: 'E-commerce',
      metrics: {
        revenueBase: 50000,
        customerBase: 1200,
        conversionRate: 3.2,
        avgOrderValue: 85,
      },
      activities: [
        'New product listing',
        'Order fulfillment',
        'Customer support ticket',
        'Marketing campaign',
        'Inventory update',
      ],
      clients: [
        'Wholesale distributor',
        'Retail partner',
        'Dropshipping customer',
      ],
      integrations: ['shopify', 'stripe', 'mailchimp', 'google_analytics'],
    },
    saas: {
      name: 'SaaS',
      metrics: {
        revenueBase: 75000,
        customerBase: 350,
        conversionRate: 2.1,
        avgOrderValue: 215,
      },
      activities: [
        'New subscription',
        'Feature deployment',
        'Customer onboarding',
        'Bug fix',
        'API integration',
      ],
      clients: [
        'Enterprise client',
        'Startup',
        'Educational institution',
      ],
      integrations: ['stripe', 'slack', 'github', 'intercom'],
    },
    agency: {
      name: 'Marketing Agency',
      metrics: {
        revenueBase: 45000,
        customerBase: 25,
        conversionRate: 15.5,
        avgOrderValue: 1800,
      },
      activities: [
        'Campaign launch',
        'Client report',
        'Content creation',
        'SEO audit',
        'Social media post',
      ],
      clients: [
        'Local business',
        'E-commerce brand',
        'B2B service provider',
      ],
      integrations: ['hubspot', 'google_ads', 'facebook', 'semrush'],
    },
    consulting: {
      name: 'Consulting',
      metrics: {
        revenueBase: 60000,
        customerBase: 12,
        conversionRate: 25.0,
        avgOrderValue: 5000,
      },
      activities: [
        'Strategy session',
        'Client workshop',
        'Report delivery',
        'Proposal sent',
        'Follow-up meeting',
      ],
      clients: [
        'Fortune 500',
        'Mid-market company',
        'Government agency',
      ],
      integrations: ['xero', 'microsoft_teams', 'zoom', 'notion'],
    },
    retail: {
      name: 'Retail',
      metrics: {
        revenueBase: 35000,
        customerBase: 5000,
        conversionRate: 1.8,
        avgOrderValue: 45,
      },
      activities: [
        'Store opening',
        'Promotion launch',
        'Staff training',
        'Inventory count',
        'Customer feedback',
      ],
      clients: [
        'Local consumer',
        'Corporate gift buyer',
        'Online shopper',
      ],
      integrations: ['square', 'quickbooks', 'instagram', 'tiktok'],
    },
    default: {
      name: 'General Business',
      metrics: {
        revenueBase: 40000,
        customerBase: 150,
        conversionRate: 5.0,
        avgOrderValue: 267,
      },
      activities: [
        'New lead',
        'Proposal sent',
        'Meeting scheduled',
        'Document created',
        'Task completed',
      ],
      clients: [
        'Small business',
        'Individual',
        'Corporate',
      ],
      integrations: ['xero', 'google_workspace', 'slack', 'stripe'],
    },
  };

  return templates[industry] || templates.default;
}

/**
 * Size multipliers for scaling data
 */
function getSizeMultiplier(size: 'small' | 'medium' | 'large') {
  return {
    small: 0.5,
    medium: 1,
    large: 2.5,
  }[size];
}

/**
 * Generate realistic metrics
 */
function generateMetrics(config: DemoDataConfig, multiplier: number): DemoMetrics {
  const template = getIndustryTemplate(config.industry);
  const baseRevenue = template.metrics.revenueBase * multiplier;
  const baseCustomers = Math.floor(template.metrics.customerBase * multiplier);
  
  // Add some randomness
  const revenueCurrent = baseRevenue * (0.9 + Math.random() * 0.2);
  const revenuePrevious = baseRevenue * (0.85 + Math.random() * 0.15);
  const revenueGrowth = ((revenueCurrent - revenuePrevious) / revenuePrevious) * 100;
  
  const newCustomers = Math.floor(baseCustomers * 0.1 * (0.8 + Math.random() * 0.4));
  const churnedCustomers = Math.floor(newCustomers * (0.1 + Math.random() * 0.2));
  
  return {
    revenue: {
      current: Math.round(revenueCurrent),
      previous: Math.round(revenuePrevious),
      growth: parseFloat(revenueGrowth.toFixed(1)),
    },
    customers: {
      total: baseCustomers,
      new: newCustomers,
      churned: churnedCustomers,
    },
    conversions: {
      rate: template.metrics.conversionRate * (0.9 + Math.random() * 0.2),
      total: Math.floor(baseCustomers * (template.metrics.conversionRate / 100) * (0.8 + Math.random() * 0.4)),
    },
    engagement: {
      activeUsers: Math.floor(baseCustomers * 0.3 * (0.7 + Math.random() * 0.6)),
      sessions: Math.floor(baseCustomers * 2.5 * (0.8 + Math.random() * 0.4)),
      avgSessionDuration: 3.5 + Math.random() * 2.5,
    },
  };
}

/**
 * Generate activity feed
 */
function generateActivities(config: DemoDataConfig, industryData: any, multiplier: number): DemoActivity[] {
  const activities: DemoActivity[] = [];
  const activityCount = 15 * multiplier;
  const activityTypes: DemoActivity['type'][] = ['integration', 'ai_agent', 'analytics', 'client', 'system'];
  const users = ['Alex Johnson', 'Sam Wilson', 'Taylor Smith', 'Jordan Lee', 'Morgan Chen'];
  
  const now = new Date();
  
  for (let i = 0; i < activityCount; i++) {
    const hoursAgo = Math.floor(Math.random() * 48);
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    const activityTemplates = {
      integration: {
        title: `${industryData.integrations[Math.floor(Math.random() * industryData.integrations.length)]} connected`,
        description: 'New integration successfully configured and synced',
      },
      ai_agent: {
        title: 'AI Agent completed analysis',
        description: 'Generated insights from customer behavior data',
      },
      analytics: {
        title: 'New analytics report',
        description: 'Monthly performance metrics compiled',
      },
      client: {
        title: 'New client onboarded',
        description: 'Completed initial setup and training',
      },
      system: {
        title: 'System update',
        description: 'Performance improvements deployed',
      },
    };
    
    activities.push({
      id: `activity-${i}`,
      type,
      title: activityTemplates[type].title,
      description: activityTemplates[type].description,
      timestamp,
      user,
      metadata: {
        priority: Math.random() > 0.7 ? 'high' : 'normal',
      },
    });
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Generate client data
 */
function generateClients(config: DemoDataConfig, industryData: any, multiplier: number): DemoClient[] {
  const clients: DemoClient[] = [];
  const clientCount = Math.max(5, Math.floor(industryData.metrics.customerBase * 0.02 * multiplier));
  
  const statuses: DemoClient['status'][] = ['active', 'pending', 'inactive'];
  const statusWeights = [0.7, 0.2, 0.1];
  
  const now = new Date();
  
  for (let i = 0; i < clientCount; i++) {
    const statusIndex = weightedRandom(statusWeights);
    const status = statuses[statusIndex];
    const daysSinceActivity = status === 'active' 
      ? Math.floor(Math.random() * 7)
      : Math.floor(7 + Math.random() * 30);
    
    const lifetimeValue = industryData.metrics.avgOrderValue * (1 + Math.random() * 3);
    
    clients.push({
      id: `client-${i}`,
      name: `${industryData.clients[Math.floor(Math.random() * industryData.clients.length)]} ${i + 1}`,
      email: `client${i + 1}@example.com`,
      industry: industryData.name,
      status,
      lifetimeValue: Math.round(lifetimeValue),
      lastActivity: new Date(now.getTime() - daysSinceActivity * 24 * 60 * 60 * 1000),
      tags: status === 'active' ? ['premium', 'recurring'] : ['new', 'prospect'],
    });
  }
  
  return clients;
}

/**
 * Generate AI agents
 */
function generateAIAgents(config: DemoDataConfig, industryData: any): DemoAIAgent[] {
  const agents = [
    {
      id: 'agent-1',
      name: 'Sales Predictor',
      description: 'Analyzes historical data to forecast sales trends',
      status: 'active' as const,
      tasksCompleted: 1247,
      accuracy: 92.5,
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'agent-2',
      name: 'Customer Insights',
      description: 'Identifies patterns in customer behavior',
      status: 'active' as const,
      tasksCompleted: 892,
      accuracy: 88.3,
      lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: 'agent-3',
      name: 'Marketing Optimizer',
      description: 'Suggests improvements for marketing campaigns',
      status: 'training' as const,
      tasksCompleted: 156,
      accuracy: 76.2,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 'agent-4',
      name: 'Financial Analyst',
      description: 'Monitors cash flow and financial health',
      status: 'idle' as const,
      tasksCompleted: 543,
      accuracy: 95.1,
      lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];
  
  return agents;
}

/**
 * Generate integrations
 */
function generateIntegrations(config: DemoDataConfig, industryData: any): DemoIntegration[] {
  const integrationTypes = {
    shopify: { name: 'Shopify', type: 'ecommerce' as const },
    stripe: { name: 'Stripe', type: 'accounting' as const },
    xero: { name: 'Xero', type: 'accounting' as const },
    quickbooks: { name: 'QuickBooks', type: 'accounting' as const },
    hubspot: { name: 'HubSpot', type: 'crm' as const },
    google_ads: { name: 'Google Ads', type: 'marketing' as const },
    facebook: { name: 'Facebook', type: 'marketing' as const },
    slack: { name: 'Slack', type: 'communication' as const },
    google_workspace: { name: 'Google Workspace', type: 'communication' as const },
    mailchimp: { name: 'Mailchimp', type: 'marketing' as const },
    semrush: { name: 'SEMrush', type: 'marketing' as const },
    intercom: { name: 'Intercom', type: 'crm' as const },
    github: { name: 'GitHub', type: 'communication' as const },
    microsoft_teams: { name: 'Microsoft Teams', type: 'communication' as const },
    zoom: { name: 'Zoom', type: 'communication' as const },
    notion: { name: 'Notion', type: 'communication' as const },
    square: { name: 'Square', type: 'accounting' as const },
    instagram: { name: 'Instagram', type: 'marketing' as const },
    tiktok: { name: 'TikTok', type: 'marketing' as const },
    google_analytics: { name: 'Google Analytics', type: 'analytics' as const },
  };
  
  const integrations: DemoIntegration[] = [];
  const now = new Date();
  
  industryData.integrations.forEach((integrationId: string, index: number) => {
    const integration = integrationTypes[integrationId as keyof typeof integrationTypes];
    if (!integration) return;
    
    const hoursSinceSync = Math.floor(Math.random() * 24);
    const status: DemoIntegration['status'] = Math.random() > 0.2 ? 'connected' : 'pending';
    
    integrations.push({
      id: `integration-${index}`,
      name: integration.name,
      type: integration.type,
      status,
      lastSync: new Date(now.getTime() - hoursSinceSync * 60 * 60 * 1000),
      dataPoints: Math.floor(1000 + Math.random() * 9000),
    });
  });
  
  return integrations;
}

/**
 * Generate insights
 */
function generateInsights(config: DemoDataConfig, industryData: any) {
  const insights = [
    {
      id: 'insight-1',
      title: 'Revenue Growth Opportunity',
      description: `Your ${industryData.name.toLowerCase()} business could increase revenue by 15% by optimizing pricing during peak hours.`,
      impact: 'high',
      category: 'revenue',
    },
    {
      id: 'insight-2',
      title: 'Customer Retention',
      description: 'Customers who engage with support in the first week have 40% higher retention.',
      impact: 'medium',
      category: 'customers',
    },
    {
      id: 'insight-3',
      title: 'Operational Efficiency',
      description: 'Automating invoice processing could save 8 hours per week.',
      impact: 'high',
      category: 'operations',
    },
    {
      id: 'insight-4',
      title: 'Marketing ROI',
      description: 'Social media campaigns are generating 3x ROI compared to email marketing.',
      impact: 'medium',
      category: 'marketing',
    },
    {
      id: 'insight-5',
      title: 'Seasonal Trends',
      description: 'Sales typically increase by 25% during the holiday season. Plan inventory accordingly.',
      impact: 'medium',
      category: 'planning',
    },
  ];
  
  return insights;
}

/**
 * Generate recommendations
 */
function generateRecommendations(config: DemoDataConfig, industryData: any) {
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Connect Payment Processor',
      description: 'Integrate with Stripe to automate invoicing and payment collection.',
      priority: 'high',
      estimatedTime: '15 minutes',
      category: 'integrations',
    },
    {
      id: 'rec-2',
      title: 'Set Up AI Sales Agent',
      description: 'Configure the Sales Predictor agent to forecast next quarter revenue.',
      priority: 'medium',
      estimatedTime: '30 minutes',
      category: 'ai_agents',
    },
    {
      id: 'rec-3',
      title: 'Import Customer Data',
      description: 'Upload your customer list to enable personalized marketing campaigns.',
      priority: 'high',
      estimatedTime: '10 minutes',
      category: 'data',
    },
    {
      id: 'rec-4',
      title: 'Schedule Weekly Reports',
      description: 'Set up automated reports to track key metrics every Monday.',
      priority: 'low',
      estimatedTime: '5 minutes',
      category: 'analytics',
    },
  ];
  
  return recommendations;
}

/**
 * Helper function for weighted random selection
 */
function weightedRandom(weights: number[]): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * total;
  
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i;
    }
  }
  
  return weights.length - 1;
}

/**
 * Toggle demo mode in localStorage
 */
export function toggleDemoMode(enable: boolean) {
  if (typeof window !== 'undefined') {
    if (enable) {
      localStorage.setItem('cazza_demo_mode', 'true');
      localStorage.setItem('cazza_demo_industry', 'ecommerce');
      localStorage.setItem('cazza_demo_size', 'medium');
    } else {
      localStorage.removeItem('cazza_demo_mode');
      localStorage.removeItem('cazza_demo_industry');
      localStorage.removeItem('cazza_demo_size');
    }
  }
}

/**
 * Check if demo mode is active
 */
export function isDemoModeActive(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cazza_demo_mode') === 'true';
  }
  return false;
}

/**
 * Get current demo configuration
 */
export function getDemoConfig(): DemoDataConfig | null {
  if (!isDemoModeActive()) return null;
  
  if (typeof window !== 'undefined') {
    return {
      industry: (localStorage.getItem('cazza_demo_industry') || 'ecommerce') as IndustryType,
      companySize: (localStorage.getItem('cazza_demo_size') || 'medium') as 'small' | 'medium' | 'large',
      includeIntegrations: true,
      timePeriod: 'month',
    };
  }
  
  return null;
}

/**
 * Quick demo data for immediate use
 */
export function getQuickDemoData() {
  return generateDemoData({
    industry: 'ecommerce',
    companySize: 'medium',
    includeIntegrations: true,
    timePeriod: 'month',
  });
}