import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';

export const CareersPage: React.FC = () => {
  const navigate = useNavigate();

  const openPositions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build and maintain our identity verification platform using React, Node.js, and cloud technologies.'
    },
    {
      title: 'Machine Learning Engineer',
      department: 'AI/ML',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and improve our document verification and facial recognition algorithms.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Drive product strategy and roadmap for our identity verification solutions.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our enterprise customers succeed with TrustCredo integration and support.'
    },
    {
      title: 'Security Engineer',
      department: 'Security',
      location: 'Remote',
      type: 'Full-time',
      description: 'Ensure the security and compliance of our identity verification infrastructure.'
    }
  ];

  const benefits = [
    { icon: '🏠', title: 'Remote First', description: 'Work from anywhere in the world' },
    { icon: '💰', title: 'Competitive Salary', description: 'Top-tier compensation packages' },
    { icon: '📈', title: 'Equity', description: 'Share in our success with stock options' },
    { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive medical, dental, and vision' },
    { icon: '🌴', title: 'Unlimited PTO', description: 'Take the time you need to recharge' },
    { icon: '📚', title: 'Learning Budget', description: '$2,000 annual learning stipend' },
    { icon: '💻', title: 'Equipment', description: 'Latest MacBook and home office setup' },
    { icon: '👶', title: 'Parental Leave', description: '16 weeks paid parental leave' }
  ];

  return (
    <div className="landing-page">
      <SEO
        title="Careers at TrustCredo"
        description="Join our team and help build the future of identity verification. We're hiring engineers, product managers, and more."
        keywords="careers, jobs, identity verification, remote work, engineering jobs"
        canonicalUrl="/careers"
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
          <h1>Join Our Team</h1>
          <p>Help us build the future of identity verification</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="legal-content">
        <div className="section-container">
          <div className="careers-intro">
            <h2>Our Mission</h2>
            <p>
              At TrustCredo, we're on a mission to make identity verification fast, secure, and accessible
              for businesses of all sizes. We're building cutting-edge technology that helps prevent fraud
              while providing seamless experiences for end users.
            </p>
            <p>
              We're a remote-first company with team members across the globe, united by our passion for
              security, innovation, and exceptional customer experiences.
            </p>
          </div>

          {/* Benefits */}
          <div className="careers-benefits">
            <h2>Why Work With Us</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <span className="benefit-icon">{benefit.icon}</span>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="careers-positions">
            <h2>Open Positions</h2>
            <div className="positions-list">
              {openPositions.map((position, index) => (
                <div key={index} className="position-card">
                  <div className="position-header">
                    <h3>{position.title}</h3>
                    <div className="position-tags">
                      <span className="tag">{position.department}</span>
                      <span className="tag">{position.location}</span>
                      <span className="tag">{position.type}</span>
                    </div>
                  </div>
                  <p>{position.description}</p>
                  <button className="btn-apply">Apply Now</button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="careers-contact">
            <h2>Don't See Your Role?</h2>
            <p>
              We're always looking for talented people to join our team. Send your resume to{' '}
              <a href="mailto:careers@trustcredo.com">careers@trustcredo.com</a> and tell us how you can contribute.
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
