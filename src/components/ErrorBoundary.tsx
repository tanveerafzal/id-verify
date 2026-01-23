import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('React Error Boundary caught an error', error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
    });

    // Log component stack
    if (errorInfo.componentStack) {
      console.error('Component Stack:', errorInfo.componentStack);
    }

    this.setState({ errorInfo });
  }

  handleReload = (): void => {
    logger.info('User triggered page reload from error boundary');
    window.location.reload();
  };

  handleGoHome = (): void => {
    logger.info('User navigated home from error boundary');
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '1rem',
        }}>
          <div style={{
            maxWidth: '32rem',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1rem',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg
                style={{ width: '2rem', height: '2rem', color: '#dc2626' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem',
            }}>
              Something went wrong
            </h1>

            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
            }}>
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}>
                <p style={{
                  fontWeight: '600',
                  color: '#991b1b',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}>
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre style={{
                    fontSize: '0.75rem',
                    color: '#7f1d1d',
                    overflow: 'auto',
                    maxHeight: '12rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Go Home
              </button>
            </div>

            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: '#9ca3af',
            }}>
              Error ID: {Date.now().toString(36)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
