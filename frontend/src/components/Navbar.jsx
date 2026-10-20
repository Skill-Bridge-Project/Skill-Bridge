import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Bot, LogOut, Menu, MessageSquare, Search, Settings, User } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { companyOf } from '../lib/utils';
import NotificationPanel from './NotificationPanel';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { openChat } = useChat();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);

  const load = useCallback(() => { if (user) api.get('/notifications').then((r) => setItems(r.data)).catch(() => {}); }, [user]);
  useEffect(() => { load(); if (!user) return; const t = setInterval(load, 30000); return () => clearInterval(t); }, [load, user]);

  const unread = items.filter((n) => !n.read).length;
  const read = (id) => api.put(`/notifications/${id}/read`).then(load);
  const readAll = () => api.put('/notifications/read-all').then(load);
  const search = (e) => { e.preventDefault(); nav(`/jobs?q=${encodeURIComponent(q)}`); };

  if (!user) {
    return (
      <header className="border-b border-base-300 bg-base-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-primary-content">SB</span> SkillBridge
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/jobs" className="btn btn-ghost btn-sm hidden sm:inline-flex">Browse jobs</Link>
            <Link to="/trending" className="btn btn-ghost btn-sm hidden sm:inline-flex">Trending skills</Link>
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-primary btn-sm">Register</div>
              <ul tabIndex={0} className="menu dropdown-content z-30 mt-2 w-52 rounded-lg border border-base-300 bg-base-100 p-2 shadow-lg">
                <li><Link to="/register/student">As a student</Link></li>
                <li><Link to="/register/employer">As an employer</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="no-print sticky top-0 z-20 border-b border-base-300 bg-base-100">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
        <label htmlFor="sb-drawer" className="btn btn-ghost btn-sm btn-square lg:hidden" aria-label="Open menu"><Menu className="size-5" /></label>
        <form onSubmit={search} className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input className="input input-bordered input-sm h-10 w-full bg-base-200 pl-9" placeholder="Search jobs, projects and skills" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="btn btn-outline btn-sm hidden gap-2 sm:inline-flex" onClick={() => openChat('assistant')}><Bot className="size-4" />Assistant</button>
          <button className="btn btn-ghost btn-sm btn-square" onClick={() => openChat('messages')} aria-label="Messages"><MessageSquare className="size-5" /></button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square relative" aria-label="Notifications">
              <Bell className="size-5" />
              {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-content">{unread > 9 ? '9+' : unread}</span>}
            </div>
            <NotificationPanel items={items} onRead={read} onReadAll={readAll} />
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 px-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-xs text-primary-content">{companyOf(user).slice(0, 1).toUpperCase()}</span>
              <span className="hidden max-w-28 truncate text-sm md:inline">{user.name}</span>
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-30 mt-2 w-52 rounded-lg border border-base-300 bg-base-100 p-2 shadow-lg">
              <li><Link to="/profile"><User className="size-4" />Profile</Link></li>
              <li><Link to="/settings"><Settings className="size-4" />Settings</Link></li>
              <li><button onClick={() => { logout(); nav('/'); }}><LogOut className="size-4" />Log out</button></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
