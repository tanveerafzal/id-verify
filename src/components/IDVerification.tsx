import React, { useState, useEffect } from 'react';
import { DocumentCapture } from './DocumentCapture';
import { SelfieCapture } from './SelfieCapture';
import { VerificationResult } from './VerificationResult';
import { getApiUrl, getAssetUrl } from '../config/api';

interface VerificationStep {
  step: 'document' | 'document-processing' | 'selfie' | 'selfie-processing' | 'processing' | 'complete';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [detectedDocumentType, setDetectedDocumentType] = useState<string | null>(null);

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
          console.log('Verification data loaded:', { userName: verification.userName, fullName: verification.fullName, userEmail: verification.userEmail, status: verification.status });
          console.log('Verification data :', { data: data});
          // Check if verification is already completed or failed
          if (verification.status === 'COMPLETED') {
            setVerificationStatus({
              isCompleted: true,
              status: 'COMPLETED',
              message: 'This verification has already been completed successfully. No further action is required.'
            });
            setIsLoading(false);
            return;
          }

          if (verification.status === 'FAILED' && verification.retryCount >= verification.maxRetries) {
            setVerificationStatus({
              isCompleted: true,
              status: 'FAILED',
              message: 'This verification has failed. Please contact the organization that requested this verification for a new link.'
            });
            setIsLoading(false);
            return;
          }

          if (verification.status === 'EXPIRED') {
            setVerificationStatus({
              isCompleted: true,
              status: 'EXPIRED',
              message: 'This verification link has expired. Please contact the organization that requested this verification for a new link.'
            });
            setIsLoading(false);
            return;
          }

          // Set the verification ID from URL parameter
          setVerificationId(verificationIdParam);

          // Store verification info (check both userName and fullName fields)
          setVerificationInfo({
            userName: verification.userName || verification.fullName,
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
    setIsLoading(false);
  };

  // Get API key from URL query parameter
  const getApiKey = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('apiKey');
  };

  // Convert technical error messages to user-friendly messages
  const getUserFriendlyError = (errorMessage: string): string => {
    const errorLower = errorMessage.toLowerCase();

    // OCR/Document reading errors
    if (errorLower.includes('ocr') || errorLower.includes('recognize') || errorLower.includes('extraction failed')) {
      return 'We couldn\'t read your document clearly. Please ensure good lighting and that the entire document is visible, then try again.';
    }

    // Image quality errors
    if (errorLower.includes('blur') || errorLower.includes('blurry')) {
      return 'The image appears to be blurry. Please hold your camera steady and ensure the document is in focus.';
    }

    if (errorLower.includes('glare') || errorLower.includes('reflection')) {
      return 'There seems to be glare on the document. Please adjust the lighting and avoid reflections.';
    }

    // Document detection errors
    if (errorLower.includes('no document') || errorLower.includes('document not found') || errorLower.includes('could not detect')) {
      return 'We couldn\'t detect a document in the image. Please make sure your ID document is clearly visible in the frame.';
    }

    // File/upload errors
    if (errorLower.includes('file') || errorLower.includes('upload') || errorLower.includes('size')) {
      return 'There was a problem with the image file. Please try taking a new photo or uploading a different image.';
    }

    // Network/server errors
    if (errorLower.includes('network') || errorLower.includes('timeout') || errorLower.includes('connection')) {
      return 'Connection issue detected. Please check your internet connection and try again.';
    }

    // Face matching errors
    if (errorLower.includes('face') && errorLower.includes('match')) {
      return 'We couldn\'t match your selfie with the photo on your document. Please ensure both images clearly show your face.';
    }

    // Generic fallback
    return 'We encountered an issue processing your document. Please try again with a clear, well-lit photo of your ID.';
  };

  const handleDocumentCaptured = async (file: File, documentType: string) => {
    // Clear any previous error when user retries
    setError('');

    try {
      // Show document processing screen immediately
      setCurrentStep({ step: 'document-processing' });

      const apiKey = getApiKey();
      let currentVerificationId = verificationId;

      // Store the user-selected document type
      setSelectedDocumentType(documentType);

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

      // Check for errors
      if (!uploadResponse.ok) {
        const friendlyError = getUserFriendlyError(uploadData.error || '');
        setError(friendlyError);
        setCurrentStep({ step: 'document' });
        return;
      }

      // Store the detected document type from the response
      if (uploadData.data?.detection?.detectedType) {
        setDetectedDocumentType(uploadData.data.detection.detectedType);
      } else if (uploadData.data?.documentType) {
        setDetectedDocumentType(uploadData.data.documentType);
      }

      setCurrentStep({ step: 'selfie', data: uploadData.data });
    } catch (error) {
      console.error('Document upload failed:', error);
      setError('An error occurred while processing your document. Please try again.');
      setCurrentStep({ step: 'document' });
    }
  };

  const handleSelfieCaptured = async (file: File) => {
    // Clear any previous error when user retries
    setError('');

    try {
      if (!verificationId) return;

      // Show selfie processing screen immediately
      setCurrentStep({ step: 'selfie-processing' });

      const formData = new FormData();
      formData.append('selfie', file);

      const apiKey = getApiKey();
      const selfieUrl = apiKey
        ? `/api/verifications/${verificationId}/selfie?apiKey=${apiKey}`
        : `/api/verifications/${verificationId}/selfie`;

      const selfieResponse = await fetch(getApiUrl(selfieUrl), {
        method: 'POST',
        body: formData
      });

      // Check for selfie upload errors
      if (!selfieResponse.ok) {
        const selfieData = await selfieResponse.json();
        const friendlyError = getUserFriendlyError(selfieData.error || '');
        setError(friendlyError);
        setCurrentStep({ step: 'selfie' });
        return;
      }

      // Switch to final processing screen
      setCurrentStep({ step: 'processing' });

      const submitUrl = apiKey
        ? `/api/verifications/${verificationId}/submit?apiKey=${apiKey}`
        : `/api/verifications/${verificationId}/submit`;

      const submitResponse = await fetch(getApiUrl(submitUrl), { method: 'POST' });
      console.log('Submit response', submitResponse);

      const submitData = await submitResponse.json();

      // Check for retry limit error
      if (!submitResponse.ok && submitResponse.status === 429) {
        setError(submitData.message || 'Maximum retry limit reached. Please contact the organization for a new verification link.');
        setCurrentStep({ step: 'document' });
        return;
      }

      // If the response contains a valid result (even if verification failed), show the result page
      // This handles cases like face match failure where verification was processed but didn't pass
      if (submitData.data && typeof submitData.data.passed !== 'undefined') {
        console.log('response contains a valid result');
        setResult(submitData.data);
        setCurrentStep({ step: 'complete', data: submitData.data });
        return;
      }

      // If response is not OK but has data, still show the result page with the data
      if (!submitResponse.ok && submitData.data) {
        console.log('Response not OK but has data, showing result page');
        setResult(submitData.data);
        setCurrentStep({ step: 'complete', data: submitData.data });
        return;
      }

      // Only show error on first page if there's no valid result at all (e.g., server error)
      if (!submitResponse.ok) {
        const friendlyError = getUserFriendlyError(submitData.error || '');
        setError(friendlyError);
        setCurrentStep({ step: 'document' });
        return;
      }

      setResult(submitData.data);
      setCurrentStep({ step: 'complete', data: submitData.data });
    } catch (error) {
      console.error('Selfie upload failed:', error);
      setError('An error occurred during verification. Please try again.');
      setCurrentStep({ step: 'selfie' });
    }
  };

  // Show loading spinner while checking verification status
  if (isLoading) {
    return (
      <div className="id-verification-container">
        <div className="verification-content">
          <div className="processing-screen">
            <div className="spinner" />
            <p>Loading verification...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {verificationInfo?.userName && (
          <p className="user-greeting">Hello, <strong>{verificationInfo.userName}</strong></p>
        )}
        <h1>Identity Verification</h1>

        {/* Welcome Message */}
        {partnerInfo?.companyName && (
          <div className="welcome-message">
            <p className="request-info">
              <strong>{partnerInfo.companyName}</strong> has requested you to complete an identity verification.
              Please follow the steps below to verify your identity securely.
            </p>
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

            {currentStep.step === 'document-processing' && (
              <div className="document-processing-screen">
                <div className="ai-processing-animation">
                  <div className="ai-brain">
                    <svg viewBox="0 0 100 100" className="ai-brain-svg">
                      {/* Brain/AI icon */}
                      <defs>
                        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                      {/* Central circle */}
                      <circle cx="50" cy="50" r="30" fill="none" stroke="url(#aiGradient)" strokeWidth="2" className="pulse-ring" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="url(#aiGradient)" strokeWidth="2" className="pulse-ring delay-1" />
                      <circle cx="50" cy="50" r="10" fill="url(#aiGradient)" className="center-dot" />
                      {/* Connection nodes */}
                      <circle cx="50" cy="15" r="4" fill="#667eea" className="node node-1" />
                      <circle cx="85" cy="50" r="4" fill="#764ba2" className="node node-2" />
                      <circle cx="50" cy="85" r="4" fill="#667eea" className="node node-3" />
                      <circle cx="15" cy="50" r="4" fill="#764ba2" className="node node-4" />
                      <circle cx="78" cy="22" r="3" fill="#667eea" className="node node-5" />
                      <circle cx="78" cy="78" r="3" fill="#764ba2" className="node node-6" />
                      <circle cx="22" cy="78" r="3" fill="#667eea" className="node node-7" />
                      <circle cx="22" cy="22" r="3" fill="#764ba2" className="node node-8" />
                      {/* Connection lines */}
                      <line x1="50" y1="20" x2="50" y2="40" stroke="#667eea" strokeWidth="1" className="connection" />
                      <line x1="60" y1="50" x2="80" y2="50" stroke="#764ba2" strokeWidth="1" className="connection delay-1" />
                      <line x1="50" y1="60" x2="50" y2="80" stroke="#667eea" strokeWidth="1" className="connection delay-2" />
                      <line x1="40" y1="50" x2="20" y2="50" stroke="#764ba2" strokeWidth="1" className="connection delay-3" />
                    </svg>
                  </div>
                  <div className="scanning-line"></div>
                </div>
                <div className="processing-text">
                  <h2>Analyzing Your Document</h2>
                  <p>Please wait while our AI verifies your ID document...</p>
                  <div className="processing-steps">
                    <div className="processing-step active">
                      <span className="step-icon">🔍</span>
                      <span className="step-text">Detecting document type</span>
                    </div>
                    <div className="processing-step">
                      <span className="step-icon">📄</span>
                      <span className="step-text">Extracting information</span>
                    </div>
                    <div className="processing-step">
                      <span className="step-icon">✓</span>
                      <span className="step-text">Validating authenticity</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep.step === 'selfie' && (
              <SelfieCapture
                onCapture={handleSelfieCaptured}
                onBack={() => {
                  // Keep verificationId to reuse the same verification
                  // Documents will be replaced when user uploads a new one
                  setCurrentStep({ step: 'document' });
                }}
                selectedDocumentType={selectedDocumentType}
                detectedDocumentType={detectedDocumentType}
              />
            )}

            {currentStep.step === 'selfie-processing' && (
              <div className="document-processing-screen">
                <div className="ai-processing-animation">
                  <div className="ai-brain">
                    <svg viewBox="0 0 100 100" className="ai-brain-svg">
                      {/* Brain/AI icon */}
                      <defs>
                        <linearGradient id="aiGradientSelfie" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                      {/* Central circle */}
                      <circle cx="50" cy="50" r="30" fill="none" stroke="url(#aiGradientSelfie)" strokeWidth="2" className="pulse-ring" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="url(#aiGradientSelfie)" strokeWidth="2" className="pulse-ring delay-1" />
                      <circle cx="50" cy="50" r="10" fill="url(#aiGradientSelfie)" className="center-dot" />
                      {/* Connection nodes */}
                      <circle cx="50" cy="15" r="4" fill="#667eea" className="node node-1" />
                      <circle cx="85" cy="50" r="4" fill="#764ba2" className="node node-2" />
                      <circle cx="50" cy="85" r="4" fill="#667eea" className="node node-3" />
                      <circle cx="15" cy="50" r="4" fill="#764ba2" className="node node-4" />
                      <circle cx="78" cy="22" r="3" fill="#667eea" className="node node-5" />
                      <circle cx="78" cy="78" r="3" fill="#764ba2" className="node node-6" />
                      <circle cx="22" cy="78" r="3" fill="#667eea" className="node node-7" />
                      <circle cx="22" cy="22" r="3" fill="#764ba2" className="node node-8" />
                      {/* Connection lines */}
                      <line x1="50" y1="20" x2="50" y2="40" stroke="#667eea" strokeWidth="1" className="connection" />
                      <line x1="60" y1="50" x2="80" y2="50" stroke="#764ba2" strokeWidth="1" className="connection delay-1" />
                      <line x1="50" y1="60" x2="50" y2="80" stroke="#667eea" strokeWidth="1" className="connection delay-2" />
                      <line x1="40" y1="50" x2="20" y2="50" stroke="#764ba2" strokeWidth="1" className="connection delay-3" />
                    </svg>
                  </div>
                  <div className="scanning-line"></div>
                </div>
                <div className="processing-text">
                  <h2>Analyzing Your Selfie</h2>
                  <p>Please wait while our AI processes your photo...</p>
                  <div className="processing-steps">
                    <div className="processing-step active">
                      <span className="step-icon">📷</span>
                      <span className="step-text">Processing selfie</span>
                    </div>
                    <div className="processing-step">
                      <span className="step-icon">👤</span>
                      <span className="step-text">Detecting face</span>
                    </div>
                    <div className="processing-step">
                      <span className="step-icon">🔒</span>
                      <span className="step-text">Performing liveness check</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep.step === 'processing' && (
              <div className="document-processing-screen">
                <div className="ai-processing-animation">
                  <div className="ai-brain">
                    <svg viewBox="0 0 100 100" className="ai-brain-svg">
                      {/* Brain/AI icon */}
                      <defs>
                        <linearGradient id="aiGradientFinal" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                      </defs>
                      {/* Central circle */}
                      <circle cx="50" cy="50" r="30" fill="none" stroke="url(#aiGradientFinal)" strokeWidth="2" className="pulse-ring" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="url(#aiGradientFinal)" strokeWidth="2" className="pulse-ring delay-1" />
                      <circle cx="50" cy="50" r="10" fill="url(#aiGradientFinal)" className="center-dot" />
                      {/* Connection nodes */}
                      <circle cx="50" cy="15" r="4" fill="#667eea" className="node node-1" />
                      <circle cx="85" cy="50" r="4" fill="#764ba2" className="node node-2" />
                      <circle cx="50" cy="85" r="4" fill="#667eea" className="node node-3" />
                      <circle cx="15" cy="50" r="4" fill="#764ba2" className="node node-4" />
                      <circle cx="78" cy="22" r="3" fill="#667eea" className="node node-5" />
                      <circle cx="78" cy="78" r="3" fill="#764ba2" className="node node-6" />
                      <circle cx="22" cy="78" r="3" fill="#667eea" className="node node-7" />
                      <circle cx="22" cy="22" r="3" fill="#764ba2" className="node node-8" />
                      {/* Connection lines */}
                      <line x1="50" y1="20" x2="50" y2="40" stroke="#667eea" strokeWidth="1" className="connection" />
                      <line x1="60" y1="50" x2="80" y2="50" stroke="#764ba2" strokeWidth="1" className="connection delay-1" />
                      <line x1="50" y1="60" x2="50" y2="80" stroke="#667eea" strokeWidth="1" className="connection delay-2" />
                      <line x1="40" y1="50" x2="20" y2="50" stroke="#764ba2" strokeWidth="1" className="connection delay-3" />
                    </svg>
                  </div>
                  <div className="scanning-line"></div>
                </div>
                <div className="processing-text">
                  <h2>Completing Verification</h2>
                  <p>Please wait while we finalize your identity verification...</p>
                  <div className="processing-steps">
                    <div className="processing-step active">
                      <span className="step-icon">🔄</span>
                      <span className="step-text">Comparing document and selfie</span>
                    </div>
                    <div className="processing-step">
                      <span className="step-icon">✓</span>
                      <span className="step-text">Generating verification result</span>
                    </div>
                  </div>
                </div>
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
