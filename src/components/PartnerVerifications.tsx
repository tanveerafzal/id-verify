import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl } from '../config/api';

interface VerificationResult {
  passed: boolean;
  score?: number;
  riskLevel?: string;
  checks?: {
    documentAuthentic?: boolean;
    documentExpired?: boolean;
    documentTampered?: boolean;
    faceMatch?: boolean;
    faceMatchScore?: number;
  };
  extractedData?: {
    fullName?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
    issuingCountry?: string;
  };
  flags?: string[];
  warnings?: string[];
}

interface Document {
  id: string;
  type: string;
  side?: string;
  createdAt: string;
  imageUrl?: string;
  originalUrl?: string;
  processedUrl?: string;
  thumbnailUrl?: string;
}

interface Verification {
  id: string;
  status: string;
  type: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  createdAt: string;
  completedAt?: string;
  documents?: Document[];
  results?: VerificationResult;
}

export const PartnerVerifications: React.FC = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const loadVerificationDetails = async (verificationId: string) => {
    const token = localStorage.getItem('partnerToken');
    if (!token) return;

    setLoadingDetails(true);

    try {
      const response = await fetch(
        getApiUrl(`/api/partners/verifications/${verificationId}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedVerification(data.data);
      }
    } catch (err) {
      console.error('Failed to load verification details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (verification: Verification) => {
    if (verification.status === 'COMPLETED' || verification.status === 'FAILED') {
      loadVerificationDetails(verification.id);
    }
  };

  const closeModal = () => {
    setSelectedVerification(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
                  <td className="actions-cell">
                    {verification.status === 'PENDING' && (
                      <button
                        onClick={() => handleResendEmail(verification.id)}
                        disabled={resendingId === verification.id}
                        className="btn btn-secondary btn-sm"
                      >
                        {resendingId === verification.id ? 'Sending...' : 'Resend Email'}
                      </button>
                    )}
                    {(verification.status === 'COMPLETED' || verification.status === 'FAILED') && (
                      <button
                        onClick={() => handleViewDetails(verification)}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
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

      {/* Verification Details Modal */}
      {selectedVerification && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content verification-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verification Details</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            {loadingDetails ? (
              <div className="modal-loading">
                <div className="spinner" />
                <p>Loading details...</p>
              </div>
            ) : (
              <div className="modal-body">
                {/* User Info */}
                <div className="detail-section">
                  <h3>User Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedVerification.userName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedVerification.userEmail || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedVerification.userPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Document Info */}
                {selectedVerification.documents && selectedVerification.documents.length > 0 && (
                  <div className="detail-section">
                    <h3>Document Type</h3>
                    <div className="document-type-badge">
                      {selectedVerification.documents[0]?.type?.replace(/_/g, ' ') || 'Unknown'}
                    </div>
                  </div>
                )}

                {/* Uploaded Documents */}
                {selectedVerification.documents && selectedVerification.documents.length > 0 && (
                  <div className="detail-section">
                    <h3>Uploaded Documents</h3>
                    <div className="uploaded-documents-grid">
                      {selectedVerification.documents?.map((doc, index) => {
                        const docUrl = doc.originalUrl || doc.processedUrl || doc.imageUrl;
                        const thumbUrl = doc.thumbnailUrl || docUrl;
                        return (
                          <div key={doc.id || index} className="uploaded-document-item">
                            <div className="document-preview">
                              {docUrl ? (
                                <a href={docUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={thumbUrl || ''}
                                    alt={`${doc.type} - ${doc.side || ''}`}
                                    className="document-thumbnail"
                                  />
                                </a>
                              ) : (
                                <div className="document-placeholder">
                                  <span>No image</span>
                                </div>
                              )}
                            </div>
                            <div className="document-info">
                              <span className="document-label">{doc.type?.replace(/_/g, ' ')}</span>
                              {doc.side && <span className="document-side">{doc.side}</span>}
                            </div>
                            {docUrl && (
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-document-link"
                              >
                                View Full Image
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Verification Result */}
                {selectedVerification.results && (
                  <>
                    <div className="detail-section">
                      <h3>Verification Result</h3>
                      <div className={`result-badge ${selectedVerification.results.passed ? 'passed' : 'failed'}`}>
                        {selectedVerification.results.passed ? '✅ PASSED' : '❌ FAILED'}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Score & Risk</h3>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Verification Score:</span>
                          <span className="detail-value score-value">
                            {selectedVerification.results.score
                              ? `${Math.round(selectedVerification.results.score * 100)}%`
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Risk Level:</span>
                          <span className={`detail-value risk-value risk-${selectedVerification.results.riskLevel?.toLowerCase()}`}>
                            {selectedVerification.results.riskLevel || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Checks */}
                    {selectedVerification.results.checks && (
                      <div className="detail-section">
                        <h3>Verification Checks</h3>
                        <div className="checks-list-modal">
                          <div className={`check-item-modal ${selectedVerification.results.checks.documentAuthentic ? 'pass' : 'fail'}`}>
                            <span className="check-icon">{selectedVerification.results.checks.documentAuthentic ? '✓' : '✗'}</span>
                            <span>Document Authentic</span>
                          </div>
                          <div className={`check-item-modal ${!selectedVerification.results.checks.documentExpired ? 'pass' : 'fail'}`}>
                            <span className="check-icon">{!selectedVerification.results.checks.documentExpired ? '✓' : '✗'}</span>
                            <span>Document Not Expired</span>
                          </div>
                          <div className={`check-item-modal ${!selectedVerification.results.checks.documentTampered ? 'pass' : 'fail'}`}>
                            <span className="check-icon">{!selectedVerification.results.checks.documentTampered ? '✓' : '✗'}</span>
                            <span>No Tampering Detected</span>
                          </div>
                          {selectedVerification.results.checks.faceMatch !== undefined && (
                            <div className={`check-item-modal ${selectedVerification.results.checks.faceMatch ? 'pass' : 'fail'}`}>
                              <span className="check-icon">{selectedVerification.results.checks.faceMatch ? '✓' : '✗'}</span>
                              <span>
                                Face Match
                                {selectedVerification.results.checks.faceMatchScore && (
                                  <span className="face-score">
                                    ({Math.round(selectedVerification.results.checks.faceMatchScore * 100)}%)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Extracted Information */}
                    {selectedVerification.results.extractedData && (
                      <div className="detail-section">
                        <h3>Extracted Information</h3>
                        <div className="extracted-data-modal">
                          {/* Document Type from documents array (exclude SELFIE) */}
                          {selectedVerification.documents && selectedVerification.documents.length > 0 && (
                            <div className="data-row-modal">
                              <span className="data-label">Document Type:</span>
                              <span className="data-value">
                                {selectedVerification.documents
                                  .find(doc => doc.type !== 'SELFIE')
                                  ?.type?.replace(/_/g, ' ') || 'Unknown'}
                              </span>
                            </div>
                          )}
                          {selectedVerification.results.extractedData.fullName && (
                            <div className="data-row-modal">
                              <span className="data-label">Full Name:</span>
                              <span className="data-value">{selectedVerification.results.extractedData.fullName}</span>
                            </div>
                          )}
                          {selectedVerification.results.extractedData.dateOfBirth && (
                            <div className="data-row-modal">
                              <span className="data-label">Date of Birth:</span>
                              <span className="data-value">{formatDate(selectedVerification.results.extractedData.dateOfBirth)}</span>
                            </div>
                          )}
                          {selectedVerification.results.extractedData.documentNumber && (
                            <div className="data-row-modal">
                              <span className="data-label">Document Number:</span>
                              <span className="data-value">{selectedVerification.results.extractedData.documentNumber}</span>
                            </div>
                          )}
                          {selectedVerification.results.extractedData.expiryDate && (
                            <div className="data-row-modal">
                              <span className="data-label">Expiry Date:</span>
                              <span className="data-value">{formatDate(selectedVerification.results.extractedData.expiryDate)}</span>
                            </div>
                          )}
                          {selectedVerification.results.extractedData.issuingCountry && (
                            <div className="data-row-modal">
                              <span className="data-label">Issuing Country:</span>
                              <span className="data-value">{selectedVerification.results.extractedData.issuingCountry}</span>
                            </div>
                          )}
                          {!selectedVerification.results.extractedData.fullName &&
                           !selectedVerification.results.extractedData.dateOfBirth &&
                           !selectedVerification.results.extractedData.documentNumber &&
                           !selectedVerification.results.extractedData.expiryDate &&
                           !selectedVerification.results.extractedData.issuingCountry && (
                            <p className="no-data-message">No data extracted from document</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Flags & Warnings */}
                    {((selectedVerification.results.flags && selectedVerification.results.flags.length > 0) ||
                      (selectedVerification.results.warnings && selectedVerification.results.warnings.length > 0)) && (
                      <div className="detail-section alerts-section">
                        <h3>Alerts</h3>
                        {selectedVerification.results.flags && selectedVerification.results.flags.length > 0 && (
                          <div className="flags-list">
                            <h4>Flags:</h4>
                            <ul>
                              {selectedVerification.results.flags.map((flag, index) => (
                                <li key={index} className="flag-item-modal">{flag.replace(/_/g, ' ')}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedVerification.results.warnings && selectedVerification.results.warnings.length > 0 && (
                          <div className="warnings-list">
                            <h4>Warnings:</h4>
                            <ul>
                              {selectedVerification.results.warnings.map((warning, index) => (
                                <li key={index} className="warning-item-modal">{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Timestamps */}
                <div className="detail-section">
                  <h3>Timestamps</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(selectedVerification.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Completed:</span>
                      <span className="detail-value">{formatDate(selectedVerification.completedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PartnerLayout>
  );
};
