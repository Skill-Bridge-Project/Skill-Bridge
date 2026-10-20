import { useEffect, useState } from 'react';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Video,
  RefreshCw,
  BriefcaseBusiness,
  UserRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const IST = 'Asia/Kolkata';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f7fc',
    padding: '32px 20px',
    color: '#243b5a',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
  },
  heading: {
    fontSize: '30px',
    fontWeight: 700,
    color: '#243b5a',
    margin: '0 0 10px',
  },
  subtitle: {
    color: '#7186a3',
    fontSize: '14px',
    margin: 0,
    lineHeight: 1.6,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #dce7f4',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(36, 59, 90, 0.045)',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  label: {
    display: 'block',
    color: '#405875',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  input: {
    display: 'block',
    width: '100%',
    minWidth: 0,
    height: '46px',
    boxSizing: 'border-box',
    background: '#ffffff',
    color: '#243b5a',
    border: '1px solid #cbd9e9',
    borderRadius: '9px',
    padding: '10px 12px',
    fontSize: '14px',
    outlineColor: '#8eb9ee',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#376fae',
    color: '#ffffff',
    border: '1px solid #376fae',
    borderRadius: '9px',
    padding: '12px 17px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: '#ffffff',
    color: '#42678e',
    border: '1px solid #cbd9e9',
    borderRadius: '9px',
    padding: '11px 15px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '11px',
    background: '#eaf2fc',
    color: '#376fae',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};

function getTimeParts(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  return Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );
}

function getISTDate(date) {
  const parts = getTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getISTTime(date) {
  const parts = getTimeParts(date);
  return `${parts.hour}:${parts.minute}`;
}

function getTodayIST() {
  return getISTDate(new Date());
}

function formatTime12(time) {
  if (!time) return '';

  const match = String(time).match(
    /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
  );

  if (!match) return time;

  let hour = Number(match[1]);
  const minute = match[2];
  let period = match[3]?.toUpperCase();

  if (!period) {
    period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
  }

  return `${hour}:${minute} ${period}`;
}

// Convert a 24-hour time into editable 12-hour fields.
function splitStoredTime(time) {
  if (!time) return { time: '', period: 'AM' };

  const match = String(time).match(
    /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
  );

  if (!match) return { time: '', period: 'AM' };

  let hour = Number(match[1]);
  const minute = match[2];
  let period = match[3]?.toUpperCase();

  if (!period) {
    period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
  }

  return {
    time: `${String(hour).padStart(2, '0')}:${minute}`,
    period,
  };
}

// Convert HH:MM + AM/PM into a 24-hour HH:MM value.
function to24Hour(time, period) {
  if (!time || !period) return '';

  const [hourText, minuteText] = time.split(':');
  let hour = Number(hourText);

  if (hour < 1 || hour > 12) return null;

  if (period === 'AM') {
    hour = hour === 12 ? 0 : hour;
  } else {
    hour = hour === 12 ? 12 : hour + 12;
  }

  return `${String(hour).padStart(2, '0')}:${minuteText}`;
}

function isValidTime(time) {
  return /^(0[1-9]|1[0-2]):[0-5]\d$/.test(time);
}

function formatDate(dateString) {
  if (!dateString) return 'Date not set';

  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function InterviewScheduling() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [forms, setForms] = useState({});

  const loadApplications = async () => {
    if (!token || user?.role !== 'employer') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

const response = await api.get('/applications/employer');

      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data.applications || data.data || [];

      setApplications(list);

      const initialForms = {};

      list.forEach((app) => {
        const id = app._id || app.id;
        const interview = app.interview || {};

        const savedDate = interview.date
          ? new Date(interview.date)
          : null;

        const validDate =
          savedDate && !Number.isNaN(savedDate.getTime())
            ? savedDate
            : null;

        // Support both new range fields and older single-time records.
        const savedStart = splitStoredTime(
          interview.startTime || (
            validDate ? getISTTime(validDate) : ''
          )
        );

        const savedEnd = splitStoredTime(interview.endTime || '');

        initialForms[id] = {
          interviewDate: validDate ? getISTDate(validDate) : '',
          startTime: savedStart.time,
          startPeriod: savedStart.period,
          endTime: savedEnd.time,
          endPeriod: savedEnd.period,
          interviewLink: interview.link || '',
        };
      });

      setForms(initialForms);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to load applicants'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'student') {
      navigate('/student/dashboard', { replace: true });
      return;
    }

    if (token && user?.role === 'employer') {
      loadApplications();
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  const handleChange = (id, field, value) => {
    setForms((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value,
      },
    }));
  };

  const scheduleInterview = async (id) => {
    const form = forms[id];

    if (!form?.interviewDate) {
      toast.error('Please select an interview date.');
      return;
    }

    if (form.interviewDate < getTodayIST()) {
      toast.error('Please select today or a future date.');
      return;
    }

    if (
      !isValidTime(form.startTime || '') ||
      !isValidTime(form.endTime || '')
    ) {
      toast.error('Enter both times in HH:MM format, such as 09:30.');
      return;
    }

    const start24 = to24Hour(form.startTime, form.startPeriod);
    const end24 = to24Hour(form.endTime, form.endPeriod);

    if (!start24 || !end24) {
      toast.error('Please enter valid start and end times.');
      return;
    }

    if (start24 >= end24) {
      toast.error('The end time must be later than the start time.');
      return;
    }

    try {
      setSavingId(id);
await api.put(`/applications/${id}/schedule`, {
  date: `${form.interviewDate}T${start24}:00+05:30`,
  mode: 'Online',
  link: (form.interviewLink || '').trim(),
  notes: `Interview time: ${form.startTime} ${form.startPeriod} - ${form.endTime} ${form.endPeriod}`,
});

      toast.success('Interview scheduled successfully!');
      await loadApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not schedule interview'
      );
    } finally {
      setSavingId(null);
    }
  };

  if (!token) {
    return (
      <div style={styles.page}>
        <div
          style={{
            ...styles.card,
            maxWidth: '450px',
            margin: '70px auto',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>
            Login Required
          </h2>

          <p style={styles.subtitle}>
            Please log in as an employer to continue.
          </p>

          <Link
            to="/login"
            style={{ ...styles.primaryButton, marginTop: '20px' }}
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role !== 'employer') return null;

  const scheduledCount = applications.filter(
    (app) => app.interview?.date
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '30px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                marginBottom: '12px',
                color: '#376fae',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.7px',
              }}
            >
              <CalendarDays size={18} />
              EMPLOYER WORKSPACE
            </div>

            <h1 style={styles.heading}>Interview Scheduling</h1>

            <p style={styles.subtitle}>
              Arrange interview dates and times for your candidates.
            </p>

            <p
              style={{
                ...styles.subtitle,
                fontSize: '12px',
                marginTop: '7px',
              }}
            >
              All interview times use Indian Standard Time (IST).
            </p>
          </div>

          <button
            type="button"
            onClick={loadApplications}
            disabled={loading}
            style={{
              ...styles.secondaryButton,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={16} />
            Refresh Applicants
          </button>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '30px',
          }}
        >
          <div style={{ ...styles.card, marginBottom: 0 }}>
            <div style={styles.iconBox}>
              <UserRound size={21} />
            </div>

            <p style={{ ...styles.subtitle, marginTop: '16px' }}>
              Total Applicants
            </p>

            <h2 style={{ fontSize: '28px', margin: '5px 0 0' }}>
              {applications.length}
            </h2>
          </div>

          <div style={{ ...styles.card, marginBottom: 0 }}>
            <div style={styles.iconBox}>
              <CalendarDays size={21} />
            </div>

            <p style={{ ...styles.subtitle, marginTop: '16px' }}>
              Scheduled Interviews
            </p>

            <h2 style={{ fontSize: '28px', margin: '5px 0 0' }}>
              {scheduledCount}
            </h2>
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <h2
            style={{
              fontSize: '21px',
              fontWeight: 700,
              margin: '0 0 6px',
            }}
          >
            Your Candidates
          </h2>

          <p style={styles.subtitle}>
            Select a date, enter the interview time range, and save.
          </p>
        </div>

        {loading ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '45px' }}>
            <p style={styles.subtitle}>Loading applicants...</p>
          </div>
        ) : applications.length === 0 ? (
          <div
            style={{
              ...styles.card,
              textAlign: 'center',
              padding: '45px 20px',
            }}
          >
            <div style={{ ...styles.iconBox, margin: '0 auto 18px' }}>
              <BriefcaseBusiness size={22} />
            </div>

            <h2 style={{ fontSize: '20px', marginBottom: '9px' }}>
              No applicants yet
            </h2>

            <p style={{ ...styles.subtitle, marginBottom: '22px' }}>
              Applications for your job postings will appear here.
            </p>

            <Link
              to="/employer/manage-applicants"
              style={styles.primaryButton}
            >
              Manage Applicants
            </Link>
          </div>
        ) : (
          applications.map((app) => {
            const id = app._id || app.id;
            const student = app.student || app.studentId || {};
            const job = app.job || app.jobId || {};
            const form = forms[id] || {};
            const scheduled = Boolean(app.interview?.date);

            return (
              <section key={id} style={styles.card}>
                {/* Candidate information */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e8eef6',
                    marginBottom: '22px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '13px',
                      alignItems: 'center',
                      minWidth: 0,
                    }}
                  >
                    <div style={styles.iconBox}>
                      <UserRound size={21} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: '17px',
                          fontWeight: 700,
                          margin: '0 0 5px',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {student.name || app.studentName || 'Applicant'}
                      </h3>

                      <p style={{ ...styles.subtitle, marginBottom: '4px' }}>
                        {job.title || app.jobTitle || 'Job Application'}
                      </p>

                      <p style={{ ...styles.subtitle, fontSize: '12px' }}>
                        {student.email || app.studentEmail || ''}
                      </p>
                    </div>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#edf5ff',
                      color: '#376fae',
                      border: '1px solid #d5e6fa',
                      padding: '7px 11px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {scheduled && <CheckCircle2 size={14} />}
                    {app.status || 'Applied'}
                  </span>
                </div>

                {/* Date and time */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '22px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <label
                      htmlFor={`date-${id}`}
                      style={styles.label}
                    >
                      Interview Date (IST)
                    </label>

                    <input
                      id={`date-${id}`}
                      type="date"
                      min={getTodayIST()}
                      value={form.interviewDate || ''}
                      onChange={(event) =>
                        handleChange(id, 'interviewDate', event.target.value)
                      }
                      onClick={(event) => {
                        if (event.currentTarget.showPicker) {
                          event.currentTarget.showPicker();
                        }
                      }}
                      style={{
                        ...styles.input,
                        cursor: 'pointer',
                      }}
                      required
                    />

                    <p
                      style={{
                        ...styles.subtitle,
                        fontSize: '12px',
                        marginTop: '7px',
                      }}
                    >
                      <CalendarDays
                        size={13}
                        style={{ display: 'inline', verticalAlign: 'middle' }}
                      />{' '}
                      Choose today or a future date.
                    </p>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <span style={styles.label}>Interview Time (IST)</span>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '14px',
                      }}
                    >
                      {[
                        {
                          label: 'From',
                          timeKey: 'startTime',
                          periodKey: 'startPeriod',
                          defaultPeriod: 'AM',
                        },
                        {
                          label: 'To',
                          timeKey: 'endTime',
                          periodKey: 'endPeriod',
                          defaultPeriod: 'PM',
                        },
                      ].map(
                        ({ label, timeKey, periodKey, defaultPeriod }) => (
                          <div key={timeKey} style={{ minWidth: 0 }}>
                            <label
                              htmlFor={`${timeKey}-${id}`}
                              style={{
                                ...styles.label,
                                fontSize: '12px',
                                marginBottom: '7px',
                              }}
                            >
                              {label}
                            </label>

                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(0, 1fr) 64px',
                                gap: '6px',
                                width: '100%',
                                minWidth: 0,
                              }}
                            >
                              <input
                                id={`${timeKey}-${id}`}
                                type="text"
                                inputMode="numeric"
                                placeholder="HH:MM"
                                maxLength={5}
                                aria-label={`${label} time`}
                                value={form[timeKey] || ''}
                                onChange={(event) => {
                                  const digits = event.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 4);

                                  const value =
                                    digits.length > 2
                                      ? `${digits.slice(0, 2)}:${digits.slice(2)}`
                                      : digits;

                                  handleChange(id, timeKey, value);
                                }}
                                style={{
                                  ...styles.input,
                                  width: '100%',
                                  minWidth: 0,
                                  padding: '10px 4px',
                                  textAlign: 'center',
                                  fontSize: '13px',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                                required
                              />

                              <select
                                aria-label={`${label} AM or PM`}
                                value={form[periodKey] || defaultPeriod}
                                onChange={(event) =>
                                  handleChange(id, periodKey, event.target.value)
                                }
                                style={{
                                  ...styles.input,
                                  width: '100%',
                                  minWidth: 0,
                                  padding: '8px 3px',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <p
                      style={{
                        ...styles.subtitle,
                        fontSize: '12px',
                        marginTop: '7px',
                      }}
                    >
                      Example: 09:30 AM to 02:30 PM
                    </p>
                  </div>

                  {/* Meeting link */}
                  <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
                    <label
                      htmlFor={`link-${id}`}
                      style={styles.label}
                    >
                      Meeting Link (Optional)
                    </label>

                    <div style={{ position: 'relative' }}>
                      <Video
                        size={17}
                        style={{
                          position: 'absolute',
                          left: '13px',
                          top: '14px',
                          color: '#7892b2',
                        }}
                      />

                      <input
                        id={`link-${id}`}
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={form.interviewLink || ''}
                        onChange={(event) =>
                          handleChange(id, 'interviewLink', event.target.value)
                        }
                        style={{
                          ...styles.input,
                          paddingLeft: '40px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Existing schedule */}
                {scheduled && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      padding: '13px 15px',
                      marginTop: '22px',
                      background: '#f2f7fd',
                      border: '1px solid #dce9f7',
                      borderRadius: '10px',
                    }}
                  >
                    <CalendarDays
                      size={17}
                      color="#376fae"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />

                    <div>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          margin: '0 0 4px',
                        }}
                      >
                        Current scheduled interview
                      </p>

                      <p style={styles.subtitle}>
                        {formatDate(form.interviewDate)}
                        {form.startTime && (
                          <>
                            {' · '}
                            {formatTime12(
                              `${form.startTime} ${form.startPeriod || 'AM'}`
                            )}
                          </>
                        )}
                        {form.endTime && (
                          <>
                            {' – '}
                            {formatTime12(
                              `${form.endTime} ${form.endPeriod || 'PM'}`
                            )}
                          </>
                        )}
                        {' · IST'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Save button */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px',
                    borderTop: '1px solid #e8eef6',
                    marginTop: '24px',
                    paddingTop: '20px',
                  }}
                >
                  <p
                    style={{
                      ...styles.subtitle,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '12px',
                    }}
                  >
                    <Clock size={15} />
                    {scheduled
                      ? 'You can update the interview details.'
                      : 'Set the date and time range to schedule.'}
                  </p>

                  <button
                    type="button"
                    onClick={() => scheduleInterview(id)}
                    disabled={savingId === id}
                    style={{
                      ...styles.primaryButton,
                      opacity: savingId === id ? 0.65 : 1,
                      cursor: savingId === id ? 'wait' : 'pointer',
                    }}
                  >
                    <CalendarDays size={17} />
                    {savingId === id
                      ? 'Saving...'
                      : scheduled
                        ? 'Update Interview'
                        : 'Schedule Interview'}
                  </button>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
