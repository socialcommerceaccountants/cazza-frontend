/**
 * Secure Storage Utilities
 * 
 * Provides secure alternatives to localStorage for non-sensitive data.
 * For authentication data, use HttpOnly cookies instead.
 * 
 * Security considerations:
 * - Never store tokens, passwords, or sensitive data
 * - Use encryption for any potentially sensitive data
 * - Implement expiry for all stored data
 * - Validate data on retrieval
 */

/**
 * Storage types
 */
export type StorageType = 'local' | 'session' | 'memory';

/**
 * Storage item with metadata
 */
export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

/**
 * Secure storage configuration
 */
export interface StorageConfig {
  type: StorageType;
  encrypt?: boolean;
  defaultExpiry?: number; // in milliseconds
  version?: string;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: StorageConfig = {
  type: 'local',
  encrypt: false,
  defaultExpiry: 24 * 60 * 60 * 1000, // 24 hours
  version: '1.0',
};

/**
 * Memory storage (fallback when no Web Storage available)
 */
class MemoryStorage {
  private storage = new Map<string, StorageItem>();

  set(key: string, value: any, expiresAt?: number): void {
    this.storage.set(key, {
      value,
      timestamp: Date.now(),
      expiresAt,
      version: DEFAULT_CONFIG.version,
    });
  }

  get(key: string): any | null {
    const item = this.storage.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.remove(key);
      return null;
    }
    
    return item.value;
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  keys(): string[] {
    return Array.from(this.storage.keys());
  }
}

/**
 * Secure storage class
 */
export class SecureStorage {
  private memoryStorage = new MemoryStorage();
  private encryptionKey: string | null = null;

  constructor(private config: StorageConfig = DEFAULT_CONFIG) {
    // Generate a simple encryption key for development
    // In production, use a proper key management system
    if (config.encrypt && typeof window !== 'undefined') {
      this.encryptionKey = this.generateEncryptionKey();
    }
  }

  /**
   * Set a value in storage
   */
  set<T = any>(key: string, value: T, options: {
    expiresIn?: number; // milliseconds
    encrypt?: boolean;
  } = {}): void {
    if (typeof window === 'undefined') {
      // Server-side rendering - use memory storage
      const expiresAt = options.expiresIn ? Date.now() + options.expiresIn : undefined;
      this.memoryStorage.set(key, value, expiresAt);
      return;
    }

    const shouldEncrypt = options.encrypt ?? this.config.encrypt;
    const expiresAt = options.expiresIn ? Date.now() + options.expiresIn : undefined;

    const storageItem: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expiresAt,
      version: this.config.version,
    };

    let dataToStore: string;
    
    if (shouldEncrypt && this.encryptionKey) {
      dataToStore = this.encrypt(JSON.stringify(storageItem));
    } else {
      dataToStore = JSON.stringify(storageItem);
    }

    try {
      switch (this.config.type) {
        case 'local':
          localStorage.setItem(key, dataToStore);
          break;
        case 'session':
          sessionStorage.setItem(key, dataToStore);
          break;
        case 'memory':
          this.memoryStorage.set(key, value, expiresAt);
          break;
      }
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      // Fallback to memory storage
      this.memoryStorage.set(key, value, expiresAt);
    }
  }

  /**
   * Get a value from storage
   */
  get<T = any>(key: string): T | null {
    if (typeof window === 'undefined') {
      // Server-side rendering - use memory storage
      return this.memoryStorage.get(key);
    }

    let storedData: string | null;
    
    try {
      switch (this.config.type) {
        case 'local':
          storedData = localStorage.getItem(key);
          break;
        case 'session':
          storedData = sessionStorage.getItem(key);
          break;
        case 'memory':
          return this.memoryStorage.get(key);
        default:
          storedData = null;
      }
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }

    if (!storedData) {
      return null;
    }

    try {
      // Try to decrypt if it looks encrypted
      let storageItem: StorageItem<T>;
      
      if (this.config.encrypt && this.encryptionKey) {
        const decrypted = this.decrypt(storedData);
        storageItem = JSON.parse(decrypted);
      } else {
        storageItem = JSON.parse(storedData);
      }

      // Check if expired
      if (storageItem.expiresAt && Date.now() > storageItem.expiresAt) {
        this.remove(key);
        return null;
      }

      // Check version compatibility (optional)
      if (storageItem.version !== this.config.version) {
        console.warn(`Storage version mismatch for ${key}: ${storageItem.version} vs ${this.config.version}`);
        // You could implement migration logic here
      }

      return storageItem.value;
    } catch (error) {
      console.error(`Failed to parse stored data for ${key}:`, error);
      // Clean up corrupted data
      this.remove(key);
      return null;
    }
  }

  /**
   * Remove a value from storage
   */
  remove(key: string): void {
    if (typeof window === 'undefined') {
      this.memoryStorage.remove(key);
      return;
    }

    try {
      switch (this.config.type) {
        case 'local':
          localStorage.removeItem(key);
          break;
        case 'session':
          sessionStorage.removeItem(key);
          break;
        case 'memory':
          this.memoryStorage.remove(key);
          break;
      }
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all storage
   */
  clear(): void {
    if (typeof window === 'undefined') {
      this.memoryStorage.clear();
      return;
    }

    try {
      switch (this.config.type) {
        case 'local':
          localStorage.clear();
          break;
        case 'session':
          sessionStorage.clear();
          break;
        case 'memory':
          this.memoryStorage.clear();
          break;
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Get all keys in storage
   */
  keys(): string[] {
    if (typeof window === 'undefined') {
      return this.memoryStorage.keys();
    }

    try {
      switch (this.config.type) {
        case 'local':
          return Object.keys(localStorage);
        case 'session':
          return Object.keys(sessionStorage);
        case 'memory':
          return this.memoryStorage.keys();
        default:
          return [];
      }
    } catch (error) {
      console.error('Failed to get storage keys:', error);
      return [];
    }
  }

  /**
   * Check if a key exists
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get storage statistics
   */
  getStats(): {
    type: StorageType;
    itemCount: number;
    totalSize: number;
  } {
    const keys = this.keys();
    let totalSize = 0;

    if (typeof window !== 'undefined') {
      for (const key of keys) {
        try {
          const value = this.config.type === 'local' 
            ? localStorage.getItem(key)
            : sessionStorage.getItem(key);
          totalSize += (key.length + (value?.length || 0)) * 2; // UTF-16
        } catch {
          // Ignore errors
        }
      }
    }

    return {
      type: this.config.type,
      itemCount: keys.length,
      totalSize,
    };
  }

  /**
   * Simple encryption (for development only)
   * In production, use Web Crypto API or a proper encryption library
   */
  private encrypt(text: string): string {
    if (!this.encryptionKey) {
      return text;
    }

    // Simple XOR encryption for demonstration
    // DO NOT USE IN PRODUCTION
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length));
    }
    
    return btoa(result);
  }

  /**
   * Simple decryption (for development only)
   */
  private decrypt(encryptedText: string): string {
    if (!this.encryptionKey) {
      return encryptedText;
    }

    try {
      const text = atob(encryptedText);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ this.encryptionKey!.charCodeAt(i % this.encryptionKey!.length));
      }
      return result;
    } catch {
      return encryptedText;
    }
  }

  /**
   * Generate encryption key
   */
  private generateEncryptionKey(): string {
    // Generate a random key
    // In production, use a proper key generation method
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    return Array.from(array, byte => String.fromCharCode(byte)).join('');
  }
}

/**
 * Pre-configured storage instances
 */

// For user preferences (non-sensitive)
export const userPreferencesStorage = new SecureStorage({
  type: 'local',
  encrypt: false,
  defaultExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
});

// For session data (cleared on browser close)
export const sessionStorage = new SecureStorage({
  type: 'session',
  encrypt: false,
});

// For sensitive data (encrypted)
export const secureStorage = new SecureStorage({
  type: 'local',
  encrypt: true,
  defaultExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// For temporary data (short-lived)
export const tempStorage = new SecureStorage({
  type: 'session',
  encrypt: false,
  defaultExpiry: 60 * 60 * 1000, // 1 hour
});

/**
 * React hook for secure storage
 */
import { useState, useEffect, useCallback } from 'react';

export function useSecureStorage<T = any>(
  key: string,
  initialValue: T,
  storage: SecureStorage = userPreferencesStorage,
  options?: {
    expiresIn?: number;
    encrypt?: boolean;
  }
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = storage.get<T>(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  useEffect(() => {
    const storedValue = storage.get<T>(key);
    if (storedValue !== null) {
      setValue(storedValue);
    }
  }, [key, storage]);

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    storage.set(key, newValue, options);
  }, [key, storage, options]);

  const removeStoredValue = useCallback(() => {
    setValue(initialValue);
    storage.remove(key);
  }, [key, storage, initialValue]);

  return [value, setStoredValue, removeStoredValue];
}

/**
 * Hook for storage with expiry
 */
export function useExpiringStorage<T = any>(
  key: string,
  initialValue: T,
  expiresIn: number
): [T | null, (value: T) => void] {
  const storage = new SecureStorage({
    type: 'local',
    encrypt: false,
  });

  const [value, setValue] = useState<T | null>(() => {
    const stored = storage.get<T>(key);
    return stored;
  });

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    storage.set(key, newValue, { expiresIn });
  }, [key, storage, expiresIn]);

  return [value, setStoredValue];
}

/**
 * Migration utility from localStorage to secure storage
 */
export function migrateFromLocalStorage(
  oldKey: string,
  newKey: string,
  storage: SecureStorage = userPreferencesStorage,
  transformer?: (value: any) => any
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const oldValue = localStorage.getItem(oldKey);
    if (!oldValue) {
      return false;
    }

    let value: any;
    try {
      value = JSON.parse(oldValue);
    } catch {
      value = oldValue;
    }

    const transformedValue = transformer ? transformer(value) : value;
    storage.set(newKey, transformedValue);

    // Optionally remove old key
    // localStorage.removeItem(oldKey);

    return true;
  } catch (error) {
    console.error(`Migration failed for ${oldKey}:`, error);
    return false;
  }
}

/**
 * Clear all insecure localStorage items
 */
export function clearInsecureStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const insecureKeys = [
    'auth_token',
    'refresh_token',
    'user_profile',
    'token',
    'access_token',
    'id_token',
  ];

  for (const key of insecureKeys) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Validate storage is working
 */
export function validateStorage(): {
  localStorage: boolean;
  sessionStorage: boolean;
  secureStorage: boolean;
} {
  const testKey = '__storage_test__';
  const testValue = { test: true, timestamp: Date.now() };

  const localStorage = new SecureStorage({ type: 'local' });
  const sessionStorage = new SecureStorage({ type: 'session' });
  const secureStorage = new SecureStorage({ type: 'local', encrypt: true });

  const results = {
    localStorage: false,
    sessionStorage: false,
    secureStorage: false,
  };

  try {
    // Test localStorage
    localStorage.set(testKey, testValue);
    const retrieved = localStorage.get(testKey);
    results.localStorage = JSON.stringify(retrieved) === JSON.stringify(testValue);
    localStorage.remove(testKey);
  } catch {
    results.localStorage = false;
  }

  try {
    // Test sessionStorage
    sessionStorage.set(testKey, testValue);
    const retrieved = sessionStorage.get(testKey);
    results.sessionStorage = JSON.stringify(retrieved) === JSON.stringify(testValue);
    sessionStorage.remove(testKey);
  } catch {
    results.sessionStorage = false;
  }

  try {
    // Test secureStorage
    secureStorage.set(testKey, testValue);
    const retrieved = secureStorage.get(testKey);
    results.secureStorage = JSON.stringify(retrieved) === JSON.stringify(testValue);
    secureStorage.remove(testKey);
  } catch {
    results.secureStorage = false;
  }

  return results;
}