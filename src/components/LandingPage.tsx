import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔐',
      title: 'Secure Verification',
      description: 'Bank-grade security with encrypted document processing and secure data handling.'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Get verification results in seconds with our advanced AI-powered document analysis.'
    },
    {
      icon: '🌍',
      title: 'Global Coverage',
      description: 'Support for passports, driver\'s licenses, and national IDs from 190+ countries.'
    },
    {
      icon: '🎯',
      title: 'High Accuracy',
      description: '99.9% accuracy rate with advanced face matching and document authenticity checks.'
    },
    {
      icon: '🔗',
      title: 'Easy Integration',
      description: 'Simple REST API and webhook support for seamless integration with your applications.'
    },
    {
      icon: '📊',
      title: 'Real-time Dashboard',
      description: 'Monitor verifications, track usage, and manage your account from one dashboard.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      verifications: '100 verifications/month',
      features: ['Document verification', 'Face matching', 'Basic support', 'API access'],
      highlighted: false,
      buttonText: 'Get Started Free'
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      verifications: '1,000 verifications/month',
      features: ['Everything in Free', 'Priority support', 'Webhooks', 'Advanced analytics'],
      highlighted: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      verifications: 'Unlimited verifications',
      features: ['Everything in Pro', 'Dedicated support', 'Custom integration', 'SLA guarantee'],
      highlighted: false,
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">ID</div>
            <span className="brand-name">ID Verification</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Identity Verification Made Simple</h1>
          <p className="hero-subtitle">
            Verify customer identities in seconds with our AI-powered document verification
            and face matching technology. Trusted by businesses worldwide.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => navigate('/partner/register')}>
              Start Free Trial
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('/verify')}>
              Try Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">10M+</span>
              <span className="stat-label">Verifications</span>
            </div>
            <div className="stat">
              <span className="stat-value">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-value">190+</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="verification-preview">
              <div className="preview-header">
                <span className="preview-icon">✓</span>
                <span>Verification Complete</span>
              </div>
              <div className="preview-details">
                <div className="preview-item">
                  <span className="check">✓</span> Document Authentic
                </div>
                <div className="preview-item">
                  <span className="check">✓</span> Face Match: 98%
                </div>
                <div className="preview-item">
                  <span className="check">✓</span> Not Expired
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to verify identities securely and efficiently</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started in minutes with our simple verification process</p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Document</h3>
              <p>User uploads a photo of their government-issued ID document</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Take Selfie</h3>
              <p>User takes a selfie for face matching verification</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Results</h3>
              <p>Receive instant verification results with detailed analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Simple Pricing</h2>
            <p>Choose the plan that fits your needs. Start free, upgrade anytime.</p>
          </div>
          <div className="pricing-grid">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`pricing-card ${tier.highlighted ? 'highlighted' : ''}`}>
                {tier.highlighted && <div className="popular-badge">Most Popular</div>}
                <h3>{tier.name}</h3>
                <div className="price">
                  <span className="price-value">{tier.price}</span>
                  <span className="price-period">{tier.period}</span>
                </div>
                <p className="verifications">{tier.verifications}</p>
                <ul className="feature-list">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <span className="check">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={tier.highlighted ? 'btn-pricing-primary' : 'btn-pricing-secondary'}
                  onClick={() => navigate('/partner/register')}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of businesses using ID Verification to protect their platforms</p>
          <div className="cta-actions">
            <button className="btn-cta-primary" onClick={() => navigate('/partner/register')}>
              Create Free Account
            </button>
            <button className="btn-cta-secondary" onClick={() => navigate('/partner/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-icon">ID</div>
            <span className="brand-name">ID Verification</span>
            <p>Secure identity verification for modern businesses</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="/verify">Demo</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#contact">Contact</a>
              <a href="#contact">About Us</a>
              <a href="#contact">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#contact">Privacy Policy</a>
              <a href="#contact">Terms of Service</a>
              <a href="#contact">GDPR</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ID Verification. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
