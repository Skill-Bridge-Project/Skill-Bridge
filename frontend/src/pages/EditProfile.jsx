import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { inp, sel, txt } from '../lib/utils';
import PageHeader from '../components/PageHeader';
import Field from '../components/Field';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const isStudent = user.role === 'student';
  const [f, setF] = useState({ ...user, links: { github: '', linkedin: '', website: '', ...(user.links || {}) } });
  const [skills, setSkills] = useState(user.skills || []);
  const [ns, setNs] = useState({ name: '', level: 'Beginner' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setLink = (k) => (e) => setF({ ...f, links: { ...f.links, [k]: e.target.value } });

  const addSkill = () => {
    if (!ns.name.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === ns.name.trim().toLowerCase())) return toast.error('This skill is already listed');
    setSkills([...skills, { name: ns.name.trim(), level: ns.level }]); setNs({ name: '', level: 'Beginner' });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      let { data } = await api.put('/profile', f);
      if (isStudent) { const r = await api.put('/skills', { skills }); data = { ...data, skills: r.data }; }
      setUser(data); toast.success('Profile updated'); nav('/profile');
    } catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <>
      <PageHeader title="Edit profile" />
      <form onSubmit={save} className="space-y-5">
        <div className="panel grid gap-3 p-6 md:grid-cols-2">
          <Field label={isStudent ? 'Full name' : 'Contact person'}><input className={inp} value={f.name || ''} onChange={set('name')} required /></Field>
          <Field label="Phone"><input className={inp} value={f.phone || ''} onChange={set('phone')} /></Field>
          <Field label="Location"><input className={inp} value={f.location || ''} onChange={set('location')} /></Field>
          {isStudent ? (<>
            <Field label="Headline"><input className={inp} value={f.headline || ''} onChange={set('headline')} placeholder="e.g. Final-year CS student interested in web development" /></Field>
            <Field label="College / University"><input className={inp} value={f.college || ''} onChange={set('college')} /></Field>
            <Field label="Degree"><input className={inp} value={f.degree || ''} onChange={set('degree')} /></Field>
            <Field label="Graduation year"><input type="number" className={inp} value={f.graduationYear || ''} onChange={set('graduationYear')} /></Field>
            <Field label="Bio" className="md:col-span-2"><textarea className={txt} rows={4} value={f.bio || ''} onChange={set('bio')} /></Field>
            <Field label="GitHub"><input className={inp} value={f.links.github} onChange={setLink('github')} /></Field>
            <Field label="LinkedIn"><input className={inp} value={f.links.linkedin} onChange={setLink('linkedin')} /></Field>
          </>) : (<>
            <Field label="Company name"><input className={inp} value={f.companyName || ''} onChange={set('companyName')} required /></Field>
            <Field label="Industry"><input className={inp} value={f.industry || ''} onChange={set('industry')} /></Field>
            <Field label="Company size"><select className={sel} value={f.companySize || '1-10'} onChange={set('companySize')}>{['1-10', '11-50', '51-200', '201-1000', '1000+'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Website"><input className={inp} value={f.website || ''} onChange={set('website')} /></Field>
            <Field label="About the company" className="md:col-span-2"><textarea className={txt} rows={5} value={f.about || ''} onChange={set('about')} /></Field>
          </>)}
        </div>

        {isStudent && (
          <div className="panel p-6">
            <h2 className="font-semibold">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.name} className="badge badge-outline gap-1.5 py-3">{s.name} · {s.level}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x.name !== s.name))} aria-label={`Remove ${s.name}`}><X className="size-3" /></button></span>
              ))}
              {!skills.length && <span className="text-sm muted">No skills added yet.</span>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <input className={`${inp} max-w-xs`} placeholder="Skill name" value={ns.name} onChange={(e) => setNs({ ...ns, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <select className={`${sel} max-w-40`} value={ns.level} onChange={(e) => setNs({ ...ns, level: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
              <button type="button" className="btn btn-outline btn-sm h-10 gap-1" onClick={addSkill}><Plus className="size-4" />Add skill</button>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2"><button type="button" className="btn btn-ghost" onClick={() => nav('/profile')}>Cancel</button><button className="btn btn-primary">Save changes</button></div>
      </form>
    </>
  );
}
