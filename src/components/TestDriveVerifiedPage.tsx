import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const TestDriveVerifiedPage: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    { stat: '$30K+', label: 'Average loss per stolen vehicle during test drive' },
    { stat: '85%', label: 'Of thefts involve fake or stolen IDs' },
    { stat: '3-5x', label: 'Insurance premium increase after incident' }
  ];

  const risks = [
    { title: 'Vehicle Theft', description: 'Fraudsters use fake IDs to steal inventory' },
    { title: 'Liability Exposure', description: 'Accidents create legal nightmares' },
    { title: 'Insurance Gaps', description: 'Claims denied without verification' },
    { title: 'Staff Safety', description: 'Employees ride with strangers' }
  ];

  const steps = [
    {
      number: 1,
      title: 'Customer Requests Test Drive',
      description: 'Your team sends a verification link via SMS or email'
    },
    {
      number: 2,
      title: 'Customer Verifies ID',
      description: 'Scans license and takes a selfie in under 60 seconds'
    },
    {
      number: 3,
      title: 'You Get Instant Results',
      description: 'Dashboard shows verification status before they arrive'
    }
  ];

  const stats = [
    { value: '47 sec', label: 'Avg. Time' },
    { value: '94%', label: 'Completion Rate' },
    { value: '99.7%', label: 'Fraud Detection' }
  ];

  const benefits = [
    {
      icon: '🛡️',
      title: 'Protect Your Inventory',
      description: 'Stop fraud before it happens. Verify every driver against government databases.'
    },
    {
      icon: '💰',
      title: 'Reduce Insurance Costs',
      description: 'Documented verification qualifies you for lower premiums.'
    },
    {
      icon: '⚖️',
      title: 'Limit Legal Liability',
      description: 'Create an auditable verification trail for every test drive.'
    },
    {
      icon: '⏱️',
      title: 'Save Staff Time',
      description: 'Customers verify before arrival. No manual ID checks at desk.'
    },
    {
      icon: '😊',
      title: 'Better Customer Experience',
      description: 'Fast, mobile-friendly. Less waiting, more driving.'
    },
    {
      icon: '👥',
      title: 'Keep Your Team Safe',
      description: 'Employees deserve to know who they\'re getting in a car with.'
    }
  ];

  const technologies = [
    { title: 'Document Authentication', description: 'AI scans for security features on 6,500+ ID types' },
    { title: 'Facial Matching', description: 'Biometric comparison ensures person matches ID photo' },
    { title: 'Liveness Detection', description: 'Prevents spoofing with photos or videos' },
    { title: 'Database Checks', description: 'Cross-reference DMV records and fraud databases' }
  ];

  const trustStats = [
    { value: '500+', label: 'Dealerships nationwide' },
    { value: '2M+', label: 'Verifications completed' },
    { value: '$12M+', label: 'Fraud prevented for partners' }
  ];

  return (
    <div className="landing-page service-page">
      <SEO
        title="Test Drive Verified - Secure Every Test Drive | TrustCredo"
        description="Driver's license verification for smart dealerships. Protect your inventory, staff, and customers with instant ID verification before every test drive."
        keywords="test drive verification, dealership security, car dealership fraud prevention, driver license verification, vehicle theft prevention"
        canonicalUrl="/services/test-drive-verified"
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
            <button className="btn-nav-primary" onClick={() => navigate('/partner/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="service-hero">
        <div className="section-container">
          <div className="service-badge">FOR AUTO DEALERSHIPS</div>
          <h1>Secure Every Test Drive <span className="highlight">Before It Starts</span></h1>
          <p className="hero-subtitle">Driver's License Verification for Smart Dealerships</p>
          <div className="hero-cta">
            <button className="btn-primary-large" onClick={() => navigate('/partner/register')}>
              Schedule a Demo
            </button>
            <button className="btn-secondary-large" onClick={() => window.open('https://verify.trustcredo.com/dealer-verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Try It Free
            </button>
          </div>
          <p className="hero-note">No credit card required. See it in action in 15 minutes.</p>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="service-challenge">
        <div className="section-container">
          <div className="section-label">THE CHALLENGE</div>
          <h2>Test Drives Are Your Biggest Blind Spot</h2>

          <div className="challenge-grid">
            <div className="challenge-stats">
              {challenges.map((item, index) => (
                <div key={index} className="challenge-stat-card">
                  <div className="stat-number">{item.stat}</div>
                  <div className="stat-description">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="challenge-risks">
              <h3>Every unverified test drive exposes your dealership to:</h3>
              <ul className="risk-list">
                {risks.map((risk, index) => (
                  <li key={index}>
                    <strong>{risk.title}</strong> — {risk.description}
                  </li>
                ))}
              </ul>
              <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <span>Manual ID checks catch less than 15% of sophisticated fake IDs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="service-solution">
        <div className="section-container">
          <div className="section-label">THE SOLUTION</div>
          <h2>Verify Identity Before They Arrive</h2>

          <div className="solution-main">
            <div className="solution-icon">✓</div>
            <div className="solution-content">
              <h3>Digital License Verification for Test Drives</h3>
              <p>Customers verify their driver's license through a secure mobile link before arriving at your dealership. Know exactly who's getting behind the wheel.</p>
            </div>
          </div>

          <div className="solution-features">
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <strong>Remote Verification</strong>
              <p>Customer completes ID check from their phone before appointment</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <strong>Instant Results</strong>
              <p>Verification in under 60 seconds with real-time alerts</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🛡️</span>
              <strong>Fraud Detection</strong>
              <p>AI-powered checks catch fake and stolen IDs automatically</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="service-how-it-works">
        <div className="section-container">
          <div className="section-label">SIMPLE PROCESS</div>
          <h2>How It Works</h2>

          <div className="steps-container">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="step-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>

          <div className="stats-bar">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
            <div className="stat-badge">No App Download Required</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="service-benefits">
        <div className="section-container">
          <div className="section-label">WHY DEALERSHIPS CHOOSE US</div>
          <h2>Benefits That Matter</h2>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <span className="benefit-icon">{benefit.icon}</span>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="service-technology">
        <div className="section-container">
          <div className="section-label">ENTERPRISE-GRADE SECURITY</div>
          <h2>Built for Trust and Compliance</h2>

          <div className="tech-content">
            <div className="tech-features">
              <h3>Verification Technology</h3>
              <div className="tech-grid">
                {technologies.map((tech, index) => (
                  <div key={index} className="tech-card">
                    <strong>{tech.title}</strong>
                    <p>{tech.description}</p>
                  </div>
                ))}
              </div>

            </div>

            <div className="trust-stats">
              <div className="trust-label">TRUSTED BY</div>
              {trustStats.map((stat, index) => (
                <div key={index} className="trust-stat">
                  <div className="trust-value">{stat.value}</div>
                  <div className="trust-description">{stat.label}</div>
                </div>
              ))}
              <div className="uptime-badge">99.99% Platform Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="service-cta">
        <div className="section-container">
          <h2>Ready to Secure Your Test Drives?</h2>
          <p>Join 500+ dealerships who trust us to protect their inventory, staff, and customers.</p>

          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/partner/register')}>
              Schedule a Demo
              <span className="btn-note">See it in action in 15 minutes</span>
            </button>
            <button className="btn-cta-secondary" onClick={() => window.open('https://verify.trustcredo.com/dealer-verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Start Free Trial
              <span className="btn-note">No credit card required</span>
            </button>
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
