import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, TrendingUp } from 'lucide-react';
import api from '../lib/axios';

const cols = [
  { icon: GraduationCap, title: 'For students', text: 'Build a skill portfolio and resume, see roles that match your skills, track every application and understand which skills to learn next.', to: '/register/student', cta: 'Register as a student' },
  { icon: Building2, title: 'For employers', text: 'Post jobs and freelance projects with clear requirements, review applicants, schedule interviews and follow work progress in one place.', to: '/register/employer', cta: 'Register as an employer' },
  { icon: TrendingUp, title: 'Market insight', text: 'See which skills are most in demand and how your profile compares with the roles you want.', to: '/trending', cta: 'View trending skills' },
];

export default function Home() {
  const [skills, setSkills] = useState([]);
  useEffect(() => { api.get('/trending').then((r) => setSkills(r.data.slice(0, 6))).catch(() => {}); }, []);

  return (
    
    <div className="space-y-12">
      <section className="py-8 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">Learn. Create. Work.</h1>
        <p className="mt-4 max-w-xl text-base muted">SkillBridge connects students with employers through verified skills, transparent applications and real project work.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/register/student" className="btn btn-primary">Get started as a student</Link>
          <Link to="/jobs" className="btn btn-outline">Browse opportunities</Link>
          
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cols.map(({ icon: Icon, title, text, to, cta }) => (
          <div key={title} className="panel flex flex-col p-6">
            <Icon className="size-5 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">{title}</h2>
            <p className="mt-2 flex-1 text-sm muted">{text}</p>
            <Link to={to} className="mt-4 text-sm font-medium text-primary hover:underline">{cta}</Link>
          </div>
        ))}
      </section>

      {skills.length > 0 && (
        <section className="panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Skills in demand</h2>
            <Link to="/trending" className="text-sm text-primary hover:underline">See full ranking</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-md border border-base-300 px-4 py-3 text-sm">
                <span className="font-medium">{s.name}</span><span className="muted">{s.category}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
