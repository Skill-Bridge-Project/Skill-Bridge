
import { Link } from 'react-router-dom';
import {
  MapPin,
  BriefcaseBusiness,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { companyOf } from '../lib/utils';

export default function JobCard({ job }) {
  const jobId = job?._id;

  if (!jobId || !/^[a-f\d]{24}$/i.test(jobId)) {
    console.error('Invalid MongoDB job ID:', job);
    return null;
  }

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
      {/* Job title and company */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
          <BriefcaseBusiness size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <Link
            to={`/jobs/${jobId}`}
            className="block break-words text-base font-bold leading-6 text-slate-900 transition hover:text-blue-700"
          >
            {job.title || 'Untitled Opportunity'}
          </Link>

          {job.employer?._id ? (
            <Link
              to={`/employers/${job.employer._id}`}
              className="mt-1 block break-words text-sm text-slate-500 hover:text-blue-700 hover:underline"
            >
              {companyOf(job.employer)}
            </Link>
          ) : (
            <p className="mt-1 break-words text-sm text-slate-500">
              {companyOf(job.employer) || job.companyName || 'Company'}
            </p>
          )}
        </div>

        {job.matchPercent !== undefined && (
          <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
            {job.matchPercent}% match
          </span>
        )}
      </div>

      {/* Job details */}
      <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3.5 sm:grid-cols-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <MapPin size={16} className="mt-0.5 shrink-0 text-blue-600" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Location</p>
            <p className="mt-1 break-words text-sm font-medium text-slate-700">
              {job.location || 'Not specified'}
            </p>
            {job.workMode && (
              <p className="mt-1 break-words text-xs text-slate-500">
                {job.workMode}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 items-start gap-2.5">
          <BriefcaseBusiness
            size={16}
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Job type</p>
            <p className="mt-1 break-words text-sm font-medium text-slate-700">
              {job.jobType || 'Not specified'}
            </p>
          </div>
        </div>

        {(job.salary || job.budget) && (
          <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2">
            <Wallet size={16} className="mt-0.5 shrink-0 text-blue-600" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">
                {job.budget ? 'Project budget' : 'Salary'}
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                {job.salary || job.budget}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Skills required
        </p>

        <div className="flex flex-wrap gap-2">
          {(Array.isArray(job.skills) ? job.skills : [])
            .slice(0, 5)
            .map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="max-w-full break-words rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-800"
              >
                {skill}
              </span>
            ))}

          {(!Array.isArray(job.skills) || job.skills.length === 0) && (
            <span className="text-sm text-slate-400">
              No skills listed
            </span>
          )}
        </div>
      </div>

      {/* View Details button */}
      <div className="mt-auto pt-5">
        <div className="mb-4 border-t border-slate-100" />

        <Link
          to={`/jobs/${jobId}`}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          View Details
          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}
