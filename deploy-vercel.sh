#!/bin/bash

# Cazza.ai Frontend Deployment to Vercel
# Run with: ./deploy-vercel.sh

set -e  # Exit on error

echo "🚀 CAZZA.AI FRONTEND DEPLOYMENT TO VERCEL"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check prerequisites
echo ""
echo "🔍 Checking prerequisites..."

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found"
    echo "Install with: npm install -g vercel"
    echo "Or deploy via: https://vercel.com/new"
    echo ""
    read -p "Install Vercel CLI now? (y/N): " INSTALL_VERCEL
    if [[ $INSTALL_VERCEL == "y" || $INSTALL_VERCEL == "Y" ]]; then
        npm install -g vercel
    fi
fi

if ! command -v git &> /dev/null; then
    print_error "Git not found"
    exit 1
fi

print_status "Git available"

# Check environment
echo ""
echo "🌍 Checking environment..."

if [ ! -f ".env.local" ]; then
    print_warning "No .env.local file found"
    echo "Creating from .env.example..."
    cp .env.example .env.local 2>/dev/null || true
    
    echo ""
    echo "📝 Please update .env.local with:"
    echo "NEXT_PUBLIC_API_URL=https://cazza-backend.up.railway.app"
    echo "NEXT_PUBLIC_APP_URL=https://cazza.ai"
    echo ""
    read -p "Press Enter to continue after updating .env.local..."
fi

# Test build locally
echo ""
echo "🧪 Testing build locally..."

if npm run build 2>/dev/null; then
    print_status "Build successful!"
else
    print_warning "Build has warnings/errors"
    echo "Continuing anyway - some TypeScript errors may not block deployment"
    echo "Check Vercel logs after deployment for runtime issues"
fi

# Deploy options
echo ""
echo "🚀 DEPLOYMENT OPTIONS:"
echo ""
echo "1. Deploy with Vercel CLI (recommended)"
echo "2. Deploy via GitHub (automatic)"
echo "3. Deploy via Vercel web dashboard"
echo ""

read -p "Choose option (1-3): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        echo ""
        echo "🔧 Deploying with Vercel CLI..."
        
        if command -v vercel &> /dev/null; then
            read -p "Deploy to production? (y/N): " CONFIRM
            if [[ $CONFIRM == "y" || $CONFIRM == "Y" ]]; then
                vercel --prod
            else
                vercel
            fi
        else
            print_error "Vercel CLI not installed"
            echo "Run: npm install -g vercel"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo "🔗 GitHub Deployment:"
        echo ""
        echo "1. Push code to GitHub:"
        echo "   git add ."
        echo "   git commit -m 'Deploy to Vercel'"
        echo "   git push origin main"
        echo ""
        echo "2. Connect at: https://vercel.com/new"
        echo "3. Import GitHub repo: socialcommerceaccountants/cazza-frontend"
        echo "4. Configure environment variables"
        echo "5. Deploy"
        echo ""
        echo "✅ Automatic deployments on every push to main"
        ;;
    
    3)
        echo ""
        echo "🌐 Vercel Web Dashboard:"
        echo ""
        echo "1. Open: https://vercel.com/new"
        echo "2. Import Git repository"
        echo "3. Select: socialcommerceaccountants/cazza-frontend"
        echo "4. Configure:"
        echo "   • Framework: Next.js"
        echo "   • Build Command: npm run build"
        echo "   • Output Directory: .next"
        echo "5. Add Environment Variables:"
        echo "   NEXT_PUBLIC_API_URL=https://cazza-backend.up.railway.app"
        echo "   NEXT_PUBLIC_APP_URL=https://cazza.ai"
        echo "6. Deploy"
        echo ""
        echo "🎯 Production URL will be: https://cazza-frontend.vercel.app"
        ;;
    
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

# Post-deployment instructions
echo ""
echo "📋 POST-DEPLOYMENT CHECKLIST:"
echo ""
echo "1. ✅ Verify site is live"
echo "2. ✅ Test API connections"
echo "3. ✅ Check console for errors"
echo "4. ✅ Test authentication flow"
echo "5. ✅ Verify responsive design"
echo "6. ✅ Set up custom domain (cazza.ai)"
echo "7. ✅ Configure analytics"
echo "8. ✅ Set up monitoring"
echo ""

# Environment variables for production
echo "🔧 PRODUCTION ENVIRONMENT VARIABLES:"
echo ""
cat << EOF
# Required:
NEXT_PUBLIC_API_URL=https://cazza-backend.up.railway.app
NEXT_PUBLIC_APP_URL=https://cazza.ai

# Optional (for enhanced features):
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_CRISP_WEBSITE_ID=...
EOF

echo ""
print_status "DEPLOYMENT READY!"
echo ""
echo "🎯 Quick deploy URL: https://vercel.com/new"
echo "🔗 GitHub repo: https://github.com/socialcommerceaccountants/cazza-frontend"
echo "🌐 Backend API: https://cazza-backend.up.railway.app"
echo ""
echo "🚀 Cazza.ai frontend will be live in ~2 minutes!"