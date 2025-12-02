import React, { useState } from 'react';
import { DocumentCapture } from './DocumentCapture';
import { SelfieCapture } from './SelfieCapture';
import { VerificationResult } from './VerificationResult';

interface VerificationStep {
  step: 'document' | 'selfie' | 'processing' | 'complete';
  data?: any;
}

export const IDVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VerificationStep>({ step: 'document' });
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

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

        const createResponse = await fetch(url, {
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

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadResponse.json();
        setDocumentData(uploadData.data);
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

      await fetch(selfieUrl, {
        method: 'POST',
        body: formData
      });

      const submitUrl = apiKey
        ? `/api/verifications/${verificationId}/submit?apiKey=${apiKey}`
        : `/api/verifications/${verificationId}/submit`;

      const submitResponse = await fetch(submitUrl, { method: 'POST' });

      const submitData = await submitResponse.json();
      setResult(submitData.data);
      setCurrentStep({ step: 'complete', data: submitData.data });
    } catch (error) {
      console.error('Selfie upload failed:', error);
    }
  };

  return (
    <div className="id-verification-container">
      <div className="verification-header">
        <h1>Identity Verification</h1>
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
