// Validation utilities for file uploads and form data

import { FILE_LIMITS } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// File validation
export function validateFile(file: File, type: 'image' | 'video'): ValidationResult {
  const limits = FILE_LIMITS[type];

  // Check file size
  if (file.size > limits.maxSize) {
    const maxSizeMB = limits.maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB for ${type}s`
    };
  }

  // Check file type
  if (!limits.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${limits.allowedExtensions.join(', ')}`
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!limits.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${limits.allowedExtensions.join(', ')}`
    };
  }

  return { isValid: true };
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long'
    };
  }

  return { isValid: true };
}

// File type detection
export function getFileType(file: File): 'image' | 'video' | 'unknown' {
  if (file.type.startsWith('image/')) {
    return 'image';
  }
  
  if (file.type.startsWith('video/')) {
    return 'video';
  }
  
  return 'unknown';
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Check if file is supported
export function isSupportedFile(file: File): boolean {
  const imageTypes = FILE_LIMITS.image.allowedTypes;
  const videoTypes = FILE_LIMITS.video.allowedTypes;
  
  return [...imageTypes, ...videoTypes].includes(file.type);
}