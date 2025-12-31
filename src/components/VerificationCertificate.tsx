import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateProps {
  userName: string;
  verificationDate: string;
  validUntil?: string;
  certificateNumber: string;
  documentType?: string;
  issuingCountry?: string;
  verificationId?: string;
}

export const VerificationCertificate: React.FC<CertificateProps> = ({
  userName,
  verificationDate,
  validUntil,
  certificateNumber,
  documentType,
  issuingCountry,
  verificationId
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Check if certificate is still valid
  const isValid = validUntil ? new Date(validUntil) > new Date() : true;

  // Generate verification URL for QR code
  const verificationUrl = verificationId
    ? `${window.location.origin}/certificate/verify/${verificationId}`
    : `${window.location.origin}/certificate/verify/${certificateNumber}`;

  return (
    <div className="certificate-container">
      <div className="certificate-actions no-print">
        <button className="btn-primary" onClick={handlePrint}>
          Print Certificate
        </button>
      </div>

      <div className={`certificate ${!isValid ? 'certificate-expired' : ''}`}>
        {/* Certificate Border Design */}
        <div className="certificate-border">
          <div className="certificate-inner">
            {/* Header */}
            <div className="certificate-header">
              <div className="certificate-logo">
                <div className="logo-icon">ID</div>
              </div>
              <h1>Certificate of Identity Verification</h1>
              <div className="certificate-subtitle">
                Digital Identity Verification Service
              </div>
            </div>

            {/* Validity Badge */}
            <div className={`validity-badge ${isValid ? 'valid' : 'expired'}`}>
              {isValid ? 'VERIFIED' : 'EXPIRED'}
            </div>

            {/* Main Content */}
            <div className="certificate-body">
              <p className="certificate-statement">This is to certify that</p>

              <h2 className="certificate-name">{userName}</h2>

              <p className="certificate-statement">
                has successfully completed identity verification
              </p>

              {/* Verification Details */}
              <div className="certificate-details">
                <div className="detail-row">
                  <span className="detail-label">Verification Date:</span>
                  <span className="detail-value">{formatDate(verificationDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Valid Until:</span>
                  <span className="detail-value">{formatDate(validUntil)}</span>
                </div>
                {documentType && (
                  <div className="detail-row">
                    <span className="detail-label">Document Type:</span>
                    <span className="detail-value">{documentType}</span>
                  </div>
                )}
                {issuingCountry && (
                  <div className="detail-row">
                    <span className="detail-label">Issuing Country:</span>
                    <span className="detail-value">{issuingCountry}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="certificate-footer">
              <div className="certificate-seal">
                <div className="seal-inner">
                  <span className="seal-icon">✓</span>
                  <span className="seal-text">VERIFIED</span>
                </div>
              </div>

              <div className="certificate-number">
                <span className="number-label">Certificate No:</span>
                <span className="number-value">{certificateNumber}</span>
              </div>

              <div className="certificate-qr">
                <div className="qr-box">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={80}
                    level="M"
                    includeMargin={false}
                    bgColor="transparent"
                    fgColor="#1f2937"
                  />
                </div>
                <span className="qr-label">Scan to verify</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="certificate-decoration top-left"></div>
            <div className="certificate-decoration top-right"></div>
            <div className="certificate-decoration bottom-left"></div>
            <div className="certificate-decoration bottom-right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
