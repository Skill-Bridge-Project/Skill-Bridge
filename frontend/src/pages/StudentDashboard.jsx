import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BriefcaseBusiness,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  FileText,
  FolderOpen,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  GraduationCap,
  Bookmark,
} from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentName =
    localStorage.getItem('studentName') ||
    (() => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.name || user.fullName || 'Student';
      } catch {
        return 'Student';
      }
    })();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/student/dashboard',
      active: true,
    },
    {
      label: 'Find Jobs',
      icon: BriefcaseBusiness,
      path: '/jobs',
    },
    {
      label: 'My Applications',
      icon: FileText,
      path: '/student/applications',
    },
    {
      label: 'Resume Management',
      icon: FolderOpen,
      path: '/student/resumes',
    },
    {
      label: 'My Profile',
      icon: UserRound,
      path: '/student/profile',
    },
    {
      label: 'Career Assistant',
      icon: Bot,
      path: '/student/career-chatbot',
    },
    {
      label: 'Trending Skills',
      icon: GraduationCap,
      path: '/student/trending-skills',
    },
    {
      label: 'Notifications',
      icon: Bell,
      path: '/notifications',
      
    },
    
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/mine');
        const data = response.data;

        setApplications(
          Array.isArray(data)
            ? data
            : data?.applications || data?.data || []
        );
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('studentName');
    localStorage.removeItem('employerName');
    localStorage.removeItem('companyName');

    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getJobTitle = (application) =>
    application?.job?.title ||
    application?.jobId?.title ||
    application?.title ||
    'Job Application';

  const totalApplications = applications.length;

  const pendingApplications = applications.filter((application) => {
    const status = String(application?.status || '').toLowerCase();
    return ['pending', 'applied', 'submitted', 'under review'].includes(status);
  }).length;

  const acceptedApplications = applications.filter((application) => {
    const status = String(application?.status || '').toLowerCase();
    return ['accepted', 'approved', 'shortlisted'].includes(status);
  }).length;

  const recentApplications = applications.slice(0, 4);

  const quickActions = [
    {
      title: 'Find Jobs',
      description: 'Explore opportunities that match your skills.',
      icon: BriefcaseBusiness,
      path: '/jobs',
    },
    {
      title: 'Manage Resume',
      description: 'View and update your resume.',
      icon: FileText,
      path: '/student/resumes',
    },
    {
      title: 'Career Assistant',
      description: 'Get help with career-related questions.',
      icon: Bot,
      path: '/student/career-chatbot',
    },
    {
      title: 'Trending Skills',
      description: 'Explore skills that employers are looking for.',
      icon: TrendingUp,
      path: '/student/trending-skills',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile overlay */}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                SkillBridge
              </p>
              <p className="text-xs text-slate-500">
                Student Portal
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

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    item.active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>

                  {item.active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Student profile and logout at the bottom */}
        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {studentName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {studentName}
              </p>
              <p className="truncate text-xs text-slate-500">
                Student Account
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
                Dashboard
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your career journey in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 md:flex"
            >
              <Search className="h-4 w-4" />
              Find opportunities
            </Link>


            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {studentName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
          {/* Welcome section */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-indigo-600">
                Student workspace
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {studentName}!
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Discover opportunities, build your skills, and track your
                applications.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Search className="h-4 w-4" />
              Explore Jobs
            </button>
          </section>

          {/* Statistics */}
          <section>
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Application Overview
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Your job application activity at a glance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'Total Applications',
                  value: loading ? '—' : totalApplications,
                  description: 'Applications submitted',
                  icon: FileText,
                },
                {
                  title: 'Pending Reviews',
                  value: loading ? '—' : pendingApplications,
                  description: 'Awaiting a response',
                  icon: Clock,
                },
                {
                  title: 'Shortlisted',
                  value: loading ? '—' : acceptedApplications,
                  description: 'Positive application updates',
                  icon: CheckCircle2,
                },
                {
                  title: 'Career Tools',
                  value: '3+',
                  description: 'Tools to support your growth',
                  icon: GraduationCap,
                },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick actions and profile */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
              <div className="mb-5">
                <h3 className="font-semibold text-slate-900">
                  Quick Actions
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Continue building your career.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.title}
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
            </div>

            {/* Student profile card */}
            <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserRound className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {studentName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Student account
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-slate-100" />

              <p className="text-sm leading-6 text-slate-500">
                Keep your profile, portfolio, and resume up to date so
                employers can learn more about your skills.
              </p>

              <div className="my-5 rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-800">
                  Career profile
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review your profile and showcase your work.
                </p>
              </div>

              <Link
                to="/student/profile"
                className="mt-auto flex items-center justify-between pt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View my profile
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Recent applications */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Recent Applications
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Check the latest status of your applications.
                </p>
              </div>

              <Link
                to="/student/applications"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all applications
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                Loading applications...
              </div>
            ) : recentApplications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentApplications.map((application, index) => (
                  <div
                    key={application._id || application.id || index}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <BriefcaseBusiness className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">
                          {getJobTitle(application)}
                        </p>
                        <p className="mt-1 text-xs capitalize text-slate-500">
                          Status: {application.status || 'Submitted'}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                      {application.status || 'Submitted'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center px-5 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Bookmark className="h-6 w-6" />
                </div>

                <h4 className="font-semibold text-slate-800">
                  No applications yet
                </h4>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Browse available opportunities and apply for jobs that
                  match your interests and skills.
                </p>

                <Link
                  to="/jobs"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Explore jobs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400">
            © SkillBridge · Student Dashboard
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;