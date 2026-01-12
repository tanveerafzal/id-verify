import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

declare global {
  interface Window {
    TrustCredo: {
      init: (config: {
        partnerId: string;
        onComplete?: (result: unknown) => void;
        onError?: (error: unknown) => void;
        onClose?: () => void;
      }) => void;
      startVerification: () => void;
    };
  }
}

export const SDKTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [partnerId, setPartnerId] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  // Load SDK script
  useEffect(() => {
    const checkSdkAvailable = () => {
      if (window.TrustCredo) {
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

    const existingScript = document.querySelector('script[src="https://sdk.trustcredo.com/sdk/idv.min.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://sdk.trustcredo.com/sdk/idv.min.js';
      script.async = true;

      script.onerror = () => {
        setSdkError('Failed to load SDK. Please check your connection.');
        setSdkLoaded(false);
      };

      document.body.appendChild(script);
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
      if (!window.TrustCredo) {
        setSdkError('SDK failed to initialize. Please refresh the page.');
      }
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleTest = () => {
    if (!partnerId.trim()) {
      setTestResult('Please enter your Partner ID');
      return;
    }

    if (!sdkLoaded) {
      setTestResult('SDK is still loading. Please wait...');
      return;
    }

    if (!window.TrustCredo) {
      setTestResult('SDK not available. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      // Initialize SDK with partner ID
      window.TrustCredo.init({
        partnerId: partnerId,
        onComplete: (result) => {
          console.log('Verification complete:', result);
          setTestResult(`Verification completed! Result: ${JSON.stringify(result, null, 2)}`);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Verification error:', error);
          setTestResult(`Verification error: ${JSON.stringify(error)}`);
          setIsLoading(false);
        },
        onClose: () => {
          console.log('Verification closed');
          setTestResult('Verification modal was closed by user.');
          setIsLoading(false);
        }
      });

      // Start the verification flow
      window.TrustCredo.startVerification();
    } catch (error) {
      console.error('SDK error:', error);
      setTestResult(`SDK error: ${error}`);
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const sdkCodeHtml = `<!-- Add to your HTML -->
<script src="https://sdk.trustcredo.com/sdk/idv.min.js"></script>`;

  const sdkCodeJs = `// Initialize TrustCredo SDK
TrustCredo.init({
  partnerId: '${partnerId || 'YOUR_PARTNER_ID'}',
  onComplete: (result) => {
    if (result.passed) {
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
  onClose: () => {
    console.log('User closed verification');
  }
});

// Call this to start verification (e.g., on button click)
document.getElementById('verify-btn').onclick = () => {
  TrustCredo.startVerification();
};`;

  const iframeCode = `<!-- Embed verification directly -->
<iframe
  src="https://verify.trustcredo.com/embed?partnerId=${partnerId || 'YOUR_PARTNER_ID'}"
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
            <a href="/#contact">Contact</a>
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
            <p>Enter your Partner ID to test the verification flow using the SDK</p>

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
                <label htmlFor="partnerId">Partner ID</label>
                <input
                  type="text"
                  id="partnerId"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  placeholder="Enter your Partner ID (API Key)"
                  className="form-input"
                />
                <small>Find your Partner ID in your dashboard under Settings</small>
              </div>

              <button
                className="btn-test"
                onClick={handleTest}
                disabled={isLoading || !sdkLoaded}
              >
                {isLoading ? 'Starting Verification...' : 'Start Verification'}
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
