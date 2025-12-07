import React, { useState, useEffect } from 'react';
import { DocumentCapture } from './DocumentCapture';
import { SelfieCapture } from './SelfieCapture';
import { VerificationResult } from './VerificationResult';
import { getApiUrl, getAssetUrl } from '../config/api';

interface VerificationStep {
  step: 'document' | 'selfie' | 'processing' | 'complete';
  data?: any;
}

interface PartnerInfo {
  companyName: string;
  logoUrl?: string;
}

interface VerificationInfo {
  userName?: string;
  userEmail?: string;
  partnerId?: string;
  status?: string;
}

interface VerificationStatus {
  isCompleted: boolean;
  status: string;
  message: string;
}

export const IDVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VerificationStep>({ step: 'document' });
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [verificationInfo, setVerificationInfo] = useState<VerificationInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);

  useEffect(() => {
    loadVerificationInfo();
  }, []);

  const loadVerificationInfo = async () => {
    const params = new URLSearchParams(window.location.search);
    const verificationIdParam = params.get('verificationId');

    if (verificationIdParam) {
      try {
        const response = await fetch(getApiUrl(`/api/verifications/${verificationIdParam}`));
        console.log('Verification info response:', response);
                console.log('Verification info response:', response);
        

        if (response.ok) {
          const data = await response.json();
          const verification = data.data;
        
          console.log('Verification info attempts:', verification.retryCount);
          console.log('Verification info maxAttempts:', verification.maxRetries);
          // Check if verification is already completed or failed
          if (verification.status === 'COMPLETED') {
            setVerificationStatus({
              isCompleted: true,
              status: 'COMPLETED',
              message: 'This verification has already been completed successfully. No further action is required.'
            });
            return;
          }

          if (verification.status === 'FAILED' && verification.retryCount >= verification.maxRetries) {
            setVerificationStatus({
              isCompleted: true,
              status: 'FAILED',
              message: 'This verification has failed. Please contact the organization that requested this verification for a new link.'
            });
            return;
          }

          if (verification.status === 'EXPIRED') {
            setVerificationStatus({
              isCompleted: true,
              status: 'EXPIRED',
              message: 'This verification link has expired. Please contact the organization that requested this verification for a new link.'
            });
            return;
          }

          // Set the verification ID from URL parameter
          setVerificationId(verificationIdParam);

          // Store verification info
          setVerificationInfo({
            userName: verification.userName,
            userEmail: verification.userEmail,
            partnerId: verification.partnerId,
            status: verification.status
          });

          // Load partner info if verification has partnerId
          if (verification.partnerId) {
            const partnerResponse = await fetch(
              getApiUrl(`/api/partners/${verification.partnerId}/public`)
            );
            if (partnerResponse.ok) {
              const partnerData = await partnerResponse.json();
              setPartnerInfo({
                companyName: partnerData.data.companyName,
                logoUrl: partnerData.data.logoUrl
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to load verification info:', error);
      }
    }
  };

  // Get API key from URL query parameter
  const getApiKey = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('apiKey');
  };

  const handleDocumentCaptured = async (file: File, documentType: string) => {
    try {
      const apiKey = getApiKey();
      let currentVerificationId = verificationId;

      // Only create a new verification if we don't have one from the URL
      if (!currentVerificationId) {
        const url = apiKey ? `/api/verifications?apiKey=${apiKey}` : '/api/verifications';

        const createResponse = await fetch(getApiUrl(url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'IDENTITY',
            metadata: { source: 'web' }
          })
        });

        const createData = await createResponse.json();
        currentVerificationId = createData.data.id;
        setVerificationId(currentVerificationId);
      }

      // Upload document to the verification (existing or newly created)
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('side', 'FRONT');

      const uploadUrl = apiKey
        ? `/api/verifications/${currentVerificationId}/documents?apiKey=${apiKey}`
        : `/api/verifications/${currentVerificationId}/documents`;

      const uploadResponse = await fetch(getApiUrl(uploadUrl), {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      setCurrentStep({ step: 'selfie', data: uploadData.data });
    } catch (error) {
      console.error('Document upload failed:', error);
    }
  };

  const handleSelfieCaptured = async (file: File) => {
    try {
      if (!verificationId) return;

      setCurrentStep({ step: 'processing' });

      const formData = new FormData();
      formData.append('selfie', file);

      const apiKey = getApiKey();
      const selfieUrl = apiKey
        ? `/api/verifications/${verificationId}/selfie?apiKey=${apiKey}`
        : `/api/verifications/${verificationId}/selfie`;

      await fetch(getApiUrl(selfieUrl), {
        method: 'POST',
        body: formData
      });

      const submitUrl = apiKey
        ? `/api/verifications/${verificationId}/submit?apiKey=${apiKey}`
        : `/api/verifications/${verificationId}/submit`;

      const submitResponse = await fetch(getApiUrl(submitUrl), { method: 'POST' });

      const submitData = await submitResponse.json();

      // Check for retry limit error
      if (!submitResponse.ok && submitResponse.status === 429) {
        setError(submitData.message || 'Maximum retry limit reached. Please contact the organization for a new verification link.');
        setCurrentStep({ step: 'document' });
        return;
      }

      if (!submitResponse.ok) {
        setError(submitData.error || 'Verification failed. Please try again.');
        setCurrentStep({ step: 'document' });
        return;
      }

      setResult(submitData.data);
      setCurrentStep({ step: 'complete', data: submitData.data });
    } catch (error) {
      console.error('Selfie upload failed:', error);
      setError('An error occurred during verification. Please try again.');
      setCurrentStep({ step: 'document' });
    }
  };

  return (
    <div className="id-verification-container">
      {partnerInfo && (
        <div className="partner-brand-header">
          {partnerInfo.logoUrl && (
            <img
              src={getAssetUrl(partnerInfo.logoUrl)}
              alt={partnerInfo.companyName}
              className="partner-brand-logo"
            />
          )}
          <div className="partner-brand-text">
            <span className="verification-for">Verification requested by</span>
            <span className="partner-brand-name">{partnerInfo.companyName}</span>
          </div>
        </div>
      )}

      <div className="verification-header">
        <h1>Identity Verification</h1>

        {/* Welcome Message */}
        {(verificationInfo?.userName || partnerInfo?.companyName) && (
          <div className="welcome-message">
            {verificationInfo?.userName && (
              <p className="greeting">
                Hello <strong>{verificationInfo.userName}</strong>!
              </p>
            )}
            {partnerInfo?.companyName && (
              <p className="request-info">
                <strong>{partnerInfo.companyName}</strong> has requested you to complete an identity verification.
                Please follow the steps below to verify your identity securely.
              </p>
            )}
          </div>
        )}

        <div className="progress-bar">
          <div
            className={`step ${currentStep.step === 'document' ? 'active' : 'completed'}`}
          >
            Document
          </div>
          <div
            className={`step ${currentStep.step === 'selfie' ? 'active' : currentStep.step === 'complete' ? 'completed' : ''}`}
          >
            Selfie
          </div>
          <div
            className={`step ${currentStep.step === 'complete' ? 'active' : ''}`}
          >
            Complete
          </div>
        </div>
      </div>

      <div className="verification-content">
        {/* Show status message if verification is already completed/failed/expired */}
        {verificationStatus?.isCompleted ? (
          <div className={`verification-status-message status-${verificationStatus.status.toLowerCase()}`}>
            <div className="status-icon">
              {verificationStatus.status === 'COMPLETED' && (
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              )}
              {verificationStatus.status === 'FAILED' && (
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              )}
              {verificationStatus.status === 'EXPIRED' && (
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              )}
            </div>
            <h2>
              {verificationStatus.status === 'COMPLETED' && 'Verification Already Completed'}
              {verificationStatus.status === 'FAILED' && 'Verification Failed'}
              {verificationStatus.status === 'EXPIRED' && 'Verification Expired'}
            </h2>
            <p>{verificationStatus.message}</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="verification-error-alert">
                <div className="error-icon">!</div>
                <div className="error-content">
                  <h3>Verification Error</h3>
                  <p>{error}</p>
                </div>
                <button className="btn-secondary" onClick={() => setError('')}>
                  Dismiss
                </button>
              </div>
            )}

            {currentStep.step === 'document' && (
              <DocumentCapture onCapture={handleDocumentCaptured} />
            )}

            {currentStep.step === 'selfie' && (
              <SelfieCapture
                onCapture={handleSelfieCaptured}
                onBack={() => {
                  setVerificationId(null);
                  setCurrentStep({ step: 'document' });
                }}
              />
            )}

            {currentStep.step === 'processing' && (
              <div className="processing-screen">
                <div className="spinner" />
                <p>Verifying your identity...</p>
              </div>
            )}

            {currentStep.step === 'complete' && result && (
              <VerificationResult
                result={result}
                onRetry={() => {
                  // Reset to document capture step for retry
                  // Keep the same verificationId to use the existing verification
                  setCurrentStep({ step: 'document' });
                  setResult(null);
                  setError('');
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
