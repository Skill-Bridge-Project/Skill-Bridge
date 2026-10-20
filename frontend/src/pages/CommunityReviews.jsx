import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { companyOf, fmtDate, sel, txt } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';
import Stars from '../components/Stars';
import Loader, { Empty } from '../components/Loader';

export default function CommunityReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [people, setPeople] = useState([]);
  const [f, setF] = useState({ to: '', rating: 5, comment: '' });
  const load = () => api.get('/reviews').then((r) => setReviews(r.data));
  useEffect(() => {
    load();
    if (user) api.get('/users', { params: { role: user.role === 'student' ? 'employer' : 'student' } }).then((r) => setPeople(r.data));
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    try { await api.post('/reviews', f); toast.success('Review posted'); setF({ to: '', rating: 5, comment: '' }); load(); } catch (err) { toast.error(errMsg(err)); }
  };
  const remove = async (id) => { if (!confirm('Delete your review?')) return; await api.delete(`/reviews/${id}`); toast.success('Review deleted'); load(); };
  if (!reviews) return <Loader />;

  return (
    <>
      <PageHeader title="Community reviews" subtitle="Ratings and feedback from students and employers." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {reviews.length === 0 ? <Empty title="No reviews yet" /> : reviews.map((r) => (
            <div key={r._id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-sm"><b>{companyOf(r.from)}</b> <span className="muted">reviewed</span> <b>{companyOf(r.to)}</b></p><p className="text-xs muted">{fmtDate(r.createdAt)}</p></div>
                <div className="flex items-center gap-2"><Stars value={r.rating} />{user && String(r.from?._id) === String(user._id) && <button className="btn btn-ghost btn-xs btn-square text-error" onClick={() => remove(r._id)} aria-label="Delete review"><Trash2 className="size-4" /></button>}</div>
              </div>
              <p className="mt-2 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
        <aside>
          {user ? (
            <form onSubmit={submit} className="panel space-y-3 p-5">
              <h2 className="font-semibold">Write a review</h2>
              <Field label={user.role === 'student' ? 'Employer' : 'Student'}><select className={sel} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} required><option value="">Select…</option>{people.map((p) => <option key={p._id} value={p._id}>{companyOf(p)}</option>)}</select></Field>
              <Field label="Rating"><Stars size="size-6" value={f.rating} onChange={(n) => setF({ ...f, rating: n })} /></Field>
              <Field label="Comment"><textarea className={txt} rows={4} value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} required /></Field>
              <button className="btn btn-primary w-full">Post review</button>
            </form>
          ) : <div className="panel p-5 text-sm muted">Log in to write a review.</div>}
        </aside>
      </div>
    </>
  );
}
