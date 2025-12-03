import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl, getAssetUrl } from '../config/api';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

interface Partner {
  id: string;
  email: string;
  companyName: string;
  logoUrl?: string;
}

export const PartnerLayout: React.FC<PartnerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    loadPartnerInfo();
  }, []);

  const loadPartnerInfo = async () => {
    const token = localStorage.getItem('partnerToken');
    if (!token) return;

    try {
      const response = await fetch(getApiUrl('/api/partners/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPartner(data.data);
      }
    } catch (error) {
      console.error('Failed to load partner info:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partnerToken');
    localStorage.removeItem('partner');
    navigate('/partner/login');
  };

  const menuItems = [
    { path: '/partner/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/partner/request-verification', label: 'Request Verification', icon: '➕' },
    { path: '/partner/verifications', label: 'Verifications', icon: '✓' },
    { path: '/partner/settings', label: 'Settings', icon: '⚙️' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="partner-layout">
      {/* Left Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="partner-branding">
            {partner?.logoUrl ? (
              <img
                src={getAssetUrl(partner.logoUrl)}
                alt={partner.companyName}
                className="partner-logo"
              />
            ) : (
              <div className="partner-logo-placeholder">
                {partner?.companyName?.substring(0, 2).toUpperCase() || 'ID'}
              </div>
            )}
            <h2 className="partner-name">{partner?.companyName || 'ID Verify'}</h2>
          </div>
          <button
            className="mobile-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            ☰
          </button>
          <div className="top-bar-title">Partner Portal</div>
        </header>

        {/* Page Content */}
        <div className="content-area">
          {children}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
