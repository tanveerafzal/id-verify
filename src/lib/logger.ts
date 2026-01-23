/**
 * Comprehensive Logging Utility
 * Provides structured console logging with levels, context, and formatting
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  partnerId?: string;
  verificationId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  data?: unknown;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Log level priority (lower = more verbose)
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Get minimum log level from environment (default: debug in dev, info in prod)
const getMinLogLevel = (): LogLevel => {
  const envLevel = import.meta.env.VITE_LOG_LEVEL as LogLevel | undefined;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return import.meta.env.DEV ? 'debug' : 'info';
};

const MIN_LOG_LEVEL = getMinLogLevel();

// Format timestamp
const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Check if log level should be output
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
};

// Format log entry for console output
const formatLogEntry = (entry: LogEntry): string => {
  const parts: string[] = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase()}]`,
  ];

  if (entry.context?.component) {
    parts.push(`[${entry.context.component}]`);
  }

  if (entry.context?.action) {
    parts.push(`[${entry.context.action}]`);
  }

  parts.push(entry.message);

  return parts.join(' ');
};

// Style configurations for different log levels
const LOG_STYLES: Record<LogLevel, string> = {
  debug: 'color: #6B7280; font-weight: normal;',
  info: 'color: #3B82F6; font-weight: normal;',
  warn: 'color: #F59E0B; font-weight: bold;',
  error: 'color: #EF4444; font-weight: bold;',
};

// Core logging function
const log = (
  level: LogLevel,
  message: string,
  contextOrData?: LogContext | unknown,
  data?: unknown
): void => {
  if (!shouldLog(level)) return;

  // Determine if second param is context or data
  let context: LogContext | undefined;
  let logData: unknown;

  if (contextOrData && typeof contextOrData === 'object' && 'component' in contextOrData) {
    context = contextOrData as LogContext;
    logData = data;
  } else {
    logData = contextOrData;
  }

  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    context,
    data: logData,
  };

  const formattedMessage = formatLogEntry(entry);
  const style = LOG_STYLES[level];

  // Use appropriate console method
  switch (level) {
    case 'debug':
      if (logData !== undefined) {
        console.debug(`%c${formattedMessage}`, style, logData);
      } else {
        console.debug(`%c${formattedMessage}`, style);
      }
      break;
    case 'info':
      if (logData !== undefined) {
        console.info(`%c${formattedMessage}`, style, logData);
      } else {
        console.info(`%c${formattedMessage}`, style);
      }
      break;
    case 'warn':
      if (logData !== undefined) {
        console.warn(`%c${formattedMessage}`, style, logData);
      } else {
        console.warn(`%c${formattedMessage}`, style);
      }
      break;
    case 'error':
      if (logData !== undefined) {
        console.error(`%c${formattedMessage}`, style, logData);
      } else {
        console.error(`%c${formattedMessage}`, style);
      }
      break;
  }
};

// Log an error with stack trace
const logError = (
  message: string,
  error: unknown,
  context?: LogContext
): void => {
  if (!shouldLog('error')) return;

  const errorInfo = error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    : {
        name: 'Unknown',
        message: String(error),
      };

  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level: 'error',
    message,
    context,
    error: errorInfo,
  };

  const formattedMessage = formatLogEntry(entry);
  console.error(`%c${formattedMessage}`, LOG_STYLES.error);
  console.error('Error details:', errorInfo);
  if (errorInfo.stack) {
    console.error('Stack trace:', errorInfo.stack);
  }
};

// Log API request
const logApiRequest = (
  method: string,
  url: string,
  options?: {
    body?: unknown;
    headers?: Record<string, string>;
  }
): void => {
  log('info', `API Request: ${method} ${url}`, { component: 'API', action: 'request' });
  if (options?.body && shouldLog('debug')) {
    // Mask sensitive fields
    const maskedBody = maskSensitiveData(options.body);
    log('debug', 'Request body:', { component: 'API' }, maskedBody);
  }
};

// Log API response
const logApiResponse = (
  method: string,
  url: string,
  status: number,
  duration: number,
  data?: unknown
): void => {
  const level: LogLevel = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
  log(level, `API Response: ${method} ${url} - ${status} (${duration}ms)`, { component: 'API', action: 'response' });
  if (data && shouldLog('debug')) {
    log('debug', 'Response data:', { component: 'API' }, data);
  }
};

// Log API error
const logApiError = (
  method: string,
  url: string,
  error: unknown,
  duration?: number
): void => {
  const durationStr = duration ? ` (${duration}ms)` : '';
  logError(`API Error: ${method} ${url}${durationStr}`, error, { component: 'API', action: 'error' });
};

// Mask sensitive data in objects
const maskSensitiveData = (data: unknown): unknown => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = ['password', 'token', 'apiKey', 'api_key', 'secret', 'authorization', 'ssn', 'creditCard'];
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      masked[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }

  return masked;
};

// Log user action
const logUserAction = (
  action: string,
  details?: Record<string, unknown>
): void => {
  log('info', `User Action: ${action}`, { component: 'User', action }, details);
};

// Log navigation
const logNavigation = (
  from: string,
  to: string
): void => {
  log('info', `Navigation: ${from} -> ${to}`, { component: 'Router', action: 'navigate' });
};

// Log component lifecycle
const logComponentMount = (componentName: string): void => {
  log('debug', `Component mounted: ${componentName}`, { component: componentName, action: 'mount' });
};

const logComponentUnmount = (componentName: string): void => {
  log('debug', `Component unmounted: ${componentName}`, { component: componentName, action: 'unmount' });
};

// Log performance timing
const logPerformance = (
  operation: string,
  duration: number,
  context?: LogContext
): void => {
  const level: LogLevel = duration > 3000 ? 'warn' : 'debug';
  log(level, `Performance: ${operation} took ${duration}ms`, context);
};

// Create a scoped logger for a specific component
const createLogger = (componentName: string) => {
  return {
    debug: (message: string, data?: unknown) =>
      log('debug', message, { component: componentName }, data),
    info: (message: string, data?: unknown) =>
      log('info', message, { component: componentName }, data),
    warn: (message: string, data?: unknown) =>
      log('warn', message, { component: componentName }, data),
    error: (message: string, error?: unknown) =>
      logError(message, error, { component: componentName }),
    action: (action: string, details?: Record<string, unknown>) =>
      log('info', action, { component: componentName, action }, details),
  };
};

// Timer utility for performance measurement
const startTimer = (label: string) => {
  const start = performance.now();
  return {
    end: (context?: LogContext) => {
      const duration = Math.round(performance.now() - start);
      logPerformance(label, duration, context);
      return duration;
    },
  };
};

// Export logger object
export const logger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: logError,
  api: {
    request: logApiRequest,
    response: logApiResponse,
    error: logApiError,
  },
  user: logUserAction,
  nav: logNavigation,
  component: {
    mount: logComponentMount,
    unmount: logComponentUnmount,
  },
  perf: logPerformance,
  timer: startTimer,
  createLogger,
};

// Also export individual functions for convenience
export {
  log,
  logError,
  logApiRequest,
  logApiResponse,
  logApiError,
  logUserAction,
  logNavigation,
  logComponentMount,
  logComponentUnmount,
  logPerformance,
  createLogger,
  startTimer,
};

export type { LogLevel, LogContext, LogEntry };
