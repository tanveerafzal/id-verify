import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

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
      <SEO
        title="Secure Identity Verification Platform"
        description="TrustCredo provides fast, secure, and reliable identity verification services. AI-powered KYC, document verification, and biometric face matching trusted by businesses worldwide."
        keywords="identity verification, KYC, document verification, ID verification, passport verification, biometric verification, face matching, digital identity, fraud prevention"
        canonicalUrl="/"
      />
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">ID</div>
            <span className="brand-name">[TrustCredo ID Verification Platform]</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#solutions">Solutions</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
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

      {/* Solutions Section */}
      <section id="solutions" className="solutions-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Solutions</h2>
            <p>Tailored identity verification solutions for every industry need</p>
          </div>
          <div className="solutions-grid">
            {/* Digital ID Wallets */}
            <div className="solution-card">
              <div className="solution-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="3"/>
                  <rect x="16" y="20" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="26" cy="27" r="4" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="46" x2="28" y2="46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M44 28L48 32L56 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Digital ID Wallets</h3>
              <p>
                Secure, portable digital identity storage for your users. Enable customers to store verified credentials
                and share them instantly across platforms with end-to-end encryption.
              </p>
              <ul className="solution-features">
                <li><span className="check">✓</span> Encrypted credential storage</li>
                <li><span className="check">✓</span> One-click identity sharing</li>
                <li><span className="check">✓</span> Cross-platform compatibility</li>
                <li><span className="check">✓</span> User-controlled privacy</li>
              </ul>
              <button className="btn-solution" onClick={() => navigate('/partner/register')}>
                Learn More
              </button>
            </div>

            {/* Age Verification */}
            <div className="solution-card featured">
              <div className="solution-badge">Popular</div>
              <div className="solution-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="3"/>
                  <path d="M16 52C16 41.5 23.2 33 32 33C40.8 33 48 41.5 48 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M40 44L44 48L52 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="24" y="24" fontSize="10" fontWeight="bold" fill="currentColor">18+</text>
                </svg>
              </div>
              <h3>Age Verification</h3>
              <p>
                Compliant age verification for regulated industries. Verify customer ages instantly for alcohol,
                tobacco, gaming, and adult content platforms while maintaining privacy.
              </p>
              <ul className="solution-features">
                <li><span className="check">✓</span> Instant age confirmation</li>
                <li><span className="check">✓</span> Regulatory compliance (COPPA, GDPR)</li>
                <li><span className="check">✓</span> Privacy-preserving verification</li>
                <li><span className="check">✓</span> Multi-document support</li>
              </ul>
              <button className="btn-solution-primary" onClick={() => navigate('/partner/register')}>
                Get Started
              </button>
            </div>

            {/* Test Drive Verified */}
            <div className="solution-card">
              <div className="solution-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="32" cy="40" rx="24" ry="10" stroke="currentColor" strokeWidth="3"/>
                  <path d="M14 36L18 24H46L50 36" stroke="currentColor" strokeWidth="3"/>
                  <rect x="22" y="26" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="20" cy="40" r="4" fill="currentColor"/>
                  <circle cx="44" cy="40" r="4" fill="currentColor"/>
                  <path d="M48 18L52 22L60 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="4" y="12" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="20" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Test Drive - Verified</h3>
              <p>
                Pre-verify customers before vehicle test drives. Confirm driver's license validity, identity,
                and insurance status to protect your dealership and streamline the experience.
              </p>
              <ul className="solution-features">
                <li><span className="check">✓</span> Driver's license validation</li>
                <li><span className="check">✓</span> Identity confirmation</li>
                <li><span className="check">✓</span> Insurance verification</li>
                <li><span className="check">✓</span> Dealership risk reduction</li>
              </ul>
              <button className="btn-solution" onClick={() => navigate('/partner/register')}>
                Learn More
              </button>
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

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>About TrustCredo</h2>
            <p>Enterprise-grade identity verification trusted by businesses worldwide</p>
          </div>

          <div className="about-content">
            <div className="about-main">
              <div className="about-description">
                <p>
                  TrustCredo is a comprehensive ID verification platform that powers KYC (Know Your Customer)
                  processes across industries. We enable businesses to verify identities remotely via SMS, email,
                  web links, and API integrations—delivering enterprise-grade security without friction.
                </p>
                <p>
                  Our AI-powered platform authenticates government-issued IDs, performs biometric facial matching,
                  detects liveness, and cross-references multiple databases—all in under 60 seconds. With 99.7%
                  fraud detection accuracy and 94% completion rates, TrustCredo makes verification seamless for
                  your customers while keeping your business secure.
                </p>
              </div>

              <div className="about-industries">
                <h3>Industries We Serve</h3>
                <div className="industries-grid">
                  <div className="industry-item">
                    <span className="industry-icon">🚗</span>
                    <div>
                      <strong>Automotive</strong>
                      <p>Test drive verification, vehicle rentals, dealership security</p>
                    </div>
                  </div>
                  <div className="industry-item">
                    <span className="industry-icon">🏦</span>
                    <div>
                      <strong>Financial Services</strong>
                      <p>Account opening, loan applications, high-risk transactions</p>
                    </div>
                  </div>
                  <div className="industry-item">
                    <span className="industry-icon">🏠</span>
                    <div>
                      <strong>Real Estate</strong>
                      <p>Property viewings, tenant screening, contractor verification</p>
                    </div>
                  </div>
                  <div className="industry-item">
                    <span className="industry-icon">🏥</span>
                    <div>
                      <strong>Healthcare</strong>
                      <p>Patient intake, telehealth verification, prescription validation</p>
                    </div>
                  </div>
                  <div className="industry-item">
                    <span className="industry-icon">🛒</span>
                    <div>
                      <strong>Marketplaces</strong>
                      <p>Peer-to-peer transactions, seller verification, buyer protection</p>
                    </div>
                  </div>
                  <div className="industry-item">
                    <span className="industry-icon">🏨</span>
                    <div>
                      <strong>Hospitality</strong>
                      <p>Guest check-in, equipment rentals, access control</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-features">
              <h3>Why Businesses Choose TrustCredo</h3>
              <ul className="why-choose-list">
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Multi-Channel Delivery</strong>
                    <p>Send verification requests via SMS, email, QR code, or API</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Global Coverage</strong>
                    <p>Support for 6,500+ document types from 190+ countries</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>No App Required</strong>
                    <p>Mobile-first experience works in any browser</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Enterprise Security</strong>
                    <p>SOC 2 Type II certified, GDPR & CCPA compliant</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Developer-Friendly</strong>
                    <p>RESTful API, webhooks, white-label options</p>
                  </div>
                </li>
                <li>
                  <span className="check">✓</span>
                  <div>
                    <strong>Real-Time Results</strong>
                    <p>Instant verification with customizable risk thresholds</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="about-tagline">
            <p>Trusted by businesses worldwide. <strong>Verify anyone, anywhere, instantly.</strong></p>
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
            <span className="brand-name">[The ID verification Company]</span>
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
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
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
