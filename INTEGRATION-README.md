# Cazza.ai Frontend Integration - Phase 2

This document outlines the frontend-backend integration implementation for Cazza.ai.

## Overview

The frontend has been integrated with a backend API system with the following components:

1. **API Client Service** - HTTP client with interceptors and error handling
2. **Authentication System** - Login, registration, JWT management
3. **User Context/Provider** - React context for auth state management
4. **Analytics API Integration** - Connection to backend analytics endpoints
5. **Environment Configuration** - Development and production settings
6. **Authentication UI Components** - Login and registration forms
7. **Error Handling** - Comprehensive error management system

## Architecture

### API Client (`/lib/api/client.ts`)
- Singleton HTTP client with interceptors
- Automatic JWT token injection
- Error handling and retry logic
- File upload support
- TypeScript support for all requests

### Authentication (`/lib/api/auth.ts`)
- Login, registration, logout endpoints
- Token refresh mechanism
- User profile management
- Password reset flow
- Social login support (ready for implementation)

### State Management (`/lib/store/auth-store.ts`)
- Zustand store for authentication state
- Persistence to localStorage
- Automatic token validation
- User profile caching

### React Context (`/components/auth/auth-provider.tsx`)
- Provides auth state to entire app
- Handles token refresh automatically
- Protected route HOC (`withAuth`)
- Permission checking hooks

### UI Components
- `LoginForm` - Complete login with validation
- `RegisterForm` - Registration with password strength
- `UserProfile` - User dropdown in sidebar
- Error boundaries and loading states

### Analytics Integration (`/lib/api/analytics.ts`)
- Revenue, CAC, ROI, platform performance endpoints
- Real-time metrics with WebSocket fallback
- React Query hooks for data fetching
- Mock API mode for development

## Environment Configuration

### Required Environment Variables
Create `.env.local` with:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Cazza.ai

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_VERSION=v1

# Authentication
NEXT_PUBLIC_AUTH_URL=http://localhost:3001/auth
NEXT_PUBLIC_AUTH_CLIENT_ID=cazza_frontend
NEXT_PUBLIC_AUTH_REDIRECT_URI=http://localhost:3000/auth/callback

# Feature Flags
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Development Flags
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Mock API mode (set to false when backend is ready)
NEXT_PUBLIC_USE_MOCK_API=true
```

## Development Workflow

### 1. Start Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Test API Connectivity
```bash
# Run the test script
node scripts/test-api-connectivity.js
```

### 3. Development with Mock API
When `NEXT_PUBLIC_USE_MOCK_API=true` (default):
- All API calls return mock data
- No backend required for development
- Perfect for frontend development and testing

### 4. Connect to Real Backend
When `NEXT_PUBLIC_USE_MOCK_API=false`:
- Frontend makes real API calls
- Backend must be running at `NEXT_PUBLIC_API_URL`
- Authentication required for protected endpoints

## Authentication Flow

### Login Process
1. User submits credentials via `LoginForm`
2. `authService.login()` makes API call
3. On success, JWT token is stored in localStorage
4. Auth store updates state
5. User is redirected to dashboard

### Token Management
- JWT tokens automatically injected in requests
- Token expiration checked on app load
- Automatic refresh mechanism (ready for implementation)
- Logout clears all auth data

### Protected Routes
Use the `withAuth` HOC or `useRequireAuth` hook:

```tsx
// Using HOC
export default withAuth(ProtectedComponent, {
  redirectTo: '/login',
  requireAuth: true,
});

// Using hook in component
const { isAuthenticated, isLoading } = useRequireAuth('/login');
```

## Analytics Integration

### Available Hooks
```tsx
// Revenue data
const { data: revenueData, isLoading } = useRevenueData('30d');

// CAC data
const { data: cacData } = useCACData();

// ROI analysis
const { data: roiData } = useROIData();

// Platform performance
const { data: platformData } = usePlatformData();

// Real-time metrics
const { data: realtimeData } = useRealtimeMetrics(true);
```

### Mock vs Real API
The system automatically falls back to mock data when:
- `NEXT_PUBLIC_USE_MOCK_API=true`
- Real API calls fail
- Backend is unreachable

## Error Handling

### Error Types
- `ApiError` - API-level errors (HTTP status codes)
- `AppError` - Application-level errors
- `NetworkError` - Connection issues

### Error Handling Hooks
```tsx
const { handleError, handleSuccess } = useErrorHandler();

// In components
try {
  await apiCall();
  handleSuccess('Operation completed');
} catch (error) {
  handleError(error);
}

// In React Query
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  onError: (error) => handleError(error, { showToast: true }),
});
```

## Testing

### Run Tests
```bash
# Test API connectivity
node scripts/test-api-connectivity.js

# Run frontend tests
npm test

# Run Playwright tests
npm run test:e2e
```

### Test Credentials
When using mock API mode:
- Email: `demo@cazza.ai`
- Password: `demo123`

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Production Environment
Set these in your deployment environment:
- `NEXT_PUBLIC_USE_MOCK_API=false`
- Real backend URLs
- Production API keys
- Disable debug mode

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has CORS configured for frontend domain
   - Check `NEXT_PUBLIC_API_URL` matches backend

2. **Authentication Failures**
   - Check JWT token in localStorage
   - Verify backend auth endpoints are working
   - Check token expiration

3. **API Connection Issues**
   - Run test script: `node scripts/test-api-connectivity.js`
   - Check backend is running
   - Verify network connectivity

4. **TypeScript Errors**
   - Run `npm run type-check`
   - Check import paths
   - Verify TypeScript configuration

### Debug Mode
Set `NEXT_PUBLIC_DEBUG_MODE=true` to enable:
- Console logging of API calls
- Error details in UI
- Performance metrics

## Next Steps

### Phase 3 Integration
1. **Real-time Updates** - Implement WebSocket connections
2. **File Uploads** - Complete file upload service
3. **Webhooks** - Handle backend webhook notifications
4. **Caching** - Implement advanced caching strategies
5. **Offline Support** - Add service worker for offline capability

### Backend Integration Checklist
- [ ] Implement all auth endpoints
- [ ] Create analytics data models
- [ ] Set up WebSocket server
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging

## Support

For issues or questions:
1. Check browser console for errors
2. Run the test script
3. Review environment configuration
4. Check backend server logs
5. Contact development team