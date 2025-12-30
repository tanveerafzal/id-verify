import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { VerificationCertificate } from './VerificationCertificate';

interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  verificationId?: string;
  verification?: {
    id: string;
    status: string;
    completedAt?: string;
    documentType?: string;
    extractedData?: {
      fullName?: string;
      dateOfBirth?: string;
      documentNumber?: string;
      expiryDate?: string;
      issuingCountry?: string;
    };
  };
}

export const UserCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      navigate('/user/login');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/users/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          navigate('/user/login');
          return;
        }
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error('Error loading user data:', error);
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/user/login');
  };

  // Generate certificate number from verification ID
  const generateCertificateNumber = (verificationId?: string) => {
    if (!verificationId) return 'CERT-000000';
    const hash = verificationId.substring(0, 8).toUpperCase();
    return `CERT-${hash}`;
  };

  if (loading) {
    return (
      <div className="user-dashboard-loading">
        <div className="spinner" />
        <p>Loading certificate...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-dashboard-loading">
        <p>Error loading certificate. Please try again.</p>
        <button className="btn-primary" onClick={() => navigate('/user/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="user-layout">
      {/* Sidebar */}
      <aside className="user-sidebar no-print">
        <div className="user-sidebar-brand">
          <div className="brand-icon">ID</div>
          <h2>ID Verification</h2>
        </div>

        <nav className="user-sidebar-nav">
          <a href="/user/dashboard">
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="/user/certificate" className="active">
            <span className="nav-icon">📜</span>
            <span>Certificate</span>
          </a>
        </nav>

        <div className="user-sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h4>{user.fullName}</h4>
              <p>{user.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        <header className="user-header no-print">
          <h1>Verification Certificate</h1>
        </header>

        <div className="user-content">
          <VerificationCertificate
            userName={user.fullName}
            verificationDate={user.verification?.completedAt || user.createdAt}
            validUntil={user.verification?.extractedData?.expiryDate}
            certificateNumber={generateCertificateNumber(user.verificationId || user.verification?.id)}
            documentType={user.verification?.documentType}
            issuingCountry={user.verification?.extractedData?.issuingCountry}
          />
        </div>
      </main>
    </div>
  );
};
