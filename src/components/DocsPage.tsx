import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';
import { SDK_URL } from '../config/api';

export const DocsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="docs-page">
      <SEO
        title="Documentation - TrustCredo"
        description="API documentation and integration guides for TrustCredo identity verification platform."
      />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <img
              src="/website-logo-horizontal.png"
              alt="TrustCredo"
              className="nav-logo"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="nav-links">
            <a href="/docs" className="active">Docs</a>
            <a href="/partner/sdk-test">SDK</a>
            <a href="/#about">About</a>
            <a href="/#contact-us">Contact Us</a>
          </div>
          <div className="nav-actions">
            <button className="btn-nav-secondary" onClick={() => navigate('/partner/login')}>
              Login
            </button>
            <button className="btn-nav-primary" onClick={() => navigate('/partner/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Documentation Content */}
      <div className="docs-container">
        <aside className="docs-sidebar">
          <h3>Getting Started</h3>
          <ul>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#authentication">Authentication</a></li>
            <li><a href="#quick-start">Quick Start</a></li>
          </ul>
          <h3>API Reference</h3>
          <ul>
            <li><a href="#create-verification">Create Verification</a></li>
            <li><a href="#upload-document">Upload Document</a></li>
            <li><a href="#upload-selfie">Upload Selfie</a></li>
            <li><a href="#submit-verification">Submit Verification</a></li>
            <li><a href="#get-verification">Get Verification</a></li>
          </ul>
          <h3>Webhooks</h3>
          <ul>
            <li><a href="#webhook-setup">Webhook Setup</a></li>
            <li><a href="#webhook-events">Event Types</a></li>
            <li><a href="#webhook-security">Security</a></li>
          </ul>
          <h3>SDK</h3>
          <ul>
            <li><a href="#sdk-installation">Installation</a></li>
            <li><a href="#sdk-usage">Usage</a></li>
            <li><a href="#sdk-events">Events</a></li>
          </ul>
        </aside>

        <main className="docs-content">
          <section id="introduction">
            <h1>TrustCredo API Documentation</h1>
            <p>
              Welcome to the TrustCredo API documentation. This guide will help you integrate
              identity verification into your application.
            </p>
          </section>

          <section id="authentication">
            <h2>Authentication</h2>
            <p>
              All API requests require authentication using your Partner ID. You can find your
              Partner ID in your dashboard under Settings.
            </p>
            <div className="code-block">
              <pre>{`// Include partnerId in your API requests
GET /api/v1/verifications?partnerId=your-partner-id`}</pre>
            </div>
          </section>

          <section id="quick-start">
            <h2>Quick Start</h2>
            <p>Follow these steps to complete your first verification:</p>
            <ol>
              <li>Create a verification request</li>
              <li>Upload the user's ID document</li>
              <li>Upload the user's selfie</li>
              <li>Submit the verification for processing</li>
              <li>Receive results via webhook or polling</li>
            </ol>
          </section>

          <section id="create-verification">
            <h2>Create Verification</h2>
            <p>Create a new verification request for a user.</p>
            <div className="code-block">
              <pre>{`POST /api/v1/verifications?partnerId=your-partner-id
Content-Type: application/json

{
  "type": "IDENTITY",
  "user": {
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "metadata": {
    "source": "web"
  }
}`}</pre>
            </div>
            <h4>Response</h4>
            <div className="code-block">
              <pre>{`{
  "success": true,
  "data": {
    "id": "verification-uuid",
    "status": "PENDING"
  }
}`}</pre>
            </div>
          </section>

          <section id="upload-document">
            <h2>Upload Document</h2>
            <p>Upload the user's identity document (driver's license, passport, etc.).</p>
            <div className="code-block">
              <pre>{`POST /api/v1/verifications/{verificationId}/documents?partnerId=your-partner-id
Content-Type: multipart/form-data

document: [file]
documentType: DRIVERS_LICENSE | PASSPORT | NATIONAL_ID
side: FRONT | BACK`}</pre>
            </div>
          </section>

          <section id="upload-selfie">
            <h2>Upload Selfie</h2>
            <p>Upload the user's selfie for face matching.</p>
            <div className="code-block">
              <pre>{`POST /api/v1/verifications/{verificationId}/selfie?partnerId=your-partner-id
Content-Type: multipart/form-data

selfie: [file]`}</pre>
            </div>
          </section>

          <section id="submit-verification">
            <h2>Submit Verification</h2>
            <p>Submit the verification for processing and get results.</p>
            <div className="code-block">
              <pre>{`POST /api/v1/verifications/{verificationId}/submit?partnerId=your-partner-id`}</pre>
            </div>
            <h4>Response</h4>
            <div className="code-block">
              <pre>{`{
  "success": true,
  "data": {
    "passed": true,
    "score": 0.95,
    "riskLevel": "LOW",
    "checks": {
      "documentAuthentic": true,
      "faceMatch": true,
      "faceMatchScore": 0.94
    },
    "extractedData": {
      "fullName": "John Doe",
      "dateOfBirth": "1990-01-15",
      "documentNumber": "D1234567"
    }
  }
}`}</pre>
            </div>
          </section>

          <section id="get-verification">
            <h2>Get Verification</h2>
            <p>Retrieve verification details and status.</p>
            <div className="code-block">
              <pre>{`GET /api/v1/verifications/{verificationId}?partnerId=your-partner-id`}</pre>
            </div>
          </section>

          <section id="webhook-setup">
            <h2>Webhook Setup</h2>
            <p>
              Configure a webhook URL in your Partner Settings to receive real-time notifications
              when verifications are completed.
            </p>
          </section>

          <section id="webhook-events">
            <h2>Webhook Events</h2>
            <p>Events sent to your webhook endpoint:</p>
            <ul>
              <li><code>verification.completed</code> - Verification finished (pass or fail)</li>
              <li><code>verification.failed</code> - Verification encountered an error</li>
            </ul>
            <div className="code-block">
              <pre>{`{
  "event": "verification.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "verificationId": "abc123",
  "data": {
    "passed": true,
    "score": 0.95,
    "riskLevel": "LOW"
  }
}`}</pre>
            </div>
          </section>

          <section id="webhook-security">
            <h2>Webhook Security</h2>
            <p>Verify webhook authenticity using the signature header:</p>
            <div className="code-block">
              <pre>{`const crypto = require('crypto');

function verifySignature(payload, signature, apiSecret) {
  const expected = crypto
    .createHmac('sha256', apiSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return signature === expected;
}`}</pre>
            </div>
          </section>

          <section id="sdk-installation">
            <h2>SDK Installation</h2>
            <p>Add the TrustCredo SDK to your website:</p>
            <div className="code-block">
              <pre>{`<script src="${SDK_URL}"></script>`}</pre>
            </div>
          </section>

          <section id="sdk-usage">
            <h2>SDK Usage</h2>
            <p>Initialize and start verification:</p>
            <div className="code-block">
              <pre>{`// Initialize the SDK
IDV.init({
  apiKey: 'your-api-key',
  environment: 'production',
  debug: false
});

// Start verification (returns a Promise)
IDV.start({
  onComplete: (result) => {
    console.log('Verification result:', result);
  },
  onError: (error) => {
    console.error('Verification error:', error);
  },
  onClose: (reason) => {
    console.log('Modal closed:', reason);
  }
});`}</pre>
            </div>
          </section>

          <section id="sdk-events">
            <h2>SDK Events</h2>
            <p>Available callback events:</p>
            <ul>
              <li><code>onReady</code> - Called when the SDK is ready</li>
              <li><code>onStart</code> - Called when verification starts</li>
              <li><code>onComplete</code> - Called when verification finishes</li>
              <li><code>onError</code> - Called when an error occurs</li>
              <li><code>onClose</code> - Called when user closes the modal</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};
