import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl } from '../config/api';

interface WebhookLog {
  id: string;
  verificationId: string;
  url: string;
  method: string;
  status: number;
  statusText?: string;
  requestBody?: any;
  responseBody?: any;
  error?: string;
  duration?: number;
  createdAt: string;
}

export const PartnerWebhooks: React.FC = () => {
  const navigate = useNavigate();
  const [webhooks, setWebhooks] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookLog | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    await loadWebhooks();
    setRefreshing(false);
  };

  const loadWebhooks = async () => {
    const token = localStorage.getItem('partnerToken');

    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/partners/webhooks'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load webhooks');
      }

      const data = await response.json();
      setWebhooks(data.data || []);
    } catch (err) {
      setError('Failed to load webhooks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <span className="status-badge status-completed">{status}</span>;
    } else if (status >= 400) {
      return <span className="status-badge status-failed">{status}</span>;
    } else if (status >= 300) {
      return <span className="status-badge status-pending">{status}</span>;
    }
    return <span className="status-badge">{status || 'N/A'}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredWebhooks = webhooks.filter((w) => {
    // Apply status filter
    if (filter === 'success' && (w.status < 200 || w.status >= 300)) return false;
    if (filter === 'failed' && w.status >= 200 && w.status < 300) return false;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesId = w.id.toLowerCase().includes(query);
      const matchesVerificationId = w.verificationId?.toLowerCase().includes(query);
      const matchesUrl = w.url?.toLowerCase().includes(query);
      const matchesStatus = w.status?.toString().includes(query);
      const matchesRequestBody = w.requestBody
        ? JSON.stringify(w.requestBody).toLowerCase().includes(query)
        : false;

      if (!matchesId && !matchesVerificationId && !matchesUrl && !matchesStatus && !matchesRequestBody) {
        return false;
      }
    }

    return true;
  });

  const closeModal = () => {
    setSelectedWebhook(null);
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="verifications-loading">
          <div className="spinner" />
          <p>Loading webhooks...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="verifications-page">
        <div className="page-header">
          <div className="page-header-top">
            <h1>Webhook History</h1>
            <button
              className="btn btn-secondary btn-refresh"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh list"
            >
              {refreshing ? '↻ Refreshing...' : '↻ Refresh'}
            </button>
          </div>
          <p>View all webhook deliveries for your verification events</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="verifications-search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by ID, verification ID, URL, status, or request body..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          <div className="verifications-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({webhooks.length})
            </button>
            <button
              className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
              onClick={() => setFilter('success')}
            >
              Success ({webhooks.filter(w => w.status >= 200 && w.status < 300).length})
            </button>
            <button
              className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
              onClick={() => setFilter('failed')}
            >
              Failed ({webhooks.filter(w => w.status < 200 || w.status >= 300).length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="verifications-table-container">
          {filteredWebhooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{searchQuery ? '🔍' : '🔗'}</div>
              <h3>{searchQuery ? 'No matching webhooks' : 'No webhooks yet'}</h3>
              <p>
                {searchQuery
                  ? `No results found for "${searchQuery}". Try adjusting your search.`
                  : 'Webhook deliveries will appear here when verifications are completed'}
              </p>
              {searchQuery && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchQuery('')}
                  style={{ marginTop: '12px' }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <table className="verifications-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Verification ID</th>
                  <th>URL</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td>{formatDate(webhook.createdAt)}</td>
                    <td>
                      <code className="verification-id">
                        {webhook.verificationId?.substring(0, 8)}...
                      </code>
                    </td>
                    <td>
                      <span className="webhook-url" title={webhook.url}>
                        {webhook.url?.length > 40
                          ? webhook.url.substring(0, 40) + '...'
                          : webhook.url}
                      </span>
                    </td>
                    <td>
                      <span className="method-badge">{webhook.method || 'POST'}</span>
                    </td>
                    <td>{getStatusBadge(webhook.status)}</td>
                    <td>
                      {webhook.duration ? `${webhook.duration}ms` : '-'}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedWebhook(webhook)}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats Summary */}
        {filteredWebhooks.length > 0 && (
          <div className="verifications-stats">
            <div className="stat-item">
              <span className="stat-label">Total Webhooks:</span>
              <span className="stat-value">{webhooks.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate:</span>
              <span className="stat-value">
                {(() => {
                  const successCount = webhooks.filter(w => w.status >= 200 && w.status < 300).length;
                  if (webhooks.length === 0) return 'N/A';
                  return `${((successCount / webhooks.length) * 100).toFixed(0)}%`;
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Webhook Details Modal */}
        {selectedWebhook && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content verification-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Webhook Details</h2>
                <button className="modal-close" onClick={closeModal}>&times;</button>
              </div>

              <div className="modal-body">
                {/* Basic Info */}
                <div className="detail-section">
                  <h3>Delivery Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Webhook ID:</span>
                      <span className="detail-value">{selectedWebhook.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Verification ID:</span>
                      <span className="detail-value">{selectedWebhook.verificationId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Timestamp:</span>
                      <span className="detail-value">{formatDate(selectedWebhook.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{selectedWebhook.duration ? `${selectedWebhook.duration}ms` : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Request Info */}
                <div className="detail-section">
                  <h3>Request</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Method:</span>
                      <span className="detail-value">{selectedWebhook.method || 'POST'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">URL:</span>
                      <span className="detail-value" style={{ wordBreak: 'break-all' }}>{selectedWebhook.url}</span>
                    </div>
                  </div>
                  {selectedWebhook.requestBody && (
                    <div className="webhook-payload">
                      <h4>Request Body:</h4>
                      <pre className="code-block">
                        {JSON.stringify(selectedWebhook.requestBody, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Response Info */}
                <div className="detail-section">
                  <h3>Response</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">
                        {selectedWebhook.status} {selectedWebhook.statusText || ''}
                      </span>
                    </div>
                  </div>
                  {selectedWebhook.error && (
                    <div className="webhook-error">
                      <h4>Error:</h4>
                      <div className="error-alert">{selectedWebhook.error}</div>
                    </div>
                  )}
                  {selectedWebhook.responseBody && (
                    <div className="webhook-payload">
                      <h4>Response Body:</h4>
                      <pre className="code-block">
                        {typeof selectedWebhook.responseBody === 'string'
                          ? selectedWebhook.responseBody
                          : JSON.stringify(selectedWebhook.responseBody, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

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
