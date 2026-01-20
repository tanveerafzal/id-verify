import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';
import { SDK_URL, VERIFY_URL, SDK_TEST_API_KEY, getVerifyUrl } from '../config/api';

interface IDVInstance {
  init: (config: { apiKey: string; environment?: string; debug?: boolean }) => void;
  start: (options?: {
    onReady?: () => void;
    onStart?: () => void;
    onComplete?: (result: unknown) => void;
    onError?: (error: unknown) => void;
    onClose?: (reason: string) => void;
    user?: { id?: string; email?: string; name?: string };
  }) => Promise<unknown>;
  close: () => void;
  isInitialized: () => boolean;
  isOpen: () => boolean;
  getVersion: () => string;
}

declare global {
  interface Window {
    IDV: {
      IDV: IDVInstance;
      default: IDVInstance;
    };
  }
}

export const SDKTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [partnerId, setPartnerId] = useState(SDK_TEST_API_KEY);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  // Get the IDV instance from the SDK namespace
  const getIDV = (): IDVInstance | null => {
    if (window.IDV?.IDV) return window.IDV.IDV;
    if (window.IDV?.default) return window.IDV.default;
    return null;
  };

  // Load SDK script
  useEffect(() => {
    console.log('[SDKTestPage] SDK_URL:', SDK_URL);

    const checkSdkAvailable = () => {
      const idv = getIDV();
      if (idv) {
        console.log('[SDKTestPage] SDK is available');
        setSdkLoaded(true);
        setSdkError(null);
        return true;
      }
      return false;
    };

    // Check if already available
    if (checkSdkAvailable()) {
      return;
    }

    // Look for any existing IDV script (with old or new URL)
    const existingScript = document.querySelector('script[src*="idv.min.js"]');

    if (!existingScript) {
      console.log('[SDKTestPage] Loading SDK from:', SDK_URL);
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;

      script.onload = () => {
        console.log('[SDKTestPage] SDK script loaded');
      };

      script.onerror = (e) => {
        console.error('[SDKTestPage] SDK script failed to load:', e);
        setSdkError('Failed to load SDK. Please check your connection.');
        setSdkLoaded(false);
      };

      document.body.appendChild(script);
    } else {
      console.log('[SDKTestPage] SDK script already exists');
    }

    // Poll for SDK availability after script loads
    const pollInterval = setInterval(() => {
      if (checkSdkAvailable()) {
        clearInterval(pollInterval);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (!getIDV()) {
        console.error('[SDKTestPage] SDK failed to initialize after timeout. window.IDV:', window.IDV);
        setSdkError('SDK failed to initialize. Please refresh the page.');
      }
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleTest = async () => {
    if (!partnerId.trim()) {
      setTestResult('Please enter your Partner ID (API Key)');
      return;
    }

    if (!sdkLoaded) {
      setTestResult('SDK is still loading. Please wait...');
      return;
    }

    const idv = getIDV();
    if (!idv) {
      setTestResult('SDK not available. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    // Log the URLs being used
    const verifyUrl = getVerifyUrl(partnerId);
    const initConfig = {
      apiKey: partnerId,
      environment: 'sandbox',
      debug: true
    };

    console.log('[SDKTestPage] Starting verification with:');
    console.log('[SDKTestPage] - SDK URL (script source):', SDK_URL);
    console.log('[SDKTestPage] - VERIFY_URL base:', VERIFY_URL);
    console.log('[SDKTestPage] - Full verify URL:', verifyUrl);
    console.log('[SDKTestPage] - Init config:', initConfig);
    console.log('[SDKTestPage] - SDK will load iframe from: https://sdk.trustcredo.com/verify?api-key=' + partnerId);

    try {
      // Initialize SDK with API key
      idv.init(initConfig);

      // Start the verification flow
      const result = await idv.start({
        onReady: () => {
          console.log('IDV Ready');
        },
        onStart: () => {
          console.log('IDV Started');
        },
        onComplete: (result) => {
          console.log('Verification complete:', result);
          setTestResult(`Verification completed!\n\n${JSON.stringify(result, null, 2)}`);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Verification error:', error);
          setTestResult(`Verification error:\n\n${JSON.stringify(error, null, 2)}`);
          setIsLoading(false);
        },
        onClose: (reason) => {
          console.log('Verification closed:', reason);
          if (reason === 'user_closed') {
            setTestResult('Verification was closed by user.');
          }
          setIsLoading(false);
        }
      });

      console.log('Verification result:', result);
    } catch (error) {
      console.error('SDK error:', error);
      setTestResult(`SDK error:\n\n${JSON.stringify(error, null, 2)}`);
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const sdkCodeHtml = `<!-- Add to your HTML -->
<script src="${SDK_URL}"></script>`;

  const sdkCodeJs = `// Initialize IDV SDK
IDV.init({
  apiKey: '${partnerId || 'YOUR_API_KEY'}',
  environment: 'production',
  debug: false
});

// Start verification (returns a Promise)
IDV.start({
  onComplete: (result) => {
    if (result.status === 'passed') {
      console.log('Verification successful!', result);
      // Handle successful verification
    } else {
      console.log('Verification failed', result);
      // Handle failed verification
    }
  },
  onError: (error) => {
    console.error('Verification error:', error);
  },
  onClose: (reason) => {
    console.log('User closed verification:', reason);
  }
});`;

  const iframeCode = `<!-- Embed verification directly -->
<iframe
  src="${VERIFY_URL}?api-key=${partnerId || 'YOUR_API_KEY'}"
  width="100%"
  height="700"
  frameborder="0"
  allow="camera"
></iframe>`;

  const apiCode = `// Create verification via API
const response = await fetch(
  'https://api.trustcredo.com/api/v1/verifications?partnerId=${partnerId || 'YOUR_PARTNER_ID'}',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'IDENTITY',
      user: {
        email: 'user@example.com',
        fullName: 'John Doe'
      }
    })
  }
);

const { data } = await response.json();
console.log('Verification ID:', data.id);`;

  return (
    <div className="sdk-test-page">
      <SEO
        title="SDK Test - TrustCredo"
        description="Test your TrustCredo integration and explore SDK options."
      />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <img
              src="/website-logo-horizontal.png"
              alt="TrustCredo"
              className="nav-logo"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="nav-links">
            <a href="/docs">Docs</a>
            <a href="/sdk-test" className="active">SDK</a>
            <a href="/#about">About</a>
            <a href="/#contact-us">Contact Us</a>
          </div>
          <div className="nav-actions">
            <button className="btn-nav-secondary" onClick={() => navigate('/partner/login')}>
              Login
            </button>
            <button className="btn-nav-primary" onClick={() => navigate('/partner/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* SDK Test Content */}
      <div className="sdk-test-container">
        <div className="sdk-test-header">
          <h1>SDK Test Console</h1>
          <p>Test your integration and explore different implementation options</p>
        </div>

        <div className="sdk-test-content">
          {/* Test Panel */}
          <div className="test-panel">
            <h2>Quick Test</h2>
            <p>Enter your API Key to test the verification flow using the SDK</p>

            <div className="sdk-status">
              <span className={`status-indicator ${sdkLoaded ? 'loaded' : 'loading'}`}></span>
              <span>{sdkLoaded ? 'SDK Loaded' : 'Loading SDK...'}</span>
            </div>

            {sdkError && (
              <div className="sdk-error">
                <p>{sdkError}</p>
              </div>
            )}

            <div className="test-form">
              <div className="form-group">
                <label htmlFor="partnerId">API Key</label>
                <input
                  type="text"
                  id="partnerId"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  placeholder="Enter your API Key"
                  className="form-input"
                />
                <small>Find your API Key in your dashboard under Settings</small>
              </div>

              <button
                className="btn-test"
                onClick={handleTest}
                disabled={isLoading || !sdkLoaded}
              >
                {isLoading ? 'Verification in Progress...' : 'Start Verification'}
              </button>

              {testResult && (
                <div className={`test-result ${testResult.includes('error') || testResult.includes('closed') ? 'error' : ''}`}>
                  <pre>{testResult}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Integration Options */}
          <div className="integration-options">
            <h2>Integration Options</h2>

            <div className="integration-card">
              <h3>JavaScript SDK (Recommended)</h3>
              <p>Add verification with a modal popup - best for most use cases</p>

              <div className="code-section">
                <div className="code-header">
                  <span>HTML</span>
                  <button onClick={() => copyCode(sdkCodeHtml)}>Copy</button>
                </div>
                <pre className="code-block">{sdkCodeHtml}</pre>
              </div>

              <div className="code-section">
                <div className="code-header">
                  <span>JavaScript</span>
                  <button onClick={() => copyCode(sdkCodeJs)}>Copy</button>
                </div>
                <pre className="code-block">{sdkCodeJs}</pre>
              </div>
            </div>

            <div className="integration-card">
              <h3>Iframe Embed</h3>
              <p>Embed verification directly in your page</p>

              <div className="code-section">
                <div className="code-header">
                  <span>HTML</span>
                  <button onClick={() => copyCode(iframeCode)}>Copy</button>
                </div>
                <pre className="code-block">{iframeCode}</pre>
              </div>
            </div>

            <div className="integration-card">
              <h3>REST API</h3>
              <p>Full control with direct API integration</p>

              <div className="code-section">
                <div className="code-header">
                  <span>JavaScript</span>
                  <button onClick={() => copyCode(apiCode)}>Copy</button>
                </div>
                <pre className="code-block">{apiCode}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
