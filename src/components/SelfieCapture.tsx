import React, { useState, useRef, useEffect } from 'react';

interface SelfieCaptureProps {
  onCapture: (file: File) => void;
}

export const SelfieCapture: React.FC<SelfieCaptureProps> = ({ onCapture }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [isCamera, setIsCamera] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useUpload, setUseUpload] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Log environment info for debugging
    console.log('User Agent:', navigator.userAgent);
    console.log('MediaDevices supported:', !!navigator.mediaDevices);
    console.log('getUserMedia supported:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
    console.log('Protocol:', window.location.protocol);

    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    setUseUpload(false);

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setLoading(false);
      setUseUpload(true);
      setError('Camera not supported on this browser. Please use Chrome, Firefox, or Safari.');
      return;
    }

    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      console.log('Camera access granted, stream:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      console.log('Video ref current:', videoRef.current);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Stream assigned to video element');

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);

          videoRef.current?.play()
            .then(() => {
              console.log('Video playing successfully');
              setIsCamera(true);
              setLoading(false);
              console.log('State updated: isCamera=true, loading=false');
            })
            .catch((playError) => {
              console.error('Video play error:', playError);
              setLoading(false);
              setUseUpload(true);
              setError('Unable to start camera preview. Please try uploading a photo instead.');
            });
        };

        // Also try to play immediately in case metadata is already loaded
        if (videoRef.current.readyState >= 2) {
          console.log('Video ready immediately, trying to play...');
          videoRef.current.play()
            .then(() => {
              console.log('Video playing successfully (immediate)');
              setIsCamera(true);
              setLoading(false);
            })
            .catch((playError) => {
              console.error('Video play error (immediate):', playError);
            });
        }
      } else {
        console.error('Video ref is null!');
        setLoading(false);
        setUseUpload(true);
        setError('Video element not ready. Please try again.');
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setLoading(false);
      setUseUpload(true);

      let errorMessage = 'Unable to access camera. ';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage += 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not meet requirements.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported. Please use HTTPS.';
        } else {
          errorMessage += error.message;
        }
      }

      setError(errorMessage);
    }
  };

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

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCamera(false);
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            setCapturedFile(file);
            setPreview(canvas.toDataURL('image/jpeg'));
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleSubmit = () => {
    if (capturedFile) {
      onCapture(capturedFile);
    }
  };

  const retake = () => {
    setPreview(null);
    setCapturedFile(null);
    startCamera();
  };

  // Debug render states
  console.log('Render states:', { loading, error, useUpload, isCamera, preview: !!preview });

  return (
    <div className="selfie-capture">
      <h2>Take a Selfie</h2>
      <p className="instructions">
        Position your face in the center of the frame. We'll verify it matches your ID.
      </p>

      {/* Video and Canvas - always rendered for refs to work */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {loading && !preview && (
        <div className="loading-camera">
          <div className="spinner" />
          <p>Initializing camera...</p>
        </div>
      )}

      {error && !preview && useUpload && (
        <div className="camera-error">
          <p className="error-message">{error}</p>
          <div className="upload-fallback">
            <p style={{ marginBottom: '20px', color: '#374151' }}>
              Please upload a selfie photo instead:
            </p>
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              📁 Upload Selfie Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              className="btn-secondary"
              onClick={startCamera}
              style={{ marginTop: '10px' }}
            >
              🔄 Try Camera Again
            </button>
          </div>
        </div>
      )}

      {!preview && !loading && !error && isCamera && (
        <div className="camera-view selfie-camera">
          <div className="video-container">
            {/* Video feed display - positioned absolutely over the hidden video */}
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '75%',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}>
                <video
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                  ref={(el) => {
                    if (el && videoRef.current && videoRef.current.srcObject) {
                      el.srcObject = videoRef.current.srcObject;
                    }
                  }}
                />

                <div className="face-outline">
                  <svg viewBox="0 0 200 200">
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="70"
                      ry="90"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>

                {countdown !== null && (
                  <div className="countdown-overlay">
                    <div className="countdown-number">{countdown}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="camera-controls">
            <button
              className="btn-primary btn-capture"
              onClick={startCountdown}
              disabled={countdown !== null}
            >
              {countdown !== null ? 'Capturing...' : 'Take Photo'}
            </button>
          </div>

          <div className="selfie-tips">
            <h4>Tips:</h4>
            <ul>
              <li>Face the camera directly</li>
              <li>Remove glasses and hats</li>
              <li>Ensure good lighting on your face</li>
              <li>Keep a neutral expression</li>
            </ul>
          </div>
        </div>
      )}

      {preview && (
        <div className="preview-section">
          <h3>Review Your Selfie</h3>
          <img src={preview} alt="Selfie preview" />
          <div className="preview-controls">
            <button className="btn-primary" onClick={handleSubmit}>
              ✓ Submit
            </button>
            <button className="btn-secondary" onClick={retake}>
              ↻ Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
