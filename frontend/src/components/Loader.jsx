export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm muted">
      <span className="loading loading-spinner loading-sm" /> {label}
    </div>
  );
}

export function Empty({ title, hint, action }) {
  return (
    <div className="panel px-6 py-12 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-md text-sm muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
