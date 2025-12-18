import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../config/api';

interface InvitationInfo {
  email: string;
  name: string;
  partner: {
    companyName: string;
    logoUrl?: string;
  };
  role: {
    name: string;
    description?: string;
  };
}

export const PartnerAcceptInvite: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      const response = await fetch(
        getApiUrl(`/api/partners/team/invitations/${token}`)
      );

      if (!response.ok) {
        throw new Error('Invalid or expired invitation');
      }

      const data = await response.json();
      setInvitation(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setAccepting(true);

    try {
      const response = await fetch(
        getApiUrl('/api/partners/team/invitations/accept'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept invitation');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/partner/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="partner-auth-container">
        <div className="auth-card">
          <div className="settings-loading">
            <div className="spinner" />
            <p>Loading invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="partner-auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">ID</div>
            <h2>[The ID verification Company]</h2>
          </div>
          <div className="auth-header">
            <h1>Invalid Invitation</h1>
            <p>{error}</p>
          </div>
          <div className="auth-footer" style={{ marginTop: '24px' }}>
            <a href="/partner/login">Go to Login</a>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="partner-auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">ID</div>
            <h2>[The ID verification Company]</h2>
          </div>
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Welcome to the team!</h2>
            <p>Your account has been created. Redirecting to login...</p>
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
          <h2>[The ID verification Company]</h2>
        </div>

        <div className="auth-header">
          <h1>Join {invitation?.partner.companyName}</h1>
          <p>
            You've been invited to join as a <strong>{invitation?.role.name}</strong>
          </p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={invitation?.email || ''}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={invitation?.name || ''}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={accepting}
          >
            {accepting ? 'Creating Account...' : 'Accept Invitation'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/partner/login">Log in</a>
        </div>
      </div>
    </div>
  );
};
