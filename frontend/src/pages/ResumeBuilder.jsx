
import React, { useState } from 'react';
import { FileText, Download, Sparkles, GraduationCap, Briefcase, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ResumeBuilder() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    headline: user?.headline || '',
    summary: user?.bio || '',
    education: user?.degree || '',
    college: user?.college || '',
    graduationYear: user?.graduationYear || '',
    skills: Array.isArray(user?.skills)
      ? user.skills.join(', ')
      : user?.skills || '',
    experience: '',
    projects: '',
  });

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#F7F4FC',
      padding: '32px 20px',
      color: '#29213D',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: {
      background: '#FFFFFF',
      border: '1px solid #DDD2F3',
      borderRadius: '18px',
      padding: '26px',
      boxShadow: '0 5px 20px rgba(91, 65, 145, 0.07)',
      boxSizing: 'border-box',
      minWidth: 0,
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '13px 14px',
      marginTop: '8px',
      marginBottom: '20px',
      border: '1.5px solid #C8B8E8',
      borderRadius: '10px',
      background: '#FCFAFF',
      color: '#29213D',
      fontSize: '15px',
      lineHeight: 1.5,
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
    },
    label: {
      display: 'block',
      color: '#3C3154',
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: 1.5,
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '9px',
      padding: '12px 18px',
      border: 'none',
      borderRadius: '10px',
      background: '#7655B5',
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
    },
    sectionTitle: {
      color: '#6845A5',
      fontSize: '13px',
      fontWeight: 800,
      letterSpacing: '1.2px',
      borderBottom: '1px solid #E5DDF3',
      paddingBottom: '8px',
      marginBottom: '12px',
    },
  };

  const field = (label, name, placeholder = '') => (
    <label key={name} style={styles.label}>
      {label}
      <input
        type="text"
        name={name}
        value={form[name]}
        onChange={updateField}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  );

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Page Heading */}
        <header style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                background: '#EAE1FA',
                color: '#6845A5',
                padding: '12px',
                borderRadius: '13px',
                display: 'flex',
              }}
            >
              <FileText size={28} />
            </div>

            <div>
              <h1
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: '#49346F',
                  margin: 0,
                }}
              >
                Resume Builder
              </h1>
              <p style={{ color: '#6F6482', margin: '6px 0 0', fontSize: '14px' }}>
                Build a resume that represents your skills and experience.
              </p>
            </div>
          </div>
        </header>

        <div
          className="resume-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Resume Form */}
          <section className="resume-form" style={styles.card}>
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '21px',
                  fontWeight: 750,
                  color: '#49346F',
                  margin: '0 0 7px',
                }}
              >
                Your Details
              </h2>
              <p style={{ color: '#716581', fontSize: '14px', margin: 0 }}>
                Fill in your details. Your resume updates automatically.
              </p>
            </div>

            <div
              style={{
                background: '#F4EEFF',
                border: '1px solid #E3D7FA',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '22px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                color: '#6845A5',
                fontSize: '13px',
              }}
            >
              <Sparkles size={18} />
              <span>Your information appears in the preview on the right.</span>
            </div>

            <h3 style={{ fontSize: '15px', color: '#6845A5', marginBottom: '18px' }}>
              Personal Information
            </h3>

            {field('Full Name', 'name', 'Enter your full name')}
            {field('Email Address', 'email', 'you@example.com')}
            {field('Phone Number', 'phone', 'Enter your phone number')}
            {field('Location', 'location', 'City, State')}
            {field('Professional Headline', 'headline', 'e.g. Computer Science Student')}

            <label style={styles.label}>
              Professional Summary
              <textarea
                name="summary"
                value={form.summary}
                onChange={updateField}
                placeholder="Write a short introduction about your skills and career goals..."
                rows={4}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </label>

            <h3
              style={{
                fontSize: '15px',
                color: '#6845A5',
                margin: '26px 0 18px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <GraduationCap size={19} />
              Education
            </h3>

            {field('Degree / Qualification', 'education', 'e.g. B.Sc. Computer Science')}
            {field('College / University', 'college', 'Enter college name')}
            {field('Graduation Year', 'graduationYear', 'e.g. 2027')}

            <h3
              style={{
                fontSize: '15px',
                color: '#6845A5',
                margin: '26px 0 18px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Code size={18} />
              Skills
            </h3>

            <label style={styles.label}>
              Technical and Other Skills
              <textarea
                name="skills"
                value={form.skills}
                onChange={updateField}
                placeholder="JavaScript, React, MongoDB, Communication..."
                rows={3}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </label>

            <h3
              style={{
                fontSize: '15px',
                color: '#6845A5',
                margin: '26px 0 18px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <Briefcase size={18} />
              Experience and Projects
            </h3>

            <label style={styles.label}>
              Projects
              <textarea
                name="projects"
                value={form.projects}
                onChange={updateField}
                placeholder="Project name, technologies used, and what you developed..."
                rows={4}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </label>

            <label style={styles.label}>
              Experience / Internships
              <textarea
                name="experience"
                value={form.experience}
                onChange={updateField}
                placeholder="Add your internship, work experience, or relevant activities..."
                rows={4}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </label>

            <button
              type="button"
              onClick={handlePrint}
              style={{ ...styles.button, width: '100%', marginTop: '5px' }}
            >
              <Download size={18} />
              Download / Save as PDF
            </button>

            <p
              style={{
                fontSize: '12px',
                color: '#716581',
                lineHeight: 1.6,
                marginTop: '12px',
                marginBottom: 0,
              }}
            >
              Your browser's print window will open. Select "Save as PDF" to save your resume.
            </p>
          </section>

          {/* Live Resume Preview */}
          <section
            id="resume-preview"
            style={{
              ...styles.card,
              padding: '0',
              overflow: 'hidden',
              background: '#FFFFFF',
              border: '1px solid #DDD2F3',
            }}
          >
            <div
              className="preview-toolbar"
              style={{
                background: '#F0E9FB',
                borderBottom: '1px solid #DDD2F3',
                padding: '16px 24px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 750,
                  fontSize: '14px',
                  color: '#49346F',
                }}
              >
                <FileText
                  size={17}
                  style={{ display: 'inline', verticalAlign: 'middle', marginRight: '7px' }}
                />
                Live Resume Preview
              </p>
            </div>

            <div
              className="resume-paper"
              style={{
                padding: '32px',
                minHeight: '720px',
                background: '#FFFFFF',
                color: '#29213D',
                overflowWrap: 'anywhere',
              }}
            >
              <header
                style={{
                  borderBottom: '3px solid #8B6CCB',
                  paddingBottom: '20px',
                  marginBottom: '24px',
                }}
              >
                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    margin: '0 0 8px',
                    color: '#302443',
                    lineHeight: 1.25,
                  }}
                >
                  {form.name || 'Your Name'}
                </h1>

                <p
                  style={{
                    color: '#6845A5',
                    fontSize: '15px',
                    fontWeight: 700,
                    margin: '0 0 14px',
                  }}
                >
                  {form.headline || 'Your Professional Headline'}
                </p>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#51465F',
                    lineHeight: 1.9,
                  }}
                >
                  {form.email && <div>{form.email}</div>}
                  {form.phone && <div>{form.phone}</div>}
                  {form.location && <div>{form.location}</div>}

                  {!form.email && !form.phone && !form.location && (
                    <div>Email • Phone • Location</div>
                  )}
                </div>
              </header>

              <div>
                <h3 style={styles.sectionTitle}>PROFESSIONAL SUMMARY</h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#40364D',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    margin: '0 0 24px',
                  }}
                >
                  {form.summary || 'Your professional summary will appear here.'}
                </p>
              </div>

              <div>
                <h3 style={styles.sectionTitle}>EDUCATION</h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#40364D',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    margin: '0 0 24px',
                  }}
                >
                  {[form.education, form.college, form.graduationYear]
                    .filter(Boolean)
                    .join('\n') || 'Your education details will appear here.'}
                </p>
              </div>

              <div>
                <h3 style={styles.sectionTitle}>SKILLS</h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#40364D',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    margin: '0 0 24px',
                  }}
                >
                  {form.skills || 'Your skills will appear here.'}
                </p>
              </div>

              <div>
                <h3 style={styles.sectionTitle}>PROJECTS</h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#40364D',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    margin: '0 0 24px',
                  }}
                >
                  {form.projects || 'Your projects will appear here.'}
                </p>
              </div>

              <div>
                <h3 style={styles.sectionTitle}>EXPERIENCE</h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#40364D',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}
                >
                  {form.experience || 'Your experience and internships will appear here.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        input::placeholder,
        textarea::placeholder {
          color: #8A7D9F;
          opacity: 1;
        }

        input:focus,
        textarea:focus {
          outline: 2px solid #A78BDA;
          outline-offset: 1px;
          border-color: #8B6CCB !important;
          background: #FFFFFF !important;
        }

        button:hover {
          filter: brightness(0.96);
        }

        @media (max-width: 800px) {
          .resume-layout {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          #resume-preview,
          #resume-preview * {
            visibility: visible !important;
          }

          #resume-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
            background: #FFFFFF !important;
          }

          #resume-preview .preview-toolbar {
            display: none !important;
          }

          #resume-preview .resume-paper {
            padding: 0 !important;
            min-height: 0 !important;
          }

          @page {
            size: A4;
            margin: 14mm;
          }
        }
      `}</style>
    </main>
  );
}
