import React from 'react';

export const Roadmap: React.FC = () => {
  const fullyImplemented = [
    {
      title: 'Partner Management',
      percentage: 100,
      items: [
        'Partner registration with email, password, company name, contact name',
        'Partner login with JWT token generation (7-day expiry)',
        'Profile viewing and updating (company name, contact, phone, website, address, logo)',
        'Logo upload with multer (5MB max, image files only)',
        'Public partner info retrieval',
        'API key and secret generation'
      ]
    },
    {
      title: 'Password Management',
      percentage: 100,
      items: [
        'Forgot password with email reset link (1-hour expiry)',
        'Reset password with token validation',
        'Secure password hashing with bcryptjs'
      ]
    },
    {
      title: 'Tier System',
      percentage: 100,
      items: [
        'Free: 100 monthly verifications, 5 API calls/min',
        'Starter: 1,000 monthly verifications, 20 API calls/min, webhooks enabled',
        'Professional: 5,000 monthly verifications, 50 API calls/min',
        'Enterprise: 50,000 monthly verifications, 200 API calls/min, dedicated support',
        'Tier upgrade functionality',
        'Usage statistics tracking (monthly vs total, remaining verifications)'
      ]
    },
    {
      title: 'User Authentication',
      percentage: 100,
      items: [
        'User registration with username, password, optional email, and role assignment',
        'User login with JWT token (24h expiry)',
        'Password strength validation (min 6 chars)',
        'Username validation (min 3 chars)',
        'Email format validation',
        'Account deactivation support',
        'Role-based user types (ADMIN, USER, API_CLIENT)'
      ]
    },
    {
      title: 'Document Processing',
      percentage: 100,
      items: [
        'Document upload with file format validation (JPEG, PNG)',
        'Multiple document types: Driver\'s License, Passport, National ID, Residence Permit, Voter ID',
        'Document side tracking (FRONT/BACK)',
        'Image quality checks: Blur detection, Glare detection, Completeness validation',
        'Image preprocessing (resize, normalize, sharpen)',
        'Thumbnail generation'
      ]
    },
    {
      title: 'OCR & Document Data Extraction',
      percentage: 100,
      items: [
        'Dual OCR engine: Google Cloud Vision API (primary) + Tesseract.js (fallback)',
        'Driver\'s License parsing: Name, DOB, license number, expiry, address',
        'Passport parsing: MRZ, name, document number, nationality, DOB, expiry, gender',
        'National ID parsing: Name, ID number, DOB',
        'Canadian/Ontario format detection',
        'US format parsing',
        'MRZ (Machine Readable Zone) parsing',
        'Address parsing (street, city, state, postal code)',
        'Date normalization (handles multiple formats)',
        'Confidence scoring per extraction'
      ]
    },
    {
      title: 'Face Detection & Comparison',
      percentage: 100,
      items: [
        'Google Cloud Vision integration for face detection',
        'Facial landmark extraction (30+ points)',
        'Face quality assessment (blur, exposure, angles)',
        'Document photo vs selfie comparison',
        'Landmark-based similarity (60% weight)',
        'Face geometry analysis (40% weight)',
        'Match confidence scoring',
        'Configurable match threshold (default 75%)'
      ]
    },
    {
      title: 'Email Service',
      percentage: 100,
      items: [
        'Integration with Ultrareach360 API',
        'Token-based authentication (1-hour cache)',
        'Verification invitation email with link',
        'Password reset email with time-limited token',
        'Verification completion email with results summary'
      ]
    },
    {
      title: 'Webhook System',
      percentage: 100,
      items: [
        'Event types: VERIFICATION_CREATED, DOCUMENT_UPLOADED, VERIFICATION_COMPLETED',
        'URL registration per verification',
        'HMAC-SHA256 signature generation',
        'Retry mechanism (3 attempts with delays: 1s, 5s, 15s)',
        'Delivery tracking and logging'
      ]
    },
    {
      title: 'Security',
      percentage: 100,
      items: [
        'Helmet.js for HTTP security headers',
        'CORS configuration',
        'Rate limiting (configurable per environment)',
        'JWT token-based authentication',
        'Password hashing with bcryptjs (10 salt rounds)',
        'API key validation middleware',
        'Partner authentication middleware',
        'HMAC signature verification for webhooks'
      ]
    },
    {
      title: 'Logging & Monitoring',
      percentage: 100,
      items: [
        'Winston logging framework',
        'Log output to files (combined.log, error.log)',
        'Console logging with contextual prefixes',
        'Error stack traces'
      ]
    }
  ];

  const partiallyImplemented = [
    {
      title: 'Liveness Detection',
      percentage: 60,
      done: [
        'Framework exists with blink, head movement, and texture detection',
        'Video frame processing capability'
      ],
      todo: [
        'Real ML model integration needed',
        'Requires video frame collection from frontend'
      ]
    },
    {
      title: 'Document Type Auto-Detection',
      percentage: 10,
      done: [
        'Structure exists in DocumentScannerService'
      ],
      todo: [
        'Returns placeholder implementation (always DRIVERS_LICENSE)',
        'Needs ML model or heuristic-based detection'
      ]
    },
    {
      title: 'Name Matching',
      percentage: 20,
      done: [
        'Name extraction from documents',
        'Database storage'
      ],
      todo: [
        'No name comparison/fuzzy matching logic',
        'No phonetic matching (Soundex, Metaphone)'
      ]
    },
    {
      title: 'DOB Matching',
      percentage: 20,
      done: [
        'DOB extraction from documents',
        'Database storage'
      ],
      todo: [
        'No actual matching with user-provided data',
        'No age verification logic'
      ]
    },
    {
      title: 'Address Matching',
      percentage: 20,
      done: [
        'Address parsing from OCR',
        'Database storage'
      ],
      todo: [
        'No third-party address validation',
        'No geocoding integration'
      ]
    }
  ];

  const futureFeatures = {
    high: [
      { feature: 'Admin Dashboard', description: 'Partner management, verification review, analytics UI', effort: '2-3 weeks' },
      { feature: 'Document Type Auto-Detection', description: 'ML-based identification of document types', effort: '1 week' },
      { feature: 'Identity Matching', description: 'Compare extracted data with user-provided data (fuzzy matching)', effort: '1 week' },
      { feature: 'MRZ Checksum Validation', description: 'Validate passport MRZ integrity using check digits', effort: '2-3 days' },
      { feature: 'Frontend Verification Flow', description: 'Complete UI/UX for document capture and selfie', effort: '2-3 weeks' }
    ],
    medium: [
      { feature: '2FA/MFA', description: 'Two-factor authentication for partners', effort: '1 week' },
      { feature: 'Real Liveness Detection', description: 'ML-based anti-spoofing (3D face, texture analysis)', effort: '2 weeks' },
      { feature: 'Document Security Features', description: 'Hologram/watermark detection', effort: '2 weeks' },
      { feature: 'ID Number Validation', description: 'Format/checksum validation per country', effort: '1 week' },
      { feature: 'Address Verification', description: 'Third-party geocoding/validation (Google Maps, etc.)', effort: '1 week' },
      { feature: 'Analytics Dashboard', description: 'Completion rates, quality metrics, trends', effort: '1-2 weeks' },
      { feature: 'PDF Report Generation', description: 'Downloadable verification reports', effort: '3-4 days' }
    ],
    low: [
      { feature: 'Bulk Operations', description: 'Batch verification processing', effort: '1 week' },
      { feature: 'Dispute Resolution', description: 'Manual review workflow', effort: '1-2 weeks' },
      { feature: 'Data Encryption at Rest', description: 'PII encryption in database', effort: '1 week' },
      { feature: 'Detailed Audit Trail', description: 'Security logging for compliance', effort: '1 week' },
      { feature: 'Account Lockout', description: 'Brute force protection', effort: '2-3 days' },
      { feature: 'Multi-language Support', description: 'OCR and UI in multiple languages', effort: '2-3 weeks' },
      { feature: 'SDK Development', description: 'Mobile SDKs (iOS, Android)', effort: '4-6 weeks' }
    ]
  };

  const techStack = [
    { name: 'Runtime', value: 'Node.js with TypeScript' },
    { name: 'Framework', value: 'Express.js' },
    { name: 'Database', value: 'PostgreSQL with Prisma ORM' },
    { name: 'OCR', value: 'Google Cloud Vision API + Tesseract.js (fallback)' },
    { name: 'Face Detection', value: 'Google Cloud Vision API' },
    { name: 'Image Processing', value: 'Sharp' },
    { name: 'Authentication', value: 'JWT (jsonwebtoken)' },
    { name: 'Password Hashing', value: 'bcryptjs' },
    { name: 'Email', value: 'Ultrareach360 API' },
    { name: 'Logging', value: 'Winston' },
    { name: 'Security', value: 'Helmet, CORS, express-rate-limit' },
    { name: 'Validation', value: 'Zod' }
  ];

  return (
    <div className="roadmap-page">
      <div className="roadmap-container">
        <div className="roadmap-header">
          <h1>ID Verify - Product Roadmap</h1>
          <p>A comprehensive KYC/identity verification system</p>
        </div>

        {/* Fully Implemented */}
        <section className="roadmap-section">
          <h2 className="section-title completed-title">
            <span className="status-icon">✅</span> Fully Implemented (Production Ready)
          </h2>
          <div className="features-grid">
            {fullyImplemented.map((feature, index) => (
              <div key={index} className="feature-block completed">
                <div className="feature-header">
                  <h3>{feature.title}</h3>
                  <span className="percentage-badge">{feature.percentage}%</span>
                </div>
                <ul className="feature-items">
                  {feature.items.map((item, i) => (
                    <li key={i}><span className="check">✓</span> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Partially Implemented */}
        <section className="roadmap-section">
          <h2 className="section-title partial-title">
            <span className="status-icon">🟡</span> Partially Implemented (Needs Work)
          </h2>
          <div className="features-grid">
            {partiallyImplemented.map((feature, index) => (
              <div key={index} className="feature-block partial">
                <div className="feature-header">
                  <h3>{feature.title}</h3>
                  <span className="percentage-badge partial">{feature.percentage}%</span>
                </div>
                <div className="progress-bar-small">
                  <div className="progress-fill" style={{ width: `${feature.percentage}%` }}></div>
                </div>
                <div className="done-items">
                  <h4>Done:</h4>
                  <ul>
                    {feature.done.map((item, i) => (
                      <li key={i}><span className="check">✓</span> {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="todo-items">
                  <h4>To Do:</h4>
                  <ul>
                    {feature.todo.map((item, i) => (
                      <li key={i}><span className="pending">○</span> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Not Implemented */}
        <section className="roadmap-section">
          <h2 className="section-title future-title">
            <span className="status-icon">❌</span> Not Implemented (Future Roadmap)
          </h2>

          <div className="priority-section">
            <h3 className="priority-title high">High Priority</h3>
            <div className="priority-table">
              <div className="table-header">
                <span>Feature</span>
                <span>Description</span>
                <span>Effort</span>
              </div>
              {futureFeatures.high.map((item, index) => (
                <div key={index} className="table-row">
                  <span className="feature-name">{item.feature}</span>
                  <span className="feature-desc">{item.description}</span>
                  <span className="feature-effort">{item.effort}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="priority-section">
            <h3 className="priority-title medium">Medium Priority</h3>
            <div className="priority-table">
              <div className="table-header">
                <span>Feature</span>
                <span>Description</span>
                <span>Effort</span>
              </div>
              {futureFeatures.medium.map((item, index) => (
                <div key={index} className="table-row">
                  <span className="feature-name">{item.feature}</span>
                  <span className="feature-desc">{item.description}</span>
                  <span className="feature-effort">{item.effort}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="priority-section">
            <h3 className="priority-title low">Low Priority</h3>
            <div className="priority-table">
              <div className="table-header">
                <span>Feature</span>
                <span>Description</span>
                <span>Effort</span>
              </div>
              {futureFeatures.low.map((item, index) => (
                <div key={index} className="table-row">
                  <span className="feature-name">{item.feature}</span>
                  <span className="feature-desc">{item.description}</span>
                  <span className="feature-effort">{item.effort}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="roadmap-section">
          <h2 className="section-title tech-title">
            <span className="status-icon">⚙️</span> Technical Stack
          </h2>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item">
                <span className="tech-label">{tech.name}</span>
                <span className="tech-value">{tech.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Next Steps */}
        <section className="roadmap-section">
          <h2 className="section-title">
            <span className="status-icon">🎯</span> Recommended Next Steps
          </h2>
          <ol className="next-steps">
            <li><strong>Identity Data Matching</strong> - Compare extracted data with user-provided data</li>
            <li><strong>Document Type Auto-Detection</strong> - Improve document classification</li>
            <li><strong>MRZ Checksum Validation</strong> - Validate passport MRZ integrity</li>
            <li><strong>Admin Dashboard</strong> - Basic partner/verification management UI</li>
            <li><strong>Real Liveness Detection</strong> - Integrate proper anti-spoofing</li>
          </ol>
        </section>

        <div className="roadmap-footer">
          <p><em>Last Updated: December 2024</em></p>
        </div>
      </div>
    </div>
  );
};
