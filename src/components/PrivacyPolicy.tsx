import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <SEO
        title="Privacy Policy - TrustCredo"
        description="Learn how TrustCredo collects, uses, and protects your personal information when using our identity verification services."
        keywords="privacy policy, data protection, GDPR, CCPA, identity verification privacy"
        canonicalUrl="/privacy"
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
          <h1>Privacy Policy</h1>
          <p>Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="legal-content">
        <div className="section-container">
          <div className="legal-document">
            <h2>1. Introduction</h2>
            <p>
              TrustCredo Inc. ("TrustCredo," "we," "us," or "our") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our identity verification services.
            </p>
            <p>
              Please read this Privacy Policy carefully. By using our Services, you consent to the data practices
              described in this policy.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li><strong>Identity Documents:</strong> Government-issued IDs, passports, driver's licenses</li>
              <li><strong>Biometric Data:</strong> Facial images for verification purposes</li>
              <li><strong>Contact Information:</strong> Name, email address, phone number</li>
              <li><strong>Account Information:</strong> Username, password, company details</li>
              <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you access our Services, we automatically collect:</p>
            <ul>
              <li>Log data and usage information</li>
              <li>Device and browser information</li>
              <li>Location data (with your consent)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide identity verification services</li>
              <li>Authenticate documents and verify identities</li>
              <li>Prevent fraud and ensure security</li>
              <li>Improve and optimize our Services</li>
              <li>Communicate with you about your account</li>
              <li>Comply with legal obligations</li>
              <li>Respond to law enforcement requests when required</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to provide our Services and fulfill the
              purposes described in this Privacy Policy. Specific retention periods include:
            </p>
            <ul>
              <li><strong>Verification Data:</strong> Retained for 90 days by default, or as configured by our partners</li>
              <li><strong>Biometric Data:</strong> Deleted immediately after verification is complete</li>
              <li><strong>Account Information:</strong> Retained while your account is active</li>
              <li><strong>Audit Logs:</strong> Retained for 7 years for compliance purposes</li>
            </ul>

            <h2>5. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Partners:</strong> The business that requested your verification</li>
              <li><strong>Service Providers:</strong> Third parties that help us operate our Services</li>
              <li><strong>Legal Authorities:</strong> When required by law or legal process</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul>
              <li>256-bit SSL/TLS encryption for data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>SOC 2 Type II certified infrastructure</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and employee training</li>
            </ul>

            <h2>7. Your Rights</h2>
            <h3>7.1 GDPR Rights (EU Residents)</h3>
            <p>If you are a resident of the European Union, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h3>7.2 CCPA Rights (California Residents)</h3>
            <p>If you are a California resident, you have the right to:</p>
            <ul>
              <li>Know what personal information we collect</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of the sale of personal information (we do not sell data)</li>
              <li>Non-discrimination for exercising your rights</li>
            </ul>

            <h2>8. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience. You can control cookies
              through your browser settings. Essential cookies are required for the Services to function properly.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place, including Standard Contractual Clauses for
              transfers from the EU.
            </p>

            <h2>10. Children's Privacy</h2>
            <p>
              Our Services are not intended for individuals under 18 years of age. We do not knowingly
              collect personal information from children. If we learn we have collected such information,
              we will delete it promptly.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by posting the new Privacy Policy on our website and updating the "Last updated" date.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <p>
              <strong>Email:</strong> privacy@trustcredo.com<br />
              <strong>Data Protection Officer:</strong> dpo@trustcredo.com<br />
              <strong>Address:</strong> TrustCredo Inc., 123 Verification Way, Suite 100, Wilmington, DE 19801
            </p>

            <h2>13. Supervisory Authority</h2>
            <p>
              EU residents have the right to lodge a complaint with their local data protection authority
              if they believe their data has been processed unlawfully.
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
