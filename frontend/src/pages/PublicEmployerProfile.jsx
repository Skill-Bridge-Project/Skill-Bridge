import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import {
  Building2,
  Mail,
  MapPin,
  Globe,
  Users,
  Factory,
  FileText,
  Pencil,
  Save,
  X,
  ArrowLeft,
  LoaderCircle,
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

const initialForm = {
  companyName: '',
  email: '',
  phone: '',
  location: '',
  industry: '',
  companySize: '',
  website: '',
  about: '',
};

const PublicEmployerProfile = () => {
  const { token, user } = useAuth();

  const [profile, setProfile] = useState(initialForm);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers,
        });

        const data = response.data.user || response.data.data || response.data;

        const details = {
          companyName: data.companyName || data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          industry: data.industry || '',
          companySize: data.companySize || '',
          website: data.website || '',
          about: data.about || data.bio || '',
        };

        setProfile(details);
        setForm(details);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Unable to load your profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        companyName: form.companyName,
        phone: form.phone,
        location: form.location,
        industry: form.industry,
        companySize: form.companySize,
        website: form.website,
        about: form.about,
      };

      const response = await axios.put(`${API_URL}/profile`, payload, {
        headers,
      });

      const updatedUser =
        response.data.user || response.data.data || response.data;

      const updatedProfile = {
        ...form,
        companyName:
          updatedUser.companyName || updatedUser.name || form.companyName,
        email: updatedUser.email || form.email,
        phone: updatedUser.phone ?? form.phone,
        location: updatedUser.location ?? form.location,
        industry: updatedUser.industry ?? form.industry,
        companySize: updatedUser.companySize ?? form.companySize,
        website: updatedUser.website ?? form.website,
        about: updatedUser.about ?? updatedUser.bio ?? form.about,
      };

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#edf5ff',
      padding: '32px 18px',
      color: '#243b53',
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '950px',
      margin: '0 auto',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#476b91',
      textDecoration: 'none',
      marginBottom: '22px',
      fontSize: '14px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '24px',
    },
    title: {
      fontSize: '30px',
      fontWeight: '700',
      margin: '0 0 7px',
      color: '#203b5b',
    },
    subtitle: {
      margin: 0,
      color: '#71869d',
      fontSize: '14px',
    },
    card: {
      background: '#ffffff',
      border: '1px solid #dce9f8',
      borderRadius: '18px',
      padding: '28px',
      marginBottom: '22px',
      boxShadow: '0 5px 20px rgba(68, 110, 160, 0.06)',
    },
    companyHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      paddingBottom: '24px',
      borderBottom: '1px solid #e8eff8',
    },
    avatar: {
      width: '82px',
      height: '82px',
      borderRadius: '18px',
      background: '#dbeafe',
      color: '#477bb7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    companyName: {
      fontSize: '23px',
      fontWeight: '700',
      margin: '0 0 8px',
      overflowWrap: 'anywhere',
    },
    email: {
      fontSize: '14px',
      color: '#71869d',
      overflowWrap: 'anywhere',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      margin: '0 0 22px',
      color: '#294866',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '22px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: 0,
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#5e748d',
    },
    value: {
      fontSize: '15px',
      color: '#2e435a',
      overflowWrap: 'anywhere',
      lineHeight: 1.6,
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px 13px',
      border: '1px solid #cbdced',
      borderRadius: '9px',
      outline: 'none',
      fontSize: '14px',
      color: '#243b53',
      background: '#fbfdff',
    },
    textarea: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px 13px',
      border: '1px solid #cbdced',
      borderRadius: '9px',
      outline: 'none',
      fontSize: '14px',
      color: '#243b53',
      background: '#fbfdff',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 17px',
      borderRadius: '9px',
      border: 'none',
      background: '#a8ccf5',
      color: '#203b5b',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '11px 17px',
      borderRadius: '9px',
      border: '1px solid #d3e2f3',
      background: '#ffffff',
      color: '#526b85',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    empty: {
      textAlign: 'center',
      color: '#8295aa',
      padding: '18px 0',
      fontSize: '14px',
      lineHeight: 1.7,
    },
  };

  const renderField = (label, name, Icon, type = 'text') => (
    <div style={styles.field} key={name}>
      <label htmlFor={name} style={styles.label}>
        {label}
      </label>

      {editing ? (
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <div
          style={{
            ...styles.value,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '9px',
          }}
        >
          <Icon size={17} color="#80a6d2" style={{ flexShrink: 0 }} />
          {name === 'website' && profile[name] ? (
            <a
              href={
                /^https?:\/\//i.test(profile[name])
                  ? profile[name]
                  : `https://${profile[name]}`
              }
              target="_blank"
              rel="noreferrer"
              style={{ color: '#477bb7', overflowWrap: 'anywhere' }}
            >
              {profile[name]}
            </a>
          ) : (
            profile[name] || 'Not provided'
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={{ ...styles.page, display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <LoaderCircle
            size={32}
            color="#6497d0"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <p>Loading employer profile...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ ...styles.page, textAlign: 'center' }}>
        <h2>Please log in to view your profile.</h2>
        <Link to="/login" style={styles.backLink}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/employer/dashboard" style={styles.backLink}>
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Company Profile</h1>
            <p style={styles.subtitle}>
              Manage your company information on SkillBridge.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              style={styles.button}
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.companyHeader}>
            <div style={styles.avatar}>
              <Building2 size={40} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={styles.companyName}>
                {profile.companyName || user?.companyName || 'Your Company'}
              </h2>
              <div style={styles.email}>
                <Mail
                  size={15}
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: '7px',
                  }}
                />
                {profile.email || user?.email || 'No email available'}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '24px' }}>
            <h3 style={styles.sectionTitle}>Company Information</h3>

            <form onSubmit={handleSave}>
              <div style={styles.grid}>
                {renderField('Company Name', 'companyName', Building2)}
                {renderField('Phone Number', 'phone', Mail, 'tel')}
                {renderField('Industry', 'industry', Factory)}
                {renderField('Company Size', 'companySize', Users)}
                {renderField('Location', 'location', MapPin)}
                {renderField('Website', 'website', Globe, 'text')}
              </div>

              <div style={{ ...styles.field, marginTop: '24px' }}>
                <label htmlFor="about" style={styles.label}>
                  About Company
                </label>

                {editing ? (
                  <textarea
                    id="about"
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Tell students about your company..."
                  />
                ) : (
                  <div
                    style={{
                      ...styles.value,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                    }}
                  >
                    <FileText
                      size={17}
                      color="#80a6d2"
                      style={{ flexShrink: 0 }}
                    />
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {profile.about || 'No company description added yet.'}
                    </span>
                  </div>
                )}
              </div>

              {editing && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '28px',
                  }}
                >
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{
                      ...styles.button,
                      opacity: saving ? 0.7 : 1,
                    }}
                    disabled={saving}
                  >
                    {saving ? (
                      <LoaderCircle size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <p style={styles.empty}>
          Keep your company information updated so students can learn more
          about your organization.
        </p>
      </div>
    </div>
  );
};

export default PublicEmployerProfile;
