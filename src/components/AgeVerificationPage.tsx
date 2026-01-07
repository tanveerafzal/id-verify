import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const AgeVerificationPage: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    { stat: '$500K+', label: 'Average penalty for selling to minors' },
    { stat: '70%', label: 'Of fake IDs pass visual inspection' },
    { stat: '3x', label: 'Increase in online age-restricted purchases' }
  ];

  const risks = [
    { title: 'Legal Penalties', description: 'Heavy fines and license revocation' },
    { title: 'Brand Damage', description: 'Reputation harm from compliance failures' },
    { title: 'Criminal Liability', description: 'Personal liability for staff and owners' },
    { title: 'Lost Revenue', description: 'Business closure from repeat violations' }
  ];

  const steps = [
    {
      number: 1,
      title: 'Customer Initiates Purchase',
      description: 'Age-restricted item triggers verification flow'
    },
    {
      number: 2,
      title: 'Quick ID Verification',
      description: 'Customer scans ID and confirms with selfie'
    },
    {
      number: 3,
      title: 'Instant Age Confirmation',
      description: 'Real-time verification without storing sensitive data'
    }
  ];

  const stats = [
    { value: '< 30 sec', label: 'Verification Time' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '190+', label: 'Countries Supported' }
  ];

  const benefits = [
    {
      icon: '18+',
      title: 'Regulatory Compliance',
      description: 'Meet age verification requirements for alcohol, tobacco, cannabis, and gambling.'
    },
    {
      icon: '🔒',
      title: 'Privacy-First Design',
      description: 'Verify age without storing birthdate or personal details. Only confirm yes/no.'
    },
    {
      icon: '⚡',
      title: 'Frictionless Experience',
      description: 'Customers verify in seconds. No app downloads or account creation required.'
    },
    {
      icon: '🌐',
      title: 'Works Everywhere',
      description: 'Online, in-store, or at delivery. One solution for all channels.'
    },
    {
      icon: '📊',
      title: 'Audit Trail',
      description: 'Complete verification logs for compliance reporting and legal protection.'
    },
    {
      icon: '🔗',
      title: 'Easy Integration',
      description: 'REST API and SDKs for web, mobile, and POS systems.'
    }
  ];

  const industries = [
    { title: 'Alcohol & Spirits', description: 'Online sales, delivery, and retail compliance' },
    { title: 'Tobacco & Vape', description: 'FDA and state regulation compliance' },
    { title: 'Cannabis', description: 'Dispensary and delivery verification' },
    { title: 'Online Gambling', description: 'Gaming and betting age gates' },
    { title: 'Adult Content', description: 'Age-restricted media and services' },
    { title: 'Firearms', description: 'Legal purchase verification' }
  ];

  const trustStats = [
    { value: '1M+', label: 'Age verifications monthly' },
    { value: '99.9%', label: 'Compliance rate' },
    { value: '0', label: 'Data breaches' }
  ];

  return (
    <div className="landing-page service-page">
      <SEO
        title="Age Verification - Compliant Age Checks | TrustCredo"
        description="Instant, compliant age verification for alcohol, tobacco, cannabis, and gambling. Privacy-first design meets regulatory requirements."
        keywords="age verification, ID verification, alcohol age check, tobacco compliance, cannabis verification, gambling age gate"
        canonicalUrl="/services/age-verification"
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
          <div className="service-badge">AGE-RESTRICTED INDUSTRIES</div>
          <h1>Verify Age <span className="highlight">Instantly & Compliantly</span></h1>
          <p className="hero-subtitle">Privacy-First Age Verification for Regulated Industries</p>
          <div className="hero-cta">
            <button className="btn-primary-large" onClick={() => navigate('/partner/register')}>
              Start Free Trial
            </button>
            <button className="btn-secondary-large" onClick={() => window.open('https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Try Demo
            </button>
          </div>
          <p className="hero-note">No credit card required. GDPR & CCPA compliant.</p>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="service-challenge">
        <div className="section-container">
          <div className="section-label">THE CHALLENGE</div>
          <h2>Age Verification Is No Longer Optional</h2>

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
              <h3>Non-compliance puts your business at risk:</h3>
              <ul className="risk-list">
                {risks.map((risk, index) => (
                  <li key={index}>
                    <strong>{risk.title}</strong> — {risk.description}
                  </li>
                ))}
              </ul>
              <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <span>Self-declaration checkboxes don't meet regulatory requirements.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="service-solution">
        <div className="section-container">
          <div className="section-label">THE SOLUTION</div>
          <h2>Real Verification, Real Compliance</h2>

          <div className="solution-main">
            <div className="solution-icon">✓</div>
            <div className="solution-content">
              <h3>Document-Based Age Verification</h3>
              <p>Verify customer age using government-issued IDs with biometric matching. Get a definitive yes/no answer without storing sensitive personal data.</p>
            </div>
          </div>

          <div className="solution-features">
            <div className="feature-card">
              <span className="feature-icon">🪪</span>
              <strong>ID Document Scan</strong>
              <p>Extract and verify birthdate from driver's licenses and passports</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👤</span>
              <strong>Biometric Match</strong>
              <p>Selfie verification ensures the ID belongs to the customer</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔐</span>
              <strong>Privacy Mode</strong>
              <p>Return only age confirmation - no personal data stored</p>
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
            <div className="stat-badge">No App Required</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="service-benefits">
        <div className="section-container">
          <div className="section-label">WHY CHOOSE TRUSTCREDO</div>
          <h2>Built for Compliance</h2>

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

      {/* Industries Section */}
      <section className="service-technology">
        <div className="section-container">
          <div className="section-label">INDUSTRIES WE SERVE</div>
          <h2>Age Verification for Every Regulated Industry</h2>

          <div className="tech-content">
            <div className="tech-features">
              <h3>Supported Industries</h3>
              <div className="tech-grid">
                {industries.map((industry, index) => (
                  <div key={index} className="tech-card">
                    <strong>{industry.title}</strong>
                    <p>{industry.description}</p>
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
              <div className="uptime-badge">SOC 2 Type II Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="service-cta">
        <div className="section-container">
          <h2>Ready to Stay Compliant?</h2>
          <p>Join hundreds of businesses using TrustCredo for age verification.</p>

          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/partner/register')}>
              Start Free Trial
              <span className="btn-note">No credit card required</span>
            </button>
            <button className="btn-cta-secondary" onClick={() => window.open('https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Try Demo
              <span className="btn-note">See it in action</span>
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
