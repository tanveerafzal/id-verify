import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { SEO } from './SEO';

export const PartnerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      const apiUrl = getApiUrl('/api/partners/login');
      console.log('[PartnerLogin] API URL:', apiUrl);
      console.log('[PartnerLogin] Environment:', import.meta.env.MODE);
      console.log('[PartnerLogin] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('[PartnerLogin] Request body:', { email: formData.email, password: '***' });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('[PartnerLogin] Response status:', response.status);
      console.log('[PartnerLogin] Response statusText:', response.statusText);
      console.log('[PartnerLogin] Response URL:', response.url);
      console.log('[PartnerLogin] Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        const responseText = await response.text();
        console.log('[PartnerLogin] Response text:', responseText);
        data = JSON.parse(responseText);
        console.log('[PartnerLogin] Parsed response data:', data);
      } catch (parseErr) {
        console.error('[PartnerLogin] Failed to parse response as JSON:', parseErr);
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || `Login failed: ${response.status} ${response.statusText}`);
      }

      // Store token
      localStorage.setItem('partnerToken', data.data.token);
      localStorage.setItem('partner', JSON.stringify(data.data.partner));

      console.log('[PartnerLogin] Login successful, navigating to dashboard');
      // Redirect to dashboard
      navigate('/partner/dashboard');
    } catch (err) {
      console.error('[PartnerLogin] Error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
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
