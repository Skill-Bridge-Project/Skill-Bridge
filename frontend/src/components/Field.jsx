export default function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`form-control w-full ${className}`}>
      <div className="label py-1"><span className="label-text text-sm font-medium">{label}</span></div>
      {children}
      {hint && <div className="label py-1"><span className="label-text-alt text-base-content/50">{hint}</span></div>}
    </label>
  );
}
