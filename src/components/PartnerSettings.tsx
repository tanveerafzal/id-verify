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
  state?: string;
  country?: string;
  userNotificationPref?: string;
  webhookUrl?: string;
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
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    logoUrl: '',
    website: '',
    address: '',
    state: '',
    country: '',
    userNotificationPref: 'EMAIL',
    webhookUrl: ''
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
        address: data.data.address || '',
        state: data.data.state || '',
        country: data.data.country || '',
        userNotificationPref: data.data.userNotificationPref || 'EMAIL',
        webhookUrl: data.data.webhookUrl || ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    setFormData({
      ...formData,
      [target.name]: target.value
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    const token = localStorage.getItem('partnerToken');
    if (!token) {
      navigate('/partner/login');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(getApiUrl('/api/partners/change-password'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., California"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g., United States"
                    className="form-input"
                  />
                </div>
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

          {/* General Verification Link */}
          <div className="settings-section">
            <h2>General Verification Link</h2>
            <p className="section-description">
              Share this link with your customers to start the ID verification process.
              This link is unique to your company and will show your branding.
            </p>
            <div className="verification-link-box">
              <code className="verification-link">
                {`https://verify.trustcredo.com/verify?apiKey=${partner.apiKey}`}
              </code>
              <div className="link-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(`https://verify.trustcredo.com/verify?apiKey=${partner.apiKey}`)}
                >
                  Copy Link
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
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

          {/* Notification Settings */}
          <div className="settings-section">
            <h2>Notification Settings</h2>
            <p className="section-description">Choose how you want to send verification invites to users.</p>
            <div className="notification-settings">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userNotificationPref"
                    value="EMAIL"
                    checked={formData.userNotificationPref === 'EMAIL'}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <span className="radio-text">
                    <strong>Email</strong>
                    <small>Send verification invites via email. Users will receive an email with a link to complete verification.</small>
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userNotificationPref"
                    value="PHONE"
                    checked={formData.userNotificationPref === 'PHONE'}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <span className="radio-text">
                    <strong>SMS / Text Message</strong>
                    <small>Send verification invites via text message. Users will receive an SMS with a link to complete verification.</small>
                  </span>
                </label>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>
          </div>

          {/* Webhook Settings */}
          <div className="settings-section">
            <h2>Webhook Settings</h2>
            <p className="section-description">
              Configure a webhook URL to receive real-time notifications when verifications are completed.
              We'll send a POST request to this URL with the verification result.
            </p>
            <div className="webhook-settings">
              <div className="form-group">
                <label htmlFor="webhookUrl">Webhook URL</label>
                <input
                  type="url"
                  id="webhookUrl"
                  name="webhookUrl"
                  value={formData.webhookUrl}
                  onChange={handleChange}
                  placeholder="https://your-server.com/webhook/verification"
                  className="form-input"
                />
                <small>Enter the URL where you want to receive verification results. Must be HTTPS.</small>
              </div>
              <div className="webhook-info">
                <h4>Webhook Headers</h4>
                <p className="webhook-note">Each webhook request includes these headers for verification:</p>
                <ul className="webhook-headers-list">
                  <li><code>X-Webhook-Signature</code> - HMAC-SHA256 signature of the payload using your API Secret</li>
                  <li><code>X-Webhook-Timestamp</code> - ISO 8601 timestamp of when the webhook was sent</li>
                </ul>
                <h4>Payload Example</h4>
                <pre className="code-block">
{`{
  "verificationId": "abc123-...",
  "status": "passed",
  "result": {
    "passed": true,
    "riskLevel": "LOW"
  },
  "extractedData": {
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-15",
    "documentNumber": "XXXXXX1234",
    "expiryDate": "2030-01-15"
  },
  "completedAt": "2024-01-15T10:30:00Z",
  "duration": 95000
}`}
                </pre>
                <h4>Signature Verification (Node.js)</h4>
                <pre className="code-block">
{`const crypto = require('crypto');

function verifySignature(payload, signature, apiSecret) {
  const expected = crypto
    .createHmac('sha256', apiSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expected;
}`}
                </pre>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Webhook Settings'}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="settings-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="settings-form">
              {passwordError && (
                <div className="error-alert">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="success-alert">
                  {passwordSuccess}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password *</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className="form-input"
                  autoComplete="new-password"
                />
                <small>Must be at least 8 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className="form-input"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
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
