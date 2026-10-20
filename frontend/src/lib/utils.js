export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
export const toLocalInput = (d) => (d ? new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '');
export const csv = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
export const lines = (v) => String(v || '').split('\n').map((s) => s.trim()).filter(Boolean);
export const companyOf = (u) => u?.companyName || u?.name || 'Company';
export const dashPath = (u) => (u?.role === 'employer' ? '/employer/dashboard' : '/student/dashboard');
export const money = (n) => (n || n === 0 ? `₹${Number(n).toLocaleString('en-IN')}` : '—');

export const STATUS_STYLE = {
  Applied: 'badge-info', Shortlisted: 'badge-secondary', Interview: 'badge-warning', Accepted: 'badge-success',
  Rejected: 'badge-error', Withdrawn: 'badge-ghost', Completed: 'badge-primary',
};
export const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Accepted', 'Completed'];

export const inp = 'input input-bordered input-sm h-10 w-full';
export const sel = 'select select-bordered select-sm h-10 w-full';
export const txt = 'textarea textarea-bordered w-full';

export const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
};
