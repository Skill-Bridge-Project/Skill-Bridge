
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  RefreshCw,
  LoaderCircle,
  FileText,
  BriefcaseBusiness,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';


const STATUSES = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Accepted',
  'Rejected',
  'Completed',
  'Withdrawn',
];

const statusStyles = {
  Applied: 'border-amber-200 bg-amber-50 text-amber-700',
  Shortlisted: 'border-violet-200 bg-violet-50 text-violet-700',
  Interview: 'border-blue-200 bg-blue-50 text-blue-700',
  Accepted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  Completed: 'border-teal-200 bg-teal-50 text-teal-700',
  Withdrawn: 'border-slate-200 bg-slate-100 text-slate-600',
};

export default function ManageApplicants() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem('sb_token');

  async function fetchApplications() {
    if (!token) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await api.get('/applications/employer');
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.applications || data.data || [];

      setApplications(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not load applications.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(application, status) {
    const id = application._id || application.id;

    if (!id) {
      toast.error('Application ID is missing.');
      return;
    }

    if (['Withdrawn', 'Applied'].includes(status)) {
      toast.error('Select a valid employer status.');
      return;
    }

    setUpdatingId(id);

    try {
      // Backend route uses PUT, not PATCH.
      await api.put(`/applications/${id}/status`, { status });

      setApplications((previous) =>
        previous.map((item) =>
          (item._id || item.id) === id
            ? { ...item, status }
            : item
        )
      );

      toast.success(`Application status updated to ${status}.`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to update application status.'
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function getStudent(application) {
    return application.student || {};
  }

  function getJob(application) {
    return application.job || {};
  }

  const filteredApplications = applications.filter((application) => {
    const student = getStudent(application);
    const job = getJob(application);
    const status = application.status || 'Applied';

    const searchableText = [
      student.name,
      student.email,
      job.title,
      status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      search.toLowerCase().trim()
    );

    const matchesStatus =
      statusFilter === 'All' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = (status) =>
    applications.filter(
      (application) => application.status === status
    ).length;

  if (!token) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Users size={36} className="mx-auto text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Login required
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Log in with your employer account to manage applicants.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700">
              <Users size={16} />
              Employer Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Manage Applicants
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review candidates, view their profiles, and manage applications.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={applications.length}
            icon={<Users size={22} />}
            color="blue"
          />
          <StatCard
            label="Applied"
            value={countByStatus('Applied')}
            icon={<Clock size={22} />}
            color="amber"
          />
          <StatCard
            label="Shortlisted"
            value={countByStatus('Shortlisted')}
            icon={<CheckCircle2 size={22} />}
            color="violet"
          />
          <StatCard
            label="Accepted"
            value={countByStatus('Accepted')}
            icon={<CheckCircle2 size={22} />}
            color="emerald"
          />
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl border border-slate-300 px-3 focus-within:border-blue-400">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidate, email or job..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review applicants and update their application status.
              </p>
            </div>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
              {filteredApplications.length} results
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border bg-white text-slate-500">
              <LoaderCircle size={30} className="animate-spin text-blue-600" />
              <p className="text-sm">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <Users size={30} className="mx-auto text-violet-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No applications found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {search || statusFilter !== 'All'
                  ? 'Try changing your search or status filter.'
                  : 'Applications will appear here when students apply for your opportunities.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredApplications.map((application) => {
                const id = application._id || application.id;
                const student = getStudent(application);
                const job = getJob(application);
                const status = application.status || 'Applied';
                const resume = application.resume;
                const portfolio = Array.isArray(student.portfolio)
                  ? student.portfolio
                  : [];

                return (
                  <article
                    key={id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-400 via-violet-300 to-emerald-300" />

                    <div className="space-y-5 p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-lg font-bold text-blue-700">
                          {(student.name || 'S').charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-lg font-bold text-slate-900">
                            {student.name || 'Candidate'}
                          </h3>

                          {student.email && (
                            <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-500">
                              <Mail size={15} className="shrink-0" />
                              {student.email}
                            </p>
                          )}

                          {student.location && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                              <MapPin size={15} className="shrink-0" />
                              {student.location}
                            </p>
                          )}

                          {student.headline && (
                            <p className="mt-1 text-sm text-slate-600">
                              {student.headline}
                            </p>
                          )}
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[status] ||
                            'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                          <BriefcaseBusiness size={15} />
                          Applied For
                        </p>

                        <p className="font-semibold text-slate-900">
                          {job.title || 'Job title unavailable'}
                        </p>

                        {application.createdAt && (
                          <p className="mt-2 text-xs text-slate-500">
                            Applied on:{' '}
                            {new Date(application.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>

                      {student.skills?.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-700">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {student.skills.map((skill, index) => (
                              <span
                                key={`${skill.name || skill}-${index}`}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                              >
                                {skill.name || skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <FileText size={17} />
                          Submitted Resume
                        </p>

                        {resume && typeof resume === 'object' ? (
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {resume.title || 'Resume'}
                            </p>
                            {resume.data?.summary && (
                              <p className="mt-2 text-sm leading-6 text-slate-500">
                                {resume.data.summary}
                              </p>
                            )}
                            {resume.data?.skills?.length > 0 && (
                              <p className="mt-2 text-xs text-slate-500">
                                Resume skills: {resume.data.skills.join(', ')}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-slate-400">
                              Resume details are displayed from the saved resume record.
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No saved resume was attached to this application.
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <FolderOpen size={17} />
                          Student Portfolio
                        </p>

                        {portfolio.length > 0 ? (
                          <div className="space-y-3">
                            {portfolio.map((item, index) => (
                              <div
                                key={item._id || `${item.title}-${index}`}
                                className="rounded-lg bg-slate-50 p-3"
                              >
                                <p className="font-semibold text-slate-800">
                                  {item.title}
                                </p>
                                {item.description && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    {item.description}
                                  </p>
                                )}
                                {item.tech?.length > 0 && (
                                  <p className="mt-2 text-xs text-slate-500">
                                    Technologies: {item.tech.join(', ')}
                                  </p>
                                )}
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
                                  >
                                    View Project <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No portfolio projects are available on this student profile.
                          </p>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Update Application Status
                        </label>

                        <select
                          value={status}
                          disabled={
                            updatingId === id ||
                            ['Withdrawn', 'Rejected', 'Completed'].includes(status)
                          }
                          onChange={(event) =>
                            updateStatus(application, event.target.value)
                          }
                          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-60"
                        >
                          {STATUSES.map((item) => (
                            <option
                              key={item}
                              value={item}
                              disabled={['Applied', 'Withdrawn'].includes(item)}
                            >
                              {item}
                            </option>
                          ))}
                        </select>

                        {updatingId === id && (
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <LoaderCircle size={16} className="animate-spin" />
                            Updating...
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {!['Rejected', 'Withdrawn', 'Completed'].includes(status) && (
                            <>
                              {status !== 'Shortlisted' && (
                                <button
                                  type="button"
                                  disabled={updatingId === id}
                                  onClick={() =>
                                    updateStatus(application, 'Shortlisted')
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-50"
                                >
                                  <CheckCircle2 size={14} />
                                  Shortlist
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={updatingId === id}
                                onClick={() =>
                                  updateStatus(application, 'Rejected')
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </>
                          )}

                          {student._id && (
                            <Link
                              to={`/messages?to=${encodeURIComponent(student._id)}`}
                              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              <MessageCircle size={14} />
                              Message Applicant
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl border p-3 ${colors[color] || colors.blue}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
