/**
 * Log levels for different types of messages
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Error types that can occur in the plugin
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STATE_ERROR = 'STATE_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

/**
 * Custom error class for plugin-specific errors
 */
export class PluginError extends Error {
  public readonly type: ErrorType;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.RUNTIME_ERROR,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'PluginError';
    this.type = type;
    this.timestamp = new Date();
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available in V8)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, PluginError);
    }
  }
}

/**
 * Logger utility for development and debugging
 */
export class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    // Check if we're in development mode (fallback to true for safety)
    this.isDevelopment = typeof window !== 'undefined' && 
      (window as any).__DEV__ !== false;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [ANIMATION-PLUGIN] [${level.toUpperCase()}]`;
    return data ? `${prefix} ${message}` : `${prefix} ${message}`;
  }

  public debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, data), data || '');
    }
  }

  public info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage(LogLevel.INFO, message, data), data || '');
    }
  }

  public warn(message: string, data?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, data), data || '');
  }

  public error(message: string, error?: Error | any): void {
    console.error(this.formatMessage(LogLevel.ERROR, message), error || '');
    
    // In production, you might want to send errors to a monitoring service
    if (!this.isDevelopment && error instanceof PluginError) {
      this.reportError(error);
    }
  }

  private reportError(error: PluginError): void {
    // Placeholder for error reporting service integration
    // In a real production environment, you'd integrate with services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom analytics endpoint
    
    const errorReport = {
      message: error.message,
      type: error.type,
      timestamp: error.timestamp,
      stack: error.stack,
      context: error.context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };
    
    // For now, just log to console in a structured format
    console.error('Error Report:', JSON.stringify(errorReport, null, 2));
  }
}

/**
 * Safe execution wrapper for potentially failing operations
 */
export const safeExecute = async <T>(
  operation: () => Promise<T> | T,
  fallbackValue: T,
  errorMessage: string = 'Operation failed'
): Promise<T> => {
  const logger = Logger.getInstance();
  
  try {
    const result = await operation();
    return result;
  } catch (error) {
    logger.error(errorMessage, error);
    return fallbackValue;
  }
};

/**
 * Debounced error handler to prevent spam
 */
export class DebouncedErrorHandler {
  private static errorCounts = new Map<string, { count: number; lastOccurrence: number }>();
  private static readonly DEBOUNCE_TIME = 5000; // 5 seconds
  private static readonly MAX_ERRORS_PER_PERIOD = 3;

  public static shouldLogError(errorKey: string): boolean {
    const now = Date.now();
    const existing = this.errorCounts.get(errorKey);

    if (!existing) {
      this.errorCounts.set(errorKey, { count: 1, lastOccurrence: now });
      return true;
    }

    // Reset count if enough time has passed
    if (now - existing.lastOccurrence > this.DEBOUNCE_TIME) {
      this.errorCounts.set(errorKey, { count: 1, lastOccurrence: now });
      return true;
    }

    // Increment count
    existing.count += 1;
    existing.lastOccurrence = now;

    // Only log if under the limit
    return existing.count <= this.MAX_ERRORS_PER_PERIOD;
  }

  public static logError(errorKey: string, message: string, error?: any): void {
    if (this.shouldLogError(errorKey)) {
      const logger = Logger.getInstance();
      logger.error(message, error);
    }
  }
}