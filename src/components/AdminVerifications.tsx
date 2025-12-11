import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getApiUrl } from '../config/api';

interface Verification {
  id: string;
  userName: string;
  userEmail: string;
  type: string;
  status: string;
  riskLevel?: string;
  score?: number;
  partner: {
    id: string;
    companyName: string;
  };
  createdAt: string;
  completedAt?: string;
}

export const AdminVerifications: React.FC = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadVerifications();
  }, [navigate]);

  const loadVerifications = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(getApiUrl('/api/admin/verifications'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to load verifications');
      }

      const data = await response.json();
      setVerifications(data.data.verifications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-progress';
      case 'FAILED': return 'status-failed';
      case 'EXPIRED': return 'status-expired';
      default: return '';
    }
  };

  const getRiskColor = (risk?: string) => {
    switch (risk?.toUpperCase()) {
      case 'LOW': return 'risk-low';
      case 'MEDIUM': return 'risk-medium';
      case 'HIGH': return 'risk-high';
      case 'CRITICAL': return 'risk-critical';
      default: return '';
    }
  };

  const filteredVerifications = verifications.filter((v) => {
    const matchesSearch =
      v.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.partner?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || v.status.toUpperCase() === filterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="spinner" />
          <p>Loading verifications...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-verifications">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Verification Management</h1>
            <p>View and manage all verification requests</p>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Filters */}
        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, partner, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        {/* Verifications Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Partner</th>
                <th>Type</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Score</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-data">
                    No verifications found
                  </td>
                </tr>
              ) : (
                filteredVerifications.map((verification) => (
                  <tr key={verification.id}>
                    <td className="id-cell">
                      <code>{verification.id.slice(0, 8)}...</code>
                    </td>
                    <td>
                      <div className="user-cell">
                        <span className="user-name">{verification.userName || 'N/A'}</span>
                        <span className="user-email">{verification.userEmail || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{verification.partner?.companyName || 'N/A'}</td>
                    <td>
                      <span className="type-badge">{verification.type}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(verification.status)}`}>
                        {verification.status}
                      </span>
                    </td>
                    <td>
                      {verification.riskLevel && (
                        <span className={`risk-badge ${getRiskColor(verification.riskLevel)}`}>
                          {verification.riskLevel}
                        </span>
                      )}
                    </td>
                    <td>
                      {verification.score !== undefined ? `${verification.score}%` : '-'}
                    </td>
                    <td>{new Date(verification.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => setSelectedVerification(verification)}
                        title="View Details"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="admin-summary">
          <span>Showing {filteredVerifications.length} of {verifications.length} verifications</span>
        </div>

        {/* Detail Modal */}
        {selectedVerification && (
          <VerificationDetailModal
            verification={selectedVerification}
            onClose={() => setSelectedVerification(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

interface VerificationDetailModalProps {
  verification: Verification;
  onClose: () => void;
}

const VerificationDetailModal: React.FC<VerificationDetailModalProps> = ({
  verification,
  onClose
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Verification Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h4>Basic Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">ID:</span>
                <code className="detail-value">{verification.id}</code>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{verification.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{verification.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Risk Level:</span>
                <span className="detail-value">{verification.riskLevel || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Score:</span>
                <span className="detail-value">{verification.score !== undefined ? `${verification.score}%` : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>User Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{verification.userName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{verification.userEmail || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Partner Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Company:</span>
                <span className="detail-value">{verification.partner?.companyName || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Timestamps</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{new Date(verification.createdAt).toLocaleString()}</span>
              </div>
              {verification.completedAt && (
                <div className="detail-item">
                  <span className="detail-label">Completed:</span>
                  <span className="detail-value">{new Date(verification.completedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
