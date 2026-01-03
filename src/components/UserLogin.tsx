import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { SEO } from './SEO';

export const UserLogin: React.FC = () => {
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
      const response = await fetch(getApiUrl('/api/users/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
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
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-container">
      <SEO
        title="User Login"
        description="Access your TrustCredo account. View your verified identity, download certificates, and manage your verification history."
        keywords="user login, identity verification account, verification certificate"
        canonicalUrl="/user/login"
      />
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">ID</div>
          <h2>ID Verification</h2>
        </div>
        <div className="auth-header">
          <h1>User Login</h1>
          <p>Access your verified account</p>
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
              placeholder="you@example.com"
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

          <div className="auth-footer">
            Don't have an account? Complete identity verification to create one.
          </div>
        </form>
      </div>
    </div>
  );
};
