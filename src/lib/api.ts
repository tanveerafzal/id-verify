/**
 * API Wrapper with Comprehensive Logging
 * Wraps fetch with automatic request/response logging and error handling
 */

import { logger } from './logger';
import { getApiUrl } from '../config/api';

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
  ok: boolean;
}

// Default timeout of 30 seconds
const DEFAULT_TIMEOUT = 30000;

/**
 * Make an API request with automatic logging
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { body, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const url = getApiUrl(endpoint);
  const method = options.method || 'GET';
  const timer = logger.timer(`${method} ${endpoint}`);

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add auth token if available
  const token = localStorage.getItem('partnerToken') ||
                localStorage.getItem('adminToken') ||
                localStorage.getItem('userToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Log the request (redact auth header if present)
  const logHeaders = { ...headers };
  if ('Authorization' in logHeaders) {
    logHeaders['Authorization'] = '[REDACTED]';
  }
  logger.api.request(method, url, { body, headers: logHeaders });

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    logger.warn(`Request timeout after ${timeout}ms: ${method} ${url}`);
  }, timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const duration = timer.end({ component: 'API' });

    // Try to parse response as JSON
    let data: T | null = null;
    let errorMessage: string | null = null;

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        const json = await response.json();
        if (response.ok) {
          data = json.data !== undefined ? json.data : json;
        } else {
          errorMessage = json.error || json.message || `Request failed: ${response.status}`;
        }
      } catch (parseError) {
        logger.warn('Failed to parse JSON response', { url, status: response.status });
        errorMessage = 'Invalid response format';
      }
    } else {
      const text = await response.text();
      if (!response.ok) {
        errorMessage = text || `Request failed: ${response.status}`;
      }
    }

    // Log the response
    logger.api.response(method, url, response.status, duration, response.ok ? data : errorMessage);

    return {
      data,
      error: errorMessage,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const duration = timer.end({ component: 'API' });

    // Determine error type
    let errorMessage: string;
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
    } else {
      errorMessage = 'An unexpected error occurred';
    }

    logger.api.error(method, url, error, duration);

    return {
      data: null,
      error: errorMessage,
      status: 0,
      ok: false,
    };
  }
}

// Convenience methods
export const api = {
  get: <T = unknown>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
