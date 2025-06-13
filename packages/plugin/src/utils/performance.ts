import { useCallback, useMemo, useRef } from '@stagewise/toolbar/plugin-ui';

/**
 * Custom hook for debouncing values
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for throttling function calls
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(Date.now());

  return useCallback(
    ((...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

/**
 * Memoization utility for expensive computations
 */
export class MemoizationCache {
  private static cache = new Map<string, { value: any; timestamp: number }>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  public static get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() - cached.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  public static set<T>(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  public static clear(): void {
    this.cache.clear();
  }

  public static clearExpired(ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Creates a memoized version of a function
 */
export const memoize = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyGenerator?: (...args: TArgs) => string,
  ttl?: number
): ((...args: TArgs) => TReturn) => {
  return (...args: TArgs): TReturn => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    const cached = MemoizationCache.get<TReturn>(key, ttl);
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    MemoizationCache.set(key, result);
    
    return result;
  };
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();

  public static startMeasure(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.measurements.has(name)) {
        this.measurements.set(name, []);
      }
      
      this.measurements.get(name)!.push(duration);
    };
  }

  public static getMeasurements(name: string): {
    count: number;
    total: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const total = measurements.reduce((sum, time) => sum + time, 0);
    const average = total / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      count: measurements.length,
      total,
      average,
      min,
      max,
    };
  }

  public static logMeasurements(): void {
    console.group('Performance Measurements');
    for (const [name, measurements] of this.measurements.entries()) {
      const stats = this.getMeasurements(name);
      if (stats) {
        console.log(`${name}:`, {
          'Average (ms)': stats.average.toFixed(2),
          'Total (ms)': stats.total.toFixed(2),
          'Count': stats.count,
          'Min (ms)': stats.min.toFixed(2),
          'Max (ms)': stats.max.toFixed(2),
        });
      }
    }
    console.groupEnd();
  }

  public static clearMeasurements(): void {
    this.measurements.clear();
  }
}

/**
 * Debounce function implementation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): T => {
  let timeout: number | null = null;
  
  return ((...args: any[]) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  }) as T;
};

/**
 * Throttle function implementation
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// Add missing imports
import { useState, useEffect } from '@stagewise/toolbar/plugin-ui';