import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { SEO } from './SEO';
import { logger } from '../lib/logger';

// Create a scoped logger for this component
const log = logger.createLogger('PartnerLogin');

export const PartnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logger.component.mount('PartnerLogin');
    return () => logger.component.unmount('PartnerLogin');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const timer = logger.timer('Partner Login Request');
    log.action('Login attempt started', { email: formData.email });

    try {
      const apiUrl = getApiUrl('/api/partners/login');

      logger.api.request('POST', apiUrl, {
        body: { email: formData.email, password: '[REDACTED]' }
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      let data;
      try {
        const responseText = await response.text();
        log.debug('Raw response received', {
          status: response.status,
          statusText: response.statusText,
          contentLength: responseText.length
        });
        data = JSON.parse(responseText);
      } catch (parseErr) {
        log.error('Failed to parse response as JSON', parseErr);
        throw new Error('Server returned invalid response');
      }

      const duration = timer.end({ component: 'PartnerLogin' });
      logger.api.response('POST', apiUrl, response.status, duration,
        response.ok ? { partnerId: data.data?.partner?.id } : data.error
      );

      if (!response.ok) {
        throw new Error(data.error || `Login failed: ${response.status} ${response.statusText}`);
      }

      // Store token and partner info
      localStorage.setItem('partnerToken', data.data.token);
      localStorage.setItem('partner', JSON.stringify(data.data.partner));
      localStorage.setItem('partnerInfo', JSON.stringify(data.data.partner));

      log.info('Login successful', {
        partnerId: data.data.partner?.id,
        companyName: data.data.partner?.companyName
      });

      logger.user('Partner logged in', {
        partnerId: data.data.partner?.id
      });

      // Redirect to dashboard
      navigate('/partner/dashboard');
    } catch (err) {
      timer.end({ component: 'PartnerLogin' });

      if (err instanceof TypeError && err.message.includes('fetch')) {
        log.error('Network error during login', err);
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
        log.error('Login failed', err);
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-auth-container">
      <SEO
        title="Partner Login"
        description="Log in to your TrustCredo partner dashboard. Manage identity verifications, view analytics, and access API keys for your business."
        keywords="partner login, business login, verification dashboard, KYC portal"
        canonicalUrl="/partner/login"
      />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">ID</div>
          <h2>TrustCredo - ID Verification Platform</h2>
        </div>
        <div className="auth-header">
          <h1>Partner Login</h1>
          <p>Access your ID verification dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-links">
            <a href="/partner/forgot-password" className="forgot-password-link">Forgot password?</a>
          </div>

          <div className="auth-footer">
            Don't have an account? <a href="/partner/register">Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};
