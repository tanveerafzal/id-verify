import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentCaptureProps {
  onCapture: (file: File, documentType: string) => void;
  allowedDocumentTypes?: string[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const DocumentCapture: React.FC<DocumentCaptureProps> = ({ onCapture, allowedDocumentTypes }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCamera, setIsCamera] = useState(false);

  const allDocumentTypes = [
    { value: 'DRIVERS_LICENSE', label: "Driver's License" },
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'NATIONAL_ID', label: 'National ID' },
    { value: 'RESIDENCE_PERMIT', label: 'Residence Permit' },
    { value: 'PERMANENT_RESIDENT_CARD', label: 'Permanent Resident Card' },
    { value: 'VOTER_ID', label: 'Voter ID' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Filter document types based on allowed types (if specified)
  const documentTypes = allowedDocumentTypes && allowedDocumentTypes.length > 0
    ? allDocumentTypes.filter(type => allowedDocumentTypes.includes(type.value))
    : allDocumentTypes;

  // Set default selected type to first available option
  const [selectedType, setSelectedType] = useState<string>('DRIVERS_LICENSE');

  // Update selected type when allowed document types change
  useEffect(() => {
    if (documentTypes.length > 0 && !documentTypes.find(t => t.value === selectedType)) {
      setSelectedType(documentTypes[0].value);
    }
  }, [allowedDocumentTypes]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear any previous error
      setFileSizeError('');

      // Check file size (max 5MB)
      if (file.size > MAX_FILE_SIZE) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setFileSizeError(`File size (${fileSizeMB}MB) exceeds the maximum allowed size of 5MB. Please choose a smaller file.`);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setCapturedFile(file);

      // Handle PDF files differently - can't preview as image
      if (file.type === 'application/pdf') {
        setPreview('pdf');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => {
              setIsCamera(true);
            })
            .catch((playError) => {
              console.error('Video play error:', playError);
              alert('Unable to start camera preview. Please upload a photo instead.');
            });
        };
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Unable to access camera. Please upload a photo instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'document.jpg', { type: 'image/jpeg' });
          setCapturedFile(file);
          setPreview(canvas.toDataURL('image/jpeg'));
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCamera(false);
    }
  };

  const handleSubmit = () => {
    if (capturedFile) {
      onCapture(capturedFile, selectedType);
    }
  };

  return (
    <div className="document-capture">
      <h2>Scan Your ID Document</h2>
      <p className="instructions">
        Please select your document type and capture a clear photo of the front side.
      </p>

      {/* Video element - always rendered for ref */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />

      <div className="document-type-selector">
        <label className="document-type-label">Select Document Type</label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full h-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#10B981] focus:ring-[#10B981]">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {documentTypes.map(type => (
              <SelectItem key={type.value} value={type.value} className="text-base py-3">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fileSizeError && (
        <div className="file-size-error">
          <span className="error-icon">⚠️</span>
          <span>{fileSizeError}</span>
        </div>
      )}

      {!preview && !isCamera && (
        <div className="capture-options">
          <Button className="w-full" onClick={startCamera}>
            Use Camera
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {isCamera && (
        <div className="camera-view">
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <video
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: 'auto', display: 'block' }}
              ref={(el) => {
                if (el && videoRef.current && videoRef.current.srcObject) {
                  el.srcObject = videoRef.current.srcObject;
                }
              }}
            />
          </div>
          <div className="camera-controls">
            <Button onClick={capturePhoto}>
              Capture
            </Button>
            <Button variant="secondary" onClick={stopCamera}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {preview && (
        <div className="preview-section">
          <h3>Preview</h3>
          {preview === 'pdf' ? (
            <div className="pdf-preview">
              <div className="pdf-icon">📄</div>
              <p className="pdf-filename">{capturedFile?.name}</p>
              <p className="pdf-info">PDF document ready to upload</p>
            </div>
          ) : (
            <img src={preview} alt="Document preview" />
          )}
          <div className="preview-controls">
            <Button className="w-full" onClick={handleSubmit}>
              Continue
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setPreview(null);
                setCapturedFile(null);
                setFileSizeError('');
              }}
            >
              Retake
            </Button>
          </div>
        </div>
      )}

      <div className="tips">
        <h4>Tips for best results:</h4>
        <ul>
          <li>Ensure good lighting without glare</li>
          <li>Keep the document flat and in focus</li>
          <li>Capture all four corners of the document</li>
          <li>Avoid shadows on the document</li>
        </ul>
      </div>
    </div>
  );
};
