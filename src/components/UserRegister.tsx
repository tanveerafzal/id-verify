import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from '../config/api';

interface LocationState {
  fullName?: string;
  email?: string;
  verificationId?: string;
}

export const UserRegister: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const state = location.state as LocationState;

    if (!state?.email || !state?.verificationId) {
      setError('Invalid registration link. Please complete identity verification first.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      fullName: state.fullName || '',
      email: state.email || ''
    }));
    setVerificationId(state.verificationId || null);
  }, [location]);

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

    if (!verificationId) {
      setError('Missing verification information. Please complete identity verification first.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/users/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          verificationId: verificationId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes('already exists')) {
          setError('An account with this email already exists. Please login instead.');
        } else {
          throw new Error(data.error || 'Registration failed');
        }
        return;
      }

      // Store token and user data
      localStorage.setItem('userToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to dashboard
      navigate('/user/dashboard');
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show error if missing verification data
  if (!verificationId && error) {
    return (
      <div className="user-auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">ID</div>
            <h2>ID Verification</h2>
          </div>
          <div className="auth-header">
            <h1>Registration Error</h1>
          </div>
          <div className="error-alert">
            {error}
          </div>
          <div className="auth-footer">
            Already have an account? <a href="/user/login">Login here</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">ID</div>
          <h2>ID Verification</h2>
        </div>
        <div className="auth-header">
          <h1>Create Your Account</h1>
          <p>Complete your registration to access your verified profile</p>
        </div>

        <div className="verification-info-card">
          <div className="info-header">
            <div className="info-icon">✓</div>
            <h4>Identity Verified</h4>
          </div>
          <p>Your identity has been successfully verified. Create a password to complete your account setup.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
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

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-footer">
            Already have an account? <a href="/user/login">Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
};
