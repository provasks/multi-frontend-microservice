/**
 * Security utilities for input sanitization and validation
 */

// Basic HTML sanitization (for production, use DOMPurify)
export const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 6;
  return password && password.length >= minLength;
};

// General input validation
export const validateInput = (input, type = 'text', maxLength = 255) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Invalid input' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input too long (max ${maxLength} characters)` };
  }
  
  switch (type) {
    case 'email':
      return validateEmail(input) 
        ? { isValid: true } 
        : { isValid: false, error: 'Invalid email format' };
    
    case 'password':
      return validatePassword(input) 
        ? { isValid: true } 
        : { isValid: false, error: 'Password must be at least 6 characters' };
    
    case 'text':
    default:
      return { isValid: true };
  }
};

// Sanitize form data
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Don't sanitize passwords
      if (key.toLowerCase().includes('password')) {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeHtml(value);
      }
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailValidation = validateInput(formData.email, 'email');
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate password
  const passwordValidation = validateInput(formData.password, 'password');
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate task form
export const validateTaskForm = (formData) => {
  const errors = {};
  
  // Validate title
  if (!formData.title || formData.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  // Validate description
  if (formData.description && formData.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  
  // Validate assignedTo
  if (!formData.assignedTo) {
    errors.assignedTo = 'Assigned user is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate user form
export const validateUserForm = (formData) => {
  const errors = {};
  
  // Validate name
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (formData.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }
  
  // Validate email
  const emailValidation = validateInput(formData.email, 'email');
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validate role
  const validRoles = ['user', 'admin'];
  if (!formData.role || !validRoles.includes(formData.role)) {
    errors.role = 'Valid role is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Rate limiting utility - DISABLED for now
export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
    // Rate limiting completely disabled
  }
  
  canMakeRequest() {
    // Always allow requests - rate limiting disabled
    return true;
  }
  
  recordRequest() {
    // Don't record requests - rate limiting disabled
    return;
  }
  
  getRemainingRequests() {
    // Return max requests - rate limiting disabled
    return this.maxRequests;
  }
  
  getTimeUntilReset() {
    // Return 0 - no reset needed
    return 0;
  }
}

// Create a global rate limiter instance
// In development: effectively unlimited (rate limiting disabled)
// In production: 10 requests per minute
export const globalRateLimiter = new RateLimiter(1000, 60000); // 1000 requests per minute (effectively unlimited in dev)
