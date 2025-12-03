import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';

export const PartnerForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/partners/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Password reset service is not available. Please try again later.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Password reset service is not available. Please try again later.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to send reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="partner-auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Check Your Email</h1>
            <p>Password reset instructions sent</p>
          </div>

          <div className="success-message" style={{ marginBottom: '20px' }}>
            If an account exists with the email <strong>{email}</strong>, you will receive a password reset link shortly.
          </div>

          <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
            Please check your email and follow the instructions to reset your password.
          </p>

          <button
            type="button"
            className="btn-secondary btn-full"
            onClick={() => navigate('/partner/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="auth-footer">
            Remember your password? <a href="/partner/login">Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
};
