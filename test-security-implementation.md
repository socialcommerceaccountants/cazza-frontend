# Security Implementation Test Plan

## Overview
This document outlines how to test the security implementation to ensure all vulnerabilities have been addressed.

## Test Environment Setup

### 1. Backend Mock Server
Create a simple mock backend to test the security features:

```typescript
// test/mock-server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3001;

app.use(cookieParser());
app.use(express.json());

// Mock authentication endpoints
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Set HttpOnly cookies
  res.cookie('auth_token', 'mock-jwt-token', {
    httpOnly: true,
    secure: false, // false for local testing
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
  
  res.cookie('csrf_token', 'mock-csrf-token', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
  
  res.json({
    user: {
      id: '1',
      email,
      name: 'Test User',
      role: 'user',
    },
    csrfToken: 'mock-csrf-token',
    expiresIn: 3600,
  });
});

app.get('/api/v1/auth/status', (req, res) => {
  const authToken = req.cookies.auth_token;
  res.json({
    authenticated: !!authToken,
  });
});

// CSRF-protected endpoint
app.post('/api/v1/protected', (req, res) => {
  const csrfHeader = req.headers['x-csrf-token'];
  const csrfCookie = req.cookies.csrf_token;
  
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      code: 'CSRF_TOKEN_INVALID',
    });
  }
  
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
```

### 2. Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## Test Cases

### Test 1: No localStorage Token Storage
**Objective**: Verify no authentication tokens are stored in localStorage

**Steps**:
1. Start the application
2. Open browser DevTools → Application → Local Storage
3. Log in with test credentials
4. Verify no `auth_token`, `refresh_token`, or `user_profile` in localStorage
5. Check cookies for HttpOnly auth tokens

**Expected Result**:
- No authentication tokens in localStorage
- HttpOnly cookies set for authentication

### Test 2: CSRF Protection
**Objective**: Verify CSRF protection on mutating requests

**Steps**:
1. Log in to get CSRF token
2. Make a POST request without CSRF token
3. Make a POST request with invalid CSRF token
4. Make a POST request with valid CSRF token

**Expected Result**:
- Requests without CSRF token get 403 error
- Requests with invalid CSRF token get 403 error
- Requests with valid CSRF token succeed

### Test 3: Server-side Token Validation
**Objective**: Verify tokens are validated server-side only

**Steps**:
1. Log in and get cookies
2. Try to parse JWT token client-side (should fail or not be accessible)
3. Modify token in cookies (simulate tampering)
4. Try to access protected route

**Expected Result**:
- Cannot access JWT token client-side (HttpOnly)
- Modified tokens rejected by server
- Protected routes inaccessible with invalid tokens

### Test 4: Protected Routes
**Objective**: Verify route protection works correctly

**Steps**:
1. Try to access protected route without authentication
2. Log in and access protected route
3. Log out and try to access protected route again
4. Test role-based access control

**Expected Result**:
- Unauthenticated users redirected to login
- Authenticated users can access protected routes
- Logged out users cannot access protected routes
- Role-based access works correctly

### Test 5: Security Headers
**Objective**: Verify security headers are present

**Steps**:
1. Make request to application
2. Check response headers
3. Verify all security headers are present

**Expected Result**:
- `Content-Security-Policy` header present
- `X-Frame-Options: DENY` present
- `X-Content-Type-Options: nosniff` present
- `Referrer-Policy` present
- `Permissions-Policy` present

### Test 6: Input Validation
**Objective**: Verify input validation prevents XSS and injection

**Steps**:
1. Try to submit form with XSS payload (`<script>alert('xss')</script>`)
2. Try to submit form with SQL injection (`' OR '1'='1`)
3. Try to upload malicious file
4. Test form validation with invalid inputs

**Expected Result**:
- XSS payloads sanitized or rejected
- SQL injection attempts detected
- Malicious files rejected
- Invalid inputs show appropriate errors

### Test 7: Token Refresh
**Objective**: Verify token refresh works automatically

**Steps**:
1. Log in and note token expiry
2. Wait for token to near expiry (or simulate)
3. Make API call that triggers token refresh
4. Verify new tokens are set

**Expected Result**:
- Token refresh happens automatically
- User stays logged in during refresh
- No authentication errors during refresh

### Test 8: Browser Compatibility
**Objective**: Verify security features work across browsers

**Browsers to Test**:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome for Android)

**Test Each Browser**:
1. Authentication flow
2. CSRF protection
3. Protected routes
4. Security headers

**Expected Result**:
- All security features work consistently across browsers
- No browser-specific issues

## Manual Testing Script

### Setup
```bash
# Install mock server dependencies
cd test
npm init -y
npm install express cookie-parser

# Start mock server
node mock-server.js

# In another terminal, start Next.js dev server
cd ..
npm run dev
```

### Test Execution
1. **Open browser** to `http://localhost:3000`
2. **Check localStorage**: Open DevTools → Application → Local Storage
   - Should be empty or contain no authentication tokens

3. **Login Test**:
   - Go to `/login`
   - Enter test credentials
   - Check cookies: Should see `auth_token` and `csrf_token` as HttpOnly
   - Check localStorage: Should NOT see authentication tokens

4. **CSRF Test**:
   - Open DevTools → Console
   - Try to make POST request without CSRF token:
     ```javascript
     fetch('/api/v1/protected', {
       method: 'POST',
       credentials: 'include',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ test: true })
     }).then(r => r.json()).then(console.log)
     ```
   - Should get 403 error with CSRF_TOKEN_INVALID

5. **Protected Route Test**:
   - Try to access `/dashboard` without login (should redirect to `/login`)
   - Login and access `/dashboard` (should work)
   - Logout and try `/dashboard` again (should redirect)

6. **Security Headers Test**:
   - Open DevTools → Network
   - Refresh page
   - Click on document request
   - Check Response Headers for security headers

7. **Input Validation Test**:
   - Try to submit form with `<script>alert('xss')</script>` in text field
   - Should be sanitized or show validation error

## Automated Tests

### Jest Test Suite
```typescript
// __tests__/security/auth.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SecureAuthProvider } from '@/components/security/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Security Implementation', () => {
  const queryClient = new QueryClient();
  
  test('no localStorage token storage', () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Render component that uses authentication
    // Verify localStorage.setItem not called with auth tokens
  });
  
  test('CSRF token included in requests', async () => {
    // Mock fetch to check headers
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    
    // Make API call
    // Verify X-CSRF-Token header present
  });
  
  test('protected route redirects when not authenticated', () => {
    // Render ProtectedRoute without authentication
    // Verify redirect happens
  });
});
```

### Playwright E2E Tests
```typescript
// tests/security.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security Features', () => {
  test('authentication uses HttpOnly cookies', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Check localStorage
    const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
    expect(localStorage).not.toContain('auth_token');
    expect(localStorage).not.toContain('token');
    
    // Check cookies
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    expect(authCookie).toBeDefined();
    expect(authCookie.httpOnly).toBe(true);
  });
  
  test('CSRF protection works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Try to make POST request without CSRF token
    const response = await page.evaluate(async () => {
      return fetch('/api/v1/protected', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
    });
    
    expect(response.status).toBe(403);
  });
});
```

## Security Audit Tools

### 1. OWASP ZAP
```bash
# Run ZAP security scan
docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r security-report.html
```

### 2. Lighthouse Security Audit
```bash
# Run Lighthouse from Chrome DevTools or CLI
npx lighthouse http://localhost:3000 --view --output=html --output-path=./lighthouse-report.html
```

### 3. Security Headers Check
```bash
# Check security headers
curl -I http://localhost:3000 | grep -i "security\|csp\|hsts"
```

## Success Criteria

### Must Have (Blocking Production Deployment)
- [ ] No authentication tokens in localStorage
- [ ] CSRF protection on all mutating requests
- [ ] HttpOnly cookies for authentication
- [ ] Server-side token validation only
- [ ] Protected routes require authentication
- [ ] Security headers present (CSP, HSTS, etc.)

### Should Have (High Priority)
- [ ] Input validation prevents XSS
- [ ] Token refresh works automatically
- [ ] Role-based access control
- [ ] Browser compatibility verified
- [ ] Performance impact acceptable (< 10% increase)

### Nice to Have
- [ ] Rate limiting implemented
- [ ] Security monitoring configured
- [ ] Automated security tests
- [ ] Security documentation complete

## Rollback Testing

### Test Rollback Procedure
1. **Simulate security issue**:
   - Introduce a bug in authentication flow
   - Verify it breaks functionality

2. **Execute rollback**:
   - Revert to previous authentication system
   - Verify functionality restored

3. **Test data preservation**:
   - Verify no data loss during rollback
   - Test user sessions work correctly

### Rollback Success Criteria
- Rollback completes within 15 minutes
- All functionality restored
- No data loss
- Users can authenticate with old system

## Monitoring After Deployment

### Key Metrics to Monitor
1. **Authentication success rate** (> 99%)
2. **CSRF validation failures** (< 1%)
3. **Token refresh success rate** (> 99%)
4. **API error rates** (no significant increase)
5. **Page load times** (< 3 seconds)

### Alerting Rules
- Authentication failures > 5%
- CSRF failures > 1%
- Token refresh failures > 5%
- API 403 errors spike
- Page load time increase > 20%

## Conclusion

This test plan provides comprehensive coverage of all security features implemented. By following this plan, you can verify that all critical vulnerabilities have been addressed and the application is ready for secure production deployment.

Remember to:
1. Test thoroughly before deployment
2. Monitor closely after deployment
3. Have rollback plan ready
4. Document any issues found
5. Update tests based on findings