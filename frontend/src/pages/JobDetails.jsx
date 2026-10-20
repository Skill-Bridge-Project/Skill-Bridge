
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import {
  BriefcaseBusiness,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Target,
  AlertCircle,
  X,
  FileText,
  Send,
  Globe,
  Building2,
  Wallet,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const isMongoId = (id) => /^[a-f\d]{24}$/i.test(id || '');

const JobDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

const authToken = token || localStorage.getItem('sb_token');

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchJob = async () => {
      setLoading(true);
      setError('');
      setJob(null);

      if (!isMongoId(id)) {
        setError('This link does not contain a valid job ID.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/jobs/${id}`);
        const data = response.data;
        const fetchedJob = data?.job || data?.data || data;

        if (!fetchedJob || !isMongoId(fetchedJob._id || fetchedJob.id)) {
          throw new Error('The server returned an invalid job record.');
        }

        if (!cancelled) setJob(fetchedJob);
      } catch (err) {
        console.error('Error fetching job:', err.response?.data || err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Unable to load this job. Please try again.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJob();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!showApplyModal || !authToken) return;

    let cancelled = false;

    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        const data = response.data;

        const resumeList = Array.isArray(data)
          ? data
          : data?.resumes || data?.data || [];

        if (cancelled) return;

        setResumes(resumeList);

        const defaultResume = resumeList.find((resume) => resume.isDefault);
        setSelectedResume(defaultResume?._id || resumeList[0]?._id || '');
      } catch (err) {
        if (cancelled) return;

        console.error('Error fetching resumes:', err);
        setResumes([]);
        setSelectedResume('');
        toast.error('Could not load saved resumes. You can still apply without one.');
      }
    };

    fetchResumes();

    return () => {
      cancelled = true;
    };
  }, [showApplyModal, authToken]);

  const handleApplyClick = () => {
    if (!authToken) {
      toast.error('Please log in to apply for this job.');
      return;
    }

    if (user?.role && user.role !== 'student') {
      toast.error('Only students can apply for jobs.');
      return;
    }

    if (!job?._id || !isMongoId(job._id)) {
      toast.error('Valid job information is unavailable.');
      return;
    }

    if (job.status && job.status.toLowerCase() !== 'open') {
      toast.error('This job is no longer accepting applications.');
      return;
    }

    setShowApplyModal(true);
  };

  const handleConfirmApply = async () => {
    if (!job?._id || !isMongoId(job._id)) {
      toast.error('Invalid job ID.');
      return;
    }

    if (applying) return;

    setApplying(true);

    try {
      const payload = {
        ...(selectedResume ? { resume: selectedResume } : {}),
        ...(coverLetter.trim()
          ? { coverLetter: coverLetter.trim() }
          : {}),
      };

      await api.post(`/applications/${job._id}`, payload);

      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      setSelectedResume('');
    } catch (err) {
      console.error('Application error:', err.response?.data || err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        toast.error('You have already applied for this job.');
      } else if (status === 401) {
        toast.error('Your session has expired. Please log in again.');
      } else {
        toast.error(message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  const skills = Array.isArray(job?.skills)
    ? job.skills
    : typeof job?.skills === 'string'
      ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  const requirements = Array.isArray(job?.requirements)
    ? job.requirements
    : typeof job?.requirements === 'string'
      ? job.requirements.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

  const employer =
    job?.employer && typeof job.employer === 'object'
      ? job.employer
      : {};

  const employerName =
    employer.companyName ||
    employer.name ||
    job?.companyName ||
    'Company';

  const location = job?.location || 'Not specified';
  const jobType = job?.jobType || job?.type || 'Job';
  const companyIndustry = employer.industry || '';
  const companySize = employer.companySize || '';
  const companyWebsite = employer.website || '';
  const companyAbout = employer.about || '';
  const companyLogo = employer.avatar || employer.logo || '';
  const isOpen = !job?.status || job.status.toLowerCase() === 'open';

  const cardClass =
    'rounded-2xl border border-slate-200 bg-white shadow-sm';

  const sectionTitle =
    'text-lg font-bold tracking-tight text-slate-900 sm:text-xl';

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-24">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-slate-600">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error || 'This job may have been removed.'}
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            <span>Back to Jobs</span>
          </Link>

          <span className="hidden text-sm font-medium text-slate-500 sm:block">
            SkillBridge <span className="text-slate-300">/</span> Job Details
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Job header */}
        <section className={`${cardClass} mb-6 p-5 sm:p-8`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-4 sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 sm:h-16 sm:w-16">
                <BriefcaseBusiness size={29} />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {jobType}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOpen
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isOpen ? '● Open for applications' : 'Closed'}
                  </span>
                </div>

                <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                  {job.title || 'Untitled Opportunity'}
                </h1>

                <p className="mt-2 text-base font-medium text-slate-600">
                  {employerName}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={17} className="shrink-0 text-blue-600" />
                    {location}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness size={17} className="shrink-0 text-blue-600" />
                    {job.workMode || 'Work mode not specified'}
                  </span>

                  {job.salary && (
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <Wallet size={17} className="shrink-0 text-blue-600" />
                      {job.salary}
                    </span>
                  )}

                  {job.budget && (
                    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                      <Wallet size={17} className="shrink-0 text-blue-600" />
                      Budget: {job.budget}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyClick}
              disabled={!isOpen}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 md:w-auto"
            >
              Apply Now <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Main content and sidebar */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            {/* Description */}
            <section className={`${cardClass} p-5 sm:p-7`}>
              <h2 className={sectionTitle}>About This Opportunity</h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {job.description || 'No description has been provided for this opportunity.'}
              </p>
            </section>

            {/* Requirements */}
            <section className={`${cardClass} p-5 sm:p-7`}>
              <h2 className={sectionTitle}>Requirements</h2>

              {requirements.length > 0 ? (
                <ul className="mt-5 space-y-4">
                  {requirements.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-start gap-3">
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span className="text-sm leading-6 text-slate-600 sm:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  No specific requirements have been listed.
                </p>
              )}
            </section>

            {/* Skills */}
            <section className={`${cardClass} p-5 sm:p-7`}>
              <h2 className={sectionTitle}>Skill-Gap</h2>
              <p>Required skills </p>

              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No specific skills have been listed.
                </p>
              )}
            </section>

            {/* Company profile */}
            <section className={`${cardClass} p-5 sm:p-7`}>
              <div className="flex items-start gap-4">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={`${employerName} logo`}
                    className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-blue-700">
                    <Building2 size={26} />
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className={sectionTitle}>{employerName}</h2>
                  <p className="mt-1 text-sm text-slate-500">Company Profile</p>

                  {companyIndustry && (
                    <p className="mt-3 text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">Industry:</span>{' '}
                      {companyIndustry}
                    </p>
                  )}

                  {companySize && (
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">Company size:</span>{' '}
                      {companySize}
                    </p>
                  )}
                </div>
              </div>

              {companyAbout && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h3 className="text-sm font-bold text-slate-900">About the Company</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {companyAbout}
                  </p>
                </div>
              )}

              {companyWebsite && (
                <a
                  href={
                    /^https?:\/\//i.test(companyWebsite)
                      ? companyWebsite
                      : `https://${companyWebsite}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900 hover:underline"
                >
                  <Globe size={17} />
                  Visit Company Website
                  <ArrowRight size={15} />
                </a>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <section className={`${cardClass} p-5 sm:p-6`}>
              <h2 className={sectionTitle}>Job Overview</h2>

              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Location</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                    <Clock size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Job Type</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{jobType}</p>
                  </div>
                </div>

                {job.workMode && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                      <BriefcaseBusiness size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Work Mode</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{job.workMode}</p>
                    </div>
                  </div>
                )}

                {job.openings != null && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                      <GraduationCap size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Openings</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{job.openings}</p>
                    </div>
                  </div>
                )}

                {(job.salary || job.budget) && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                      <Wallet size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {job.budget ? 'Project Budget' : 'Salary'}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {job.salary || job.budget}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

           
            <section className={`${cardClass} p-5 sm:p-6`}>
              <h3 className="font-bold text-slate-900">Ready to apply?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review the details and submit your application when you're ready.
              </p>

              <button
                type="button"
                onClick={handleApplyClick}
                disabled={!isOpen}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Apply Now <ArrowRight size={17} />
              </button>
            </section>
          </aside>
        </div>
      </main>

      {/* Application modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            className="relative my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              disabled={applying}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
              aria-label="Close application form"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Send size={23} />
              </div>
              <div>
                <h2 id="apply-modal-title" className="text-xl font-bold text-slate-900">
                  Confirm Application
                </h2>
                <p className="mt-1 text-sm text-slate-500">{job.title}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">
                You're applying to <span className="font-semibold">{employerName}</span>.
                Review your details below before submitting.
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="application-resume"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Select Resume <span className="font-normal text-slate-500">(Optional)</span>
              </label>

              {resumes.length > 0 ? (
                <select
                  id="application-resume"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  disabled={applying}
                >
                  <option value="">Apply without a resume</option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.title || 'My Resume'}
                      {resume.isDefault ? ' (Default)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <FileText size={19} className="mt-0.5 shrink-0 text-slate-500" />
                  <p className="text-sm leading-5 text-slate-600">
                    No saved resumes found. You can still submit your application without one.
                  </p>
                </div>
              )}

              <Link
                to="/resume-management"
                onClick={() => setShowApplyModal(false)}
                className="mt-2 inline-flex text-sm font-medium text-blue-700 hover:underline"
              >
                Manage my resumes
              </Link>
            </div>

            <div className="mt-5">
              <label
                htmlFor="application-cover-letter"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Cover Letter <span className="font-normal text-slate-500">(Optional)</span>
              </label>

              <textarea
                id="application-cover-letter"
                className="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                rows={4}
                placeholder="Introduce yourself and explain why you're interested in this opportunity..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={applying}
              />
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
              >
                Cancel
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmApply}
                disabled={applying}
              >
                {applying ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Confirm Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
