// Global error handling utilities

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class DeepSniffError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code = 'UNKNOWN_ERROR', statusCode = 500, details?: any) {
    super(message);
    this.name = 'DeepSniffError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Common error types
export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  
  // API errors
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_INVALID_REQUEST: 'API_INVALID_REQUEST',
  
  // File errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE: 'FILE_INVALID_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // Analysis errors
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  ANALYSIS_TIMEOUT: 'ANALYSIS_TIMEOUT',
  ANALYSIS_LIMIT_REACHED: 'ANALYSIS_LIMIT_REACHED',
  
  // Database errors
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  
  // General errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// Error handler function
export function handleError(error: unknown): AppError {
  console.error('Error occurred:', error);

  if (error instanceof DeepSniffError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    };
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('fetch')) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        code: ErrorCodes.NETWORK_ERROR,
        statusCode: 503
      };
    }

    if (error.message.includes('auth')) {
      return {
        message: 'Authentication failed. Please sign in again.',
        code: ErrorCodes.AUTH_INVALID,
        statusCode: 401
      };
    }

    return {
      message: error.message,
      code: ErrorCodes.UNKNOWN_ERROR,
      statusCode: 500
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    code: ErrorCodes.UNKNOWN_ERROR,
    statusCode: 500
  };
}

// User-friendly error messages
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.code) {
    case ErrorCodes.AUTH_REQUIRED:
      return 'Please sign in to continue using DeepSniff.';
    
    case ErrorCodes.AUTH_INVALID:
      return 'Your session has expired. Please sign in again.';
    
    case ErrorCodes.API_UNAVAILABLE:
      return 'Our analysis service is temporarily unavailable. Please try again later.';
    
    case ErrorCodes.API_RATE_LIMIT:
      return 'You\'ve reached the rate limit. Please wait a moment before trying again.';
    
    case ErrorCodes.FILE_TOO_LARGE:
      return 'File is too large. Please upload a smaller file (max 50MB for videos, 10MB for images).';
    
    case ErrorCodes.FILE_INVALID_TYPE:
      return 'Invalid file type. Please upload an image (PNG, JPG, JPEG) or video (MP4, MOV, AVI, WebM).';
    
    case ErrorCodes.ANALYSIS_FAILED:
      return 'Analysis failed. Please try uploading a different file or try again later.';
    
    case ErrorCodes.ANALYSIS_LIMIT_REACHED:
      return 'You\'ve reached your daily analysis limit. Upgrade to Pro Plan for unlimited analyses.';
    
    case ErrorCodes.NETWORK_ERROR:
      return 'Network connection failed. Please check your internet connection and try again.';
    
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

// Retry utility
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError;
}