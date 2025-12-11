import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getApiUrl } from '../config/api';

interface DashboardStats {
  totalPartners: number;
  activePartners: number;
  totalVerifications: number;
  verificationsThisMonth: number;
  pendingVerifications: number;
  completedVerifications: number;
  failedVerifications: number;
  revenueThisMonth: number;
}

interface RecentPartner {
  id: string;
  companyName: string;
  email: string;
  tier: { displayName: string };
  createdAt: string;
  verificationsUsed: number;
}

interface RecentVerification {
  id: string;
  userName: string;
  partner: { companyName: string };
  status: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPartners, setRecentPartners] = useState<RecentPartner[]>([]);
  const [recentVerifications, setRecentVerifications] = useState<RecentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      // Load dashboard stats
      const statsResponse = await fetch(getApiUrl('/api/admin/dashboard-stats'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!statsResponse.ok) {
        if (statsResponse.status === 401) {
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to load dashboard stats');
      }

      const statsData = await statsResponse.json();
      setStats(statsData.data);

      // Load recent partners
      const partnersResponse = await fetch(getApiUrl('/api/admin/partners?limit=5&sort=createdAt&order=desc'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (partnersResponse.ok) {
        const partnersData = await partnersResponse.json();
        setRecentPartners(partnersData.data.partners || []);
      }

      // Load recent verifications
      const verificationsResponse = await fetch(getApiUrl('/api/admin/verifications?limit=5&sort=createdAt&order=desc'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (verificationsResponse.ok) {
        const verificationsData = await verificationsResponse.json();
        setRecentVerifications(verificationsData.data.verifications || []);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-progress';
      case 'FAILED': return 'status-failed';
      default: return '';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="spinner" />
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Overview of your ID verification platform</p>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon partners-icon">👥</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.totalPartners || 0}</span>
              <span className="stat-label">Total Partners</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon active-icon">✓</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.activePartners || 0}</span>
              <span className="stat-label">Active Partners</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon verifications-icon">📋</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.totalVerifications || 0}</span>
              <span className="stat-label">Total Verifications</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon month-icon">📅</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.verificationsThisMonth || 0}</span>
              <span className="stat-label">This Month</span>
            </div>
          </div>
        </div>

        {/* Verification Status Overview */}
        <div className="admin-status-overview">
          <h3>Verification Status</h3>
          <div className="status-cards">
            <div className="status-card pending">
              <span className="status-count">{stats?.pendingVerifications || 0}</span>
              <span className="status-name">Pending</span>
            </div>
            <div className="status-card completed">
              <span className="status-count">{stats?.completedVerifications || 0}</span>
              <span className="status-name">Completed</span>
            </div>
            <div className="status-card failed">
              <span className="status-count">{stats?.failedVerifications || 0}</span>
              <span className="status-name">Failed</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="admin-activity-grid">
          {/* Recent Partners */}
          <div className="dashboard-card admin-card">
            <div className="card-header">
              <h3>Recent Partners</h3>
              <button
                className="btn-link"
                onClick={() => navigate('/admin/partners')}
              >
                View All
              </button>
            </div>
            <div className="card-content">
              {recentPartners.length === 0 ? (
                <p className="text-muted">No partners yet</p>
              ) : (
                <div className="recent-list">
                  {recentPartners.map((partner) => (
                    <div key={partner.id} className="recent-item">
                      <div className="recent-item-main">
                        <span className="recent-item-name">{partner.companyName}</span>
                        <span className="recent-item-sub">{partner.email}</span>
                      </div>
                      <div className="recent-item-meta">
                        <span className="tier-badge small">{partner.tier?.displayName || 'Free'}</span>
                        <span className="recent-item-date">
                          {new Date(partner.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Verifications */}
          <div className="dashboard-card admin-card">
            <div className="card-header">
              <h3>Recent Verifications</h3>
              <button
                className="btn-link"
                onClick={() => navigate('/admin/verifications')}
              >
                View All
              </button>
            </div>
            <div className="card-content">
              {recentVerifications.length === 0 ? (
                <p className="text-muted">No verifications yet</p>
              ) : (
                <div className="recent-list">
                  {recentVerifications.map((verification) => (
                    <div key={verification.id} className="recent-item">
                      <div className="recent-item-main">
                        <span className="recent-item-name">{verification.userName || 'Unknown'}</span>
                        <span className="recent-item-sub">{verification.partner?.companyName || 'N/A'}</span>
                      </div>
                      <div className="recent-item-meta">
                        <span className={`status-badge ${getStatusColor(verification.status)}`}>
                          {verification.status}
                        </span>
                        <span className="recent-item-date">
                          {new Date(verification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
