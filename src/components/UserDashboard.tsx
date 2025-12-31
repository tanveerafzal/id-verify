import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';

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

export const UserDashboard: React.FC = () => {
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
      // Try to use cached user data
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="user-dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-dashboard-loading">
        <p>Error loading dashboard. Please try again.</p>
        <button className="btn-primary" onClick={() => navigate('/user/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="user-layout">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <div className="user-sidebar-brand">
          <div className="brand-icon">ID</div>
          <h2>ID Verification</h2>
        </div>

        <nav className="user-sidebar-nav">
          <a href="/user/dashboard" className="active">
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          {user?.verification?.status === 'COMPLETED' && (
            <a href="/user/certificate">
              <span className="nav-icon">📜</span>
              <span>Certificate</span>
            </a>
          )}
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
        <header className="user-header">
          <h1>Dashboard</h1>
        </header>

        <div className="user-content">
          <div className="user-dashboard-grid">
            {/* Welcome Card */}
            <div className="user-dashboard-card user-welcome-card">
              <h2>Welcome, {user.fullName}!</h2>
              <p>
                {user.verification?.status === 'COMPLETED'
                  ? 'Your identity has been successfully verified. You can view your verification details below.'
                  : user.verification?.status === 'FAILED'
                    ? 'Your identity verification was not successful. Some features may be limited.'
                    : 'Your account has been created. Complete identity verification to access all features.'}
              </p>
            </div>

            {/* Profile Card */}
            <div className="user-dashboard-card user-profile-card">
              <h3>Profile Information</h3>
              <div className="profile-item">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">{user.fullName}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Account Created</span>
                <span className="profile-value">{formatDate(user.createdAt)}</span>
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="user-dashboard-card user-verification-card">
              <h3>Verification Status</h3>
              <div className={`verification-status ${user.verification?.status === 'COMPLETED' ? 'status-verified' : user.verification?.status === 'FAILED' ? 'status-failed' : 'status-pending'}`}>
                <div className="status-icon">
                  {user.verification?.status === 'COMPLETED' ? '✓' : user.verification?.status === 'FAILED' ? '!' : '○'}
                </div>
                <div className="status-text">
                  <h4>
                    {user.verification?.status === 'COMPLETED' ? 'Verified' : user.verification?.status === 'FAILED' ? 'Not Verified' : 'Pending'}
                  </h4>
                  <p>
                    {user.verification?.status === 'COMPLETED'
                      ? 'Your identity has been successfully verified'
                      : user.verification?.status === 'FAILED'
                        ? 'Your identity verification was not successful'
                        : 'Identity verification is pending'}
                  </p>
                </div>
              </div>

              {user.verification?.status === 'COMPLETED' && user.verification?.extractedData && (
                <>
                  {user.verification.extractedData.documentNumber && (
                    <div className="profile-item">
                      <span className="profile-label">Document Number </span>
                      <span className="profile-value">{user.verification.extractedData.documentNumber}</span>
                    </div>
                  )}
                  {user.verification.extractedData.dateOfBirth && (
                    <div className="profile-item">
                      <span className="profile-label">Date of Birth </span>
                      <span className="profile-value">{formatDate(user.verification.extractedData.dateOfBirth)}</span>
                    </div>
                  )}
                  {user.verification.extractedData.issuingCountry && (
                    <div className="profile-item">
                      <span className="profile-label">Issuing Country </span>
                      <span className="profile-value">{user.verification.extractedData.issuingCountry}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Certificate Card - Only show when verified */}
            {user.verification?.status === 'COMPLETED' && (
              <div className="user-dashboard-card user-certificate-card">
                <h3>Verification Certificate</h3>
                <div className="certificate-preview">
                  <div className="certificate-preview-info">
                    <h4>Your Identity Certificate</h4>
                    <p>
                      Valid until: {user.verification?.extractedData?.expiryDate
                        ? formatDate(user.verification.extractedData.expiryDate)
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="certificate-preview-badge">
                    <span className="badge-icon">✓</span>
                    <span>Verified</span>
                  </div>
                </div>
                <button
                  className="btn-view-certificate"
                  onClick={() => navigate('/user/certificate')}
                >
                  View Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
