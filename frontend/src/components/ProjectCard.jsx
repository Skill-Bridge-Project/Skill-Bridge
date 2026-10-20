import { Link } from 'react-router-dom';
import { Clock, Wallet, CalendarDays } from 'lucide-react';
import { companyOf, fmtDate, money } from '../lib/utils';

export default function ProjectCard({ job }) {
  const projectId = job?._id || job?.id;

  if (!projectId) {
    console.error('Project is missing its ID:', job);
    return null;
  }

  return (
    <div className="panel flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/projects/${projectId}`}
            className="block truncate font-semibold hover:text-primary"
          >
            {job.title}
          </Link>

          {job.employer?._id && (
            <Link
              to={`/employers/${job.employer._id}`}
              className="text-sm muted hover:underline"
            >
              {companyOf(job.employer)}
            </Link>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-1">
          <span className="badge badge-sm">Freelance project</span>

          {job.matchPercent !== undefined && (
            <span className="badge badge-neutral badge-sm">
              {job.matchPercent}% match
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs muted">
        <span className="flex items-center gap-1">
          <Wallet className="size-3.5" />
          {money(job.budget)}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {job.duration || 'Flexible'}
        </span>

        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          Apply by {fmtDate(job.deadline)}
        </span>
      </div>

      {job.requirements?.length > 0 && (
        <ul className="list-disc pl-5 text-xs muted">
          {job.requirements.slice(0, 2).map((requirement, index) => (
            <li key={index} className="truncate">
              {requirement}
            </li>
          ))}

          {job.requirements.length > 2 && (
            <li>+{job.requirements.length - 2} more requirements</li>
          )}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(job.skills || []).slice(0, 5).map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="badge badge-outline badge-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-1 text-right">
        <Link
          to={`/projects/${projectId}`}
          className="text-sm font-medium hover:text-primary"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
