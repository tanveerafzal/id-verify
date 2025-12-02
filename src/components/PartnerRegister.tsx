import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';

export const PartnerRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    phone: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = getApiUrl('/api/partners/register');
      console.log('[PartnerRegister] API URL:', apiUrl);
      console.log('[PartnerRegister] Environment:', import.meta.env.MODE);
      console.log('[PartnerRegister] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

      const requestBody = {
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        contactName: formData.contactName,
        phone: formData.phone
      };
      console.log('[PartnerRegister] Request body:', { ...requestBody, password: '***' });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('[PartnerRegister] Response status:', response.status);
      console.log('[PartnerRegister] Response statusText:', response.statusText);
      console.log('[PartnerRegister] Response URL:', response.url);
      console.log('[PartnerRegister] Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        const responseText = await response.text();
        console.log('[PartnerRegister] Response text:', responseText);
        data = JSON.parse(responseText);
        console.log('[PartnerRegister] Parsed response data:', data);
      } catch (parseErr) {
        console.error('[PartnerRegister] Failed to parse response as JSON:', parseErr);
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || `Registration failed: ${response.status} ${response.statusText}`);
      }

      // Store token
      localStorage.setItem('partnerToken', data.data.token);
      localStorage.setItem('partner', JSON.stringify(data.data.partner));

      console.log('[PartnerRegister] Registration successful, navigating to dashboard');
      // Redirect to dashboard
      navigate('/partner/dashboard');
    } catch (err) {
      console.error('[PartnerRegister] Error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Partner Registration</h1>
          <p>Start verifying identities with our ID verification platform</p>
        </div>

        <div className="free-tier-badge">
          <span>🎉</span> Free Tier - 100 verifications/month included!
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <div className="form-section">
            <h3>Company Information</h3>

            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Enter your company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactName">Contact Name *</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Account Credentials</h3>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
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
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Partner Account'}
          </button>

          <div className="auth-footer">
            Already have an account? <a href="/partner/login">Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
};
