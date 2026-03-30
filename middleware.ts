import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateAllSecurityHeaders } from './lib/security/headers.tsx';

/**
 * Next.js Middleware for Authentication and Security
 * 
 * This middleware runs on every request and provides:
 * 1. Security headers for all responses
 * 2. Authentication protection for protected routes
 * 3. CSRF token management
 * 4. Rate limiting (basic)
 * 5. Request logging
 */

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// CORS: only allow explicitly configured origins (defaults to app URL)
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [appUrl];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/auth/login',
  '/auth/register',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/support',
  '/api/public',
  '/api/auth',
  '/_next',
  '/favicon.ico',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
  '/settings',
  '/users',
];

// API routes that require CSRF protection
const CSRF_PROTECTED_API_ROUTES = [
  '/api/users',
  '/api/settings',
  '/api/integrations',
  '/api/analytics',
];

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/api/auth')
  );
}

/**
 * Check if a route requires admin access
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if an API route requires CSRF protection
 */
function requiresCSRFProtection(pathname: string, method: string): boolean {
  const isProtectedRoute = CSRF_PROTECTED_API_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isMutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  
  return isProtectedRoute && isMutatingMethod;
}

/**
 * Rate limiting middleware
 */
function rateLimit(request: NextRequest): NextResponse | null {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  let rateLimitInfo = rateLimitMap.get(ip);
  
  if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
    rateLimitInfo = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    rateLimitMap.set(ip, rateLimitInfo);
  } else {
    rateLimitInfo.count++;
    
    if (rateLimitInfo.count > RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }
  
  return null;
}

/**
 * Extract authentication token from request
 */
function getAuthToken(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try to get token from cookie (for API routes)
  const cookie = request.cookies.get('auth_token');
  if (cookie) {
    return cookie.value;
  }
  
  return null;
}

/**
 * Validate CSRF token
 */
function validateCSRFToken(request: NextRequest): boolean {
  // Skip CSRF validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }
  
  // Get CSRF token from header
  const csrfHeader = request.headers.get('x-csrf-token');
  
  // Get CSRF token from cookie
  const csrfCookie = request.cookies.get('csrf_token');
  
  // Both must be present and match
  if (!csrfHeader || !csrfCookie) {
    return false;
  }
  
  // Use timing-safe comparison
  return constantTimeCompare(csrfHeader, csrfCookie.value);
}

/**
 * Timing-safe string comparison
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const method = request.method;
  
  // Apply rate limiting (skip for static assets)
  if (!pathname.startsWith('/_next') && !pathname.startsWith('/favicon.ico')) {
    const rateLimitResponse = rateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  const securityHeaders = generateAllSecurityHeaders();
  
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  
  // Add CORS headers for API routes — only for whitelisted origins
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    }

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }
  
  // Check authentication for protected routes
  if (!isPublicRoute(pathname)) {
    const authToken = getAuthToken(request);
    
    if (!authToken) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check admin access for admin routes
    if (isAdminRoute(pathname)) {
      // In a real implementation, you would validate the token and check user role
      // For now, we'll assume the token validation happens in API routes
      // You could add JWT decoding and role checking here
    }
  }
  
  // Validate CSRF token for protected API routes
  if (requiresCSRFProtection(pathname, method)) {
    const isValidCSRF = validateCSRFToken(request);
    
    if (!isValidCSRF) {
      return NextResponse.json(
        { 
          error: 'CSRF token validation failed',
          code: 'CSRF_TOKEN_INVALID'
        },
        { status: 403 }
      );
    }
  }
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  return response;
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

/**
 * Helper function to create authenticated API responses
 */
export function createAuthenticatedResponse(
  data: unknown,
  options: {
    status?: number;
    cookies?: { name: string; value: string; options?: Record<string, unknown> }[];
    csrfToken?: string;
  } = {}
): NextResponse {
  const { status = 200, cookies = [], csrfToken } = options;
  
  const response = NextResponse.json(data, { status });
  
  // Add security headers
  const securityHeaders = generateAllSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  
  // Set cookies
  for (const cookie of cookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
  
  // Add CSRF token to response if provided
  if (csrfToken) {
    response.headers.set('X-CSRF-Token', csrfToken);
  }
  
  return response;
}

/**
 * Helper function to create error responses
 */
export function createErrorResponse(
  error: string,
  code: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse {
  return createAuthenticatedResponse(
    { error, code, details },
    { status }
  );
}

/**
 * Helper function to validate request body
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  validator: (data: unknown) => data is T
): Promise<{ valid: true; data: T } | { valid: false; error: string }> {
  try {
    const body = await request.json();
    
    if (!validator(body)) {
      return { valid: false, error: 'Invalid request body' };
    }
    
    return { valid: true, data: body };
  } catch {
    return { valid: false, error: 'Invalid JSON in request body' };
  }
}

/**
 * Helper function to get user from request (for API routes)
 * 
 * Note: In a real implementation, you would decode and verify JWT
 */
export async function getUserFromRequest(request: NextRequest): Promise<{
  id: string;
  email: string;
  role: string;
  permissions: string[];
} | null> {
  const authToken = getAuthToken(request);
  
  if (!authToken) {
    return null;
  }
  
  // In a real implementation, you would:
  // 1. Verify JWT signature
  // 2. Check token expiration
  // 3. Extract user data from payload
  // 4. Validate user exists in database
  
  // For now, return a mock user
  // Replace this with actual JWT verification
  try {
    // This is a simplified example - don't use in production
    const payload = JSON.parse(atob(authToken.split('.')[1]));
    
    return {
      id: payload.sub || 'user-id',
      email: payload.email || 'user@example.com',
      role: payload.role || 'user',
      permissions: payload.permissions || [],
    };
  } catch {
    return null;
  }
}

/**
 * Helper function to check user permissions
 */
export function checkUserPermissions(
  user: { permissions: string[] },
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(permission => 
    user.permissions.includes(permission)
  );
}

/**
 * Helper function to check user role
 */
export function checkUserRole(
  user: { role: string },
  requiredRole: string
): boolean {
  switch (requiredRole) {
    case 'admin':
      return user.role === 'admin';
    case 'user':
      return user.role === 'user' || user.role === 'admin';
    default:
      return user.role === requiredRole;
  }
}