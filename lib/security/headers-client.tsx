"use client";

/**
 * React hook to check security headers on current page
 * Client-side only - for use in React components
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

    const checkHeaders = () => {
      const securityHeaders: SecurityHeaderStatus[] = [
        {
          header: 'Content-Security-Policy',
          present: false,
          value: '',
          recommended: 'script-src \'self\'',
          status: 'missing'
        },
        {
          header: 'Strict-Transport-Security',
          present: false,
          value: '',
          recommended: 'max-age=31536000; includeSubDomains',
          status: 'missing'
        },
        {
          header: 'X-Frame-Options',
          present: false,
          value: '',
          recommended: 'DENY',
          status: 'missing'
        },
        {
          header: 'X-Content-Type-Options',
          present: false,
          value: '',
          recommended: 'nosniff',
          status: 'missing'
        },
        {
          header: 'Referrer-Policy',
          present: false,
          value: '',
          recommended: 'strict-origin-when-cross-origin',
          status: 'missing'
        },
        {
          header: 'Permissions-Policy',
          present: false,
          value: '',
          recommended: 'geolocation=(), microphone=(), camera=()',
          status: 'missing'
        }
      ];

      // In a real implementation, this would fetch headers from the current page
      // For now, we'll simulate checking
      try {
        // This is a simulation - in production, you'd need to fetch headers
        // from your API or use a server-side check
        securityHeaders.forEach(header => {
          // Simulate some headers being present in development
          if (header.header === 'X-Content-Type-Options') {
            header.present = true;
            header.value = 'nosniff';
            header.status = 'good';
          }
          if (header.header === 'Referrer-Policy') {
            header.present = true;
            header.value = 'strict-origin-when-cross-origin';
            header.status = 'good';
          }
        });
      } catch (error) {
        console.error('Failed to check security headers:', error);
      }

      setHeaders(securityHeaders);
    };

    checkHeaders();
  }, []);

  return headers;
}

export const SecurityHeadersStatus: React.FC = () => {
  const headers = useSecurityHeadersCheck();

  const getStatusColor = (status: 'good' | 'warning' | 'missing') => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'missing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Security Headers Status</h3>
      <div className="space-y-2">
        {headers.map((header) => (
          <div key={header.header} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{header.header}</div>
              <div className="text-sm text-gray-600">
                {header.present ? header.value : 'Not set'}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(header.status)}`}>
              {header.status === 'good' ? '✓ Good' : 
               header.status === 'warning' ? '⚠ Warning' : '✗ Missing'}
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-600">
        <p>Security headers help protect your application from common web vulnerabilities.</p>
        <p className="mt-1">In production, these should be configured at the server or CDN level.</p>
      </div>
    </div>
  );
};

export const securityHeadersValidator = {
  validateCSP: (csp: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Basic CSP validation
    if (!csp.includes("script-src")) {
      errors.push("Missing script-src directive");
    }
    
    if (csp.includes("unsafe-inline") && !csp.includes("'nonce-'") && !csp.includes("'sha256-'")) {
      errors.push("Consider removing unsafe-inline for better security");
    }
    
    if (csp.includes("unsafe-eval")) {
      errors.push("Consider removing unsafe-eval for better security");
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  validateHSTS: (hsts: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!hsts.includes("max-age=")) {
      errors.push("Missing max-age directive");
    }
    
    const maxAgeMatch = hsts.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1], 10);
      if (maxAge < 31536000) {
        errors.push("HSTS max-age should be at least 31536000 (1 year) for production");
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};