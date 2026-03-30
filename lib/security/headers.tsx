/**
 * Security Headers Configuration
 * 
 * Provides security headers for Next.js applications to protect against common attacks:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME type sniffing
 * - Information disclosure
 * - CSRF (Cross-Site Request Forgery)
 */

/**
 * Security Headers Configuration
 */
export interface SecurityHeaders {
  [key: string]: string;
}

/**
 * Default security headers for production
 */
export const defaultSecurityHeaders: SecurityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  
  // Cache control for sensitive pages
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  
  // Pragma for legacy HTTP/1.0 caches
  'Pragma': 'no-cache',
  
  // Expires header for legacy proxies
  'Expires': '0',
};

/**
 * CSP (Content Security Policy) Directives
 */
export interface CSPDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  sandbox?: string[];
  reportUri?: string;
  requireTrustedTypesFor?: string[];
  trustedTypes?: string[];
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
}

/**
 * Generate CSP header string from directives
 */
export function generateCSP(directives: CSPDirectives = {}, reportOnly: boolean = false): string {
  const defaultDirectives: CSPDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Note: unsafe-inline/eval should be removed in production
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    frameSrc: ["'self'"],
    upgradeInsecureRequests: true,
    blockAllMixedContent: true,
  };

  const mergedDirectives = { ...defaultDirectives, ...directives };
  const parts: string[] = [];

  for (const [key, value] of Object.entries(mergedDirectives)) {
    if (value === undefined || value === null) continue;
    
    if (typeof value === 'boolean') {
      if (value) {
        parts.push(key.replace(/([A-Z])/g, '-$1').toLowerCase());
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        parts.push(`${key.replace(/([A-Z])/g, '-$1').toLowerCase()} ${value.join(' ')}`);
      }
    } else if (typeof value === 'string') {
      parts.push(`${key.replace(/([A-Z])/g, '-$1').toLowerCase()} ${value}`);
    }
  }

  const csp = parts.join('; ');
  return reportOnly ? `${csp}; report-uri /api/csp-report` : csp;
}

/**
 * Strict CSP for production (recommended)
 */
export const strictCSP = generateCSP({
  scriptSrc: ["'self'"], // Remove unsafe-inline/eval in production
  styleSrc: ["'self'"], // Remove unsafe-inline in production
});

/**
 * Development CSP (more permissive)
 */
export const developmentCSP = generateCSP({
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:*"],
  styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:*"],
  connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
});

/**
 * Get appropriate CSP for current environment
 */
export function getCSPForEnvironment(): string {
  if (process.env.NODE_ENV === 'production') {
    return strictCSP;
  }
  return developmentCSP;
}

/**
 * Generate HSTS (HTTP Strict Transport Security) header
 */
export function generateHSTS(maxAge: number = 31536000, includeSubDomains: boolean = true, preload: boolean = false): string {
  let hsts = `max-age=${maxAge}`;
  if (includeSubDomains) hsts += '; includeSubDomains';
  if (preload) hsts += '; preload';
  return hsts;
}

/**
 * Generate Feature Policy header (deprecated but still supported)
 */
export function generateFeaturePolicy(): string {
  return [
    "geolocation 'none'",
    "microphone 'none'",
    "camera 'none'",
    "payment 'none'",
    "usb 'none'",
    "bluetooth 'none'",
    "magnetometer 'none'",
    "gyroscope 'none'",
    "accelerometer 'none'",
  ].join('; ');
}

/**
 * Generate all security headers for a response
 */
export function generateAllSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': getCSPForEnvironment(),
    'Strict-Transport-Security': generateHSTS(),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
}

/**
 * Middleware for adding security headers to Next.js responses
 */
export function securityHeadersMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  const headers = generateAllSecurityHeaders();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  
  // Add CSRF protection headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  }
  
  return response;
}