import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl } from '../config/api';

interface Verification {
  id: string;
  status: string;
  type: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  createdAt: string;
  completedAt?: string;
  results?: {
    passed: boolean;
    score?: number;
    riskLevel?: string;
  };
}

export const PartnerVerifications: React.FC = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    const token = localStorage.getItem('partnerToken');

    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/partners/verifications'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load verifications');
      }

      const data = await response.json();
      setVerifications(data.data);
    } catch (err) {
      setError('Failed to load verifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      COMPLETED: 'status-completed',
      PENDING: 'status-pending',
      IN_PROGRESS: 'status-in-progress',
      FAILED: 'status-failed'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getRiskBadge = (riskLevel?: string) => {
    if (!riskLevel) return null;

    const riskClasses: { [key: string]: string } = {
      LOW: 'risk-low',
      MEDIUM: 'risk-medium',
      HIGH: 'risk-high',
      CRITICAL: 'risk-critical'
    };

    return (
      <span className={`risk-badge ${riskClasses[riskLevel] || ''}`}>
        {riskLevel}
      </span>
    );
  };

  const handleResendEmail = async (verificationId: string) => {
    const token = localStorage.getItem('partnerToken');

    if (!token) {
      navigate('/partner/login');
      return;
    }

    setResendingId(verificationId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        getApiUrl(`/api/partners/verifications/${verificationId}/resend-email`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resend email');
      }

      setSuccessMessage('Verification email sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Resend email error:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setResendingId(null);
    }
  };

  const filteredVerifications = verifications.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return v.status === 'COMPLETED';
    if (filter === 'pending') return v.status === 'PENDING' || v.status === 'IN_PROGRESS';
    return true;
  });

  if (loading) {
    return (
      <PartnerLayout>
        <div className="verifications-loading">
          <div className="spinner" />
          <p>Loading verifications...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="verifications-page">
      <div className="page-header">
        <h1>Verification Requests</h1>
        <p>View and manage all identity verification requests</p>
      </div>

      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-alert">
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="verifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({verifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({verifications.filter(v => v.status === 'COMPLETED').length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({verifications.filter(v => v.status === 'PENDING' || v.status === 'IN_PROGRESS').length})
        </button>
      </div>

      {/* Table */}
      <div className="verifications-table-container">
        {filteredVerifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No verifications yet</h3>
            <p>Share your verification link to start receiving requests</p>
          </div>
        ) : (
          <table className="verifications-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Type</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Score</th>
                <th>Created</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.map((verification) => (
                <tr key={verification.id}>
                  <td>
                    <code className="verification-id">
                      {verification.id.substring(0, 8)}...
                    </code>
                  </td>
                  <td>
                    <div className="user-details">
                      {verification.userName && (
                        <div className="user-name">{verification.userName}</div>
                      )}
                      {verification.userEmail && (
                        <div className="user-email">{verification.userEmail}</div>
                      )}
                      {verification.userPhone && (
                        <div className="user-phone">{verification.userPhone}</div>
                      )}
                      {!verification.userName && !verification.userEmail && !verification.userPhone && (
                        <span className="no-data">-</span>
                      )}
                    </div>
                  </td>
                  <td>{verification.type}</td>
                  <td>{getStatusBadge(verification.status)}</td>
                  <td>{getRiskBadge(verification.results?.riskLevel)}</td>
                  <td>
                    {verification.results?.score
                      ? `${(verification.results.score * 100).toFixed(0)}%`
                      : '-'}
                  </td>
                  <td>{new Date(verification.createdAt).toLocaleDateString()}</td>
                  <td>
                    {verification.completedAt
                      ? new Date(verification.completedAt).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {verification.status === 'PENDING' && (
                      <button
                        onClick={() => handleResendEmail(verification.id)}
                        disabled={resendingId === verification.id}
                        className="btn btn-secondary btn-sm"
                      >
                        {resendingId === verification.id ? 'Sending...' : 'Resend Email'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats Summary */}
      {filteredVerifications.length > 0 && (
        <div className="verifications-stats">
          <div className="stat-item">
            <span className="stat-label">Total Verifications:</span>
            <span className="stat-value">{verifications.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success Rate:</span>
            <span className="stat-value">
              {verifications.filter(v => v.results?.passed).length > 0
                ? `${((verifications.filter(v => v.results?.passed).length / verifications.filter(v => v.status === 'COMPLETED').length) * 100).toFixed(0)}%`
                : '0%'}
            </span>
          </div>
        </div>
      )}
      </div>
    </PartnerLayout>
  );
};
