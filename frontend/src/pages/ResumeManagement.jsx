
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FileText,
  Plus,
  Trash2,
  RefreshCw,
  ArrowRight,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const API = 'http://localhost:3000/api';

export default function ResumeManagement() {
  const { token } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Load the student's resumes
  const loadResumes = async () => {
    if (!token) {
      setResumes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(`${API}/resumes`, {
        headers,
      });

      const data =
        response.data.resumes ||
        response.data.data ||
        response.data;

      setResumes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not load resumes'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [token]);

  // Upload an existing resume from the computer
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowed) {
      toast.error('Choose a PDF, DOC, or DOCX file');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be 5 MB or smaller');
      e.target.value = '';
      return;
    }

    if (!token) {
      toast.error('Please log in to upload a resume');
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('resume', file);
      formData.append(
        'title',
        file.name.replace(/\.[^.]+$/, '')
      );

      await axios.post(`${API}/resumes/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Resume uploaded successfully');
      await loadResumes();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Resume upload failed'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Download an uploaded resume
  const downloadResume = async (resume) => {
    try {
      const response = await axios.get(
        `${API}/resumes/${resume._id}/file`,
        {
          headers,
          responseType: 'blob',
        }
      );

      const fileURL = URL.createObjectURL(response.data);
      const link = document.createElement('a');

      link.href = fileURL;
      link.download =
        resume.file?.originalName ||
        `${resume.title || 'resume'}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not download resume'
      );
    }
  };

  // Delete a resume
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resume?'
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/resumes/${id}`, {
        headers,
      });

      setResumes((previous) =>
        previous.filter((resume) => resume._id !== id)
      );

      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not delete resume'
      );
    }
  };

  const styles = {
    page: {
      minHeight: '80vh',
      background: '#f8fafc',
      padding: '35px 20px',
      color: '#0f172a',
    },
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    card: {
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '14px',
      padding: '22px',
      boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
      minWidth: 0,
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '8px',
      background: '#4f46e5',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
    },
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading resumes...
      </div>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Page heading and actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '25px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 750,
                margin: 0,
              }}
            >
              Resume Management
            </h1>

            <p style={{ color: '#64748b', marginTop: '8px' }}>
              Upload existing resumes or create a new one.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />

            <button
              type="button"
              style={{
                ...styles.button,
                opacity: uploading ? 0.7 : 1,
              }}
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus size={18} />
              {uploading ? 'Uploading...' : 'Add Resume'}
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/student/resume-builder';
              }}
              style={{
                ...styles.button,
                background: '#7655b5',
              }}
            >
              <FileText size={18} />
              Build Resume
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {resumes.length === 0 ? (
          <div
            style={{
              ...styles.card,
              textAlign: 'center',
              padding: '45px 20px',
            }}
          >
            <FileText size={42} color="#64748b" />

            <h2
              style={{
                fontSize: '20px',
                marginBottom: '8px',
              }}
            >
              No resumes yet
            </h2>

            <p style={{ color: '#64748b' }}>
              Upload a resume from your computer or build one with
              SkillBridge.
            </p>
          </div>
        ) : (
          /* Resume cards */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
            }}
          >
            {resumes.map((resume) => {
              const isUploaded = Boolean(
                resume.file?.storedName
              );

              return (
                <article
                  key={resume._id}
                  style={styles.card}
                >
                  <FileText size={28} color="#4f46e5" />

                  <h2
                    style={{
                      fontSize: '19px',
                      fontWeight: 700,
                      marginBottom: '8px',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {resume.title || resume.name || 'Untitled Resume'}
                  </h2>

                  {/* Original filename for uploaded resumes */}
                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                      overflowWrap: 'anywhere',
                      margin: '0 0 10px',
                    }}
                  >
                    {resume.file?.originalName ||
                      'Resume created with SkillBridge'}
                  </p>

                  {resume.isDefault && (
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      Default Resume
                    </span>
                  )}

                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {resume.data?.summary ||
                      resume.content ||
                      resume.summary ||
                      (isUploaded
                        ? 'Uploaded resume file'
                        : 'Resume created using SkillBridge')}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginTop: '18px',
                    }}
                  >
                    {isUploaded && (
                      <button
                        type="button"
                        style={{
                          ...styles.button,
                          background: '#e0e7ff',
                          color: '#3730a3',
                        }}
                        onClick={() => downloadResume(resume)}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    )}

                    <button
                      type="button"
                      style={{
                        ...styles.button,
                        background: '#fee2e2',
                        color: '#b91c1c',
                      }}
                      onClick={() => handleDelete(resume._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Refresh */}
        <button
          type="button"
          onClick={loadResumes}
          style={{
            ...styles.button,
            background: '#334155',
            marginTop: '22px',
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
    </main>
  );
}
