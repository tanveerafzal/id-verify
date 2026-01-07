import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const DigitalIDWalletsPage: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    { stat: '80%', label: 'Of users abandon sign-ups requiring document uploads' },
    { stat: '5+ min', label: 'Average time for repeat ID verification' },
    { stat: '$15-30', label: 'Cost per verification for businesses' }
  ];

  const benefits_user = [
    { title: 'One-Time Verification', description: 'Verify once, reuse everywhere' },
    { title: 'Instant Access', description: 'Share credentials in seconds' },
    { title: 'Privacy Control', description: 'Choose what data to share' },
    { title: 'Always Available', description: 'Digital ID on your phone' }
  ];

  const steps = [
    {
      number: 1,
      title: 'User Verifies Identity',
      description: 'Complete one-time verification with ID and selfie'
    },
    {
      number: 2,
      title: 'Credentials Stored Securely',
      description: 'Verified identity saved to encrypted digital wallet'
    },
    {
      number: 3,
      title: 'Instant Re-verification',
      description: 'Share verified credentials with any partner instantly'
    }
  ];

  const stats = [
    { value: '1 click', label: 'Re-verification' },
    { value: '95%', label: 'User Retention' },
    { value: '80%', label: 'Cost Reduction' }
  ];

  const benefits = [
    {
      icon: '🔄',
      title: 'Reusable Verification',
      description: 'Users verify once and reuse their credentials across your platform and partners.'
    },
    {
      icon: '⚡',
      title: 'Instant Onboarding',
      description: 'Reduce sign-up time from minutes to seconds with pre-verified credentials.'
    },
    {
      icon: '💰',
      title: 'Lower Costs',
      description: 'Pay once for verification, not every time the user needs to prove identity.'
    },
    {
      icon: '🔒',
      title: 'User-Controlled Privacy',
      description: 'Users decide what to share. Selective disclosure for minimum data exposure.'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'Works seamlessly on iOS and Android. Add to Apple Wallet or Google Wallet.'
    },
    {
      icon: '🌐',
      title: 'Cross-Platform',
      description: 'One verified identity works across web, mobile, and in-person verification.'
    }
  ];

  const features = [
    { title: 'Encrypted Storage', description: 'Military-grade encryption for all stored credentials' },
    { title: 'Biometric Lock', description: 'Face ID or fingerprint required to access wallet' },
    { title: 'Selective Sharing', description: 'Share only necessary attributes (age, name, etc.)' },
    { title: 'Audit Trail', description: 'Users see who accessed their credentials and when' }
  ];

  const useCases = [
    { title: 'Financial Services', description: 'Instant KYC for account opening' },
    { title: 'Marketplaces', description: 'Verified sellers and buyers' },
    { title: 'Sharing Economy', description: 'Trust between strangers' },
    { title: 'Healthcare', description: 'Patient identity verification' },
    { title: 'Travel & Hospitality', description: 'Seamless check-ins' },
    { title: 'Gaming & Entertainment', description: 'Age and identity gates' }
  ];

  const trustStats = [
    { value: '500K+', label: 'Active wallet users' },
    { value: '10M+', label: 'Credentials shared' },
    { value: '0', label: 'Security incidents' }
  ];

  return (
    <div className="landing-page service-page">
      <SEO
        title="Digital ID Wallets - Reusable Identity Verification | TrustCredo"
        description="Enable users to verify once and reuse their identity everywhere. Digital ID wallets for seamless, privacy-first identity sharing."
        keywords="digital ID wallet, reusable identity, verified credentials, identity verification, digital identity, mobile ID"
        canonicalUrl="/services/digital-id-wallets"
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
          <div className="service-badge">DIGITAL IDENTITY</div>
          <h1>Verify Once, <span className="highlight">Use Everywhere</span></h1>
          <p className="hero-subtitle">Reusable Digital Identity for the Modern World</p>
          <div className="hero-cta">
            <button className="btn-primary-large" onClick={() => navigate('/partner/register')}>
              Get Started
            </button>
            <button className="btn-secondary-large" onClick={() => window.open('https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Try Demo
            </button>
          </div>
          <p className="hero-note">Give your users a verified digital identity they can use anywhere.</p>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="service-challenge">
        <div className="section-container">
          <div className="section-label">THE PROBLEM</div>
          <h2>Identity Verification Is Broken</h2>

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
              <h3>Users deserve better:</h3>
              <ul className="risk-list">
                {benefits_user.map((item, index) => (
                  <li key={index}>
                    <strong>{item.title}</strong> — {item.description}
                  </li>
                ))}
              </ul>
              <div className="warning-box">
                <span className="warning-icon">💡</span>
                <span>Digital ID Wallets solve the verification fatigue problem.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="service-solution">
        <div className="section-container">
          <div className="section-label">THE SOLUTION</div>
          <h2>Digital ID Wallet</h2>

          <div className="solution-main">
            <div className="solution-icon">📱</div>
            <div className="solution-content">
              <h3>Your Identity, Your Control</h3>
              <p>Users complete one verification and receive a digital credential they can share instantly with any business. No more uploading IDs repeatedly. No more waiting for manual reviews.</p>
            </div>
          </div>

          <div className="solution-features">
            <div className="feature-card">
              <span className="feature-icon">🪪</span>
              <strong>Verified Credentials</strong>
              <p>Government ID verified once, stored securely in the wallet</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔗</span>
              <strong>One-Click Sharing</strong>
              <p>Share verified identity with partners in a single tap</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🛡️</span>
              <strong>Privacy Protected</strong>
              <p>Share only what's needed - age, name, or full identity</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="service-how-it-works">
        <div className="section-container">
          <div className="section-label">USER JOURNEY</div>
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
            <div className="stat-badge">Apple & Google Wallet</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="service-benefits">
        <div className="section-container">
          <div className="section-label">FOR BUSINESSES</div>
          <h2>Why Integrate Digital ID Wallets</h2>

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
          <div className="section-label">SECURITY & USE CASES</div>
          <h2>Enterprise-Grade Security</h2>

          <div className="tech-content">
            <div className="tech-features">
              <h3>Security Features</h3>
              <div className="tech-grid">
                {features.map((feature, index) => (
                  <div key={index} className="tech-card">
                    <strong>{feature.title}</strong>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>

              <h3>Use Cases</h3>
              <div className="tech-grid">
                {useCases.map((useCase, index) => (
                  <div key={index} className="tech-card">
                    <strong>{useCase.title}</strong>
                    <p>{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="trust-stats">
              <div className="trust-label">PLATFORM STATS</div>
              {trustStats.map((stat, index) => (
                <div key={index} className="trust-stat">
                  <div className="trust-value">{stat.value}</div>
                  <div className="trust-description">{stat.label}</div>
                </div>
              ))}
              <div className="uptime-badge">99.99% Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="service-cta">
        <div className="section-container">
          <h2>Ready to Transform Identity Verification?</h2>
          <p>Give your users the gift of reusable identity.</p>

          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/partner/register')}>
              Start Integration
              <span className="btn-note">Free sandbox access</span>
            </button>
            <button className="btn-cta-secondary" onClick={() => window.open('https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Try Demo
              <span className="btn-note">Experience the wallet</span>
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
