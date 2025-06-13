export interface AnimationConfig {
  type: 'css-transition' | 'css-keyframes' | 'motion' | 'react-spring' | 'gsap' | 'lottie';
  duration: number;
  easing: string;
  delay: number;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  properties: string[];
  customOptions: Record<string, any>;
}

export interface AnimationTypeOption {
  readonly value: AnimationConfig['type'];
  readonly label: string;
  readonly description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AnimationPanelProps {
  onConfigChange?: (config: AnimationConfig) => void;
}

// Constants
export const ANIMATION_TYPES: readonly AnimationTypeOption[] = [
  { value: 'css-transition', label: 'CSS Transitions', description: 'Simple property transitions' },
  { value: 'css-keyframes', label: 'CSS Keyframes', description: 'Complex keyframe animations' },
  { value: 'motion', label: 'Motion React', description: 'React animation library' },
  { value: 'react-spring', label: 'React Spring', description: 'Spring-physics animations' },
  { value: 'gsap', label: 'GSAP', description: 'Professional animation library' },
  { value: 'lottie', label: 'Lottie', description: 'After Effects animations' },
] as const;

export const EASING_OPTIONS: readonly string[] = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
  'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'cubic-bezier(0.42, 0, 0.58, 1)',
  'cubic-bezier(0.42, 0, 1, 1)',
  'cubic-bezier(0, 0, 0.58, 1)',
] as const;

export const COMMON_PROPERTIES: readonly string[] = [
  'opacity',
  'transform',
  'background-color',
  'color',
  'width',
  'height',
  'margin',
  'padding',
  'border',
  'box-shadow',
  'border-radius',
] as const;

export const VALIDATION_LIMITS = {
  MIN_DURATION: 0,
  MAX_DURATION: 30000, // 30 seconds
  MIN_DELAY: 0,
  MAX_DELAY: 10000, // 10 seconds
  MAX_ITERATIONS: 100,
  MIN_CUSTOM_PROPERTY_LENGTH: 1,
  MAX_CUSTOM_PROPERTY_LENGTH: 50,
} as const;

export const DEFAULT_CONFIG: AnimationConfig = {
  type: 'css-transition',
  duration: 300,
  easing: 'ease',
  delay: 0,
  iterations: 1,
  direction: 'normal',
  fillMode: 'both',
  properties: ['opacity', 'transform'],
  customOptions: {},
} as const;