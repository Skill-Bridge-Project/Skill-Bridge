import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BriefcaseBusiness,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
  RefreshCw,
  ArrowUpRight,
  CalendarDays,
  Video,
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

const statusStyles = {
  applied: 'bg-amber-50 text-amber-700 border-amber-100',
  shortlisted: 'bg-violet-50 text-violet-700 border-violet-100',
  interview: 'bg-blue-50 text-blue-700 border-blue-100',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
  withdrawn: 'bg-slate-100 text-slate-600 border-slate-200',
  completed: 'bg-teal-50 text-teal-700 border-teal-100',
};

function getJob(application) {
  const job = application?.job || application?.jobId;

  return job && typeof job === 'object' ? job : {};
}

function getJobId(application) {
  const job = application?.job || application?.jobId;

  if (typeof job === 'string') return job;

  return job?._id || job?.id || application?.job?._id || null;
}

function getStatus(application) {
  return String(application?.status || 'Applied').toLowerCase();
}

function formatDate(date) {
  if (!date) return 'Date unavailable';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(date) {
  if (!date) return 'Date unavailable';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const normalized = String(status || 'Applied').toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        statusStyles[normalized] || statusStyles.applied
      }`}
    >
      {normalized === 'accepted' && <CheckCircle2 size={14} />}
      {normalized === 'rejected' && <XCircle size={14} />}
      {normalized === 'applied' && <Clock3 size={14} />}
      {normalized === 'interview' && <CalendarDays size={14} />}
      {label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

export default function Applications() {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState('');

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      }),
    [token]
  );

  async function fetchApplications() {
    if (!token) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await api.get('/applications/mine');
      const data = response.data;

      console.log('My applications API response:', data);

      const list = Array.isArray(data)
        ? data
        : data?.applications || data?.data || [];

      setApplications(Array.isArray(list) ? list : []);
    } catch (error) {
      setApplications([]);

      toast.error(
        error.response?.data?.message ||
          'Could not load your applications.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, [token]);

  async function withdrawApplication(application) {
    const id = application._id || application.id;

    if (!id) {
      toast.error('Application ID is missing.');
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to withdraw this application?'
      )
    ) {
      return;
    }

    setWithdrawing(id);

    try {
      await api.put(`/applications/${id}/withdraw`);

      toast.success('Application withdrawn successfully.');
      await fetchApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not withdraw the application.'
      );
    } finally {
      setWithdrawing('');
    }
  }

  const filteredApplications = applications.filter((application) => {
    const job = getJob(application);
    const employer = job.employer || {};

    const company =
      employer.companyName ||
      employer.name ||
      (typeof job.company === 'string' ? job.company : '') ||
      (typeof application.company === 'string'
        ? application.company
        : '') ||
      'Company not specified';

    const title = job.title || job.role || job.jobTitle || '';

    const searchText = `${title} ${company}`.toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase().trim()
    );

    const status = getStatus(application);
    const matchesFilter = filter === 'all' || status === filter;

    return matchesSearch && matchesFilter;
  });

  const countStatus = (status) =>
    applications.filter((item) => getStatus(item) === status).length;

  if (!token) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-5 py-14">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <BriefcaseBusiness
            className="mx-auto text-blue-600"
            size={38}
          />

          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            Login required
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Log in to view and manage your job applications.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Your career journey
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              My Applications
            </h1>

            <p className="mt-3 text-slate-500">
              Track your applications and stay updated on their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={applications.length}
            icon={FileText}
            color="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Applied"
            value={countStatus('applied')}
            icon={Clock3}
            color="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Shortlisted"
            value={countStatus('shortlisted')}
            icon={CheckCircle2}
            color="bg-violet-50 text-violet-600"
          />

          <StatCard
            title="Accepted"
            value={countStatus('accepted')}
            icon={BriefcaseBusiness}
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Applied Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredApplications.length} application
                {filteredApplications.length === 1 ? '' : 's'} found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
                <Search size={18} className="text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search job or company"
                  className="w-full min-w-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:w-56"
                />
              </div>

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="all">All statuses</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-14 text-slate-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {applications.length === 0
                  ? 'No applications yet'
                  : 'No matching applications'}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {applications.length === 0
                  ? 'Explore available jobs and apply to start tracking your applications here.'
                  : 'Try a different search term or select another status filter.'}
              </p>

              {applications.length === 0 && (
                <Link
                  to="/jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Explore Jobs <ArrowUpRight size={18} />
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredApplications.map((application) => {
                const job = getJob(application);
                const id = application._id || application.id;
                const jobId = getJobId(application);

                const title =
                  job.title ||
                  job.role ||
                  job.jobTitle ||
                  'Job title unavailable';

                const employer = job.employer || {};

                const company =
                  employer.companyName ||
                  employer.name ||
                  (typeof job.company === 'string'
                    ? job.company
                    : '') ||
                  (typeof application.company === 'string'
                    ? application.company
                    : '') ||
                  'Company not specified';

                const location =
                  job.location ||
                  job.workLocation ||
                  'Location not specified';

                const status = getStatus(application);

                const appliedDate =
                  application.createdAt ||
                  application.appliedAt ||
                  application.dateApplied;

                const interview = application.interview;

                return (
                  <article
                    key={id}
                    className="flex flex-col gap-5 p-5 transition hover:bg-slate-50/70 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <BriefcaseBusiness size={23} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words text-base font-bold text-slate-900">
                            {title}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {company}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              Applied: {formatDate(appliedDate)}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <BriefcaseBusiness size={14} />
                              {location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <StatusBadge status={status} />

                        {jobId && (
                          <Link
                            to={`/jobs/${jobId}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600"
                          >
                            View Job <ArrowUpRight size={15} />
                          </Link>
                        )}

                        {![
                          'accepted',
                          'rejected',
                          'withdrawn',
                          'completed',
                        ].includes(status) && (
                          <button
                            type="button"
                            disabled={withdrawing === id}
                            onClick={() =>
                              withdrawApplication(application)
                            }
                            className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                          >
                            {withdrawing === id
                              ? 'Withdrawing...'
                              : 'Withdraw'}
                          </button>
                        )}
                      </div>
                    </div>

                    {interview?.date && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 sm:ml-16">
                        <h4 className="flex items-center gap-2 font-bold text-blue-800">
                          <CalendarDays size={17} />
                          Interview Scheduled
                        </h4>

                        <p className="mt-2 text-sm text-blue-700">
                          Date &amp; Time: {formatDateTime(interview.date)}
                        </p>

                        {interview.mode && (
                          <p className="mt-1 flex items-center gap-2 text-sm text-blue-700">
                            <Video size={15} />
                            Mode: {interview.mode}
                          </p>
                        )}

                        {interview.notes && (
                          <p className="mt-2 whitespace-pre-wrap text-sm text-blue-700">
                            Notes: {interview.notes}
                          </p>
                        )}

                        {interview.link && (
                          <a
                            href={interview.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 font-semibold text-blue-700 underline"
                          >
                            Join Interview
                            <ArrowUpRight size={15} />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}