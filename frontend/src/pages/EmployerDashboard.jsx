import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Bell,
  CalendarDays,
  MessageCircle,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const user = getStoredUser();

  const employerName =
    localStorage.getItem('employerName') ||
    user.name ||
    user.fullName ||
    'Employer';

  const companyName =
    localStorage.getItem('companyName') ||
    user.companyName ||
    'Your Company';

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/employer/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Manage Jobs & Projects',
      path: '/employer/manage-jobs',
      icon: BriefcaseBusiness,
    },
    {
      name: 'Manage Applicants',
      path: '/employer/manage-applicants',
      icon: Users,
    },
    {
      name: 'Interview Scheduling',
      path: '/employer/interviews',
      icon: CalendarDays,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
    },
    {
      name: 'Company Profile',
      path: '/employer/profile',
      icon: Building2,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const quickActions = [
    {
      title: 'Manage Jobs & Projects',
      description: 'Create, update, and manage your opportunities.',
      icon: BriefcaseBusiness,
      path: '/employer/manage-jobs',
    },
    {
      title: 'Manage Applicants',
      description: 'Review applicants and manage their applications.',
      icon: Users,
      path: '/employer/manage-applicants',
    },
    {
      title: 'Messages',
      description: 'Communicate with students and applicants.',
      icon: MessageCircle,
      path: '/messages',
    },
    {
      title: 'Interview Scheduling',
      description: 'Coordinate interviews with applicants.',
      icon: CalendarDays,
      path: '/employer/interviews',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('studentName');
    localStorage.removeItem('employerName');
    localStorage.removeItem('companyName');

    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            to="/employer/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                SkillBridge
              </p>
              <p className="text-xs text-slate-500">
                Employer Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    item.name === 'Dashboard'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>

                  {item.name === 'Dashboard' && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Employer profile and logout */}
        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {employerName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {employerName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {companyName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Employer Dashboard
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your hiring activities in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/employer/manage-jobs"
              className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 md:flex"
            >
              <Plus className="h-4 w-4" />
              Manage Opportunities
            </Link>

            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {employerName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
          {/* Welcome section */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-indigo-600">
                Employer workspace
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {employerName}!
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Find talent, manage applications, and connect with skilled
                students.
              </p>

              <p className="mt-2 text-sm font-medium text-slate-700">
                Company: {companyName}
              </p>
            </div>

            <Link
              to="/employer/manage-jobs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Manage Jobs & Projects
            </Link>
          </section>

          {/* Employer overview */}
          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Hiring Overview
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Access your main hiring tools and activities.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'Jobs & Projects',
                  description: 'Manage your opportunities',
                  icon: BriefcaseBusiness,
                  path: '/employer/manage-jobs',
                },
                {
                  title: 'Applicants',
                  description: 'Review applications',
                  icon: Users,
                  path: '/employer/manage-applicants',
                },
                {
                  title: 'Interviews',
                  description: 'Schedule interviews',
                  icon: CalendarDays,
                  path: '/employer/interviews',
                },
                {
                  title: 'Messages',
                  description: 'Connect with students',
                  icon: MessageCircle,
                  path: '/messages',
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>

                      <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                      Open section
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Quick actions */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">
                Quick Actions
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose a section to continue managing your hiring process.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="group rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                        <Icon className="h-5 w-5" />
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-600" />
                    </div>

                    <h4 className="font-semibold text-slate-800">
                      {action.title}
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Company profile card */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Building2 className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    {companyName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep your company information up to date.
                  </p>
                </div>
              </div>

              <Link
                to="/employer/profile"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Company Profile
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="pb-2 text-center text-xs text-slate-400">
            © SkillBridge · Employer Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;
