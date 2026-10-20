import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Search, ClipboardList, CalendarClock, Layers, FileText, PenSquare, Target, TrendingUp, MessageSquare, Star, Bot, User, Settings, Briefcase, Users, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { dashPath } from '../lib/utils';

const student = [
  ['Workspace', [['Dashboard', '/student/dashboard', LayoutDashboard], ['Browse jobs', '/jobs', Search], ['Applications', '/applications', ClipboardList], ['Interviews', '/interviews', CalendarClock]]],
  ['Career tools', [['Skill portfolio', '/portfolio', Layers], ['Resumes', '/resumes', FileText], ['Resume builder', '/resume-builder', PenSquare], ['Skill gap analyser', '/skill-gap', Target], ['Trending skills', '/trending', TrendingUp]]],
  ['Community', [['Messages', '/messages', MessageSquare], ['Reviews', '/reviews', Star], ['Career assistant', '/chatbot', Bot]]],
];
const employer = [
  ['Workspace', [['Dashboard', '/employer/dashboard', LayoutDashboard], ['Manage postings', '/employer/jobs', Briefcase], ['Applicants', '/employer/applicants', Users], ['Interviews', '/interviews', CalendarClock]]],
  ['Insights', [['Browse opportunities', '/jobs', Search], ['Trending skills', '/trending', TrendingUp]]],
  ['Community', [['Messages', '/messages', MessageSquare], ['Reviews', '/reviews', Star], ['Career assistant', '/chatbot', Bot]]],
];

export default function Sidebar() {
  const { user } = useAuth();
  const { openChat } = useChat();
  const groups = user.role === 'employer' ? employer : student;
  const close = () => { const d = document.getElementById('sb-drawer'); if (d) d.checked = false; };
  const link = ([label, to, Icon]) => (
    <NavLink key={to} to={to} onClick={close} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon className="size-4" />{label}</NavLink>
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r border-base-300 bg-base-100">
      <Link to={dashPath(user)} className="flex items-center gap-2 px-5 py-5 text-lg font-semibold text-primary">
        <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-primary-content">SB</span> SkillBridge
      </Link>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map(([title, items]) => (
          <div key={title}>
            <p className="mb-1 px-3 text-xs muted">{title}</p>
            <div className="space-y-0.5">{items.map(link)}</div>
          </div>
        ))}
      </nav>
      <div className="space-y-0.5 border-t border-base-300 p-3">
        {link([user.role === 'employer' ? 'Company profile' : 'My profile', '/profile', User])}
        {link(['Notifications', '/notifications', Bell])}
        {link(['Settings', '/settings', Settings])}
        <button onClick={() => { close(); openChat('assistant'); }} className="nav-link w-full"><Bot className="size-4" />Quick assistant</button>
      </div>
    </aside>
  );
}
