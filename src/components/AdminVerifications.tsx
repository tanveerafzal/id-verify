import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
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
    livenessCheck?: boolean;
    livenessScore?: number;
  };
  extractedData?: {
    fullName?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
    issuingCountry?: string;
    address?: string;
  };
  flags?: string[];
  warnings?: string[];
}

interface Document {
  id: string;
  type: string;
  side?: string;
  createdAt: string;
  originalUrl?: string;
  processedUrl?: string;
  thumbnailUrl?: string;
  qualityScore?: number;
  isBlurry?: boolean;
  hasGlare?: boolean;
}

interface Verification {
  id: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  type: string;
  status: string;
  riskLevel?: string;
  score?: number;
  partner?: {
    id: string;
    companyName: string;
    email?: string;
  };
  user?: {
    id: string;
    fullName?: string;
    email?: string;
  };
  documents?: Document[];
  results?: VerificationResult;
  createdAt: string;
  completedAt?: string;
}

export const AdminVerifications: React.FC = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

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

  const loadVerificationDetails = async (verificationId: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setLoadingDetails(true);

    try {
      const response = await fetch(
        getApiUrl(`/api/admin/verifications/${verificationId}`),
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
    // Set the verification from the list first (this makes modal appear immediately)
    setSelectedVerification(verification);
    // Then load full details from API
    loadVerificationDetails(verification.id);
  };

  const handleManualPass = async (verificationId: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    if (!confirm('Are you sure you want to manually mark this verification as PASSED?')) {
      return;
    }

    setProcessingAction(true);
    setError('');

    try {
      const response = await fetch(
        getApiUrl(`/api/admin/verifications/${verificationId}/manual-pass`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update verification');
      }

      setSuccessMessage('Verification marked as PASSED successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reload details and list
      await loadVerificationDetails(verificationId);
      await loadVerifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update verification');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleManualFail = async (verificationId: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const reason = prompt('Please enter a reason for failing this verification:');
    if (!reason) return;

    setProcessingAction(true);
    setError('');

    try {
      const response = await fetch(
        getApiUrl(`/api/admin/verifications/${verificationId}/manual-fail`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update verification');
      }

      setSuccessMessage('Verification marked as FAILED.');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reload details and list
      await loadVerificationDetails(verificationId);
      await loadVerifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update verification');
    } finally {
      setProcessingAction(false);
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
    const matchesSearch =
      v.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.partner?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || v.status.toUpperCase() === filterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const closeModal = () => {
    setSelectedVerification(null);
  };

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

        {successMessage && (
          <div className="success-message">
            {successMessage}
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
                      {verification.score !== undefined ? `${Math.round(verification.score * 100)}%` : '-'}
                    </td>
                    <td>{new Date(verification.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => handleViewDetails(verification)}
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

        {/* Verification Details Modal */}
        {selectedVerification && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content verification-details-modal large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Verification Details</h2>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>

              {loadingDetails ? (
                <div className="modal-loading">
                  <div className="spinner" />
                  <p>Loading details...</p>
                </div>
              ) : (
                <div className="modal-body">
                  {/* Status Banner */}
                  <div className={`verification-status-banner ${(selectedVerification.status || 'pending').toLowerCase()}`}>
                    <span className="status-text">Status: {selectedVerification.status || 'Unknown'}</span>
                    {selectedVerification.results && (
                      <span className={`result-text ${selectedVerification.results.passed ? 'passed' : 'failed'}`}>
                        {selectedVerification.results.passed ? '✅ PASSED' : '❌ FAILED'}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="detail-section">
                    <h3>User Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">
                          {selectedVerification.userName || selectedVerification.user?.fullName || 'N/A'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">
                          {selectedVerification.userEmail || selectedVerification.user?.email || 'N/A'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedVerification.userPhone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Partner Info */}
                  <div className="detail-section">
                    <h3>Partner Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Company:</span>
                        <span className="detail-value">{selectedVerification.partner?.companyName || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{selectedVerification.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  {selectedVerification.documents && selectedVerification.documents.length > 0 && (
                    <div className="detail-section">
                      <h3>Uploaded Documents</h3>
                      <div className="uploaded-documents-grid">
                        {selectedVerification.documents.map((doc, index) => {
                          const docUrl = doc.originalUrl || doc.processedUrl;
                          const thumbUrl = doc.thumbnailUrl || docUrl;
                          const isSelfie = doc.type === 'SELFIE';
                          return (
                            <div key={doc.id || index} className={`uploaded-document-item ${isSelfie ? 'selfie' : 'id-document'}`}>
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
                                <span className="document-label">
                                  {isSelfie ? 'Selfie' : doc.type?.replace(/_/g, ' ')}
                                </span>
                                {doc.side && <span className="document-side">{doc.side}</span>}
                                {doc.qualityScore !== undefined && (
                                  <span className="document-quality">
                                    Quality: {Math.round(doc.qualityScore * 100)}%
                                  </span>
                                )}
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
                                  {selectedVerification.results.checks.faceMatchScore !== undefined && (
                                    <span className="face-score">
                                      ({Math.round(selectedVerification.results.checks.faceMatchScore * 100)}%)
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            {selectedVerification.results.checks.livenessCheck !== undefined && (
                              <div className={`check-item-modal ${selectedVerification.results.checks.livenessCheck ? 'pass' : 'fail'}`}>
                                <span className="check-icon">{selectedVerification.results.checks.livenessCheck ? '✓' : '✗'}</span>
                                <span>
                                  Liveness Check
                                  {selectedVerification.results.checks.livenessScore !== undefined && (
                                    <span className="face-score">
                                      ({Math.round(selectedVerification.results.checks.livenessScore * 100)}%)
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
                            {selectedVerification.results.extractedData.address && (
                              <div className="data-row-modal">
                                <span className="data-label">Address:</span>
                                <span className="data-value">{selectedVerification.results.extractedData.address}</span>
                              </div>
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

              <div className="modal-footer admin-verification-footer">
                {/* Manual Action Buttons - Only show for non-failed verifications */}
                {selectedVerification && selectedVerification.status !== 'FAILED' && (
                  <div className="admin-action-buttons">
                    {(!selectedVerification.results?.passed) && (
                      <button
                        className="btn-success"
                        onClick={() => handleManualPass(selectedVerification.id)}
                        disabled={processingAction}
                      >
                        {processingAction ? 'Processing...' : '✅ Manual Pass'}
                      </button>
                    )}
                    <button
                      className="btn-danger"
                      onClick={() => handleManualFail(selectedVerification.id)}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Processing...' : '❌ Manual Fail'}
                    </button>
                  </div>
                )}
                <button className="btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
