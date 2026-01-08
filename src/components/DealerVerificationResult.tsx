import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DealerVerificationResultProps {
  result: {
    passed: boolean;
    score: number;
    riskLevel: string;
    checks: {
      documentAuthentic: boolean;
      documentExpired: boolean;
      documentTampered: boolean;
      faceMatch?: boolean;
      faceMatchScore?: number;
      nameMatch?: boolean;
      nameMatchScore?: number;
    };
    extractedData: {
      fullName?: string;
      dateOfBirth?: string;
      documentNumber?: string;
      expiryDate?: string;
      issuingCountry?: string;
      address?: string;
    };
    flags: string[];
    warnings: string[];
    canRetry?: boolean;
    remainingRetries?: number;
    retryCount?: number;
    maxRetries?: number;
    message?: string;
  };
  onRetry?: () => void;
  userInfo?: {
    fullName?: string;
    email?: string;
  };
  verificationId?: string;
  partnerName?: string;
}

export const DealerVerificationResult: React.FC<DealerVerificationResultProps> = ({
  result,
  onRetry,
  userInfo,
  verificationId,
  partnerName
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getValidUntilDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate verification URL for QR code
  const verificationUrl = verificationId
    ? `${window.location.origin}/certificate/verify/${verificationId}`
    : '';

  const downloadAsImage = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `verification-certificate-${verificationId || 'dealer'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download certificate as image. Please try again.');
    }
  };

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`verification-certificate-${verificationId || 'dealer'}.pdf`);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download certificate as PDF. Please try again.');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      case 'CRITICAL': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // If verification failed, show failure screen with retry option
  if (!result.passed) {
    return (
      <div className="dealer-verification-result">
        <div className="result-header failure">
          <div className="result-icon">✗</div>
          <h2>Verification Failed</h2>
          <p className="result-message">
            {result.message || 'We were unable to verify your identity. Please try again or contact support.'}
          </p>
          {result.canRetry && result.remainingRetries !== undefined && (
            <p className="retry-info">
              You have <strong>{result.remainingRetries}</strong> attempt{result.remainingRetries !== 1 ? 's' : ''} remaining.
            </p>
          )}
        </div>

        <div className="result-details">
          <div className="detail-card">
            <h3>Verification Checks</h3>
            <div className="checks-list">
              <div className={`check-item ${result.checks.documentAuthentic ? 'pass' : 'fail'}`}>
                <span className="check-icon">{result.checks.documentAuthentic ? '✓' : '✗'}</span>
                <span>Document Authenticity</span>
              </div>
              <div className={`check-item ${!result.checks.documentExpired ? 'pass' : 'fail'}`}>
                <span className="check-icon">{!result.checks.documentExpired ? '✓' : '✗'}</span>
                <span>Document Not Expired</span>
              </div>
              <div className={`check-item ${!result.checks.documentTampered ? 'pass' : 'fail'}`}>
                <span className="check-icon">{!result.checks.documentTampered ? '✓' : '✗'}</span>
                <span>No Tampering Detected</span>
              </div>
              {result.checks.faceMatch !== undefined && (
                <div className={`check-item ${result.checks.faceMatch ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{result.checks.faceMatch ? '✓' : '✗'}</span>
                  <span>Face Match</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="result-actions">
          {result.canRetry && onRetry && (
            <Button onClick={onRetry}>Retry Verification</Button>
          )}
          <Button variant="secondary" onClick={() => window.close()}>Close</Button>
        </div>
      </div>
    );
  }

  // Show certificate for successful verification
  return (
    <div className="dealer-verification-result">
      <div className="result-header success">
        <div className="result-icon">✓</div>
        <h2>Verification Successful</h2>
        <p className="result-message">
          Your driver's license has been successfully verified.
        </p>
      </div>

      {/* Certificate */}
      <div className="certificate-wrapper">
        <div ref={certificateRef} className="dealer-certificate">
          <div className="certificate-border">
            <div className="certificate-inner">
              {/* Header */}
              <div className="certificate-header">
                <div className="certificate-logo">
                  <div className="logo-icon">✓</div>
                </div>
                <h1>Driver's License Verification Certificate</h1>
                <div className="certificate-subtitle">
                  {partnerName ? `Verified for ${partnerName}` : 'Test Drive Verification'}
                </div>
              </div>

              {/* Validity Badge */}
              <div className="validity-badge valid">VERIFIED</div>

              {/* Main Content */}
              <div className="certificate-body">
                <p className="certificate-statement">This is to certify that</p>
                <h2 className="certificate-name">
                  {result.extractedData.fullName || userInfo?.fullName || 'N/A'}
                </h2>
                <p className="certificate-statement">
                  has presented a valid driver's license and successfully completed identity verification
                </p>

                {/* Verification Details */}
                <div className="certificate-details">
                  <div className="details-grid">
                    <div className="detail-row">
                      <span className="detail-label">Verification Date:</span>
                      <span className="detail-value">{getCurrentDate()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Valid Until:</span>
                      <span className="detail-value">{getValidUntilDate()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Document Type:</span>
                      <span className="detail-value">Driver's License</span>
                    </div>
                    {result.extractedData.documentNumber && (
                      <div className="detail-row">
                        <span className="detail-label">License Number:</span>
                        <span className="detail-value">{result.extractedData.documentNumber}</span>
                      </div>
                    )}
                    {result.extractedData.expiryDate && (
                      <div className="detail-row">
                        <span className="detail-label">License Expiry:</span>
                        <span className="detail-value">{formatDate(result.extractedData.expiryDate)}</span>
                      </div>
                    )}
                    {result.extractedData.issuingCountry && (
                      <div className="detail-row">
                        <span className="detail-label">Issuing State/Country:</span>
                        <span className="detail-value">{result.extractedData.issuingCountry}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Score */}
                <div className="verification-score">
                  <div className="score-label">Verification Score</div>
                  <div className="score-value" style={{ color: getRiskColor(result.riskLevel) }}>
                    {Math.round(result.score * 100)}%
                  </div>
                  <div className="risk-level">
                    Risk Level: <span style={{ color: getRiskColor(result.riskLevel) }}>{result.riskLevel}</span>
                  </div>
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

                {verificationId && (
                  <div className="certificate-number">
                    <span className="number-label">Certificate ID:</span>
                    <span className="number-value">{verificationId.substring(0, 16)}...</span>
                  </div>
                )}

                {verificationUrl && (
                  <div className="certificate-qr">
                    <div className="qr-box">
                      <QRCodeSVG
                        value={verificationUrl}
                        size={70}
                        level="M"
                        includeMargin={false}
                        bgColor="transparent"
                        fgColor="#1f2937"
                      />
                    </div>
                    <span className="qr-label">Scan to verify</span>
                  </div>
                )}
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

      {/* Download Options */}
      <div className="download-options">
        <h3>Download Certificate</h3>
        <div className="download-buttons">
          <Button onClick={downloadAsImage} className="download-btn">
            <span className="btn-icon">🖼️</span>
            Download as Image
          </Button>
          <Button onClick={downloadAsPDF} className="download-btn">
            <span className="btn-icon">📄</span>
            Download as PDF
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="result-actions">
        <Button variant="secondary" onClick={() => window.print()}>
          Print Certificate
        </Button>
        <Button variant="secondary" onClick={() => window.close()}>
          Close
        </Button>
      </div>
    </div>
  );
};
