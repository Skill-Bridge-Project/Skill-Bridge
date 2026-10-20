
import { useEffect, useState } from 'react';
import api from '../lib/axios';import toast from 'react-hot-toast';
import {
  BriefcaseBusiness,
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  X,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';


const emptyForm = {
  title: '',
  description: '',
  location: '',
  jobType: 'Full-time',
  salary: '',
  skills: '',
};

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();


  async function fetchJobs() {
    setLoading(true);

    try {
      const response = await api.get('/jobs');
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.jobs || data.data || [];

      const ownJobs = list.filter((job) => {
        const ownerId =
          job.employer?._id ||
          job.employer ||
          job.postedBy?._id ||
          job.postedBy ||
          job.createdBy?._id ||
          job.createdBy;

        if (!ownerId) return false;

        return String(ownerId) === String(user?._id || user?.id);
      });

      setJobs(ownJobs);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Could not load jobs. Please check your API.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(job) {
    setEditingId(job._id || job.id);

    setForm({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      jobType: job.jobType || job.type || 'Full-time',
      salary: job.salary ?? '',
      skills: Array.isArray(job.skills)
        ? job.skills.join(', ')
        : job.skills || '',
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Enter a job title and description.');
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      jobType: form.jobType,
      salary: form.salary,
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/jobs/${editingId}`, payload);
        toast.success('Job updated successfully!');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted successfully!');
      }

      closeForm();
      await fetchJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to save job. Check your backend fields and routes.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(job) {
    const id = job._id || job.id;

    if (!window.confirm(`Delete "${job.title}"?`)) return;

    setDeletingId(id);

    try {
      await api.delete(`/jobs/${id}`);

      setJobs((previous) =>
        previous.filter((item) => (item._id || item.id) !== id)
      );

      toast.success('Job deleted successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to delete this job.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title || ''} ${job.location || ''} ${
      job.jobType || job.type || ''
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const inputClass =
    'input input-bordered w-full border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  const textareaClass =
    'textarea textarea-bordered min-h-28 w-full border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-7 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
              <BriefcaseBusiness size={16} />
              Employer Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Manage Jobs
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Create, update and manage your company's job postings.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <Plus size={18} />
            Post a Job
          </button>
        </header>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <BriefcaseBusiness size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Your Job Postings
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {jobs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <Search size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Matching Search Results
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {filteredJobs.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Refresh */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <Search size={19} className="shrink-0 text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="Search by job title, location or type..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>

          <button
            type="button"
            onClick={fetchJobs}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </section>

        {/* Job Listings */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Listings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review and update your published opportunities.
              </p>
            </div>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
              {filteredJobs.length} jobs
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-slate-500">
              <LoaderCircle
                size={30}
                className="animate-spin text-blue-600"
              />
              <p className="text-sm font-medium">Loading your jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness size={30} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {search ? 'No matching jobs' : 'No job postings yet'}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? 'Try a different search term or clear your search.'
                  : 'Your job listings will appear here. Create your first posting to get started.'}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Create Your First Job
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredJobs.map((job) => {
                const id = job._id || job.id;

                return (
                  <article
                    key={id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300" />

                    <div className="space-y-5 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="shrink-0 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-indigo-600">
                            <BriefcaseBusiness size={23} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words text-lg font-bold text-slate-900">
                              {job.title}
                            </h3>

                            <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500">
                              <MapPin size={16} className="mt-0.5 shrink-0" />
                              <span>
                                {job.location || 'Location not specified'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span className="max-w-32 shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-center text-xs font-semibold text-blue-700">
                          {job.jobType || job.type || 'Job'}
                        </span>
                      </div>

                      <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {job.description}
                      </p>

                      {job.salary && (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                          <span className="text-xs font-semibold text-emerald-700">
                            Salary / Stipend
                          </span>
                          <span className="text-sm font-bold text-emerald-800">
                            {job.salary}
                          </span>
                        </div>
                      )}

                      {Array.isArray(job.skills) &&
                        job.skills.length > 0 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Required Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={`${skill}-${index}`}
                                  className="rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700"
                                >
                                  {skill}
                                </span>
                              ))}

                              {job.skills.length > 5 && (
                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                  +{job.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => openEditForm(job)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(job)}
                          disabled={deletingId === id}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === id ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm">          
<div
  className="relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl sm:p-7"
  onClick={(event) => event.stopPropagation()}
>            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <BriefcaseBusiness size={14} />
                  Employer Workspace
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId ? 'Edit Job Posting' : 'Create a Job Posting'}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add clear details so candidates can understand the opportunity.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={textareaClass}
                  placeholder="Describe the role, responsibilities and requirements..."
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Mumbai / Remote"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Employment Type
                  </label>
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Salary / Stipend
                </label>
                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. ₹4–6 LPA or ₹10,000/month"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Required Skills
                </label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="React, JavaScript, CSS"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Separate each skill with a comma.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={saving}
                >
                  {saving && (
                    <LoaderCircle size={17} className="animate-spin" />
                  )}
                  {editingId ? 'Save Changes' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>

<button
  type="button"
  className="modal-backdrop"
  onClick={closeForm}
  aria-label="Close modal"
>
  Close
</button>
        </div>
      )}
    </div>
  );
}
