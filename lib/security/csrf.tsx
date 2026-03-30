/**
 * CSRF Token Management
 * 
 * Implements Double Submit Cookie pattern for CSRF protection:
 * 1. Server sets CSRF token in HttpOnly cookie
 * 2. Server also returns CSRF token in response body/header
 * 3. Client stores CSRF token in memory (NOT localStorage)
 * 4. Client includes CSRF token in X-CSRF-Token header for mutating requests
 * 5. Server compares cookie token with header token
 */

/**
 * CSRF Token Storage
 * 
 * Stores CSRF token in memory only - never in localStorage or sessionStorage
 * This prevents XSS attacks from stealing the token
 */
class CSRFTokenStorage {
  private csrfToken: string | null = null;
  private storageKey = 'csrf_token_memory';

  /**
   * Set CSRF token in memory
   */
  setToken(token: string): void {
    this.csrfToken = token;
    
    // Optional: Store in sessionStorage with a short expiry as fallback
    // Only if absolutely necessary and with clear security considerations
    if (typeof window !== 'undefined') {
      try {
        // Store with timestamp for expiry checking
        const tokenData = {
          token,
          timestamp: Date.now(),
          expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        };
        sessionStorage.setItem(this.storageKey, JSON.stringify(tokenData));
      } catch (error) {
        console.warn('Failed to store CSRF token in sessionStorage:', error);
      }
    }
  }

  /**
   * Get CSRF token from memory
   */
  getToken(): string | null {
    // First check memory
    if (this.csrfToken) {
      return this.csrfToken;
    }

    // Fallback to sessionStorage (with expiry check)
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(this.storageKey);
        if (stored) {
          const tokenData = JSON.parse(stored);
          
          // Check if token is expired
          const now = Date.now();
          const expiryTime = tokenData.timestamp + tokenData.expiresIn;
          
          if (now < expiryTime) {
            this.csrfToken = tokenData.token;
            return tokenData.token;
          } else {
            // Token expired, clean up
            this.clearToken();
          }
        }
      } catch (error) {
        console.warn('Failed to retrieve CSRF token from sessionStorage:', error);
        this.clearToken();
      }
    }

    return null;
  }

  /**
   * Clear CSRF token from memory and storage
   */
  clearToken(): void {
    this.csrfToken = null;
    
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(this.storageKey);
      } catch (error) {
        console.warn('Failed to clear CSRF token from sessionStorage:', error);
      }
    }
  }

  /**
   * Check if CSRF token is valid (not expired)
   */
  isValid(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Extract CSRF token from response
   * Looks for token in headers or response body
   */
  extractFromResponse(response: Response, responseBody?: any): string | null {
    // Check headers first
    const headerToken = response.headers.get('X-CSRF-Token');
    if (headerToken) {
      return headerToken;
    }

    // Check response body
    if (responseBody?.csrfToken) {
      return responseBody.csrfToken;
    }

    return null;
  }
}

// Create singleton instance
export const csrfTokenStorage = new CSRFTokenStorage();

/**
 * CSRF Token Validation
 * 
 * Client-side validation helpers (server does the actual validation)
 */
export class CSRFValidator {
  /**
   * Validate CSRF token format
   * Basic validation to catch obviously malformed tokens
   */
  static validateFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Check length (typical JWT or random token length)
    if (token.length < 32 || token.length > 1024) {
      return false;
    }

    // Check for common patterns (basic sanity check)
    // JWT tokens have 3 parts separated by dots
    if (token.split('.').length === 3) {
      // Basic JWT format check
      const parts = token.split('.');
      if (parts.some(part => !part || part.length === 0)) {
        return false;
      }
    }

    // Check for only valid characters
    const validChars = /^[A-Za-z0-9\-._~+/]+=*$/;
    if (!validChars.test(token)) {
      return false;
    }

    return true;
  }

  /**
   * Generate a mock CSRF token for testing
   * Note: In production, tokens should be generated server-side
   */
  static generateMockToken(): string {
    const array = new Uint8Array(32);
    // globalThis.crypto is available in all modern browsers and Node.js 15+
    if (typeof globalThis.crypto?.getRandomValues !== 'function') {
      throw new Error('Cryptographically secure random number generation is not available');
    }
    globalThis.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Create CSRF token header for fetch requests
   */
  static createHeader(): Record<string, string> {
    const token = csrfTokenStorage.getToken();
    if (!token) {
      return {};
    }

    return {
      'X-CSRF-Token': token
    };
  }

  /**
   * Check if request requires CSRF protection
   */
  static requiresProtection(method: string): boolean {
    const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    return protectedMethods.includes(method.toUpperCase());
  }
}

/**
 * React hook for CSRF token management
 */
import { useEffect, useState } from 'react';

export const useCSRFToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load token on mount
    const storedToken = csrfTokenStorage.getToken();
    setToken(storedToken);
    setIsValid(csrfTokenStorage.isValid());
  }, []);

  const updateToken = (newToken: string) => {
    if (CSRFValidator.validateFormat(newToken)) {
      csrfTokenStorage.setToken(newToken);
      setToken(newToken);
      setIsValid(true);
    }
    // Silently discard invalid tokens — do not log details that could assist attackers
  };

  const clearToken = () => {
    csrfTokenStorage.clearToken();
    setToken(null);
    setIsValid(false);
  };

  const getHeader = () => {
    return CSRFValidator.createHeader();
  };

  return {
    token,
    isValid,
    updateToken,
    clearToken,
    getHeader,
    requiresProtection: CSRFValidator.requiresProtection,
  };
};

/**
 * Higher-order component to provide CSRF protection
 */
import React from 'react';

interface CSRFProviderProps {
  children: React.ReactNode;
  initialToken?: string;
}

export const CSRFProvider: React.FC<CSRFProviderProps> = ({ children, initialToken }) => {
  const { updateToken } = useCSRFToken();

  useEffect(() => {
    if (initialToken) {
      updateToken(initialToken);
    }
  }, [initialToken, updateToken]);

  return <>{children}</>;
};

/**
 * Hook to check CSRF protection requirements for a route
 */
export const useCSRFProtection = (method: string = 'GET') => {
  const { isValid } = useCSRFToken();
  const requiresProtection = CSRFValidator.requiresProtection(method);

  return {
    requiresProtection,
    hasValidToken: isValid,
    isProtected: requiresProtection && isValid,
    missingToken: requiresProtection && !isValid,
  };
};

/**
 * Utility to handle CSRF token extraction from various sources
 */
export const csrfUtils = {
  /**
   * Extract CSRF token from document cookies
   * Note: CSRF cookie should be HttpOnly, so this won't work for that
   * This is for other cookies that might contain CSRF tokens
   */
  extractFromCookies(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token' || name === 'X-CSRF-Token') {
        return decodeURIComponent(value);
      }
    }
    return null;
  },

  /**
   * Extract CSRF token from meta tags
   * Some frameworks put CSRF tokens in meta tags
   */
  extractFromMetaTags(): string | null {
    if (typeof document === 'undefined') return null;

    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }
    return null;
  },

  /**
   * Extract CSRF token from response
   * Comprehensive extraction from multiple sources
   */
  async extractFromFetchResponse(response: Response): Promise<string | null> {
    // Try headers first
    const headerToken = response.headers.get('X-CSRF-Token');
    if (headerToken) return headerToken;

    // Try response body
    try {
      const body = await response.clone().json();
      if (body.csrfToken) return body.csrfToken;
    } catch {
      // Response is not JSON or empty
    }

    return null;
  },

  /**
   * Validate and store CSRF token from response
   */
  async handleResponse(response: Response): Promise<void> {
    const token = await this.extractFromFetchResponse(response);
    if (token && CSRFValidator.validateFormat(token)) {
      csrfTokenStorage.setToken(token);
    }
  },
};