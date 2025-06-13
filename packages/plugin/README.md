# Stagewise Animation Builder Plugin

A production-ready plugin for the Stagewise Toolbar that provides a visual interface for building CSS animations and sending specifications to Cursor.

## Features

- 🎨 **Visual Animation Builder**: Intuitive interface for configuring animations
- 🛡️ **Production Ready**: Comprehensive error handling, validation, and performance optimization
- 🔧 **Multiple Animation Types**: Support for CSS Transitions, Keyframes, Motion, React Spring, GSAP, and Lottie
- ✅ **Input Validation**: Real-time validation with helpful error messages
- 🚀 **Performance Optimized**: Debounced updates, memoization, and performance monitoring
- 🎯 **Accessibility**: Full ARIA support and keyboard navigation
- 📊 **Comprehensive Logging**: Development and production logging with error reporting

## Supported Animation Types

| Type | Description | Use Case |
|------|-------------|----------|
| CSS Transitions | Simple property transitions | Basic hover effects, state changes |
| CSS Keyframes | Complex keyframe animations | Multi-step animations, custom timing |
| Motion React | React animation library | Modern React applications |
| React Spring | Spring-physics animations | Natural, bouncy animations |
| GSAP | Professional animation library | Complex, high-performance animations |
| Lottie | After Effects animations | Vector animations, micro-interactions |

## Configuration Options

### Basic Settings
- **Duration**: 0-30,000ms (0-30 seconds)
- **Delay**: 0-10,000ms (0-10 seconds)
- **Easing**: Predefined functions or custom cubic-bezier curves
- **Iterations**: 1-100 or infinite
- **Direction**: normal, reverse, alternate, alternate-reverse
- **Fill Mode**: none, forwards, backwards, both

### Properties
Choose from common CSS properties or add custom ones:
- **Common Properties**: opacity, transform, background-color, color, width, height, margin, padding, border, box-shadow, border-radius
- **Custom Properties**: Add any valid CSS property with real-time validation

## Architecture

### Production-Ready Features

#### 1. Error Handling (`src/utils/error-handling.ts`)
- **Custom Error Classes**: Structured error handling with context
- **Logging System**: Environment-aware logging with different levels
- **Debounced Error Reporting**: Prevents error spam
- **Error Recovery**: Graceful fallbacks for component failures

#### 2. Input Validation (`src/utils/validation.ts`)
- **Real-time Validation**: Immediate feedback on input changes
- **Sanitization**: Automatic cleanup of user inputs
- **Type Safety**: Comprehensive TypeScript validation
- **Custom Property Validation**: CSS property name validation

#### 3. Performance Optimization (`src/utils/performance.ts`)
- **Debounced Updates**: Prevents excessive re-renders
- **Memoization**: Caches expensive computations
- **Performance Monitoring**: Tracks render times and operations
- **Throttling**: Controls frequency of expensive operations

#### 4. Type Safety (`src/types.ts`)
- **Comprehensive Types**: Full TypeScript coverage
- **Readonly Constants**: Immutable configuration objects
- **Validation Interfaces**: Structured validation results
- **Configuration Limits**: Type-safe boundaries

### File Structure

```
packages/plugin/
├── src/
│   ├── types.ts              # Type definitions and constants
│   ├── utils/
│   │   ├── validation.ts     # Input validation utilities
│   │   ├── error-handling.ts # Error handling and logging
│   │   └── performance.ts    # Performance optimization utilities
│   ├── component.tsx         # Main plugin component
│   └── index.tsx            # Plugin entry point
├── dist/                     # Built output
├── package.json             # Package configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Build configuration
└── README.md               # This file
```

## Usage

### Installation

The plugin is automatically available in the Stagewise Toolbar. No additional installation required.

### Basic Usage

1. **Open the Animation Panel**: Click the Animation Builder icon in the toolbar
2. **Configure Animation**: Use the visual interface to set up your animation
3. **Select Properties**: Choose which CSS properties to animate
4. **Add Custom Properties**: Enter custom CSS properties as needed
5. **Send to Cursor**: With elements selected, send your prompt to apply the animation

### Advanced Usage

#### Custom Properties
Add any valid CSS property by typing it in the custom property field. The plugin will validate:
- Property name format (letters, numbers, hyphens)
- Length limits (1-50 characters)
- Uniqueness (no duplicates)

#### Error Handling
The plugin provides comprehensive error feedback:
- Real-time validation messages
- Configuration issue warnings
- Graceful fallbacks for errors

#### Performance Monitoring
In development mode, the plugin tracks:
- Configuration validation time
- Custom property addition time
- Panel render time
- Prompt processing time

Access performance data via: `PerformanceMonitor.logMeasurements()`

## Development

### Building

```bash
# Development build with watch mode
pnpm dev

# Production build
pnpm build
```

### Environment Variables

- `NODE_ENV`: Affects logging behavior
- `__DEV__`: Development flag for enhanced debugging

### Logging

The plugin uses a structured logging system:

```typescript
import { Logger } from './utils/error-handling';

const logger = Logger.getInstance();
logger.debug('Debug message', data);
logger.info('Info message', data);
logger.warn('Warning message', data);
logger.error('Error message', error);
```

### Performance Monitoring

Track operation performance:

```typescript
import { PerformanceMonitor } from './utils/performance';

const endMeasure = PerformanceMonitor.startMeasure('operation-name');
// ... perform operation
endMeasure();

// View all measurements
PerformanceMonitor.logMeasurements();
```

## API Reference

### Animation Configuration

```typescript
interface AnimationConfig {
  type: 'css-transition' | 'css-keyframes' | 'motion' | 'react-spring' | 'gsap' | 'lottie';
  duration: number;          // 0-30000ms
  easing: string;           // CSS easing function
  delay: number;            // 0-10000ms
  iterations: number | 'infinite'; // 1-100 or 'infinite'
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  properties: string[];     // CSS properties to animate
  customOptions: Record<string, any>; // Library-specific options
}
```

### Validation

```typescript
// Validate entire configuration
const result = validateAnimationConfig(config);
if (!result.isValid) {
  console.log(result.errors);
}

// Validate individual properties
const customPropResult = validateCustomProperty('margin-top');
const durationResult = validateDuration(500);
const delayResult = validateDelay(100);
```

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **CSS Features**: CSS Transitions, CSS Animations, CSS Custom Properties
- **JavaScript**: ES2020+ features

## Contributing

1. Follow the existing code style and architecture
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure all TypeScript errors are resolved
5. Test performance impact of changes

## License

AGPL-3.0-only

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.