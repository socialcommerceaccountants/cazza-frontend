/**
 * Cookie Utilities for Secure Authentication
 * 
 * Provides utilities for working with cookies in a secure manner.
 * Note: HttpOnly cookies cannot be accessed by JavaScript for security reasons.
 * These utilities are for non-HttpOnly cookies or cookie management.
 */

/**
 * Cookie configuration for secure authentication
 */
export interface CookieConfig {
  name: string;
  value: string;
  options?: CookieOptions;
}

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Default secure cookie options
 */
export const defaultSecureOptions: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true, // Note: This cannot be set from client-side JavaScript
  sameSite: 'Strict',
  maxAge: 24 * 60 * 60, // 24 hours in seconds
};

/**
 * Set a cookie with secure defaults
 * 
 * Note: HttpOnly cookies MUST be set server-side.
 * This function is for non-HttpOnly cookies only.
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') {
    return; // Server-side rendering
  }

  const mergedOptions: CookieOptions = {
    ...defaultSecureOptions,
    ...options,
    httpOnly: false, // Cannot set HttpOnly from client-side
  };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (mergedOptions.expires) {
    cookieString += `; expires=${mergedOptions.expires.toUTCString()}`;
  }

  if (mergedOptions.maxAge !== undefined) {
    cookieString += `; max-age=${mergedOptions.maxAge}`;
  }

  if (mergedOptions.path) {
    cookieString += `; path=${mergedOptions.path}`;
  }

  if (mergedOptions.domain) {
    cookieString += `; domain=${mergedOptions.domain}`;
  }

  if (mergedOptions.secure) {
    cookieString += '; secure';
  }

  if (mergedOptions.sameSite) {
    cookieString += `; samesite=${mergedOptions.sameSite}`;
  }

  // Note: httpOnly cannot be set from client-side
  // It's included here for documentation purposes

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Server-side rendering
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
  if (typeof document === 'undefined') {
    return; // Server-side rendering
  }

  // Set cookie with expired date
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
    maxAge: -1,
  });
}

/**
 * Check if cookies are enabled
 */
export function areCookiesEnabled(): boolean {
  if (typeof navigator === 'undefined') {
    return false; // Server-side rendering
  }

  // Try to set and read a test cookie
  const testCookieName = 'cookie_test_' + Date.now();
  const testCookieValue = 'test_value';

  setCookie(testCookieName, testCookieValue, {
    path: '/',
    maxAge: 60, // 1 minute
  });

  const retrievedValue = getCookie(testCookieName);
  
  // Clean up test cookie
  deleteCookie(testCookieName);

  return retrievedValue === testCookieValue;
}

/**
 * Parse all cookies into an object
 */
export function parseAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') {
    return {}; // Server-side rendering
  }

  const cookies: Record<string, string> = {};

  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * Check if a cookie has secure attributes
 * Note: Cannot check HttpOnly attribute from JavaScript
 */
export function isCookieSecure(name: string): boolean {
  if (typeof document === 'undefined') {
    return false; // Server-side rendering
  }

  const cookie = document.cookie
    .split(';')
    .find(c => c.trim().startsWith(name + '='));

  if (!cookie) {
    return false;
  }

  // Check for secure flag
  const hasSecure = cookie.includes('; secure') || cookie.includes(';secure');
  
  // Check for SameSite flag
  const hasSameSite = cookie.includes('; samesite=') || cookie.includes(';samesite=');
  
  return hasSecure && hasSameSite;
}

/**
 * Cookie security validator
 */
export class CookieSecurityValidator {
  /**
   * Validate cookie security for authentication
   */
  static validateAuthCookies(): {
    secure: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if cookies are enabled
    if (!areCookiesEnabled()) {
      issues.push('Cookies are disabled in browser');
      recommendations.push('Enable cookies for authentication to work');
    }

    // Check for auth-related cookies (non-HttpOnly ones we can see)
    const cookies = parseAllCookies();
    const authCookieNames = ['auth_token', 'csrf_token', 'session_id'];

    for (const cookieName of authCookieNames) {
      if (cookies[cookieName]) {
        // Warning: Auth cookie accessible to JavaScript
        issues.push(`Auth cookie "${cookieName}" is accessible to JavaScript`);
        recommendations.push(`Set "${cookieName}" as HttpOnly (server-side)`);
        
        // Check if it has secure attributes
        if (!isCookieSecure(cookieName)) {
          issues.push(`Auth cookie "${cookieName}" lacks secure attributes`);
          recommendations.push(`Add secure, SameSite=Strict attributes to "${cookieName}"`);
        }
      }
    }

    return {
      secure: issues.length === 0,
      issues,
      recommendations,
    };
  }

  /**
   * Check for cookie security best practices
   */
  static getSecurityRecommendations(): string[] {
    return [
      'Use HttpOnly flag for authentication cookies',
      'Use Secure flag for cookies in production',
      'Use SameSite=Strict for authentication cookies',
      'Set appropriate Max-Age or Expires for session management',
      'Use cookie prefixes (__Host-, __Secure-) when supported',
      'Implement CSRF protection with separate cookies',
      'Regularly rotate session cookies',
      'Invalidate cookies on logout and password change',
    ];
  }
}

/**
 * React hook for cookie management
 */
import { useEffect, useState } from 'react';

export function useCookie(name: string): [string | null, (value: string, options?: CookieOptions) => void, () => void] {
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  useEffect(() => {
    // Initial read
    const value = getCookie(name);
    setCookieValue(value);

    // Set up interval to check for changes
    const interval = setInterval(() => {
      const currentValue = getCookie(name);
      if (currentValue !== cookieValue) {
        setCookieValue(currentValue);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [name, cookieValue]);

  const updateCookie = (value: string, options?: CookieOptions) => {
    setCookie(name, value, options);
    setCookieValue(value);
  };

  const removeCookie = () => {
    deleteCookie(name);
    setCookieValue(null);
  };

  return [cookieValue, updateCookie, removeCookie];
}

/**
 * Hook to check cookie security status
 */
export function useCookieSecurity() {
  const [securityStatus, setSecurityStatus] = useState<ReturnType<typeof CookieSecurityValidator.validateAuthCookies>>({
    secure: false,
    issues: [],
    recommendations: [],
  });

  useEffect(() => {
    const status = CookieSecurityValidator.validateAuthCookies();
    setSecurityStatus(status);
  }, []);

  return securityStatus;
}

/**
 * Utility to handle cookie-based feature detection
 */
export const cookieFeatures = {
  /**
   * Check if browser supports SameSite=None
   */
  supportsSameSiteNone(): boolean {
    if (typeof navigator === 'undefined') return false;

    // Modern browsers support SameSite=None
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for known incompatible browsers
    const incompatibleBrowsers = [
      { name: 'chrome', version: 51, maxVersion: 66 },
      { name: 'ucbrowser', version: 12, maxVersion: 12 },
      { name: 'safari', version: 12, maxVersion: 12 },
      { name: 'iphone', version: 12, maxVersion: 12 },
      { name: 'ipad', version: 12, maxVersion: 12 },
      { name: 'macintosh', version: 10, maxVersion: 14 },
    ];

    for (const browser of incompatibleBrowsers) {
      if (userAgent.includes(browser.name)) {
        // Extract version (simplified)
        const versionMatch = userAgent.match(new RegExp(`${browser.name}[\\s/](\\d+)`));
        if (versionMatch) {
          const version = parseInt(versionMatch[1], 10);
          if (version >= browser.version && version <= browser.maxVersion) {
            return false;
          }
        }
      }
    }

    return true;
  },

  /**
   * Check if browser supports cookie prefixes
   */
  supportsCookiePrefixes(): boolean {
    if (typeof document === 'undefined') return false;

    try {
      // Test __Host- prefix
      document.cookie = '__Host-test=value; path=/; secure';
      const hasPrefix = document.cookie.includes('__Host-test');
      
      // Clean up
      document.cookie = '__Host-test=; path=/; secure; max-age=0';
      
      return hasPrefix;
    } catch {
      return false;
    }
  },

  /**
   * Get recommended cookie settings based on browser capabilities
   */
  getRecommendedSettings(): CookieOptions {
    const supportsNone = this.supportsSameSiteNone();
    const supportsPrefixes = this.supportsCookiePrefixes();

    const options: CookieOptions = {
      path: '/',
      secure: true,
      sameSite: supportsNone ? 'None' : 'Lax',
    };

    if (supportsPrefixes) {
      // Note: Prefixes are part of the cookie name, not options
      // This would need to be handled by the server
    }

    return options;
  },
};

/**
 * Server-side cookie utilities (for Next.js API routes)
 */
export const serverCookieUtils = {
  /**
   * Set secure authentication cookies (server-side)
   * 
   * This should be used in Next.js API routes or server actions
   */
  setAuthCookies(
    response: Response,
    tokens: {
      authToken: string;
      csrfToken: string;
      refreshToken?: string;
    },
    options: {
      authMaxAge?: number;
      csrfMaxAge?: number;
      refreshMaxAge?: number;
      domain?: string;
    } = {}
  ): void {
    const {
      authMaxAge = 24 * 60 * 60, // 24 hours
      csrfMaxAge = 24 * 60 * 60, // 24 hours
      refreshMaxAge = 7 * 24 * 60 * 60, // 7 days
      domain,
    } = options;

    // Set auth token cookie (HttpOnly, Secure, SameSite=Strict)
    response.headers.append(
      'Set-Cookie',
      `auth_token=${tokens.authToken}; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Path=/; ` +
      `Max-Age=${authMaxAge}` +
      (domain ? `; Domain=${domain}` : '')
    );

    // Set CSRF token cookie (HttpOnly, Secure, SameSite=Strict)
    response.headers.append(
      'Set-Cookie',
      `csrf_token=${tokens.csrfToken}; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Path=/; ` +
      `Max-Age=${csrfMaxAge}` +
      (domain ? `; Domain=${domain}` : '')
    );

    // Set refresh token cookie if provided (HttpOnly, Secure, SameSite=Strict)
    if (tokens.refreshToken) {
      response.headers.append(
        'Set-Cookie',
        `refresh_token=${tokens.refreshToken}; ` +
        `HttpOnly; ` +
        `Secure; ` +
        `SameSite=Strict; ` +
        `Path=/; ` +
        `Max-Age=${refreshMaxAge}` +
        (domain ? `; Domain=${domain}` : '')
      );
    }
  },

  /**
   * Clear authentication cookies (server-side)
   */
  clearAuthCookies(response: Response, domain?: string): void {
    const cookies = ['auth_token', 'csrf_token', 'refresh_token'];
    
    for (const cookieName of cookies) {
      response.headers.append(
        'Set-Cookie',
        `${cookieName}=; ` +
        `HttpOnly; ` +
        `Secure; ` +
        `SameSite=Strict; ` +
        `Path=/; ` +
        `Max-Age=0` +
        (domain ? `; Domain=${domain}` : '')
      );
    }
  },
};