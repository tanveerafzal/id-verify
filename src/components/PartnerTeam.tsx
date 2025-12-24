import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartnerLayout } from './PartnerLayout';
import { getApiUrl } from '../config/api';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

interface Invitation {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export const PartnerTeam: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    roleId: '',
  });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadTeamData();
    loadRoles();
  }, []);

  const loadTeamData = async () => {
    const token = localStorage.getItem('partnerToken');
    if (!token) {
      navigate('/partner/login');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/partners/team/members'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load team');

      const data = await response.json();
      setMembers(data.data.members);
      setInvitations(data.data.invitations);
    } catch (err) {
      setError('Failed to load team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    const token = localStorage.getItem('partnerToken');
    try {
      const response = await fetch(getApiUrl('/api/partners/team/roles'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data.data);
        if (data.data.length > 0) {
          setInviteForm((prev) => ({ ...prev, roleId: data.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError('');

    const token = localStorage.getItem('partnerToken');

    try {
      const response = await fetch(getApiUrl('/api/partners/team/invitations'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setSuccess('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteForm({ email: '', name: '', roleId: roles[0]?.id || '' });
      loadTeamData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    const token = localStorage.getItem('partnerToken');

    try {
      const response = await fetch(
        getApiUrl(`/api/partners/team/invitations/${invitationId}/resend`),
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to resend');

      setSuccess('Invitation resent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to resend invitation');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    if (!confirm('Cancel this invitation?')) return;

    const token = localStorage.getItem('partnerToken');

    try {
      const response = await fetch(
        getApiUrl(`/api/partners/team/invitations/${invitationId}`),
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to cancel');

      loadTeamData();
      setSuccess('Invitation cancelled');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to cancel invitation');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this user?`))
      return;

    const token = localStorage.getItem('partnerToken');

    try {
      const response = await fetch(
        getApiUrl(`/api/partners/team/members/${userId}/toggle-status`),
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      loadTeamData();
      setSuccess(data.data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.name.toLowerCase().includes(query) ||
      member.status.toLowerCase().includes(query)
    );
  });

  // Filter invitations based on search query
  const filteredInvitations = invitations.filter((inv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      inv.name.toLowerCase().includes(query) ||
      inv.email.toLowerCase().includes(query) ||
      inv.role.name.toLowerCase().includes(query) ||
      inv.status.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <PartnerLayout>
        <div className="settings-loading">
          <div className="spinner" />
          <p>Loading team...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="team-page">
        <div className="page-header">
          <div>
            <h1>Team Management</h1>
            <p className="page-subtitle">
              Manage your team members and their access permissions
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
            + Invite User
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}

        {/* Search */}
        <div className="team-search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, role, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-section">
          <h2>Team Members ({filteredMembers.length}{searchQuery && members.length !== filteredMembers.length ? ` of ${members.length}` : ''})</h2>

          {filteredMembers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{searchQuery ? '🔍' : '👥'}</div>
              <h3>{searchQuery ? 'No matching members' : 'No team members yet'}</h3>
              <p>{searchQuery ? `No members found for "${searchQuery}"` : 'Invite your first team member to get started'}</p>
              {searchQuery && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchQuery('')}
                  style={{ marginTop: '12px' }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="team-table-container">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-info">
                          <div className="member-avatar">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="member-name">{member.name}</div>
                            <div className="member-email">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge">{member.role.name}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-${member.status}`}>
                          {member.status}
                        </span>
                      </td>
                      <td>
                        {member.lastLogin ? formatDate(member.lastLogin) : 'Never'}
                      </td>
                      <td className="actions-cell">
                        <button
                          className={`btn btn-sm ${
                            member.status === 'active' ? 'btn-warning' : 'btn-success'
                          }`}
                          onClick={() => handleToggleStatus(member.id, member.status)}
                        >
                          {member.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Invitations Section */}
        {(invitations.length > 0 || (searchQuery && filteredInvitations.length === 0)) && (
          <div className="team-section">
            <h2>Pending Invitations ({filteredInvitations.length}{searchQuery && invitations.length !== filteredInvitations.length ? ` of ${invitations.length}` : ''})</h2>
            {filteredInvitations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No matching invitations</h3>
                <p>No invitations found for "{searchQuery}"</p>
              </div>
            ) : (
            <div className="team-table-container">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Invitee</th>
                    <th>Role</th>
                    <th>Sent</th>
                    <th>Expires</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <div className="member-info">
                          <div className="member-avatar pending">
                            {inv.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="member-name">{inv.name}</div>
                            <div className="member-email">{inv.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge">{inv.role.name}</span>
                      </td>
                      <td>{formatDate(inv.createdAt)}</td>
                      <td>{formatDate(inv.expiresAt)}</td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleResendInvite(inv.id)}
                        >
                          Resend
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancelInvite(inv.id)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Invite Team Member</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowInviteModal(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSendInvite}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="inviteName">Name *</label>
                    <input
                      type="text"
                      id="inviteName"
                      className="form-input"
                      value={inviteForm.name}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, name: e.target.value })
                      }
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inviteEmail">Email *</label>
                    <input
                      type="email"
                      id="inviteEmail"
                      className="form-input"
                      value={inviteForm.email}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, email: e.target.value })
                      }
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inviteRole">Role *</label>
                    <select
                      id="inviteRole"
                      className="form-input"
                      value={inviteForm.roleId}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, roleId: e.target.value })
                      }
                      required
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                          {role.description ? ` - ${role.description}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={inviting}
                  >
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
};
