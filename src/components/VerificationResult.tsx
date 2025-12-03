import React from 'react';

interface VerificationResultProps {
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
    };
    extractedData: {
      fullName?: string;
      dateOfBirth?: string;
      documentNumber?: string;
      expiryDate?: string;
      issuingCountry?: string;
    };
    flags: string[];
    warnings: string[];
  };
}

export const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return '#10b981';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HIGH':
        return '#ef4444';
      case 'CRITICAL':
        return '#dc2626';
      default:
        return '#6b7280';
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

  return (
    <div className="verification-result">
      <div className={`result-header ${result.passed ? 'success' : 'failure'}`}>
        <div className="result-icon">
          {result.passed ? '✓' : '✗'}
        </div>
        <h2>{result.passed ? 'Verification Successful' : 'Verification Failed'}</h2>
        <p className="result-message">
          {result.passed
            ? 'Your identity has been successfully verified.'
            : 'We were unable to verify your identity. Please try again or contact support.'}
        </p>
      </div>

      <div className="result-details">
        <div className="detail-card">
          <h3>Verification Score</h3>
          <div className="score-display">
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={getRiskColor(result.riskLevel)}
                  strokeWidth="8"
                  strokeDasharray={`${result.score * 251.2} 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="score-text">{Math.round(result.score * 100)}%</div>
            </div>
            <div className="risk-level" style={{ color: getRiskColor(result.riskLevel) }}>
              Risk Level: {result.riskLevel}
            </div>
          </div>
        </div>

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
                <span>
                  Face Match
                  {result.checks.faceMatchScore && (
                    <span className="score-badge">
                      {Math.round(result.checks.faceMatchScore * 100)}%
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-card">
          <h3>Extracted Information</h3>
          <div className="extracted-data">
            {result.extractedData.fullName && (
              <div className="data-row">
                <span className="data-label">Full Name:</span>
                <span className="data-value">{result.extractedData.fullName}</span>
              </div>
            )}
            {result.extractedData.dateOfBirth && (
              <div className="data-row">
                <span className="data-label">Date of Birth:</span>
                <span className="data-value">{formatDate(result.extractedData.dateOfBirth)}</span>
              </div>
            )}
            {result.extractedData.documentNumber && (
              <div className="data-row">
                <span className="data-label">Document Number:</span>
                <span className="data-value">{result.extractedData.documentNumber}</span>
              </div>
            )}
            {result.extractedData.expiryDate && (
              <div className="data-row">
                <span className="data-label">Expiry Date:</span>
                <span className="data-value">{formatDate(result.extractedData.expiryDate)}</span>
              </div>
            )}
            {result.extractedData.issuingCountry && (
              <div className="data-row">
                <span className="data-label">Issuing Country:</span>
                <span className="data-value">{result.extractedData.issuingCountry}</span>
              </div>
            )}
          </div>
        </div>

        {(result.flags.length > 0 || result.warnings.length > 0) && (
          <div className="detail-card alerts-card">
            <h3>Alerts</h3>
            {result.flags.length > 0 && (
              <div className="flags">
                <h4>Flags:</h4>
                <ul>
                  {result.flags.map((flag, index) => (
                    <li key={index} className="flag-item">
                      {flag.replace(/_/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.warnings.length > 0 && (
              <div className="warnings">
                <h4>Warnings:</h4>
                <ul>
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="warning-item">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="result-actions">
        {result.passed ? (
          <>
            <button className="btn-primary" onClick={() => window.print()}>
              Print
            </button>
            <button className="btn-secondary" onClick={() => window.close()}>
              Close
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Start New Verification
          </button>
        )}
      </div>
    </div>
  );
};
