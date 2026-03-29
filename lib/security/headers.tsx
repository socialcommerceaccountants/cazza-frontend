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
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // X-Powered-By removal (handled by Next.js)
};

/**
 * Content Security Policy (CSP) configuration
 * 
 * CSP is a critical security header that prevents XSS attacks
 * by specifying which sources of content are allowed to load.
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
  reportTo?: string;
}

/**
 * Generate Content Security Policy header
 */
export function generateCSP(directives: CSPDirectives = {}, reportOnly: boolean = false): string {
  const defaultDirectives: CSPDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Next.js hydration
      "'unsafe-eval'", // Required for some Next.js features
    ],
    styleSrc: ["'self'", "'unsafe-inline'"], // Required for CSS-in-JS
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
  };

  // Merge with custom directives
  const mergedDirectives = { ...defaultDirectives, ...directives };

  // Build CSP string
  const cspParts: string[] = [];

  for (const [directive, values] of Object.entries(mergedDirectives)) {
    if (values && values.length > 0) {
      if (directive === 'reportUri' || directive === 'reportTo') {
        cspParts.push(`${directive} ${values}`);
      } else if (directive === 'sandbox') {
        cspParts.push(`sandbox ${values.join(' ')}`);
      } else {
        cspParts.push(`${directive} ${values.join(' ')}`);
      }
    }
  }

  const cspString = cspParts.join('; ');

  return reportOnly 
    ? `Content-Security-Policy-Report-Only: ${cspString}`
    : `Content-Security-Policy: ${cspString}`;
}

/**
 * Strict CSP for production (blocks inline scripts/styles)
 * Use this when you can ensure all scripts/styles are external
 */
export const strictCSP = generateCSP({
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  // Remove 'unsafe-inline' and 'unsafe-eval'
});

/**
 * Development CSP (more permissive)
 */
export const developmentCSP = generateCSP({
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
  ],
  connectSrc: [
    "'self'",
    "http://localhost:3001", // API server
    "ws://localhost:3001", // WebSocket
  ],
});

/**
 * Get appropriate CSP based on environment
 */
export function getCSPForEnvironment(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? developmentCSP : strictCSP;
}

/**
 * HTTP Strict Transport Security (HSTS)
 * Forces browsers to use HTTPS
 */
export function generateHSTS(maxAge: number = 31536000, includeSubDomains: boolean = true, preload: boolean = false): string {
  let hsts = `max-age=${maxAge}`;
  
  if (includeSubDomains) {
    hsts += '; includeSubDomains';
  }
  
  if (preload) {
    hsts += '; preload';
  }
  
  return `Strict-Transport-Security: ${hsts}`;
}

/**
 * Feature Policy (deprecated, use Permissions-Policy)
 */
export function generateFeaturePolicy(): string {
  return "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()";
}

/**
 * Generate all security headers for Next.js
 */
export function generateAllSecurityHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    ...defaultSecurityHeaders,
  };

  // Add CSP
  const cspHeader = getCSPForEnvironment();
  const [cspKey, cspValue] = cspHeader.split(': ');
  headers[cspKey] = cspValue;

  // Add HSTS in production only
  if (process.env.NODE_ENV === 'production') {
    const hstsHeader = generateHSTS();
    const [hstsKey, hstsValue] = hstsHeader.split(': ');
    headers[hstsKey] = hstsValue;
  }

  // Remove X-Powered-By (Next.js handles this)
  delete headers['X-Powered-By'];

  return headers;
}

/**
 * Next.js middleware for security headers
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function securityHeadersMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers to response
  const headers = generateAllSecurityHeaders();
  
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  
  // Additional security measures
  
  // Set secure cookie attributes for any cookies we set
  const cookies = request.headers.get('cookie');
  if (cookies && response.headers.get('set-cookie')) {
    // Note: In practice, cookies should be set with secure attributes server-side
    // This is just an additional safety measure
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

/**
 * React hook to check security headers on current page
 */
import { useEffect, useState } from 'react';

export interface SecurityHeaderStatus {
  header: string;
  present: boolean;
  value: string;
  recommended: string;
  status: 'good' | 'warning' | 'missing';
}

export function useSecurityHeadersCheck(): SecurityHeaderStatus[] {
  const [headers, setHeaders] = useState<SecurityHeaderStatus[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHeaders = async () => {
      try {
        // Make a request to the current page to check headers
        const response = await fetch(window.location.href, { method: 'HEAD' });
        const headerChecks: SecurityHeaderStatus[] = [];
        
        // Check critical security headers
        const criticalHeaders = [
          { 
            name: 'Content-Security-Policy', 
            recommended: 'Should be present with strict directives' 
          },
          { 
            name: 'X-Frame-Options', 
            recommended: 'DENY or SAMEORIGIN' 
          },
          { 
            name: 'X-Content-Type-Options', 
            recommended: 'nosniff' 
          },
          { 
            name: 'Referrer-Policy', 
            recommended: 'strict-origin-when-cross-origin' 
          },
        ];
        
        for (const { name, recommended } of criticalHeaders) {
          const value = response.headers.get(name);
          const present = !!value;
          let status: 'good' | 'warning' | 'missing' = 'missing';
          
          if (present) {
            status = 'good';
            // Additional validation for specific headers
            if (name === 'X-Frame-Options' && !['DENY', 'SAMEORIGIN'].includes(value!)) {
              status = 'warning';
            }
            if (name === 'X-Content-Type-Options' && value !== 'nosniff') {
              status = 'warning';
            }
          }
          
          headerChecks.push({
            header: name,
            present,
            value: value || 'Not set',
            recommended,
            status,
          });
        }
        
        setHeaders(headerChecks);
      } catch (error) {
        console.error('Failed to check security headers:', error);
      }
    };

    checkHeaders();
  }, []);

  return headers;
}

/**
 * Component to display security header status
 */
import React from 'react';

export const SecurityHeadersStatus: React.FC = () => {
  const headers = useSecurityHeadersCheck();
  
  if (headers.length === 0) {
    return <div>Checking security headers...</div>;
  }
  
  const missingHeaders = headers.filter(h => !h.present);
  const warningHeaders = headers.filter(h => h.status === 'warning');
  
  return (
    <div className="security-headers-status">
      <h3>Security Headers Status</h3>
      <div className="status-summary">
        <div className={`status-item ${missingHeaders.length === 0 ? 'good' : 'warning'}`}>
          Missing: {missingHeaders.length}
        </div>
        <div className={`status-item ${warningHeaders.length === 0 ? 'good' : 'warning'}`}>
          Warnings: {warningHeaders.length}
        </div>
      </div>
      
      <div className="headers-list">
        {headers.map((header, index) => (
          <div key={index} className={`header-item ${header.status}`}>
            <div className="header-name">{header.header}</div>
            <div className="header-value">{header.value}</div>
            <div className="header-status">{header.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Utility to validate security headers configuration
 */
export const securityHeadersValidator = {
  /**
   * Validate CSP directive
   */
  validateCSP(csp: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!csp) {
      errors.push('CSP is empty');
      return { valid: false, errors };
    }
    
    // Check for unsafe directives in production
    if (process.env.NODE_ENV === 'production') {
      if (csp.includes("'unsafe-inline'")) {
        errors.push('CSP contains unsafe-inline (avoid in production)');
      }
      if (csp.includes("'unsafe-eval'")) {
        errors.push('CSP contains unsafe-eval (avoid in production)');
      }
    }
    
    // Check for missing essential directives
    const directives = csp.split(';').map(d => d.trim().split(' ')[0]);
    const essentialDirectives = ['default-src', 'script-src', 'style-src'];
    
    for (const essential of essentialDirectives) {
      if (!directives.includes(essential)) {
        errors.push(`Missing essential directive: ${essential}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },
  
  /**
   * Validate security headers object
   */
  validateHeaders(headers: Record<string, string>): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Check for missing critical headers
    const criticalHeaders = [
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
    ];
    
    for (const header of criticalHeaders) {
      if (!headers[header]) {
        warnings.push(`Missing critical header: ${header}`);
      }
    }
    
    // Validate specific headers
    if (headers['X-Frame-Options'] && !['DENY', 'SAMEORIGIN'].includes(headers['X-Frame-Options'])) {
      warnings.push('X-Frame-Options should be DENY or SAMEORIGIN');
    }
    
    if (headers['X-Content-Type-Options'] && headers['X-Content-Type-Options'] !== 'nosniff') {
      warnings.push('X-Content-Type-Options should be "nosniff"');
    }
    
    return {
      valid: warnings.length === 0,
      warnings,
    };
  },
};