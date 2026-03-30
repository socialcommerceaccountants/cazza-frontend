#!/bin/bash

# Simple backend connection test for Cazza.ai

echo "🚀 CAZZA.AI BACKEND CONNECTION TEST"
echo "==================================="

BACKEND_URL="https://cazza-backend.up.railway.app"

echo ""
echo "🔗 Testing connection to: $BACKEND_URL"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl not found. Install curl or test manually."
    exit 1
fi

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "   ✅ Health: 200 OK"
else
    echo "   ⚠️  Health: $HEALTH_RESPONSE (might be 404 if route not defined)"
fi

# Test API root
echo "2. Testing API root..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/" 2>/dev/null)
if [ "$API_RESPONSE" = "200" ]; then
    echo "   ✅ API root: 200 OK"
elif [ "$API_RESPONSE" = "401" ]; then
    echo "   ✅ API root: 401 (requires authentication - normal)"
else
    echo "   ⚠️  API root: $API_RESPONSE"
fi

# Test OpenAPI docs
echo "3. Testing OpenAPI docs..."
DOCS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/docs" 2>/dev/null)
if [ "$DOCS_RESPONSE" = "200" ]; then
    echo "   ✅ Docs: 200 OK"
else
    echo "   ⚠️  Docs: $DOCS_RESPONSE"
fi

# Create frontend configuration
echo ""
echo "🔧 FRONTEND CONFIGURATION:"
echo "=========================="

cat > .env.local << EOF
# Cazza.ai Frontend Configuration
# Generated $(date)

# Backend API URL
NEXT_PUBLIC_API_URL=$BACKEND_URL

# App URL
NEXT_PUBLIC_APP_URL=https://cazza.ai

# Optional integrations (uncomment and add your keys)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# NEXT_PUBLIC_SENTRY_DSN=https://...
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Feature flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_TEAMS=true
EOF

echo "✅ Created .env.local configuration file"
echo ""
echo "📋 Configuration summary:"
echo "------------------------"
echo "Backend URL: $BACKEND_URL"
echo "App URL: https://cazza.ai"
echo ""

# Create API configuration
mkdir -p lib/config

cat > lib/config/api.ts << 'EOF'
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
EOF

echo "✅ Created API configuration: lib/config/api.ts"
echo ""
echo "🎯 NEXT STEPS:"
echo "============="
echo "1. Review .env.local configuration"
echo "2. Start frontend: npm run dev"
echo "3. Test login/authentication"
echo "4. Check browser console for errors"
echo "5. Deploy to Vercel when ready"
echo ""
echo "✅ Connection test complete!"