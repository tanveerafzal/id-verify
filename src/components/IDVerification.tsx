import React, { useState, useEffect } from 'react';
import { DocumentCapture } from './DocumentCapture';
import { SelfieCapture } from './SelfieCapture';
import { VerificationResult } from './VerificationResult';
import { getApiUrl } from '../config/api';

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
}

export const IDVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VerificationStep>({ step: 'document' });
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [verificationInfo, setVerificationInfo] = useState<VerificationInfo | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadVerificationInfo();
  }, []);

  const loadVerificationInfo = async () => {
    const params = new URLSearchParams(window.location.search);
    const verificationIdParam = params.get('verificationId');

    if (verificationIdParam) {
      try {
        const response = await fetch(getApiUrl(`/api/verifications/${verificationIdParam}`));
        if (response.ok) {
          const data = await response.json();
          const verification = data.data;

          // Store verification info
          setVerificationInfo({
            userName: verification.userName,
            userEmail: verification.userEmail,
            partnerId: verification.partnerId
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
      if (!verificationId) {
        const apiKey = getApiKey();
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
        setVerificationId(createData.data.id);

        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);
        formData.append('side', 'FRONT');

        const uploadUrl = apiKey
          ? `/api/verifications/${createData.data.id}/documents?apiKey=${apiKey}`
          : `/api/verifications/${createData.data.id}/documents`;

        const uploadResponse = await fetch(getApiUrl(uploadUrl), {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadResponse.json();
        setCurrentStep({ step: 'selfie', data: uploadData.data });
      }
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
              src={partnerInfo.logoUrl}
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
        {error && (
          <div className="verification-error-alert">
            <div className="error-icon">⚠️</div>
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
          <SelfieCapture onCapture={handleSelfieCaptured} />
        )}

        {currentStep.step === 'processing' && (
          <div className="processing-screen">
            <div className="spinner" />
            <p>Verifying your identity...</p>
          </div>
        )}

        {currentStep.step === 'complete' && result && (
          <VerificationResult result={result} />
        )}
      </div>
    </div>
  );
};
