import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const SMSVerificationPage: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    { stat: '30%', label: 'Of users drop off during ID verification' },
    { stat: '15%', label: 'Of phone numbers entered are invalid' },
    { stat: '2x', label: 'Higher conversion with familiar OTP flow' }
  ];

  const benefits_list = [
    { title: 'Validate Phone Numbers', description: 'Confirm users have access to the number they provide' },
    { title: 'Reduce Fraud Early', description: 'Filter out fake accounts before costly ID checks' },
    { title: 'Familiar Experience', description: 'Users know and trust OTP verification' },
    { title: 'Improve Pass Rates', description: 'Warm up users before document verification' }
  ];

  const steps = [
    {
      number: 1,
      title: 'User Enters Phone Number',
      description: 'Capture mobile number as first step in KYC flow'
    },
    {
      number: 2,
      title: 'OTP Sent Instantly',
      description: 'One-time passcode delivered via SMS in seconds'
    },
    {
      number: 3,
      title: 'User Confirms Code',
      description: 'Simple 6-digit entry confirms phone ownership'
    },
    {
      number: 4,
      title: 'Proceed to ID Check',
      description: 'Verified users continue to document verification'
    }
  ];

  const stats = [
    { value: '< 5 sec', label: 'SMS Delivery' },
    { value: '98%', label: 'Delivery Rate' },
    { value: '200+', label: 'Countries' }
  ];

  const benefits = [
    {
      icon: '📱',
      title: 'Phone Number Validation',
      description: 'Confirm users own the phone number they provide before proceeding with verification.'
    },
    {
      icon: '🚀',
      title: 'Boost Conversion Rates',
      description: 'Familiar OTP flow builds confidence. Users who complete SMS verification are 2x more likely to finish KYC.'
    },
    {
      icon: '🛡️',
      title: 'Early Fraud Detection',
      description: 'Filter out fraudsters early with phone verification. Reduce costs from failed ID checks.'
    },
    {
      icon: '✨',
      title: 'Seamless Integration',
      description: 'Add SMS verification as an optional step before ID document capture in your existing flow.'
    },
    {
      icon: '🌍',
      title: 'Global Coverage',
      description: 'Send OTP to 200+ countries with carrier-grade delivery and automatic failover.'
    },
    {
      icon: '⚡',
      title: 'Instant Delivery',
      description: 'Messages delivered in under 5 seconds with real-time delivery confirmation.'
    }
  ];

  const features = [
    { title: 'Smart Retry Logic', description: 'Automatic resend with voice fallback option' },
    { title: 'Rate Limiting', description: 'Built-in protection against OTP abuse' },
    { title: 'Number Intelligence', description: 'Detect carrier type, line type, and risk signals' },
    { title: 'Customizable Templates', description: 'Brand your OTP messages with your company name' }
  ];

  const useCases = [
    { title: 'KYC Pre-verification', description: 'Warm up users before document checks' },
    { title: 'Account Registration', description: 'Verify phone during sign-up' },
    { title: 'Transaction Confirmation', description: 'Confirm high-value actions' },
    { title: 'Password Reset', description: 'Secure account recovery flow' }
  ];

  const trustStats = [
    { value: '50M+', label: 'OTPs sent monthly' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 5 sec', label: 'Average delivery' }
  ];

  return (
    <div className="landing-page service-page">
      <SEO
        title="SMS Verification - OTP Phone Verification | TrustCredo"
        description="Add SMS OTP verification to your KYC workflow. Validate phone numbers, improve conversion rates, and filter fraud before ID document checks."
        keywords="SMS verification, OTP verification, phone verification, KYC, one-time passcode, mobile verification, phone number validation"
        canonicalUrl="/services/sms-verification"
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
          <div className="service-badge">KYC ENHANCEMENT</div>
          <h1>Verify Phone Numbers <span className="highlight">Before ID Checks</span></h1>
          <p className="hero-subtitle">Add OTP Verification to Your KYC Workflow</p>
          <div className="hero-cta">
            <button className="btn-primary-large" onClick={() => navigate('/partner/register')}>
              Start Free Trial
            </button>
            <button className="btn-secondary-large" onClick={() => window.open('https://verify.trustcredo.com/verify?verification-request=KajLfFLOjraHyS1BgQr3DjfWhSX48cRa4H7WtUDk0ZwtkjZdOGGj_ZbaT7KHuOGENW3OYOa3GShs6JWbLnZ82G0Icus', '_blank')}>
              Try Demo
            </button>
          </div>
          <p className="hero-note">Convert more users with a familiar onboarding experience.</p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="service-challenge">
        <div className="section-container">
          <div className="section-label">WHY SMS VERIFICATION</div>
          <h2>Improve KYC Pass Rates with a Simple Step</h2>

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
              <h3>Add an extra prompt before ID document check:</h3>
              <ul className="risk-list">
                {benefits_list.map((item, index) => (
                  <li key={index}>
                    <strong>{item.title}</strong> — {item.description}
                  </li>
                ))}
              </ul>
              <div className="warning-box">
                <span className="warning-icon">💡</span>
                <span>Users who verify their phone are 2x more likely to complete full KYC.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="service-solution">
        <div className="section-container">
          <div className="section-label">THE SOLUTION</div>
          <h2>One-Time Passcode Verification</h2>

          <div className="solution-main">
            <div className="solution-icon">📲</div>
            <div className="solution-content">
              <h3>Familiar, Fast, and Effective</h3>
              <p>Send a One-Time Passcode (OTP) directly to the user's mobile device to confirm they've entered a valid phone number. A familiar experience that builds trust and improves conversion rates before the ID document check.</p>
            </div>
          </div>

          <div className="solution-features">
            <div className="feature-card">
              <span className="feature-icon">✉️</span>
              <strong>Instant SMS Delivery</strong>
              <p>OTP delivered in under 5 seconds to 200+ countries</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔢</span>
              <strong>Simple 6-Digit Code</strong>
              <p>Easy entry with auto-fill support on mobile devices</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔄</span>
              <strong>Smart Fallback</strong>
              <p>Voice call option if SMS doesn't reach the user</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="service-how-it-works">
        <div className="section-container">
          <div className="section-label">SIMPLE FLOW</div>
          <h2>How It Works</h2>

          <div className="steps-container steps-four">
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
            <div className="stat-badge">Voice Fallback Available</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="service-benefits">
        <div className="section-container">
          <div className="section-label">KEY BENEFITS</div>
          <h2>Why Add SMS to Your KYC Flow</h2>

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
          <div className="section-label">FEATURES & USE CASES</div>
          <h2>Enterprise-Ready SMS Verification</h2>

          <div className="tech-content">
            <div className="tech-features">
              <h3>Platform Features</h3>
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
              <div className="uptime-badge">Carrier-Grade Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="service-cta">
        <div className="section-container">
          <h2>Ready to Boost Your KYC Conversion?</h2>
          <p>Add SMS verification and convert more legitimate users.</p>

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
