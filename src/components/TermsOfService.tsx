import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <SEO
        title="Terms of Service - TrustCredo"
        description="Read our terms of service to understand your rights and responsibilities when using TrustCredo's identity verification platform."
        keywords="terms of service, terms and conditions, legal, identity verification"
        canonicalUrl="/terms"
      />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/website-logo-horizontal.png" alt="TrustCredo" className="nav-logo" />
          </div>
          <div className="nav-actions">
            <button className="btn-nav-secondary" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="legal-hero">
        <div className="section-container">
          <h1>Terms of Service</h1>
          <p>Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="legal-content">
        <div className="section-container">
          <div className="legal-document">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using TrustCredo's identity verification services ("Services"), you agree to be bound
              by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use
              the Services.
            </p>
            <p>
              These Terms apply to all users of the Services, including partners, businesses, and end-users who
              submit identity documents for verification.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              TrustCredo provides identity verification services that include:
            </p>
            <ul>
              <li>Document verification and authentication</li>
              <li>Facial recognition and biometric matching</li>
              <li>Liveness detection</li>
              <li>Identity data extraction and validation</li>
              <li>API access for integration with third-party applications</li>
              <li>Dashboard and analytics tools</li>
            </ul>

            <h2>3. Account Registration</h2>
            <p>
              To use our Services, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>
              You agree not to use the Services to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Submit fraudulent or falsified documents</li>
              <li>Attempt to circumvent security measures</li>
              <li>Interfere with the proper functioning of the Services</li>
              <li>Use the Services for any illegal or unauthorized purpose</li>
            </ul>

            <h2>5. Data Processing</h2>
            <p>
              By using our Services, you acknowledge that:
            </p>
            <ul>
              <li>We will process personal data as described in our Privacy Policy</li>
              <li>You have obtained necessary consents from end-users</li>
              <li>You will comply with all applicable data protection laws</li>
              <li>Data will be processed in accordance with our Data Processing Agreement</li>
            </ul>

            <h2>6. Fees and Payment</h2>
            <p>
              Certain features of the Services may require payment. You agree to:
            </p>
            <ul>
              <li>Pay all fees according to your selected pricing plan</li>
              <li>Provide accurate billing information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Pay any applicable taxes</li>
            </ul>
            <p>
              Fees are non-refundable unless otherwise specified in writing.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              The Services, including all content, features, and functionality, are owned by TrustCredo and are
              protected by copyright, trademark, and other intellectual property laws. You may not copy, modify,
              distribute, or create derivative works without our express written permission.
            </p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
              OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRUSTCREDO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless TrustCredo and its officers, directors, employees, and agents
              from any claims, damages, losses, or expenses arising out of your use of the Services or violation
              of these Terms.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend your access to the Services at any time, with or without cause, with or
              without notice. Upon termination, your right to use the Services will immediately cease.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by
              posting the updated Terms on our website. Your continued use of the Services after such changes
              constitutes acceptance of the new Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
              United States, without regard to its conflict of law provisions.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@trustcredo.com<br />
              <strong>Address:</strong> TrustCredo Inc., 123 Verification Way, Suite 100, Wilmington, DE 19801
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TrustCredo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
