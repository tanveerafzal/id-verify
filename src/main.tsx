import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logger } from './lib/logger'
import './styles/globals.css'
import './styles/verification.css'

// Log application startup
logger.info('Application starting', {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || 'unknown',
  buildTime: import.meta.env.VITE_BUILD_TIME || 'unknown',
})

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Uncaught error', error || message, {
    component: 'Global',
    action: 'window.onerror',
  })
  console.error('Global error details:', { message, source, lineno, colno })
  return false // Let the default handler run too
}

// Global handler for unhandled promise rejections
window.onunhandledrejection = (event) => {
  logger.error('Unhandled promise rejection', event.reason, {
    component: 'Global',
    action: 'unhandledrejection',
  })
}

// Log performance metrics when page loads
window.addEventListener('load', () => {
  // Wait a bit for performance entries to be populated
  setTimeout(() => {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        logger.info('Page load performance', {
          dnsLookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          tcpConnection: Math.round(navigation.connectEnd - navigation.connectStart),
          serverResponse: Math.round(navigation.responseStart - navigation.requestStart),
          domLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.startTime),
          fullLoad: Math.round(navigation.loadEventEnd - navigation.startTime),
        })
      }
    } catch {
      // Performance API might not be available
    }
  }, 100)
})

// Log when user leaves the page
window.addEventListener('beforeunload', () => {
  logger.info('User leaving page', {
    component: 'Global',
    action: 'beforeunload',
  })
})

// Log visibility changes (tab switching)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    logger.debug('Tab hidden')
  } else {
    logger.debug('Tab visible')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
