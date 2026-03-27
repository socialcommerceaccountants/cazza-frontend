import { ApiError } from './api/client';

export interface ErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromApiError(apiError: ApiError): AppError {
    return new AppError(
      apiError.message,
      apiError.code,
      apiError.status,
      apiError.details,
      apiError.status ? apiError.status >= 500 : false // Server errors are retryable
    );
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof ApiError) {
      return AppError.fromApiError(error);
    }
    
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN_ERROR');
    }
    
    return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 0 || error.code === 'NETWORK_ERROR';
  }
  
  if (error instanceof AppError) {
    return error.status === 0 || error.code === 'NETWORK_ERROR';
  }
  
  return false;
}

export function isAuthError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
}

export function isServerError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status ? status >= 500 : false;
}

export function isClientError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status ? status >= 400 && status < 500 : false;
}

export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof ApiError) {
    return error.status;
  }
  
  if (error instanceof AppError) {
    return error.status;
  }
  
  return undefined;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof ApiError) {
    return error.code;
  }
  
  if (error instanceof AppError) {
    return error.code;
  }
  
  return undefined;
}

// Error boundary fallback component props
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You need to be logged in to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

// Error handling hooks
import { useCallback } from 'react';

export function useErrorHandler() {
  const handleError = useCallback((error: unknown, options?: {
    showToast?: boolean;
    fallbackMessage?: string;
    onError?: (error: AppError) => void;
  }) => {
    const appError = AppError.fromUnknown(error);
    const {
      showToast = true,
      fallbackMessage = ERROR_MESSAGES.UNKNOWN,
      onError,
    } = options || {};

    // Call custom error handler if provided
    if (onError) {
      onError(appError);
    }

    // Show console notification instead of toast for now
    if (showToast) {
      let message = appError.message || fallbackMessage;

      // Customize message based on error type
      if (isNetworkError(appError)) {
        message = ERROR_MESSAGES.NETWORK;
      } else if (isAuthError(appError)) {
        message = ERROR_MESSAGES.UNAUTHORIZED;
        // Redirect to login if unauthorized
        if (typeof window !== 'undefined' && appError.status === 401) {
          window.location.href = '/login';
          return;
        }
      } else if (isServerError(appError)) {
        message = ERROR_MESSAGES.SERVER_ERROR;
      }

      console.error('Error:', message);
    }

    // Log error for debugging
    console.error('Error details:', {
      message: appError.message,
      code: appError.code,
      status: appError.status,
      details: appError.details,
      stack: appError.stack,
    });

    return appError;
  }, []);

  const handleSuccess = useCallback((message: string) => {
    console.log('Success:', message);
  }, []);

  return {
    handleError,
    handleSuccess,
    isNetworkError,
    isAuthError,
    isServerError,
    isClientError,
    getErrorMessage,
    getErrorCode,
  };
}

// React Query error handler
export function useQueryErrorHandler() {
  const { handleError } = useErrorHandler();

  const onError = useCallback((error: unknown) => {
    handleError(error, {
      showToast: true,
      onError: (appError) => {
        // Don't show toast for 404 errors in queries (they might be expected)
        if (appError.status === 404) {
          return;
        }
      },
    });
  }, [handleError]);

  return { onError };
}

// Mutation error handler
export function useMutationErrorHandler() {
  const { handleError } = useErrorHandler();

  const onError = useCallback((error: unknown) => {
    handleError(error, { showToast: true });
  }, [handleError]);

  const onSuccess = useCallback((message: string) => {
    handleError.handleSuccess(message);
  }, [handleError]);

  return { onError, onSuccess };
}