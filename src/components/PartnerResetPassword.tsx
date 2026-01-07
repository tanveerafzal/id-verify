import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../config/api';

export const PartnerResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      setTokenValid(false);
      return;
    }
    // Token exists, assume valid until API says otherwise
    setTokenValid(true);
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/partners/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: formData.password
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Password reset service is not available. Please try again later.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Password reset service is not available. Please try again later.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="partner-auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">ID</div>
            <h2>TrustCredo - ID Verification Platform</h2>
          </div>
          <div className="auth-header">
            <h1>Password Reset Successful</h1>
            <p>Your password has been updated</p>
          </div>

          <div className="success-message" style={{ marginBottom: '20px' }}>
            Your password has been successfully reset. You can now log in with your new password.
          </div>

          <button
            type="button"
            className="btn-primary btn-full"
            onClick={() => navigate('/partner/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="partner-auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">ID</div>
            <h2>TrustCredo - ID Verification Platform</h2>
          </div>
          <div className="auth-header">
            <h1>Invalid Link</h1>
            <p>This reset link is invalid or has expired</p>
          </div>

          <div className="error-alert" style={{ marginBottom: '20px' }}>
            {error || 'The password reset link is invalid or has expired. Please request a new one.'}
          </div>

          <button
            type="button"
            className="btn-primary btn-full"
            onClick={() => navigate('/partner/forgot-password')}
          >
            Request New Reset Link
          </button>

          <div className="auth-footer">
            <a href="/partner/login">Back to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">ID</div>
          <h2>TrustCredo - ID Verification Platform</h2>
        </div>
        <div className="auth-header">
          <h1>Set New Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              minLength={8}
            />
            <small style={{ color: '#6b7280' }}>Must be at least 8 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="auth-footer">
            <a href="/partner/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};
