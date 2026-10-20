
import React, { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  AlertTriangle,
  Trash2,
  LockKeyhole,
  Sun,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';


export default function Settings() {
  const [deletingAccount, setDeletingAccount] = useState(false);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [lightTheme, setLightTheme] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);



  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Please log in first');
      return;
    }

    try {
      setSaving(true);

await api.put('/profile', profile);
      toast.success('Profile settings updated');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not update profile'
      );
    } finally {
      setSaving(false);
    }
  };
const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    'Are you sure you want to permanently delete your SkillBridge account? This action cannot be undone.'
  );

  if (!confirmed) return;

  try {
    setDeletingAccount(true);

await api.delete('/profile');
    toast.success('Account deleted successfully');

    logout();
    navigate('/login', { replace: true });
  } catch (error) {
    toast.error(
      error.response?.data?.message || 'Failed to delete account'
    );
  } finally {
    setDeletingAccount(false);
  }
};
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 6) {
      toast.error('New password must contain at least 6 characters');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setChangingPassword(true);

await api.put('/auth/password', {
  currentPassword: passwords.currentPassword,
  newPassword: passwords.newPassword,
});

      toast.success('Password changed successfully');

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not change password'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const styles = {
    page: {
      minHeight: '80vh',
      background: '#F8FAFC',
      padding: '35px 20px',
      color: '#0F172A',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    card: {
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '11px 12px',
      marginTop: '7px',
      marginBottom: '17px',
      border: '1px solid #CBD5E1',
      borderRadius: '8px',
      background: '#FFFFFF',
      color: '#0F172A',
      font: 'inherit',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 16px',
      background: '#4F46E5',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '9px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    heading: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '20px',
      marginTop: 0,
      marginBottom: '20px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
    },
  };

  if (!token) {
    return (
      <main style={styles.page}>
        <div style={{ ...styles.card, maxWidth: '500px', margin: '30px auto' }}>
          <h2>Please log in to access Settings.</h2>
          <button
            style={styles.button}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            ...styles.button,
            background: '#E2E8F0',
            color: '#334155',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={17} /> Back
        </button>

        <div style={{ marginBottom: '25px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 750,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <SettingsIcon size={27} color="#7655B5" />
            Settings
          </h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>
            Manage your account and preferences.
          </p>
        </div>

        {/* Account Settings */}
        <section style={styles.card}>
          <h2 style={styles.heading}>
            <User size={22} color="#7655B5" />
            Account Settings
          </h2>

          <form onSubmit={handleSaveProfile}>
            <label style={styles.label} htmlFor="settings-name">Full Name</label>
            <input
              id="settings-name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              style={styles.input}
              required
            />

            <label style={styles.label} htmlFor="settings-email">Email Address</label>
            <input
              id="settings-email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              style={styles.input}
              required
            />

            <label style={styles.label} htmlFor="settings-phone">Phone</label>
            <input
              id="settings-phone"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              style={styles.input}
              placeholder="Enter phone number"
            />

            <label style={styles.label} htmlFor="settings-location">Location</label>
            <input
              id="settings-location"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
              style={styles.input}
              placeholder="Enter your location"
            />

            <label style={styles.label} htmlFor="settings-bio">About You</label>
            <textarea
              id="settings-bio"
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              style={{ ...styles.input, resize: 'vertical' }}
              rows={3}
              placeholder="Write a short introduction"
            />

            <button type="submit" disabled={saving} style={styles.button}>
              <Save size={17} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Password Settings */}
        <section style={styles.card}>
          <h2 style={styles.heading}>
            <LockKeyhole size={22} color="#7655B5" />
            Change Password
          </h2>

          <form onSubmit={handleChangePassword}>
            {[
              { name: 'currentPassword', label: 'Current Password' },
              { name: 'newPassword', label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm New Password' },
            ].map((field) => (
              <div key={field.name}>
                <label
                  style={styles.label}
                  htmlFor={field.name}
                >
                  {field.label}
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type={showPasswords ? 'text' : 'password'}
                  value={passwords[field.name]}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  required
                  autoComplete="off"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              style={{
                ...styles.button,
                background: '#EDE7F7',
                color: '#65449B',
                marginBottom: '16px',
              }}
            >
              {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
              {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
            </button>

            <br />

            <button
              type="submit"
              disabled={changingPassword}
              style={styles.button}
            >
              <LockKeyhole size={17} />
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Appearance */}
        <section style={styles.card}>
          <h2 style={styles.heading}>
            <Sun size={22} color="#7655B5" />
            Appearance
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap',
          }}>
            <div>
              <strong>Light Theme</strong>
              <p style={{ color: '#64748B', margin: '6px 0 0' }}>
                Choose the appearance preference for your account.
              </p>
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={lightTheme}
                onChange={(e) => setLightTheme(e.target.checked)}
              />
              {lightTheme ? 'Enabled' : 'Disabled'}
            </label>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: 0 }}>
            This preference is currently temporary and does not change the
            appearance of other pages.
          </p>
        </section>

        {/* Account Information */}
        <section style={styles.card}>
          <h2 style={styles.heading}>
            <User size={22} color="#7655B5" />
            Account Information
          </h2>

          <p style={{ color: '#64748B', marginBottom: '8px' }}>
            Account type
          </p>
          <strong>
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : 'Student'}
          </strong>

          <p style={{ color: '#64748B', marginTop: '18px', marginBottom: '8px' }}>
            Email associated with your account
          </p>
          <strong>{user?.email || profile.email || 'Not available'}</strong>
        </section>
      </div>
      {/* Danger Zone */}
<div className="mt-8 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
  <div className="mb-4 flex items-center gap-3">
    <AlertTriangle className="text-red-600" size={24} />

    <div>
      <h2 className="text-lg font-bold text-red-700">
        Danger Zone
      </h2>
      <p className="text-sm text-slate-500">
        Permanently remove your SkillBridge account and associated records.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={handleDeleteAccount}
    disabled={deletingAccount}
    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <Trash2 size={18} />
    {deletingAccount ? 'Deleting Account...' : 'Delete Account'}
  </button>
</div>
    </main>
    
  );
}
