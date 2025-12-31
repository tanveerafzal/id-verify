import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl } from '../config/api';

interface VerificationRequest {
  userName: string;
  userEmail: string;
  userPhone: string;
  type: string;
  webhookUrl: string;
}

export const PartnerRequestVerification: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VerificationRequest>({
    userName: '',
    userEmail: '',
    userPhone: '',
    type: 'IDENTITY',
    webhookUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationLink, setVerificationLink] = useState('');
  const [sentToEmail, setSentToEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const token = localStorage.getItem('partnerToken');

    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      console.log('[RequestVerification] Submitting request:', formData);

      const response = await fetch(getApiUrl('/api/partners/verifications/request'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('[RequestVerification] Response status:', response.status);
      console.log('[RequestVerification] Response statusText:', response.statusText);
      console.log('[RequestVerification] Response URL:', response.url);

      let data;
      const responseText = await response.text();
      console.log('[RequestVerification] Response text:', responseText);

      try {
        data = JSON.parse(responseText);
        console.log('[RequestVerification] Parsed response data:', data);
      } catch (parseError) {
        console.error('[RequestVerification] Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create verification request');
      }

      // Use the verification link from the backend response (same as email link)
      setVerificationLink(data.data.verificationLink);
      setSentToEmail(formData.userEmail);
      setSuccess(true);

      // Reset form
      setFormData({
        userName: '',
        userEmail: '',
        userPhone: '',
        type: 'IDENTITY',
        webhookUrl: ''
      });
    } catch (err) {
      console.error('[RequestVerification] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create verification request');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(verificationLink);
    alert('Verification link copied to clipboard!');
  };

  const sendEmailToUser = () => {
    const subject = 'Identity Verification Required';
    const body = `Hello,\n\nPlease complete your identity verification by clicking the link below:\n\n${verificationLink}\n\nThank you!`;
    window.open(`mailto:${formData.userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <PartnerLayout>
      <div className="request-verification-page">
        <div className="page-header">
          <h1>Request Verification</h1>
          <p>Create a new identity verification request for a user</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {success && verificationLink && (
          <div className="success-card">
            <div className="success-header">
              <span className="success-icon">✓</span>
              <h3>Verification Request Created!</h3>
            </div>

            <div className="success-message-box">
              <p className="success-main-text">
                An email has been automatically sent to <strong>{sentToEmail}</strong> with the verification link.
              </p>
              <p className="success-sub-text">
                You can also share the link manually if needed:
              </p>
            </div>

            <div className="verification-link-container">
              <input
                type="text"
                value={verificationLink}
                readOnly
                className="verification-link-input"
              />
              <button onClick={copyLink} className="btn btn-secondary btn-sm">
                Copy Link
              </button>
            </div>

            <div className="action-buttons">
              <button onClick={sendEmailToUser} className="btn btn-outline">
                Resend Email
              </button>
              <button onClick={() => navigate('/partner/verifications')} className="btn btn-primary">
                View All Verifications
              </button>
              <button onClick={() => setSuccess(false)} className="btn btn-outline">
                Create Another Request
              </button>
            </div>
          </div>
        )}

        {!success && (
          <div className="request-form-container">
            <form onSubmit={handleSubmit} className="request-form">
              <div className="form-section">
                <h3>User Information</h3>

                <div className="form-group">
                  <label htmlFor="userName">Full Name *</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="userEmail">Email Address *</label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required
                    placeholder="user@example.com"
                    className="form-input"
                  />
                  <small>We'll send the verification link to this email</small>
                </div>

                <div className="form-group">
                  <label htmlFor="userPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="userPhone"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Verification Settings</h3>

                <div className="form-group">
                  <label htmlFor="type">Verification Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="IDENTITY">Full Identity (Document + Selfie)</option>
                    <option value="DOCUMENT_ONLY">Document Only</option>
                    <option value="SELFIE_ONLY">Selfie Only</option>
                    <option value="FULL_KYC">Full KYC</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="webhookUrl">Webhook URL (Optional)</label>
                  <input
                    type="url"
                    id="webhookUrl"
                    name="webhookUrl"
                    value={formData.webhookUrl}
                    onChange={handleChange}
                    placeholder="https://your-api.com/webhook"
                    className="form-input"
                  />
                  <small>Receive real-time updates about this verification</small>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Creating Request...' : 'Create Verification Request'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/partner/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="info-card">
              <h4>How it works</h4>
              <ol>
                <li>Enter the user's information and select verification type</li>
                <li>We'll generate a unique verification link</li>
                <li>Share the link with your user via email or other methods</li>
                <li>User completes the verification process</li>
                <li>View results in your dashboard or receive webhook notifications</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
};
