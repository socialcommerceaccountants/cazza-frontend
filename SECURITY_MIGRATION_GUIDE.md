# Security Migration Guide

## Overview
This guide helps developers migrate existing components from the old vulnerable authentication system to the new secure authentication system.

## Quick Reference

### Import Changes
| Old Import | New Import | Purpose |
|------------|------------|---------|
| `import { authService } from '@/lib/api/auth'` | `import { secureAuthService } from '@/lib/security/auth'` | Authentication service |
| `import { apiClient } from '@/lib/api/client'` | `import { secureApiClient } from '@/lib/security/api-client'` | API client |
| `import { AuthProvider } from '@/components/auth/auth-provider'` | `import { SecurityProvider } from '@/components/security/AuthProvider'` | Auth provider |
| `import { useAuth } from '@/lib/store/auth-store'` | `import { useSecureAuth } from '@/components/security/AuthProvider'` | Auth hook |

## Component Migration Examples

### 1. Login Component Migration

#### Old (Vulnerable) Login:
```typescript
// components/auth/login-form.tsx (OLD)
import { useAuthContext } from './auth-provider';

export function LoginForm() {
  const { login, isLoading } = useAuthContext();
  
  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
    // Token stored in localStorage (VULNERABLE)
  };
}
```

#### New (Secure) Login:
```typescript
// components/auth/login-form.tsx (NEW)
import { useSecureAuth } from '@/components/security/AuthProvider';

export function LoginForm() {
  const { login, isLoading } = useSecureAuth();
  
  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
    // Token stored in HttpOnly cookie (SECURE)
  };
}
```

### 2. API Call Migration

#### Old (Vulnerable) API Call:
```typescript
// lib/api/analytics.ts (OLD)
import { apiClient } from './client';
import { authService } from './auth';

export async function getAnalyticsData() {
  // Manually add token from localStorage
  const token = authService.getToken(); // VULNERABLE
  
  return apiClient.get('/analytics', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
```

#### New (Secure) API Call:
```typescript
// lib/api/analytics.ts (NEW)
import { secureApiClient } from '@/lib/security/api-client';

export async function getAnalyticsData() {
  // Token automatically included from HttpOnly cookie
  // CSRF token automatically added for mutating requests
  return secureApiClient.get('/analytics');
}
```

### 3. Protected Route Migration

#### Old (Manual Protection):
```typescript
// app/dashboard/page.tsx (OLD)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Manual check using localStorage
    if (!authService.isAuthenticated()) { // VULNERABLE
      router.push('/login');
    }
  }, []);
  
  return <div>Dashboard</div>;
}
```

#### New (Automatic Protection):
```typescript
// app/dashboard/page.tsx (NEW)
import { ProtectedRoute } from '@/components/security/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <div>Dashboard</div>
    </ProtectedRoute>
  );
}

// OR using the HOC:
import { withProtectedRoute } from '@/components/security/ProtectedRoute';

function DashboardContent() {
  return <div>Dashboard</div>;
}

export default withProtectedRoute(DashboardContent, { requiredRole: 'user' });
```

### 4. Auth Hook Migration

#### Old Zustand Store:
```typescript
// components/user-profile.tsx (OLD)
import { useAuth } from '@/lib/store/auth-store';

export function UserProfile() {
  const { user, token, logout } = useAuth();
  // token is from localStorage (VULNERABLE)
  
  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### New Secure Hook:
```typescript
// components/user-profile.tsx (NEW)
import { useSecureAuth } from '@/components/security/AuthProvider';

export function UserProfile() {
  const { user, logout } = useSecureAuth();
  // No token access (SECURE - HttpOnly cookie)
  
  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## File-by-File Migration

### 1. Update `app/layout.tsx`
```diff
- import { AuthProvider } from '@/components/auth/auth-provider';
+ import { SecurityProvider } from '@/components/security/AuthProvider';
+ import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create query client
+ const queryClient = new QueryClient();

// In the component
- <AuthProvider>
-   {children}
- </AuthProvider>
+ <QueryClientProvider client={queryClient}>
+   <SecurityProvider>
+     {children}
+   </SecurityProvider>
+ </QueryClientProvider>
```

### 2. Update API Service Files
For each API service file (`lib/api/*.ts`):

```diff
- import { apiClient } from './client';
+ import { secureApiClient } from '@/lib/security/api-client';

// Remove any manual token handling
- const token = localStorage.getItem('token');
- const headers = { Authorization: `Bearer ${token}` };
```

### 3. Update Components Using Authentication
For each component that uses authentication:

```diff
- import { useAuth } from '@/lib/store/auth-store';
- import { useAuthContext } from '@/components/auth/auth-provider';
+ import { useSecureAuth } from '@/components/security/AuthProvider';

// In the component
- const { user, token, login, logout } = useAuth();
+ const { user, login, logout } = useSecureAuth();
// Note: token is no longer accessible (by design)
```

### 4. Update Pages Needing Protection
For each page that needs authentication:

**Option A: Wrap with ProtectedRoute**
```diff
+ import { ProtectedRoute } from '@/components/security/ProtectedRoute';

export default function Page() {
  return (
+   <ProtectedRoute requiredRole="user">
      <PageContent />
+   </ProtectedRoute>
  );
}
```

**Option B: Use HOC**
```diff
+ import { withProtectedRoute } from '@/components/security/ProtectedRoute';

function PageContent() {
  return <div>Content</div>;
}

- export default PageContent;
+ export default withProtectedRoute(PageContent, { requiredRole: 'user' });
```

## Common Migration Issues & Solutions

### Issue 1: "token is undefined" errors
**Cause**: Trying to access token directly after migration
**Solution**: Remove token access - it's now in HttpOnly cookie

```diff
- const token = authService.getToken();
- // Do something with token
+ // Token is automatically managed in HttpOnly cookie
+ // No need to access it directly
```

### Issue 2: API calls failing with 403 (CSRF)
**Cause**: Missing CSRF token for mutating requests
**Solution**: Use secureApiClient which automatically adds CSRF tokens

```diff
- await fetch('/api/endpoint', {
-   method: 'POST',
-   body: JSON.stringify(data)
- });
+ await secureApiClient.post('/api/endpoint', data);
```

### Issue 3: Authentication state not persisting
**Cause**: Relying on localStorage state
**Solution**: Use the secure auth hooks which check server-side authentication

```diff
- const isAuthenticated = localStorage.getItem('token') !== null;
+ const { isAuthenticated } = useSecureAuth();
```

### Issue 4: Role-based access not working
**Cause**: Manual role checking instead of using ProtectedRoute
**Solution**: Use RoleGuard or ProtectedRoute components

```diff
- if (user.role !== 'admin') return null;
+ <RoleGuard requiredRole="admin">
+   <AdminContent />
+ </RoleGuard>
```

## Testing Migration

### 1. Verify No localStorage Usage
```bash
# Search for localStorage usage
grep -r "localStorage" src/ --include="*.ts" --include="*.tsx"

# Should only find:
# - Comments about not using localStorage
# - Migration cleanup code
# - No active localStorage usage
```

### 2. Verify No client-side JWT Parsing
```bash
# Search for JWT parsing
grep -r "atob\|JSON.parse.*split\|jwt-decode" src/ --include="*.ts" --include="*.tsx"

# Should find no results (except in comments or tests)
```

### 3. Verify Secure Imports
```bash
# Check for old imports
grep -r "from '@/lib/api/auth'\|from '@/lib/api/client'" src/ --include="*.ts" --include="*.tsx"

# Should find no results (all migrated)
```

### 4. Test Authentication Flows
1. Login → Should set HttpOnly cookies
2. Logout → Should clear cookies
3. Page refresh → Should maintain authentication
4. New tab → Should maintain authentication

## Backend Coordination

### Required Backend Changes
1. **Update authentication endpoints** to set HttpOnly cookies
2. **Implement CSRF token generation/validation**
3. **Add token refresh endpoint**
4. **Update CORS configuration** to include credentials

### Example Backend Response (Login)
```javascript
// OLD: Returns token in response body
res.json({ token: 'jwt-token', user: { ... } });

// NEW: Sets HttpOnly cookies and returns CSRF token
res.cookie('auth_token', 'jwt-token', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});

res.cookie('csrf_token', 'csrf-token', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});

res.json({
  user: { ... },
  csrfToken: 'csrf-token' // For client-side storage
});
```

## Performance Considerations

### Bundle Size Impact
The new security libraries add some bundle size:
- `lib/security/*`: ~15KB minified
- Security components: ~10KB minified
- Total impact: ~25KB (gzipped: ~8KB)

### Runtime Performance
- **Authentication checks**: Now server-side calls (~100-300ms)
- **CSRF tokens**: Minimal overhead (~1ms per request)
- **Cookie management**: Browser handles automatically

### Caching Strategy
- User data cached with React Query (5 minute stale time)
- Auth status cached (1 minute stale time)
- CSRF tokens cached in memory

## Fallback Strategies

### For Older Browsers
If HttpOnly cookies aren't supported (very rare):
```typescript
// In secureApiClient
if (!supportsHttpOnlyCookies()) {
  // Fallback to secure sessionStorage with short expiry
  // Only for critical browsers that don't support HttpOnly
}
```

### For Development Environment
```typescript
// In development, cookies might not be Secure
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false in dev
  sameSite: 'lax' // 'strict' in production
};
```

## Monitoring After Migration

### Key Metrics to Watch
1. **Authentication success rate** (should remain > 99%)
2. **CSRF validation failures** (should be near 0%)
3. **API error rates** (should not increase significantly)
4. **User support tickets** related to authentication

### Alerting Rules
- Authentication failures > 5%
- CSRF failures > 1%
- API 403 errors spike
- User complaints about login issues

## Rollback Procedure

If migration causes issues:

### Immediate Rollback
1. Revert `app/layout.tsx` to use old AuthProvider
2. Revert components to use old imports
3. Disable security middleware
4. Re-enable localStorage authentication temporarily

### Data Preservation
- User sessions will be lost during rollback (cookies vs localStorage)
- Inform users to log in again
- No data loss expected

## Support Resources

### Documentation
- [Security Architecture](./SECURITY_ARCHITECTURE.md)
- [Security Fixes Report](./SECURITY_FIXES_REPORT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

### Code Examples
- `examples/secure-login.tsx` - Complete secure login example
- `examples/protected-route.tsx` - Route protection examples
- `examples/secure-api-call.tsx` - API call examples

### Troubleshooting Guide
Common issues and solutions are documented in the team wiki.

## Final Verification Checklist

- [ ] All localStorage usage removed
- [ ] All client-side JWT parsing removed
- [ ] All components use secure imports
- [ ] All API calls use secureApiClient
- [ ] All protected routes use ProtectedRoute
- [ ] Backend updated to support new authentication
- [ ] CSRF protection working
- [ ] Authentication flows tested
- [ ] Browser compatibility verified
- [ ] Performance impact acceptable
- [ ] Monitoring configured
- [ ] Rollback plan ready

## Getting Help

For migration assistance:
1. Check the troubleshooting guide
2. Review code examples
3. Ask in #security-migration Slack channel
4. Contact the security team

## Timeline

**Phase 1 (Week 1)**: Update layout and providers
**Phase 2 (Week 2)**: Migrate API services
**Phase 3 (Week 3)**: Migrate components
**Phase 4 (Week 4)**: Testing and deployment

Each phase should be completed and tested before moving to the next.