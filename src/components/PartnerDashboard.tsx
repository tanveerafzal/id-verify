import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl } from '../config/api';

interface Partner {
  id: string;
  email: string;
  companyName: string;
  contactName: string;
  phone?: string;
  tier: Tier;
  apiKey: string;
  apiSecret?: string;
  verificationsUsed: number;
  createdAt: string;
}

interface Tier {
  id: string;
  name: string;
  displayName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyVerifications: number;
  apiCallsPerMinute: number;
  features: any;
}

interface UsageStats {
  currentTier: Tier;
  thisMonthUsage: number;
  totalUsage: number;
  remainingVerifications: number;
  usagePercentage: number;
}

export const PartnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApiCredentials, setShowApiCredentials] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem('partnerToken');
    console.log('[PartnerDashboard] Token from localStorage:', token ? 'exists' : 'missing');

    if (!token) {
      console.log('[PartnerDashboard] No token, redirecting to login');
      navigate('/partner/login');
      return;
    }

    try {
      // Load partner profile
      const profileUrl = getApiUrl('/api/partners/profile');
      console.log('[PartnerDashboard] Loading profile from:', profileUrl);
      console.log('[PartnerDashboard] Environment:', import.meta.env.MODE);
      console.log('[PartnerDashboard] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

      const profileResponse = await fetch(profileUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('[PartnerDashboard] Profile response status:', profileResponse.status);
      console.log('[PartnerDashboard] Profile response headers:', Object.fromEntries(profileResponse.headers.entries()));

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('[PartnerDashboard] Profile error response:', errorText);
        throw new Error('Failed to load profile');
      }

      const profileData = await profileResponse.json();
      console.log('[PartnerDashboard] Profile data loaded:', profileData);
      setPartner(profileData.data);

      // Load usage stats
      const statsUrl = getApiUrl('/api/partners/usage-stats');
      console.log('[PartnerDashboard] Loading stats from:', statsUrl);

      const statsResponse = await fetch(statsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('[PartnerDashboard] Stats response status:', statsResponse.status);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('[PartnerDashboard] Stats data loaded:', statsData);
        setUsageStats(statsData.data);
      } else {
        console.error('[PartnerDashboard] Failed to load stats:', await statsResponse.text());
      }

      // Load available tiers
      const tiersUrl = getApiUrl('/api/partners/tiers');
      console.log('[PartnerDashboard] Loading tiers from:', tiersUrl);

      const tiersResponse = await fetch(tiersUrl);
      console.log('[PartnerDashboard] Tiers response status:', tiersResponse.status);

      if (tiersResponse.ok) {
        const tiersData = await tiersResponse.json();
        console.log('[PartnerDashboard] Tiers data loaded:', tiersData);
        setTiers(tiersData.data);
      } else {
        console.error('[PartnerDashboard] Failed to load tiers:', await tiersResponse.text());
      }
    } catch (error) {
      console.error('[PartnerDashboard] Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };


  const [copyMessage, setCopyMessage] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMessage('Copied to clipboard!');
    setTimeout(() => setCopyMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!partner || !usageStats) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <PartnerLayout>
      <div className="partner-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <p>Welcome back, {partner.contactName}</p>
          </div>
        </div>

      {/* Overview Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Current Plan</h3>
            <span className="tier-badge">{usageStats.currentTier.displayName}</span>
          </div>
          <div className="card-content">
            <div className="tier-info">
              <div className="tier-price">
                <span className="price">${usageStats.currentTier.monthlyPrice}</span>
                <span className="period">/month</span>
              </div>
              <p>{usageStats.currentTier.monthlyVerifications} verifications/month</p>
              {usageStats.currentTier.name !== 'enterprise' && (
                <button
                  className="btn-primary"
                  onClick={() => setShowUpgradeModal(true)}
                  style={{ marginTop: '15px' }}
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Usage This Month</h3>
          </div>
          <div className="card-content">
            <div className="usage-stats">
              <div className="usage-numbers">
                <span className="usage-current">{usageStats.thisMonthUsage}</span>
                <span className="usage-total">/ {usageStats.currentTier.monthlyVerifications}</span>
              </div>
              <div className="usage-bar">
                <div
                  className="usage-fill"
                  style={{ width: `${Math.min(usageStats.usagePercentage, 100)}%` }}
                />
              </div>
              <p className="usage-remaining">
                {usageStats.remainingVerifications} verifications remaining
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>API Credentials</h3>
            <button
              className="btn-link"
              onClick={() => setShowApiCredentials(!showApiCredentials)}
            >
              {showApiCredentials ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="card-content">
            {copyMessage && (
              <div className="success-message">
                {copyMessage}
              </div>
            )}
            {showApiCredentials ? (
              <div className="api-credentials">
                <div className="credential-item">
                  <label>API Key:</label>
                  <div className="credential-value">
                    <code>{partner.apiKey}</code>
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(partner.apiKey)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
                {partner.apiSecret && (
                  <div className="credential-item">
                    <label>API Secret:</label>
                    <div className="credential-value">
                      <code>{partner.apiSecret}</code>
                      <button
                        className="btn-copy"
                        onClick={() => copyToClipboard(partner.apiSecret || '')}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted">Click "Show" to view your API credentials</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Account Info</h3>
          </div>
          <div className="card-content">
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Company:</span>
                <span className="info-value">{partner.companyName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{partner.email}</span>
              </div>
              {partner.phone && (
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{partner.phone}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {new Date(partner.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Link Section */}
      <div className="verification-link-section">
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3>General Verification Link</h3>
          </div>
          <div className="card-content">
            <p className="link-description">
              Share this link with your customers to start the ID verification process.
              This link is unique to your company and will show your branding.
            </p>
            {copyMessage && (
              <div className="success-message">
                {copyMessage}
              </div>
            )}
            <div className="verification-link-box">
              <code className="verification-link">
                {`https://verify.trustcredo.com/verify?apiKey=${partner.apiKey}`}
              </code>
              <div className="link-actions">
                <button
                  className="btn-copy"
                  onClick={() => copyToClipboard(`https://verify.trustcredo.com/verify?apiKey=${partner.apiKey}`)}
                >
                  Copy Link
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => window.open(`https://verify.trustcredo.com/verify?apiKey=${partner.apiKey}`, '_blank')}
                >
                  Test Link
                </button>
              </div>
            </div>
            <p className="link-note">
              <strong>Tip:</strong> For personalized verification links with user details pre-filled, use the "Request Verification" feature or API to generate links in the format: <code>?verification-request=&lt;encrypted-token&gt;</code>
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Current Plan Features</h2>
        <div className="features-grid">
          {Object.entries(usageStats.currentTier.features).map(([key, value]) => (
            <div key={key} className={`feature-item ${value ? 'enabled' : 'disabled'}`}>
              <span className="feature-icon">{value ? '✓' : '✗'}</span>
              <span className="feature-name">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <TierUpgradeModal
            currentTier={usageStats.currentTier}
            tiers={tiers}
            onClose={() => setShowUpgradeModal(false)}
            onUpgrade={loadDashboardData}
          />
        )}
      </div>
    </PartnerLayout>
  );
};

interface TierUpgradeModalProps {
  currentTier: Tier;
  tiers: Tier[];
  onClose: () => void;
  onUpgrade: () => void;
}

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({
  currentTier,
  tiers,
  onClose,
  onUpgrade
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpgrade = async () => {
    if (!selectedTier) return;

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('partnerToken');
      const response = await fetch(getApiUrl('/api/partners/upgrade-tier'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tierName: selectedTier })
      });

      if (!response.ok) {
        throw new Error('Upgrade failed');
      }

      setMessage({ type: 'success', text: 'Plan upgraded successfully!' });
      setTimeout(() => {
        onUpgrade();
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upgrade plan. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upgrade Your Plan</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {message && (
            <div className={message.type === 'success' ? 'success-message' : 'error-alert'}>
              {message.text}
            </div>
          )}
          <div className="tiers-comparison">
            {tiers
              .filter((tier) => tier.monthlyPrice > currentTier.monthlyPrice)
              .map((tier) => (
                <div
                  key={tier.id}
                  className={`tier-option ${selectedTier === tier.name ? 'selected' : ''}`}
                  onClick={() => setSelectedTier(tier.name)}
                >
                  <div className="tier-option-header">
                    <h3>{tier.displayName}</h3>
                    <div className="tier-price">
                      <span className="price">${tier.monthlyPrice}</span>
                      <span className="period">/month</span>
                    </div>
                  </div>
                  <div className="tier-option-features">
                    <p><strong>{tier.monthlyVerifications}</strong> verifications/month</p>
                    <p><strong>{tier.apiCallsPerMinute}</strong> API calls/minute</p>
                  </div>
                  <div className="tier-option-select">
                    {selectedTier === tier.name && <span className="checkmark">✓</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleUpgrade}
            disabled={!selectedTier || loading}
          >
            {loading ? 'Upgrading...' : 'Confirm Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
};
