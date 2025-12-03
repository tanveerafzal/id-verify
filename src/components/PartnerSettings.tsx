import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl, getAssetUrl } from '../config/api';

interface Partner {
  id: string;
  email: string;
  companyName: string;
  contactName: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  address?: string;
  apiKey: string;
  apiSecret: string;
  tier: {
    displayName: string;
  };
  createdAt: string;
}

export const PartnerSettings: React.FC = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    logoUrl: '',
    website: '',
    address: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem('partnerToken');

    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/partners/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setPartner(data.data);

      setFormData({
        companyName: data.data.companyName || '',
        contactName: data.data.contactName || '',
        phone: data.data.phone || '',
        logoUrl: data.data.logoUrl || '',
        website: data.data.website || '',
        address: data.data.address || ''
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const token = localStorage.getItem('partnerToken');

    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/partners/profile'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setPartner(data.data);
      setSuccess('Profile updated successfully!');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB');
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setUploadingLogo(true);
    setError('');

    const token = localStorage.getItem('partnerToken');
    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('logo', logoFile);

      const response = await fetch(getApiUrl('/api/partners/upload-logo'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();

      // Update form data with the new logo URL
      setFormData({
        ...formData,
        logoUrl: data.data.logoUrl
      });

      // Update partner state
      if (partner) {
        setPartner({
          ...partner,
          logoUrl: data.data.logoUrl
        });
      }

      setSuccess('Logo uploaded successfully!');
      setLogoFile(null);
      setLogoPreview('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload logo');
      console.error(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const clearLogoFile = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="settings-loading">
          <div className="spinner" />
          <p>Loading settings...</p>
        </div>
      </PartnerLayout>
    );
  }

  if (!partner) {
    return (
      <PartnerLayout>
        <div className="settings-error">
          <p>Failed to load partner profile</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="settings-page">
        <div className="page-header">
          <h1>Account Settings</h1>
          <p>Manage your partner account information and API credentials</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {success && (
          <div className="success-alert">
            {success}
          </div>
        )}

        <div className="settings-container">
          {/* Account Information */}
          <div className="settings-section">
            <h2>Account Information</h2>
            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={partner.email}
                  disabled
                  className="form-input disabled"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactName">Contact Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Company Logo</label>
                <div className="logo-upload-section">
                  <div className="logo-upload-options">
                    <div className="upload-option">
                      <label htmlFor="logoUrl">Enter Logo URL</label>
                      <input
                        type="url"
                        id="logoUrl"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="form-input"
                      />
                    </div>

                    <div className="upload-divider">
                      <span>OR</span>
                    </div>

                    <div className="upload-option">
                      <label htmlFor="logoFile">Upload Logo File</label>
                      <input
                        type="file"
                        id="logoFile"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="file-input"
                      />
                      <small>Max size: 5MB. Supported formats: PNG, JPG, SVG</small>

                      {logoFile && (
                        <div className="file-selected">
                          <span>{logoFile.name}</span>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={clearLogoFile}
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleLogoUpload}
                            disabled={uploadingLogo}
                          >
                            {uploadingLogo ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {(logoPreview || formData.logoUrl) && (
                    <div className="logo-preview">
                      <label>Logo Preview</label>
                      <img
                        src={logoPreview || getAssetUrl(formData.logoUrl)}
                        alt="Company Logo"
                        className="logo-preview-img"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* API Credentials */}
          <div className="settings-section">
            <h2>API Credentials</h2>
            <div className="credentials-info">
              <div className="credential-item">
                <label>API Key</label>
                <div className="credential-value">
                  <code>{partner.apiKey}</code>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyToClipboard(partner.apiKey)}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="credential-item">
                <label>API Secret</label>
                <div className="credential-value">
                  <code>{partner.apiSecret}</code>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyToClipboard(partner.apiSecret)}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="credential-warning">
                <strong>Keep your credentials secure!</strong> Never share your API secret publicly or commit it to version control.
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="settings-section">
            <h2>Subscription</h2>
            <div className="subscription-info">
              <div className="info-item">
                <label>Current Tier</label>
                <div className="tier-badge">{partner.tier.displayName}</div>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <div>{new Date(partner.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
};
