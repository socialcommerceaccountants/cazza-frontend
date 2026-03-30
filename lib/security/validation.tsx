/**
 * Input Validation and Sanitization
 * 
 * Provides utilities for validating and sanitizing user input to prevent:
 * - XSS (Cross-Site Scripting) attacks
 * - SQL injection (though less relevant for frontend)
 * - Command injection
 * - Malicious file uploads
 * - Data corruption
 */

/**
 * Validation rules for common input types
 */
export interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  custom?: (value: any) => boolean;
  errorMessage?: string;
}

/**
 * Validation results
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: any;
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  // Email validation (RFC 5322 compliant)
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Password requirements: at least 8 chars, 1 uppercase, 1 lowercase, 1 number
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  // URL validation
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  
  // Phone number (basic international format)
  PHONE: /^\+?[1-9]\d{1,14}$/,
  
  // No HTML tags
  NO_HTML: /^[^<>]*$/,
  
  // No script tags or event handlers
  NO_SCRIPT: /<(script|iframe|frame|object|embed|applet|meta|link|style|form|input|button|textarea|select|option).*?>|on\w+\s*=/i,
  
  // Alphanumeric with spaces and basic punctuation
  SAFE_TEXT: /^[a-zA-Z0-9\s.,!?@#$%^&*()\-_+=:;'"<>[\]{}|\\\/`~]*$/,
  
  // UUID v4
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

/**
 * Input validator class
 */
export class InputValidator {
  /**
   * Validate a single value against rules
   */
  static validate(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(rules.errorMessage || 'This field is required');
      return { valid: false, errors };
    }

    // Skip further validation if value is empty and not required
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return { valid: true, errors: [], sanitized: value };
    }

    const stringValue = String(value);

    // Check min length
    if (rules.minLength !== undefined && stringValue.length < rules.minLength) {
      errors.push(rules.errorMessage || `Minimum length is ${rules.minLength} characters`);
    }

    // Check max length
    if (rules.maxLength !== undefined && stringValue.length > rules.maxLength) {
      errors.push(rules.errorMessage || `Maximum length is ${rules.maxLength} characters`);
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      errors.push(rules.errorMessage || 'Invalid format');
    }

    // Custom validation
    if (rules.custom && !rules.custom(value)) {
      errors.push(rules.errorMessage || 'Validation failed');
    }

    // Sanitize if valid
    let sanitized = value;
    if (errors.length === 0) {
      sanitized = this.sanitize(value);
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Validate multiple fields
   */
  static validateForm(
    data: Record<string, any>,
    rules: Record<string, ValidationRule>
  ): ValidationResult {
    const errors: string[] = [];
    const sanitized: Record<string, any> = {};

    for (const [field, value] of Object.entries(data)) {
      const fieldRules = rules[field];
      if (fieldRules) {
        const result = this.validate(value, fieldRules);
        if (!result.valid) {
          errors.push(...result.errors.map(error => `${field}: ${error}`));
        }
        sanitized[field] = result.sanitized;
      } else {
        // No rules specified, apply basic sanitization
        sanitized[field] = this.sanitize(value);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitize(input: any): any {
    if (input === null || input === undefined) {
      return input;
    }

    // Handle different types
    if (typeof input === 'string') {
      return this.sanitizeString(input);
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitize(item));
    }

    if (typeof input === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitize(value);
      }
      return sanitized;
    }

    // Return primitive values as-is
    return input;
  }

  /**
   * Sanitize a string to prevent XSS
   */
  static sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }

    // Remove script tags and event handlers
    let sanitized = str.replace(ValidationPatterns.NO_SCRIPT, '');
    
    // Escape HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
  }

  /**
   * Validate and sanitize HTML content (for rich text editors)
   */
  static sanitizeHTML(html: string, allowedTags: string[] = []): string {
    if (typeof html !== 'string') {
      return '';
    }

    // Basic HTML sanitization
    // In production, use a library like DOMPurify
    let sanitized = html;

    // Remove script tags and event handlers
    sanitized = sanitized.replace(ValidationPatterns.NO_SCRIPT, '');

    // If allowed tags specified, remove all others
    if (allowedTags.length > 0) {
      const tagPattern = new RegExp(`<\\/?(?!(${allowedTags.join('|')})\\b)[^>]+>`, 'gi');
      sanitized = sanitized.replace(tagPattern, '');
    }

    return sanitized;
  }

  /**
   * Validate file upload
   */
  static validateFile(file: File, options: {
    allowedTypes?: string[];
    maxSize?: number; // in bytes
    allowedExtensions?: string[];
  } = {}): ValidationResult {
    const errors: string[] = [];

    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const isValidType = options.allowedTypes.some(type => 
        file.type.startsWith(type.replace('/*', ''))
      );
      if (!isValidType) {
        errors.push(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
      }
    }

    // Check file extension
    if (options.allowedExtensions && options.allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !options.allowedExtensions.includes(`.${extension}`)) {
        errors.push(`File extension not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`);
      }
    }

    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
      errors.push(`File too large. Maximum size: ${maxSizeMB} MB`);
    }

    // Check for potentially dangerous file types
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.html'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension && dangerousExtensions.includes(`.${fileExtension}`)) {
      errors.push('Potentially dangerous file type detected');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate email address
   */
  static validateEmail(email: string): ValidationResult {
    return this.validate(email, {
      required: true,
      pattern: ValidationPatterns.EMAIL,
      errorMessage: 'Please enter a valid email address',
    });
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string, confirmPassword?: string): ValidationResult {
    const errors: string[] = [];

    // Basic password requirements
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Optional: Check for common passwords
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'welcome',
      'password123', '12345678', '123456789', '1234567890'
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a stronger password');
    }

    // Confirm password match
    if (confirmPassword !== undefined && password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate URL
   */
  static validateURL(url: string, requireHttps: boolean = true): ValidationResult {
    const errors: string[] = [];

    try {
      const parsedUrl = new URL(url);
      
      if (requireHttps && parsedUrl.protocol !== 'https:') {
        errors.push('URL must use HTTPS');
      }

      // Check for suspicious characters in path
      if (parsedUrl.pathname.includes('<') || parsedUrl.pathname.includes('>')) {
        errors.push('URL contains potentially dangerous characters');
      }
    } catch {
      errors.push('Please enter a valid URL');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate JSON data
   */
  static validateJSON(jsonString: string, schema?: any): ValidationResult {
    const errors: string[] = [];

    try {
      const parsed = JSON.parse(jsonString);
      
      // Basic JSON validation
      if (typeof parsed !== 'object' || parsed === null) {
        errors.push('JSON must be an object');
      }

      // TODO: Add JSON schema validation if schema provided
      // This would require a JSON schema validator library

      return {
        valid: errors.length === 0,
        errors,
        sanitized: parsed,
      };
    } catch (error) {
      return {
        valid: false,
        errors: ['Invalid JSON format'],
      };
    }
  }

  /**
   * Check for SQL injection patterns
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)/i,
      /(\b(OR|AND)\s+['"]?\d+['"]?\s*[=<>])/i,
      /(--|\#|\/\*)/, // SQL comments
      /(;\s*(\w+)?)/, // Multiple statements
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for XSS patterns
   */
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /vbscript:/i,
      /expression\s*\(/i,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for command injection patterns
   */
  static detectCommandInjection(input: string): boolean {
    const commandPatterns = [
      /[;&|`\$\(\)]/,
      /(\b(rm|del|mkdir|cp|mv|chmod|chown|wget|curl|nc|telnet|ssh)\b)/i,
      /(\/\w+\/)/, // Unix paths
      /(\.\.\/)/, // Directory traversal
    ];

    return commandPatterns.some(pattern => pattern.test(input));
  }
}

/**
 * React hook for form validation
 */
import { useState, useCallback } from 'react';

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationRules: Record<keyof T, ValidationRule>
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as any);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);

  const validateField = useCallback((field: keyof T, value: any) => {
    const rule = validationRules[field];
    if (!rule) return { valid: true, errors: [] };

    const result = InputValidator.validate(value, rule);
    
    setErrors(prev => ({
      ...prev,
      [field]: result.errors,
    }));

    return result;
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const newErrors: Record<keyof T, string[]> = {} as any;
    let isValid = true;

    for (const field of Object.keys(validationRules) as Array<keyof T>) {
      const rule = validationRules[field];
      const value = formData[field];
      const result = InputValidator.validate(value, rule);
      
      newErrors[field] = result.errors;
      if (result.errors.length > 0) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    return { valid: isValid, errors: newErrors };
  }, [formData, validationRules]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    const sanitizedValue = InputValidator.sanitize(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue,
    }));

    // Validate on change if field has been touched
    if (touched[field]) {
      validateField(field, sanitizedValue);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    validateField(field, formData[field]);
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({} as any);
    setTouched({} as any);
  }, [initialData]);

  return {
    formData,
    errors,
    touched,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    resetForm,
    setFormData,
  };
}

/**
 * Higher-order component for validated forms
 */
import React from 'react';

interface WithValidationProps {
  validationRules: Record<string, ValidationRule>;
  onSubmit: (data: any, isValid: boolean) => void;
}

export function withValidation<P extends object>(
  WrappedComponent: React.ComponentType<P & WithValidationProps>
) {
  return function ValidatedForm(props: P) {
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (formData: any) => {
      setIsSubmitting(true);
      
      // Validate all fields
      const validation = InputValidator.validateForm(formData, props.validationRules);
      
      if (validation.valid) {
        await props.onSubmit(validation.sanitized, true);
      } else {
        // Convert errors to field-specific format
        const fieldErrors: Record<string, string[]> = {};
        validation.errors.forEach(error => {
          const match = error.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, field, message] = match;
            if (!fieldErrors[field]) fieldErrors[field] = [];
            fieldErrors[field].push(message);
          }
        });
        
        setFormErrors(fieldErrors);
        await props.onSubmit(formData, false);
      }
      
      setIsSubmitting(false);
    },
  });

  return {
    formErrors,
    isSubmitting,
    handleSubmit,
  };
}