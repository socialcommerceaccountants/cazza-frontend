// Frontend API Configuration for Cazza.ai

export const API_CONFIG = {
  // Backend API URL
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://cazza-backend.up.railway.app",
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/v1/auth/login",
      REGISTER: "/api/v1/auth/register",
      LOGOUT: "/api/v1/auth/logout",
      REFRESH: "/api/v1/auth/refresh",
      ME: "/api/v1/auth/me"
    },
    BILLING: {
      SUBSCRIPTIONS: "/api/v1/billing/subscriptions",
      INVOICES: "/api/v1/billing/invoices",
      PAYMENT_METHODS: "/api/v1/billing/payment-methods"
    },
    AI: {
      SUGGEST: "/api/v1/ai-enhanced/suggest",
      TRAIN: "/api/v1/accounting-training/train",
      QUERY: "/api/v1/accounting-training/query"
    },
    INTEGRATIONS: {
      XERO: "/api/v1/xero",
      STRIPE: "/api/v1/billing",
      SHOPIFY: "/api/v1/integrations/shopify"
    }
  },
  
  // Timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT: 30000,
    UPLOAD: 60000,
    AI_QUERY: 45000
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// Environment check
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// API client helper
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.API_URL}${endpoint}`;
}

// Default headers for API requests
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
