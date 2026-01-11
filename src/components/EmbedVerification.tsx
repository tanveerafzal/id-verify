import React, { useState, useEffect } from 'react';
import { DocumentCapture } from './DocumentCapture';
import { SelfieCapture } from './SelfieCapture';
import { getApiUrl, getAssetUrl } from '../config/api';
import { Button } from '@/components/ui/button';

interface VerificationStep {
  step: 'document' | 'document-processing' | 'selfie' | 'selfie-processing' | 'processing' | 'complete';
  data?: any;
}

interface PartnerInfo {
  companyName: string;
  logoUrl?: string;
}

interface EmbedConfig {
  apiKey: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  theme?: 'light' | 'dark';
  allowedDocumentTypes?: string[];
  showBranding?: boolean;
}

// Notify parent window of events
const notifyParent = (event: string, data?: any) => {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'TRUSTCREDO_EVENT',
      event,
      data,
      timestamp: new Date().toISOString()
    }, '*');
  }
};

export const EmbedVerification: React.FC = () => {
  const [config, setConfig] = useState<EmbedConfig | null>(null);
  const [currentStep, setCurrentStep] = useState<VerificationStep>({ step: 'document' });
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [detectedDocumentType, setDetectedDocumentType] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();

    // Listen for messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TRUSTCREDO_COMMAND') {
        switch (event.data.command) {
          case 'close':
            notifyParent('close');
            break;
          case 'retry':
            setCurrentStep({ step: 'document' });
            setResult(null);
            setError('');
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const loadConfig = async () => {
    const params = new URLSearchParams(window.location.search);
    const apiKey = params.get('apiKey');

    if (!apiKey) {
      setError('Missing API key. Please provide a valid API key.');
      setIsLoading(false);
      notifyParent('error', { code: 'MISSING_API_KEY', message: 'API key is required' });
      return;
    }

    const embedConfig: EmbedConfig = {
      apiKey,
      userId: params.get('userId') || undefined,
      userEmail: params.get('userEmail') || undefined,
      userName: params.get('userName') || undefined,
      theme: (params.get('theme') as 'light' | 'dark') || 'light',
      allowedDocumentTypes: params.get('documentTypes')?.split(',') || undefined,
      showBranding: params.get('showBranding') !== 'false'
    };

    setConfig(embedConfig);

    try {
      // Validate API key and get partner info
      const response = await fetch(getApiUrl(`/api/partners/validate-key?apiKey=${apiKey}`));

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setPartnerInfo({
            companyName: data.data.companyName,
            logoUrl: data.data.logoUrl
          });
        }
      }

      // Create a new verification
      const createResponse = await fetch(getApiUrl(`/api/verifications?apiKey=${apiKey}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'IDENTITY',
          metadata: {
            source: 'embed-sdk',
            userId: embedConfig.userId,
            userEmail: embedConfig.userEmail,
            userName: embedConfig.userName
          },
          user: embedConfig.userEmail ? {
            email: embedConfig.userEmail,
            fullName: embedConfig.userName
          } : undefined
        })
      });

      if (!createResponse.ok) {
        throw new Error('Failed to initialize verification');
      }

      const createData = await createResponse.json();
      setVerificationId(createData.data.id);

      notifyParent('ready', { verificationId: createData.data.id });
    } catch (err) {
      console.error('Failed to initialize:', err);
      setError('Failed to initialize verification. Please check your API key.');
      notifyParent('error', { code: 'INIT_FAILED', message: 'Failed to initialize verification' });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserFriendlyError = (errorMessage: string): string => {
    const errorLower = errorMessage.toLowerCase();

    if (errorLower.includes('ocr') || errorLower.includes('recognize') || errorLower.includes('extraction failed')) {
      return 'We couldn\'t read your document clearly. Please ensure good lighting and that the entire document is visible.';
    }
    if (errorLower.includes('blur') || errorLower.includes('blurry')) {
      return 'The image appears to be blurry. Please hold your camera steady and ensure the document is in focus.';
    }
    if (errorLower.includes('glare') || errorLower.includes('reflection')) {
      return 'There seems to be glare on the document. Please adjust the lighting and avoid reflections.';
    }
    if (errorLower.includes('no document') || errorLower.includes('document not found')) {
      return 'We couldn\'t detect a document in the image. Please make sure your ID is clearly visible.';
    }
    if (errorLower.includes('face') && errorLower.includes('match')) {
      return 'We couldn\'t match your selfie with the photo on your document. Please try again.';
    }

    return 'We encountered an issue processing your document. Please try again.';
  };

  const handleDocumentCaptured = async (file: File, documentType: string) => {
    setError('');
    notifyParent('step_change', { step: 'document_processing' });

    try {
      setCurrentStep({ step: 'document-processing' });
      setSelectedDocumentType(documentType);

      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('side', 'FRONT');

      const uploadResponse = await fetch(
        getApiUrl(`/api/verifications/${verificationId}/documents?apiKey=${config?.apiKey}`),
        { method: 'POST', body: formData }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        const friendlyError = getUserFriendlyError(uploadData.error || '');
        setError(friendlyError);
        setCurrentStep({ step: 'document' });
        notifyParent('error', { code: 'DOCUMENT_UPLOAD_FAILED', message: friendlyError });
        return;
      }

      if (uploadData.data?.detection?.detectedType) {
        setDetectedDocumentType(uploadData.data.detection.detectedType);
      }

      notifyParent('step_change', { step: 'selfie' });
      setCurrentStep({ step: 'selfie', data: uploadData.data });
    } catch (error) {
      console.error('Document upload failed:', error);
      setError('An error occurred while processing your document. Please try again.');
      setCurrentStep({ step: 'document' });
      notifyParent('error', { code: 'DOCUMENT_UPLOAD_ERROR', message: 'Document upload failed' });
    }
  };

  const handleSelfieCaptured = async (file: File) => {
    setError('');
    notifyParent('step_change', { step: 'selfie_processing' });

    try {
      if (!verificationId) return;

      setCurrentStep({ step: 'selfie-processing' });

      const formData = new FormData();
      formData.append('selfie', file);

      const selfieResponse = await fetch(
        getApiUrl(`/api/verifications/${verificationId}/selfie?apiKey=${config?.apiKey}`),
        { method: 'POST', body: formData }
      );

      if (!selfieResponse.ok) {
        const selfieData = await selfieResponse.json();
        const friendlyError = getUserFriendlyError(selfieData.error || '');
        setError(friendlyError);
        setCurrentStep({ step: 'selfie' });
        notifyParent('error', { code: 'SELFIE_UPLOAD_FAILED', message: friendlyError });
        return;
      }

      notifyParent('step_change', { step: 'processing' });
      setCurrentStep({ step: 'processing' });

      const submitResponse = await fetch(
        getApiUrl(`/api/verifications/${verificationId}/submit?apiKey=${config?.apiKey}`),
        { method: 'POST' }
      );

      const submitData = await submitResponse.json();

      if (!submitResponse.ok && submitResponse.status === 429) {
        setError(submitData.message || 'Maximum retry limit reached.');
        setCurrentStep({ step: 'document' });
        notifyParent('error', { code: 'RETRY_LIMIT_EXCEEDED', message: 'Maximum retry limit reached' });
        return;
      }

      if (submitData.data && typeof submitData.data.passed !== 'undefined') {
        setResult(submitData.data);
        setCurrentStep({ step: 'complete', data: submitData.data });

        // Notify parent of completion
        if (submitData.data.passed) {
          notifyParent('verification_success', {
            verificationId,
            passed: true,
            score: submitData.data.score,
            extractedData: submitData.data.extractedData
          });
        } else {
          notifyParent('verification_failed', {
            verificationId,
            passed: false,
            score: submitData.data.score,
            canRetry: submitData.data.canRetry,
            remainingRetries: submitData.data.remainingRetries
          });
        }
        return;
      }

      if (!submitResponse.ok) {
        const friendlyError = getUserFriendlyError(submitData.error || '');
        setError(friendlyError);
        setCurrentStep({ step: 'document' });
        notifyParent('error', { code: 'VERIFICATION_FAILED', message: friendlyError });
        return;
      }

      setResult(submitData.data);
      setCurrentStep({ step: 'complete', data: submitData.data });
    } catch (error) {
      console.error('Verification failed:', error);
      setError('An error occurred during verification. Please try again.');
      setCurrentStep({ step: 'selfie' });
      notifyParent('error', { code: 'VERIFICATION_ERROR', message: 'Verification failed' });
    }
  };

  const handleClose = () => {
    notifyParent('close');
  };

  const handleRetry = () => {
    setCurrentStep({ step: 'document' });
    setResult(null);
    setError('');
    notifyParent('retry');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="embed-verification">
        <div className="embed-loading">
          <div className="spinner" />
          <p>Initializing verification...</p>
        </div>
      </div>
    );
  }

  // Error state (no verification ID)
  if (!verificationId) {
    return (
      <div className="embed-verification">
        <div className="embed-error">
          <div className="error-icon">!</div>
          <h2>Initialization Error</h2>
          <p>{error || 'Failed to initialize verification.'}</p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`embed-verification ${config?.theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Header */}
      {config?.showBranding !== false && (
        <div className="embed-header">
          {partnerInfo?.logoUrl ? (
            <img
              src={getAssetUrl(partnerInfo.logoUrl)}
              alt={partnerInfo.companyName}
              className="embed-partner-logo"
            />
          ) : (
            <div className="embed-logo">
              <span className="logo-icon">ID</span>
            </div>
          )}
          <div className="embed-title">
            <h1>Identity Verification</h1>
            {partnerInfo && <p>for {partnerInfo.companyName}</p>}
          </div>
          <button className="embed-close-btn" onClick={handleClose}>×</button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="embed-progress">
        <div className={`progress-step ${currentStep.step === 'document' ? 'active' : ['selfie', 'complete'].includes(currentStep.step) ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Document</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${currentStep.step === 'selfie' ? 'active' : currentStep.step === 'complete' ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Selfie</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${currentStep.step === 'complete' ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Done</span>
        </div>
      </div>

      {/* Content */}
      <div className="embed-content">
        {error && (
          <div className="embed-error-alert">
            <span className="error-icon">!</span>
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {currentStep.step === 'document' && (
          <DocumentCapture
            onCapture={handleDocumentCaptured}
            allowedDocumentTypes={config?.allowedDocumentTypes}
          />
        )}

        {(currentStep.step === 'document-processing' || currentStep.step === 'selfie-processing' || currentStep.step === 'processing') && (
          <div className="embed-processing">
            <div className="processing-animation">
              <div className="spinner-large" />
            </div>
            <h2>
              {currentStep.step === 'document-processing' && 'Analyzing Document...'}
              {currentStep.step === 'selfie-processing' && 'Processing Selfie...'}
              {currentStep.step === 'processing' && 'Completing Verification...'}
            </h2>
            <p>Please wait while we verify your identity</p>
          </div>
        )}

        {currentStep.step === 'selfie' && (
          <SelfieCapture
            onCapture={handleSelfieCaptured}
            onBack={() => setCurrentStep({ step: 'document' })}
            selectedDocumentType={selectedDocumentType}
            detectedDocumentType={detectedDocumentType}
          />
        )}

        {currentStep.step === 'complete' && result && (
          <div className={`embed-result ${result.passed ? 'success' : 'failure'}`}>
            <div className="result-icon">
              {result.passed ? '✓' : '✗'}
            </div>
            <h2>{result.passed ? 'Verification Successful' : 'Verification Failed'}</h2>
            <p>
              {result.passed
                ? 'Your identity has been verified successfully.'
                : result.message || 'We were unable to verify your identity.'}
            </p>

            {result.passed && result.extractedData?.fullName && (
              <div className="result-data">
                <p><strong>Name:</strong> {result.extractedData.fullName}</p>
              </div>
            )}

            <div className="result-actions">
              {!result.passed && result.canRetry && (
                <Button onClick={handleRetry}>Try Again</Button>
              )}
              <Button variant={result.passed ? 'default' : 'secondary'} onClick={handleClose}>
                {result.passed ? 'Done' : 'Close'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="embed-footer">
        <span>Secured by</span>
        <strong>TrustCredo</strong>
      </div>
    </div>
  );
};
