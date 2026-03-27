/**
 * Context7 API Integration for Cazza.ai Frontend
 * 
 * This module provides functions to interact with the Context7 AI agent API
 * through the Cazza.ai backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface AIAgent {
  agent_id: string
  agent_type: string
  name: string
  description: string
  personality_traits: string[]
  response_style: string
  temperature: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  session_id: string
  agent_id: string
  status: string
  started_at?: string
  estimated_completion?: string
  tokens_processed: number
}

export interface QueryRequest {
  query: string
  context?: Record<string, any>
  stream?: boolean
}

export interface QueryResponse {
  response: string
  agent_id: string
  session_id?: string
  tokens_used: number
  processing_time_ms: number
  confidence_score?: number
}

export interface KnowledgeItem {
  id: string
  title: string
  content: string
  type: 'document' | 'database' | 'web' | 'manual'
  tags: string[]
  agent: string
  lastUpdated: string
  size: string
  status: 'active' | 'pending' | 'archived'
}

export interface Deployment {
  id: string
  agent: string
  version: string
  environment: 'development' | 'staging' | 'production'
  status: 'active' | 'deploying' | 'paused' | 'failed'
  deployedAt: string
  deployedBy: string
  endpoints: string[]
  metrics: {
    uptime: string
    requests: number
    avgResponseTime: number
    errorRate: number
  }
}

class Context7API {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // AI Agents Management
  async listAgents(): Promise<AIAgent[]> {
    return this.request('/api/v1/ai-agents/')
  }

  async createAgent(agentData: {
    agent_id: string
    agent_type: string
    name: string
    description: string
    personality_traits?: string[]
    response_style?: string
    temperature?: number
  }): Promise<AIAgent> {
    return this.request('/api/v1/ai-agents/', {
      method: 'POST',
      body: JSON.stringify(agentData),
    })
  }

  async getAgent(agentId: string): Promise<AIAgent> {
    return this.request(`/api/v1/ai-agents/${agentId}`)
  }

  // Training
  async trainAgent(agentId: string, clientId: string, dataSources?: any[]): Promise<TrainingSession> {
    return this.request(`/api/v1/ai-agents/${agentId}/train`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        data_sources: dataSources || [],
      }),
    })
  }

  async getTrainingStatus(sessionId: string): Promise<TrainingSession> {
    return this.request(`/api/v1/training-sessions/${sessionId}`)
  }

  // Querying
  async queryAgent(agentId: string, queryData: QueryRequest): Promise<QueryResponse> {
    return this.request(`/api/v1/ai-agents/${agentId}/query`, {
      method: 'POST',
      body: JSON.stringify(queryData),
    })
  }

  // Knowledge Base
  async listKnowledgeItems(agentId?: string): Promise<KnowledgeItem[]> {
    const endpoint = agentId 
      ? `/api/v1/knowledge?agent_id=${agentId}`
      : '/api/v1/knowledge'
    return this.request(endpoint)
  }

  async addKnowledgeItem(item: {
    title: string
    content: string
    type: KnowledgeItem['type']
    tags: string[]
    agent_id?: string
  }): Promise<KnowledgeItem> {
    return this.request('/api/v1/knowledge', {
      method: 'POST',
      body: JSON.stringify(item),
    })
  }

  // Performance Monitoring
  async getAgentPerformance(agentId: string, timeRange: string = '7d'): Promise<any> {
    return this.request(`/api/v1/agents/${agentId}/performance?range=${timeRange}`)
  }

  // Conversation History
  async getConversations(filters?: {
    agent_id?: string
    start_date?: string
    end_date?: string
    limit?: number
  }): Promise<any[]> {
    const params = new URLSearchParams()
    if (filters?.agent_id) params.append('agent_id', filters.agent_id)
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    return this.request(`/api/v1/conversations?${params.toString()}`)
  }

  // Deployment Management
  async listDeployments(environment?: string): Promise<Deployment[]> {
    const endpoint = environment
      ? `/api/v1/deployments?environment=${environment}`
      : '/api/v1/deployments'
    return this.request(endpoint)
  }

  async deployAgent(deploymentData: {
    agent_id: string
    version: string
    environment: Deployment['environment']
    notes?: string
  }): Promise<Deployment> {
    return this.request('/api/v1/deployments', {
      method: 'POST',
      body: JSON.stringify(deploymentData),
    })
  }

  async rollbackDeployment(deploymentId: string): Promise<void> {
    return this.request(`/api/v1/deployments/${deploymentId}/rollback`, {
      method: 'POST',
    })
  }

  // Predefined Agents
  async getPredefinedAgents(): Promise<any[]> {
    return this.request('/api/v1/ai-agents/predefined')
  }
}

// Singleton instance
export const context7API = new Context7API()

// React Query hooks (optional - for use with TanStack Query)
export const context7QueryKeys = {
  all: ['context7'] as const,
  agents: () => [...context7QueryKeys.all, 'agents'] as const,
  agent: (id: string) => [...context7QueryKeys.agents(), id] as const,
  training: (agentId?: string) => [...context7QueryKeys.all, 'training', agentId] as const,
  knowledge: (agentId?: string) => [...context7QueryKeys.all, 'knowledge', agentId] as const,
  conversations: (filters?: any) => [...context7QueryKeys.all, 'conversations', filters] as const,
  deployments: (environment?: string) => [...context7QueryKeys.all, 'deployments', environment] as const,
  performance: (agentId: string, range: string) => [...context7QueryKeys.all, 'performance', agentId, range] as const,
}

export default context7API