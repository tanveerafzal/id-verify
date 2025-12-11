import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getApiUrl } from '../config/api';

interface Tier {
  id: string;
  name: string;
  displayName: string;
  monthlyPrice: number;
  monthlyVerifications: number;
}

interface Partner {
  id: string;
  email: string;
  companyName: string;
  contactName: string;
  phone?: string;
  website?: string;
  tier: Tier;
  apiKey: string;
  apiSecret?: string;
  verificationsUsed: number;
  createdAt: string;
  isActive: boolean;
}

export const AdminPartners: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      // Load partners
      const partnersResponse = await fetch(getApiUrl('/api/admin/partners'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!partnersResponse.ok) {
        if (partnersResponse.status === 401) {
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to load partners');
      }

      const partnersData = await partnersResponse.json();
      setPartners(partnersData.data.partners || []);

      // Load tiers
      const tiersResponse = await fetch(getApiUrl('/api/partners/tiers'));
      if (tiersResponse.ok) {
        const tiersData = await tiersResponse.json();
        setTiers(tiersData.data || []);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const handleToggleActive = async (partner: Partner) => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(getApiUrl(`/api/admin/partners/${partner.id}/toggle-active`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadData();
      }
    } catch (err) {
      setError('Failed to update partner status');
    }
  };

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = filterTier === 'all' || partner.tier?.name === filterTier;

    return matchesSearch && matchesTier;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="spinner" />
          <p>Loading partners...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-partners">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Partner Management</h1>
            <p>Manage all registered partners</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Add Partner
          </button>
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
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
            >
              <option value="all">All Tiers</option>
              {tiers.map((tier) => (
                <option key={tier.id} value={tier.name}>
                  {tier.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Partners Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data">
                    No partners found
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id}>
                    <td className="company-cell">
                      <span className="company-name">{partner.companyName}</span>
                    </td>
                    <td>{partner.contactName}</td>
                    <td>{partner.email}</td>
                    <td>
                      <span className="tier-badge">{partner.tier?.displayName || 'Free'}</span>
                    </td>
                    <td>
                      <span className="usage-info">
                        {partner.verificationsUsed} / {partner.tier?.monthlyVerifications || 100}
                      </span>
                    </td>
                    <td>
                      <span className={`status-indicator ${partner.isActive !== false ? 'active' : 'inactive'}`}>
                        {partner.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => handleEditPartner(partner)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleToggleActive(partner)}
                        title={partner.isActive !== false ? 'Deactivate' : 'Activate'}
                      >
                        {partner.isActive !== false ? '🚫' : '✅'}
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
          <span>Showing {filteredPartners.length} of {partners.length} partners</span>
        </div>

        {/* Edit Modal */}
        {showModal && selectedPartner && (
          <PartnerEditModal
            partner={selectedPartner}
            tiers={tiers}
            onClose={() => {
              setShowModal(false);
              setSelectedPartner(null);
            }}
            onSave={() => {
              loadData();
              setShowModal(false);
              setSelectedPartner(null);
            }}
          />
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <PartnerCreateModal
            tiers={tiers}
            onClose={() => setShowCreateModal(false)}
            onSave={() => {
              loadData();
              setShowCreateModal(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

interface PartnerEditModalProps {
  partner: Partner;
  tiers: Tier[];
  onClose: () => void;
  onSave: () => void;
}

const PartnerEditModal: React.FC<PartnerEditModalProps> = ({
  partner,
  tiers,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    companyName: partner.companyName,
    contactName: partner.contactName,
    email: partner.email,
    phone: partner.phone || '',
    website: partner.website || '',
    tierName: partner.tier?.name || 'free',
    verificationsUsed: partner.verificationsUsed
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(getApiUrl(`/api/admin/partners/${partner.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update partner');
      }

      setSuccess('Partner updated successfully!');
      setTimeout(() => onSave(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update partner');
    } finally {
      setLoading(false);
    }
  };

  const handleResetApiKey = async () => {
    if (!confirm('Are you sure you want to reset the API key? The partner will need to update their integration.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(getApiUrl(`/api/admin/partners/${partner.id}/reset-api-key`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('API key reset successfully!');
        setTimeout(() => onSave(), 1000);
      }
    } catch (err) {
      setError('Failed to reset API key');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Partner</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-alert">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tier</label>
                <select
                  name="tierName"
                  value={formData.tierName}
                  onChange={handleChange}
                >
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.name}>
                      {tier.displayName} (${tier.monthlyPrice}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Verifications Used</label>
                <input
                  type="number"
                  name="verificationsUsed"
                  value={formData.verificationsUsed}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="api-section">
              <h4>API Credentials</h4>
              <div className="api-info">
                <div className="api-row">
                  <span className="api-label">API Key:</span>
                  <code className="api-value">{partner.apiKey}</code>
                </div>
                <button
                  type="button"
                  className="btn-secondary btn-small"
                  onClick={handleResetApiKey}
                >
                  Reset API Key
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PartnerCreateModalProps {
  tiers: Tier[];
  onClose: () => void;
  onSave: () => void;
}

const PartnerCreateModal: React.FC<PartnerCreateModalProps> = ({
  tiers,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    password: '',
    phone: '',
    website: '',
    tierName: 'free'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(getApiUrl('/api/admin/partners'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create partner');
      }

      setSuccess('Partner created successfully!');
      setTimeout(() => onSave(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Partner</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-alert">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Tier</label>
                <select
                  name="tierName"
                  value={formData.tierName}
                  onChange={handleChange}
                >
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.name}>
                      {tier.displayName} (${tier.monthlyPrice}/mo - {tier.monthlyVerifications} verifications)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
