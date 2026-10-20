
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import api from '../lib/axios';
import PageHeader from '../components/PageHeader';
import Loader, { Empty } from '../components/Loader';
import JobCard from '../components/JobCard';
import ProjectCard from '../components/ProjectCard';

export default function BrowseJobs() {
  const [params] = useSearchParams();

  const [f, setF] = useState({
    q: params.get('q') || params.get('keyword') || '',
    type: '',
    workMode: '',
    jobType: '',
    location: '',
  });

  const [jobs, setJobs] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [retry, setRetry] = useState(0);

  const set = (key) => (e) => {
    setF((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const clearFilters = () => {
    setF({
      q: '',
      type: '',
      workMode: '',
      jobType: '',
      location: '',
    });
  };

  useEffect(() => {
    const keyword = params.get('q') || params.get('keyword') || '';

    setF((prev) =>
      prev.q === keyword ? prev : { ...prev, q: keyword }
    );
  }, [params]);

  useEffect(() => {
    let isActive = true;

    const timeout = setTimeout(async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(f).filter(([, value]) => value.trim() !== '')
      );

      try {
        setJobs(null);
        setFetchError(false);

        const response = await api.get('/jobs', {
          params: cleanParams,
        });

        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data?.jobs || data?.data || [];

        if (isActive) {
          setJobs(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);

        if (isActive) {
          setJobs([]);
          setFetchError(true);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [f, retry]);

  const hasFilters = Object.values(f).some(
    (value) => value.trim() !== ''
  );

  const fieldClass =
    'w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50';

  const labelClass =
    'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500';

  return (
    <div className="min-h-screen bg-[#fbfcff] text-slate-800">
      {/* Page heading */}
      <div className="border-b border-[#e9edf7] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#edf3ff] px-3 py-1.5 text-xs font-semibold text-[#4765a9]">
                <Sparkles size={14} />
                Find your next opportunity
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Browse Opportunities
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Discover jobs, internships and freelance projects that
                match your skills and career goals.
              </p>
            </div>

            <div className="hidden h-20 w-20 items-center justify-center rounded-3xl bg-[#f0edff] text-[#7770bb] sm:flex">
              <BriefcaseBusiness size={35} strokeWidth={1.6} />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Filter panel */}
        <section className="overflow-hidden rounded-2xl border border-[#e4e9f4] bg-white shadow-[0_4px_20px_rgba(40,60,100,0.04)]">
          <div className="flex items-center justify-between border-b border-[#edf0f7] bg-[#f6f8ff] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#6578b8] shadow-sm">
                <SlidersHorizontal size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                  Refine your search
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Use filters to find the right fit.
                </p>
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#5e70aa] transition hover:bg-white sm:px-3 sm:text-sm"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="browse-search">
                Keywords
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8996b8]"
                />
                <input
                  id="browse-search"
                  className={`${fieldClass} pl-10`}
                  placeholder="Job title, skill or keyword"
                  value={f.q}
                  onChange={set('q')}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelClass} htmlFor="browse-location">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8996b8]"
                />
                <input
                  id="browse-location"
                  className={`${fieldClass} pl-10`}
                  placeholder="City or location"
                  value={f.location}
                  onChange={set('location')}
                />
              </div>
            </div>

            {/* Opportunity category */}
            <div>
              <label className={labelClass} htmlFor="browse-category">
                Category
              </label>

              <select
                id="browse-category"
                className={fieldClass}
                value={f.type}
                onChange={set('type')}
              >
                <option value="">All opportunities</option>
                <option value="job">Jobs only</option>
                <option value="project">Freelance projects</option>
              </select>
            </div>

            {/* Work mode */}
            <div>
              <label className={labelClass} htmlFor="browse-mode">
                Work arrangement
              </label>

              <select
                id="browse-mode"
                className={fieldClass}
                value={f.workMode}
                onChange={set('workMode')}
              >
                <option value="">All arrangements</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Employment type */}
            <div>
              <label className={labelClass} htmlFor="browse-job-type">
                Employment type
              </label>

              <select
                id="browse-job-type"
                className={fieldClass}
                value={f.jobType}
                onChange={set('jobType')}
              >
                <option value="">All job types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6478b8] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5368a8] focus:outline-none focus:ring-4 focus:ring-[#e4e9fb]"
              >
                <Search size={16} />
                Search opportunities
              </button>
            </div>
          </div>
        </section>

        {/* Results header */}
        <section className="mb-5 mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Opportunities for you
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {jobs === null
                ? 'Finding opportunities...'
                : fetchError
                  ? 'We could not load the results.'
                  : `${jobs.length} ${jobs.length === 1 ? 'opportunity' : 'opportunities'} available`}
            </p>
          </div>

          {jobs && !fetchError && jobs.length > 0 && (
            <span className="inline-flex w-fit items-center rounded-full border border-[#e3e8f6] bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
              Latest opportunities
            </span>
          )}
        </section>

        {/* Results */}
        {jobs === null ? (
          <div className="rounded-2xl border border-[#e4e9f4] bg-white px-4 py-12">
            <Loader />
          </div>
        ) : fetchError ? (
          <div className="rounded-2xl border border-[#e4e9f4] bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ef] text-[#bd6862]">
              <BriefcaseBusiness size={23} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Unable to load opportunities
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-5 rounded-xl bg-[#6478b8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5368a8]"
            >
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-[#e4e9f4] bg-white px-4 py-12">
            <Empty
              title="No matching opportunities"
              hint="Try changing your keywords or removing some filters."
            />

            {hasFilters && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl bg-[#6478b8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5368a8]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:gap-6">
            {jobs.map((job, index) => {
              const isProject =
                job.type?.toLowerCase() === 'project' ||
                job.category?.toLowerCase() === 'project';

              const jobId = job._id || job.id;

              return isProject ? (
                <ProjectCard
                  key={jobId || `project-${index}`}
                  job={job}
                />
              ) : (
                <JobCard
                  key={jobId || `job-${index}`}
                  job={job}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
