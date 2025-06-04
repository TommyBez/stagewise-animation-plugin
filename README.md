# Stagewise Animation Plugin

A powerful animation builder plugin for [Stagewise.io](https://stagewise.io) that provides an intuitive interface for creating and configuring animations across multiple animation libraries.

## Features

- **Multiple Animation Types**: Support for CSS Transitions, CSS Keyframes, Motion React, React Spring, GSAP, and Lottie
- **Visual Configuration**: User-friendly interface for animation properties
- **Flexible Property Selection**: Choose from common CSS properties or add custom ones
- **Advanced Controls**: Configure duration, easing, delay, iterations, direction, and fill modes
- **Real-time Preview**: Test animations with instant feedback
- **Code Generation**: Automatic generation of animation code for different libraries

## Project Structure

This is a Turborepo monorepo containing:

- `packages/plugin/` - The main animation plugin package
- `apps/example-app/` - Next.js example application demonstrating plugin usage

## Quick Start

### Prerequisites

- Node.js ≥18
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stagewise-animation-plugin
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development:
```bash
pnpm dev
```

This will start both the plugin build in watch mode and the example application.

## Development

### Available Scripts

- `pnpm dev` - Start development servers for all packages
- `pnpm build` - Build all packages for production
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code using Prettier
- `pnpm check-types` - Run TypeScript type checking

### Plugin Development

The main plugin code is located in `packages/plugin/src/`:

- `index.tsx` - Main plugin export
- `component.tsx` - Animation builder component with full UI and logic

### Example App

The example app demonstrates how to integrate the animation plugin with Stagewise toolbar in a Next.js application.

## Plugin Features

### Animation Types

- **CSS Transitions**: Simple property transitions with customizable duration and easing
- **CSS Keyframes**: Complex multi-step animations with keyframe control
- **Motion React**: Modern React animation library integration
- **React Spring**: Spring-physics based animations
- **GSAP**: Professional-grade animation library support
- **Lottie**: After Effects animation integration

### Configuration Options

- **Duration**: Animation timing in milliseconds
- **Easing**: Various easing functions (ease, ease-in, ease-out, cubic-bezier, etc.)
- **Delay**: Animation start delay
- **Iterations**: Number of animation repetitions (including infinite)
- **Direction**: Animation direction (normal, reverse, alternate, alternate-reverse)
- **Fill Mode**: How animation properties are applied (none, forwards, backwards, both)
- **Properties**: Animatable CSS properties (opacity, transform, colors, dimensions, etc.)

### Property Selection

Choose from common CSS properties:
- Opacity
- Transform
- Background Color
- Color
- Width/Height
- Margin/Padding
- Border
- Box Shadow
- Border Radius

Or add custom properties for advanced use cases.

## Integration

This plugin is designed to work with the Stagewise toolbar system. To integrate:

1. Install the plugin in your Stagewise-enabled application
2. Import and register the `AnimationPlugin`
3. The plugin will appear in your Stagewise toolbar interface

```tsx
import { AnimationPlugin } from 'stagewise-animation-plugin';

// Register with Stagewise toolbar
// (Specific integration depends on your Stagewise setup)
```

## License

AGPL-3.0-only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- [GitHub Issues](https://github.com/stagewise-io/stagewise/issues)
- [Stagewise.io](https://stagewise.io)

---

Built with ❤️ by [tiq UG (haftungsbeschränkt)](https://stagewise.io) 