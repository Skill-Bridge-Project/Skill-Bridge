
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const API = 'http://localhost:3000/api';

const emptyForm = {
  title: '',
  description: '',
  link: '',
};

export default function EditPortfolio() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadPortfolio = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers });
      const data = res.data.user || res.data.data || res.data;

      setProjects(Array.isArray(data.portfolio) ? data.portfolio : []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not load projects'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadPortfolio();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title || project.name || '',
      description: project.description || '',
      link: project.link || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Enter a project title');
      return;
    }

    if (!token) {
      toast.error('Please log in first');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        link: form.link.trim(),
      };

      if (editingId) {
        await axios.put(
          `${API}/portfolio/${editingId}`,
          payload,
          { headers }
        );
        toast.success('Project updated');
      } else {
        await axios.post(`${API}/portfolio`, payload, { headers });
        toast.success('Project added');
      }

      resetForm();
      await loadPortfolio();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not save project'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;

    try {
      await axios.delete(`${API}/portfolio/${id}`, { headers });
      setProjects((prev) => prev.filter((project) => project._id !== id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not delete project'
      );
    }
  };

  const styles = {
    page: {
      minHeight: '80vh',
      padding: '35px 20px',
      background: '#F7F4FC',
      color: '#29213D',
    },
    container: {
      maxWidth: '950px',
      margin: '0 auto',
    },
    card: {
      background: '#FFFFFF',
      border: '1px solid #DDD2F3',
      borderRadius: '15px',
      padding: '23px',
      marginBottom: '20px',
      boxShadow: '0 4px 14px rgba(80, 50, 120, 0.05)',
    },
    input: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px',
      marginTop: '7px',
      marginBottom: '17px',
      border: '1px solid #C8B8E8',
      borderRadius: '9px',
      background: '#FFFFFF',
      color: '#29213D',
      font: 'inherit',
      outlineColor: '#7655B5',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '9px',
      background: '#7655B5',
      color: '#FFFFFF',
      fontWeight: 600,
      cursor: 'pointer',
    },
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>
      Loading portfolio...
    </p>;
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button
          type="button"
          style={{ ...styles.button, marginBottom: '20px' }}
          onClick={() => navigate('/student/portfolio')}
        >
          <ArrowLeft size={17} /> View Portfolio
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 750, marginBottom: '8px' }}>
          Edit Portfolio
        </h1>
        <p style={{ color: '#716581', marginBottom: '25px' }}>
          Add and manage your projects to showcase your skills.
        </p>

        {!token && (
          <div style={styles.card}>
            Please log in as a student to manage your portfolio.
          </div>
        )}

        <form onSubmit={handleSave} style={styles.card}>
          <h2 style={{ marginTop: 0, fontSize: '21px' }}>
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h2>

          <label htmlFor="project-title">Project Title *</label>
          <input
            id="project-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Attendance Management System"
            style={styles.input}
            required
          />

          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your project, its purpose and features..."
            rows={4}
            style={{ ...styles.input, resize: 'vertical' }}
          />

          <label htmlFor="project-link">Project Link</label>
          <input
            id="project-link"
            name="link"
            type="url"
            value={form.link}
            onChange={handleChange}
            placeholder="https://github.com/your-project"
            style={styles.input}
          />

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={saving || !token}
              style={{
                ...styles.button,
                opacity: saving || !token ? 0.6 : 1,
              }}
            >
              <Save size={17} />
              {saving ? 'Saving...' : editingId ? 'Update Project' : 'Save Project'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  ...styles.button,
                  background: '#EDE7F7',
                  color: '#65449B',
                }}
              >
                <X size={17} /> Cancel Edit
              </button>
            )}
          </div>
        </form>

        <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>
          Your Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '35px 20px' }}>
            <Plus size={35} color="#7655B5" />
            <p>No projects yet. Add your first project above.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {projects.map((project, index) => (
              <article
                key={project._id || index}
                style={{ ...styles.card, marginBottom: 0 }}
              >
                <h3 style={{ fontSize: '18px', marginTop: 0 }}>
                  {project.title || project.name || 'Untitled Project'}
                </h3>

                <p style={{ color: '#716581', lineHeight: 1.6 }}>
                  {project.description || 'No description added.'}
                </p>

                {project.link && (
                  <p style={{ overflowWrap: 'anywhere' }}>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#7655B5' }}
                    >
                      Open Project
                    </a>
                  </p>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    style={{
                      ...styles.button,
                      background: '#EDE7F7',
                      color: '#65449B',
                    }}
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    style={{
                      ...styles.button,
                      background: '#FEE2E2',
                      color: '#B91C1C',
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
