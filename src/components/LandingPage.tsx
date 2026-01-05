import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const services = [
    { name: 'Digital ID Wallets', path: '/services/digital-id-wallets', description: 'Secure digital identity storage' },
    { name: 'Age Verification', path: '/services/age-verification', description: 'Compliant age verification' },
    { name: 'Test Drive Verified', path: '/services/test-drive-verified', description: 'Pre-verify test drive customers' },
  ];

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
      name: 'Starter',
      price: '$0',
      period: '/month',
      verifications: 'First 100 verifications free',
      features: ['Document verification', 'Face matching', 'Basic support', 'API access'],
      highlighted: false,
      buttonText: 'Get Started'
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      verifications: '1,000 verifications/month',
      features: ['Everything in Starter', 'Priority support', 'Webhooks', 'Advanced analytics'],
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
            <img src="/website-logo-horizontal.png" alt="TrustCredo" className="nav-logo" />
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <div className="services-dropdown" ref={servicesDropdownRef}>
              <button
                className="nav-link-dropdown"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                Services
                <svg
                  className={`dropdown-arrow ${servicesDropdownOpen ? 'open' : ''}`}
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {servicesDropdownOpen && (
                <div className="services-dropdown-menu">
                  {services.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => { navigate(service.path); setServicesDropdownOpen(false); }}
                    >
                      <strong>{service.name}</strong>
                      <span>{service.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <div className="login-dropdown" ref={dropdownRef}>
              <button
                className="btn-nav-secondary"
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
              >
                Login
                <svg
                  className={`dropdown-arrow ${loginDropdownOpen ? 'open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {loginDropdownOpen && (
                <div className="login-dropdown-menu">
                  <button onClick={() => { navigate('/partner/login'); setLoginDropdownOpen(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Partner Login
                  </button>
                  <button onClick={() => { navigate('/user/login'); setLoginDropdownOpen(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <path d="M20 8v6M23 11h-6"/>
                    </svg>
                    User Login
                  </button>
                </div>
              )}
            </div>
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
            <button className="btn-hero-secondary" onClick={() => window.open('https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
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

      {/* Trusted By Section */}
      <section className="trusted-by-section">
        <div className="section-container">
          <p className="trusted-label">Trusted by innovative companies worldwide</p>
          <div className="trusted-logos">
            <div className="trusted-logo">
              <svg viewBox="0 0 120 40" fill="currentColor">
                <text x="10" y="28" fontSize="18" fontWeight="700">AutoMax</text>
              </svg>
            </div>
            <div className="trusted-logo">
              <svg viewBox="0 0 120 40" fill="currentColor">
                <text x="10" y="28" fontSize="18" fontWeight="700">FinSecure</text>
              </svg>
            </div>
            <div className="trusted-logo">
              <svg viewBox="0 0 120 40" fill="currentColor">
                <text x="10" y="28" fontSize="18" fontWeight="700">RentEasy</text>
              </svg>
            </div>
            <div className="trusted-logo">
              <svg viewBox="0 0 120 40" fill="currentColor">
                <text x="10" y="28" fontSize="18" fontWeight="700">CarHub</text>
              </svg>
            </div>
            <div className="trusted-logo">
              <svg viewBox="0 0 120 40" fill="currentColor">
                <text x="10" y="28" fontSize="18" fontWeight="700">TrustBank</text>
              </svg>
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>See how businesses are using TrustCredo to streamline their verification process</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="testimonial-text">
                "TrustCredo reduced our customer onboarding time by 80%. The verification process is seamless and our customers love how quick it is."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <strong>James Davidson</strong>
                  <span>CEO, AutoMax Dealerships</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="testimonial-text">
                "The API integration was incredibly smooth. We went from evaluation to production in less than a week. Outstanding developer experience."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <strong>Sarah Mitchell</strong>
                  <span>CTO, FinSecure Inc.</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="testimonial-text">
                "We've processed over 50,000 verifications with 99.8% accuracy. TrustCredo has become an essential part of our security infrastructure."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MK</div>
                <div className="author-info">
                  <strong>Michael Kim</strong>
                  <span>VP Security, RentEasy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="security-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Enterprise-Grade Security</h2>
            <p>Your data is protected with industry-leading security standards</p>
          </div>
          <div className="security-badges">
            <div className="security-badge">
              <div className="badge-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3"/>
                  <path d="M24 14V24L30 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <text x="24" y="40" textAnchor="middle" fontSize="6" fill="currentColor">SOC 2</text>
                </svg>
              </div>
              <strong>SOC 2 Type II</strong>
              <p>Certified compliant</p>
            </div>
            <div className="security-badge">
              <div className="badge-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L6 12V22C6 33 14 42 24 44C34 42 42 33 42 22V12L24 4Z" stroke="currentColor" strokeWidth="3"/>
                  <path d="M18 24L22 28L30 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <strong>GDPR</strong>
              <p>Fully compliant</p>
            </div>
            <div className="security-badge">
              <div className="badge-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="16" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="3"/>
                  <path d="M16 16V12C16 8 20 4 24 4C28 4 32 8 32 12V16" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="24" cy="28" r="4" fill="currentColor"/>
                </svg>
              </div>
              <strong>256-bit SSL</strong>
              <p>End-to-end encryption</p>
            </div>
            <div className="security-badge">
              <div className="badge-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3"/>
                  <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">ISO</text>
                  <text x="24" y="32" textAnchor="middle" fontSize="6" fill="currentColor">27001</text>
                </svg>
              </div>
              <strong>ISO 27001</strong>
              <p>Information security</p>
            </div>
            <div className="security-badge">
              <div className="badge-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L6 12V22C6 33 14 42 24 44C34 42 42 33 42 22V12L24 4Z" stroke="currentColor" strokeWidth="3"/>
                  <text x="24" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">CCPA</text>
                </svg>
              </div>
              <strong>CCPA</strong>
              <p>Privacy compliant</p>
            </div>
          </div>
          <div className="security-features">
            <div className="security-feature">
              <span className="feature-check">✓</span>
              <span>Data encrypted at rest and in transit</span>
            </div>
            <div className="security-feature">
              <span className="feature-check">✓</span>
              <span>Regular third-party security audits</span>
            </div>
            <div className="security-feature">
              <span className="feature-check">✓</span>
              <span>99.99% uptime SLA available</span>
            </div>
            <div className="security-feature">
              <span className="feature-check">✓</span>
              <span>Data residency options available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners Section */}
      <section className="integrations-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Seamless Integrations</h2>
            <p>Connect TrustCredo with your existing tools and workflows</p>
          </div>
          <div className="integrations-grid">
            <div className="integration-card">
              <div className="integration-icon">
                <svg viewBox="0 0 48 48" fill="currentColor">
                  <rect x="4" y="4" width="40" height="40" rx="8" fill="#1a73e8" opacity="0.1"/>
                  <text x="24" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1a73e8">API</text>
                </svg>
              </div>
              <strong>REST API</strong>
              <p>Full-featured RESTful API with comprehensive documentation</p>
            </div>
            <div className="integration-card">
              <div className="integration-icon">
                <svg viewBox="0 0 48 48" fill="currentColor">
                  <rect x="4" y="4" width="40" height="40" rx="8" fill="#10b981" opacity="0.1"/>
                  <path d="M14 24L20 30L34 18" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <strong>Webhooks</strong>
              <p>Real-time notifications for verification events</p>
            </div>
            <div className="integration-card">
              <div className="integration-icon">
                <svg viewBox="0 0 48 48" fill="currentColor">
                  <rect x="4" y="4" width="40" height="40" rx="8" fill="#8b5cf6" opacity="0.1"/>
                  <text x="24" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8b5cf6">SDK</text>
                </svg>
              </div>
              <strong>SDKs</strong>
              <p>Native SDKs for JavaScript, Python, and more</p>
            </div>
            <div className="integration-card">
              <div className="integration-icon">
                <svg viewBox="0 0 48 48" fill="currentColor">
                  <rect x="4" y="4" width="40" height="40" rx="8" fill="#f59e0b" opacity="0.1"/>
                  <rect x="12" y="16" width="24" height="16" rx="2" stroke="#f59e0b" strokeWidth="3"/>
                  <circle cx="24" cy="24" r="4" fill="#f59e0b"/>
                </svg>
              </div>
              <strong>White Label</strong>
              <p>Custom branding for seamless user experience</p>
            </div>
          </div>
          <div className="integration-cta">
            <p>Need a custom integration? <button className="text-link" onClick={() => navigate('/partner/register')}>Talk to our team</button></p>
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
            <img src="/website-logo-horizontal-light.png" alt="TrustCredo" className="footer-logo" />
            <p>Secure identity verification for modern businesses</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus" target="_blank" rel="noopener noreferrer">Demo</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="/careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">GDPR</a>
            </div>
          </div>
        </div>
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/TrustCredo" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@TrustCredo" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ID Verification. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
