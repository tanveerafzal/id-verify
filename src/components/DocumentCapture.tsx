import React, { useState, useRef } from 'react';

interface DocumentCaptureProps {
  onCapture: (file: File, documentType: string) => void;
}

export const DocumentCapture: React.FC<DocumentCaptureProps> = ({ onCapture }) => {
  const [selectedType, setSelectedType] = useState<string>('DRIVERS_LICENSE');
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCamera, setIsCamera] = useState(false);

  const documentTypes = [
    { value: 'DRIVERS_LICENSE', label: "Driver's License" },
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'NATIONAL_ID', label: 'National ID' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCapturedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        <label>Document Type:</label>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {documentTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {!preview && !isCamera && (
        <div className="capture-options">
          <button className="btn-primary" onClick={startCamera}>
            📷 Use Camera
          </button>
          <button
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            📁 Upload Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
            <button className="btn-primary" onClick={capturePhoto}>
              Capture
            </button>
            <button className="btn-secondary" onClick={stopCamera}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="preview-section">
          <h3>Preview</h3>
          <img src={preview} alt="Document preview" />
          <div className="preview-controls">
            <button className="btn-primary" onClick={handleSubmit}>
              ✓ Continue
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setPreview(null);
                setCapturedFile(null);
              }}
            >
              ↻ Retake
            </button>
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
