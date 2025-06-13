import { AnimationConfig, ValidationResult, VALIDATION_LIMITS, COMMON_PROPERTIES } from '../types';

/**
 * Validates a duration value
 */
export const validateDuration = (value: number): ValidationResult => {
  const errors: string[] = [];
  
  if (!Number.isInteger(value) || value < VALIDATION_LIMITS.MIN_DURATION) {
    errors.push(`Duration must be a positive integer (minimum: ${VALIDATION_LIMITS.MIN_DURATION}ms)`);
  }
  
  if (value > VALIDATION_LIMITS.MAX_DURATION) {
    errors.push(`Duration cannot exceed ${VALIDATION_LIMITS.MAX_DURATION}ms (${VALIDATION_LIMITS.MAX_DURATION / 1000}s)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a delay value
 */
export const validateDelay = (value: number): ValidationResult => {
  const errors: string[] = [];
  
  if (!Number.isInteger(value) || value < VALIDATION_LIMITS.MIN_DELAY) {
    errors.push(`Delay must be a non-negative integer (minimum: ${VALIDATION_LIMITS.MIN_DELAY}ms)`);
  }
  
  if (value > VALIDATION_LIMITS.MAX_DELAY) {
    errors.push(`Delay cannot exceed ${VALIDATION_LIMITS.MAX_DELAY}ms (${VALIDATION_LIMITS.MAX_DELAY / 1000}s)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates iterations value
 */
export const validateIterations = (value: number | 'infinite'): ValidationResult => {
  const errors: string[] = [];
  
  if (value !== 'infinite') {
    if (!Number.isInteger(value) || value < 1) {
      errors.push('Iterations must be a positive integer or "infinite"');
    }
    
    if (value > VALIDATION_LIMITS.MAX_ITERATIONS) {
      errors.push(`Iterations cannot exceed ${VALIDATION_LIMITS.MAX_ITERATIONS}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a custom CSS property name
 */
export const validateCustomProperty = (property: string): ValidationResult => {
  const errors: string[] = [];
  
  if (property.length < VALIDATION_LIMITS.MIN_CUSTOM_PROPERTY_LENGTH) {
    errors.push('Property name cannot be empty');
  }
  
  if (property.length > VALIDATION_LIMITS.MAX_CUSTOM_PROPERTY_LENGTH) {
    errors.push(`Property name cannot exceed ${VALIDATION_LIMITS.MAX_CUSTOM_PROPERTY_LENGTH} characters`);
  }
  
  // Basic CSS property name validation
  const cssPropertyRegex = /^[a-zA-Z-][a-zA-Z0-9-]*$/;
  if (!cssPropertyRegex.test(property)) {
    errors.push('Property name must be a valid CSS property (letters, numbers, and hyphens only)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates the entire animation configuration
 */
export const validateAnimationConfig = (config: AnimationConfig): ValidationResult => {
  const errors: string[] = [];
  
  // Validate duration
  const durationResult = validateDuration(config.duration);
  if (!durationResult.isValid) {
    errors.push(...durationResult.errors);
  }
  
  // Validate delay
  const delayResult = validateDelay(config.delay);
  if (!delayResult.isValid) {
    errors.push(...delayResult.errors);
  }
  
  // Validate iterations
  const iterationsResult = validateIterations(config.iterations);
  if (!iterationsResult.isValid) {
    errors.push(...iterationsResult.errors);
  }
  
  // Validate properties array
  if (config.properties.length === 0) {
    errors.push('At least one property must be selected for animation');
  }
  
  // Validate custom properties
  const customProperties = config.properties.filter(prop => !COMMON_PROPERTIES.includes(prop as any));
  for (const prop of customProperties) {
    const propResult = validateCustomProperty(prop);
    if (!propResult.isValid) {
      errors.push(`Invalid custom property "${prop}": ${propResult.errors.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitizes a numeric input value
 */
export const sanitizeNumericInput = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : Math.max(0, parsed);
};

/**
 * Sanitizes a string input value
 */
export const sanitizeStringInput = (value: string, maxLength: number = 100): string => {
  return value.trim().slice(0, maxLength);
};