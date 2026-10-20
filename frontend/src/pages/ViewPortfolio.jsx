
import React, { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FolderOpen, Code2, ArrowLeft, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';


export default function ViewPortfolio() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        let data;

if (id) {
  const res = await api.get(`/users/${id}`);
  data = res.data.user || res.data.data || res.data;
} else {
  const res = await api.get('/auth/me');
  data = res.data.user || res.data.data || res.data;
}

        setProfile(data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Could not load portfolio'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [id]);

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
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 4px 14px rgba(80, 50, 120, 0.05)',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 15px',
      background: '#7655B5',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '9px',
      cursor: 'pointer',
      fontWeight: 600,
    },
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>
      Loading portfolio...
    </p>;
  }

  if (!profile) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>
      Portfolio not found.
    </p>;
  }

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const projects = Array.isArray(profile.portfolio) ? profile.portfolio : [];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button
          style={{ ...styles.button, marginBottom: '22px' }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} /> Back
        </button>

        <section style={styles.card}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}>
            <div>
              <h1 style={{ fontSize: '28px', margin: '0 0 8px', fontWeight: 750 }}>
                {profile.name || 'Student Portfolio'}
              </h1>
              <p style={{ color: '#7655B5', margin: 0, fontWeight: 600 }}>
                {profile.headline || 'Student / Aspiring Professional'}
              </p>
            </div>

            {!id && (
              <button
                style={styles.button}
                onClick={() => navigate('/student/portfolio/edit')}
              >
                <Pencil size={17} /> Edit Portfolio
              </button>
            )}
          </div>

          <p style={{ color: '#625A70', lineHeight: 1.7, marginTop: '18px' }}>
            {profile.bio || 'Add a short introduction to tell others about yourself.'}
          </p>

          {profile.email && (
            <p><strong>Email:</strong> {profile.email}</p>
          )}

          {profile.college && (
            <p><strong>College:</strong> {profile.college}</p>
          )}

          {profile.degree && (
            <p><strong>Degree:</strong> {profile.degree}</p>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={{ fontSize: '21px', marginTop: 0 }}>
            <Code2 size={21} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Skills
          </h2>

          {skills.length ? (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: '8px 13px',
                    borderRadius: '20px',
                    background: '#EEE7FA',
                    color: '#65449B',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: '#766D85' }}>No skills added yet.</p>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={{ fontSize: '21px', marginTop: 0 }}>
            <FolderOpen size={21} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Projects
          </h2>

          {projects.length ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '15px',
            }}>
              {projects.map((project, index) => (
                <article
                  key={project._id || index}
                  style={{
                    padding: '18px',
                    border: '1px solid #E6DDF5',
                    borderRadius: '12px',
                    background: '#FCFAFF',
                  }}
                >
                  <h3 style={{ marginTop: 0, fontSize: '18px' }}>
                    {project.title || project.name || 'Untitled Project'}
                  </h3>

                  <p style={{ color: '#625A70', lineHeight: 1.6 }}>
                    {project.description || 'No description added.'}
                  </p>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#7655B5', fontWeight: 600 }}
                    >
                      View Project
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: '#766D85' }}>
              No projects added yet. Add your projects to showcase your work.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
