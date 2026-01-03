import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { SEO } from './SEO';

interface VerificationData {
  id: string;
  status: string;
  completedAt?: string;
  user?: {
    fullName: string;
    email: string;
  };
  results?: {
    extractedName?: string;
    extractedDob?: string;
    documentNumber?: string;
    expiryDate?: string;
    issuingCountry?: string;
  };
  documents?: Array<{
    type: string;
  }>;
}

export const CertificateVerify: React.FC = () => {
  const { verificationId } = useParams<{ verificationId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState<VerificationData | null>(null);

  useEffect(() => {
    loadVerification();
  }, [verificationId]);

  const loadVerification = async () => {
    if (!verificationId) {
      setError('Invalid verification ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/verifications/${verificationId}/public`));

      if (!response.ok) {
        if (response.status === 404) {
          setError('Certificate not found. The verification ID may be invalid.');
        } else {
          setError('Failed to verify certificate. Please try again later.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setVerification(data.data);
    } catch (err) {
      console.error('Error loading verification:', err);
      setError('Failed to connect to verification service.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const isExpired = verification?.results?.expiryDate
    ? new Date(verification.results.expiryDate) < new Date()
    : false;

  const isValid = verification?.status === 'COMPLETED' && !isExpired;

  if (loading) {
    return (
      <div className="certificate-verify-container">
        <div className="verify-card">
          <div className="verify-loading">
            <div className="spinner"></div>
            <p>Verifying certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-verify-container">
        <div className="verify-card verify-error">
          <div className="verify-icon error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h1>Verification Failed</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-verify-container">
      <SEO
        title="Verify Certificate"
        description="Verify the authenticity of a TrustCredo identity verification certificate. Scan QR codes to confirm verification status."
        keywords="verify certificate, identity verification, certificate validation"
        noIndex={true}
      />
      <div className={`verify-card ${isValid ? 'verify-valid' : 'verify-invalid'}`}>
        <div className={`verify-icon ${isValid ? 'valid' : 'invalid'}`}>
          {isValid ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          )}
        </div>

        <h1>{isValid ? 'Certificate Verified' : 'Certificate Invalid'}</h1>

        <p className="verify-status">
          {isValid
            ? 'This identity verification certificate is authentic and valid.'
            : isExpired
              ? 'This certificate has expired.'
              : 'This certificate could not be verified.'}
        </p>

        {verification && (
          <div className="verify-details">
            <div className="detail-item">
              <span className="label">Name</span>
              <span className="value">{verification.user?.fullName || verification.results?.extractedName || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="label">Verification Status</span>
              <span className={`value status-badge ${verification.status.toLowerCase()}`}>
                {verification.status}
              </span>
            </div>

            {verification.completedAt && (
              <div className="detail-item">
                <span className="label">Verified On</span>
                <span className="value">{formatDate(verification.completedAt)}</span>
              </div>
            )}

            {verification.results?.expiryDate && (
              <div className="detail-item">
                <span className="label">Valid Until</span>
                <span className={`value ${isExpired ? 'expired' : ''}`}>
                  {formatDate(verification.results.expiryDate)}
                  {isExpired && ' (Expired)'}
                </span>
              </div>
            )}

            {verification.documents?.[0]?.type && (
              <div className="detail-item">
                <span className="label">Document Type</span>
                <span className="value">{verification.documents[0].type.replace(/_/g, ' ')}</span>
              </div>
            )}

            {verification.results?.issuingCountry && (
              <div className="detail-item">
                <span className="label">Issuing Country</span>
                <span className="value">{verification.results.issuingCountry}</span>
              </div>
            )}
          </div>
        )}

        <div className="verify-footer">
          <p>Certificate ID: <code>{verificationId?.substring(0, 8)}...</code></p>
        </div>
      </div>
    </div>
  );
};
