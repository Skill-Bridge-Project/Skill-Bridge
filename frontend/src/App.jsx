
import { Toaster } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from './lib/axios';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import BrowseJobs from './pages/BrowseJobs.jsx';
import StudentRegistration from './pages/StudentRegistration.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import EmployerRegistration from './pages/EmployerRegistration.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import JobDetails from './pages/JobDetails.jsx';
import MyProfile from './pages/MyProfile.jsx';
import ManageJobs from './pages/ManageJobs.jsx';
import ManageApplicants from './pages/ManageApplicants.jsx';
import Applications from './pages/Applications.jsx';
import InterviewScheduling from './pages/InterviewScheduling.jsx';
import PublicEmployerProfile from './pages/PublicEmployerProfile.jsx';
import Notifications from './pages/Notifications.jsx';
import ResumeManagement from './pages/ResumeManagement.jsx';
import ResumeBuilder from'./pages/ResumeBuilder.jsx';
import ViewPortfolio from './pages/ViewPortfolio.jsx';
import EditPortfolio from './pages/EditPortfolio.jsx';
import Settings from './pages/Settings.jsx';
import TrendingSkills from './pages/TrendingSkills.jsx';
import Messages from './pages/Messages';
import CareerChatbot from './pages/CareerChatbot.jsx';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Palette,
  Megaphone,
  BarChart3,
  Search,
  MapPin,
  Clock3,
  Bookmark,
  Sparkles,
  Users,
  GraduationCap,
  Menu,
  X,
  Bell
} from 'lucide-react';
const categories = [
  {
    title: 'Development',
    count: '120+ opportunities',
    icon: Code2,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Design & Creative',
    count: '85+ opportunities',
    icon: Palette,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Marketing',
    count: '64+ opportunities',
    icon: Megaphone,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Data & Analytics',
    count: '92+ opportunities',
    icon: BarChart3,
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const jobs = [
  {
    id: 1,
    company: 'NexaTech',
    initials: 'N',
    companyColor: 'bg-blue-600',
    role: 'Frontend Developer',
    location: 'Mumbai, India',
    type: 'Full-time',
    salary: '₹6–10 LPA',
    tags: ['React', 'JavaScript', 'CSS'],
    posted: '2 days ago',
  },
  {
    id: 2,
    company: 'Pixel Studio',
    initials: 'P',
    companyColor: 'bg-purple-600',
    role: 'UI/UX Designer',
    location: 'Remote',
    type: 'Remote',
    salary: '₹5–8 LPA',
    tags: ['Figma', 'UI Design', 'Prototyping'],
    posted: '1 day ago',
  },
  {
    id: 3,
    company: 'DataNest',
    initials: 'D',
    companyColor: 'bg-emerald-600',
    role: 'Junior Data Analyst',
    location: 'Pune, India',
    type: 'Full-time',
    salary: '₹4–7 LPA',
    tags: ['SQL', 'Python', 'Excel'],
    posted: '3 days ago',
  },
];


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const { token, user } = useAuth();
  const location = useLocation();

  const isLoggedIn = Boolean(token || user);

  const dashboardPath =
    user?.role === 'employer'
      ? '/employer/dashboard'
      : '/student/dashboard';

  useEffect(() => {
    if (!token || !user) {
      setUnreadCount(0);
      setHasNewNotifications(false);
      return undefined;
    }

    let cancelled = false;
    let previousUnread = null;
    let checking = false;

    const checkNotifications = async () => {
      if (checking || cancelled) return;
      checking = true;

      try {
        const response = await api.get('/notifications');

        if (cancelled) return;

        const data = response.data;
        const notifications = Array.isArray(data)
          ? data
          : Array.isArray(data?.notifications)
            ? data.notifications
            : [];

        const unread = notifications.filter(
          (notification) => !notification.read
        ).length;

        setUnreadCount(unread);

        if (previousUnread !== null && unread > previousUnread) {
          setHasNewNotifications(true);

          toast('You have new notifications. Check them now!', {
            icon: '🔔',
            id: 'new-notification-prompt',
            duration: 5000,
          });
        }

        if (unread === 0) {
          setHasNewNotifications(false);
        }

        previousUnread = unread;
      } catch (error) {
        console.error(
          'Notification check failed:',
          error.response?.data?.message || error.message
        );
      } finally {
        checking = false;
      }
    };

    checkNotifications();

    const interval = setInterval(checkNotifications, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, user?._id, user?.id, location.pathname]);

  const openNotifications = () => {
    setMenuOpen(false);
    setHasNewNotifications(false);
  };

  const notificationBell = (
    <Link
      to="/notifications"
      onClick={openNotifications}
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : 'Notifications'
      }
      title={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : 'Notifications'
      }
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
        unreadCount > 0
          ? 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Bell
        size={21}
        className={
          hasNewNotifications
            ? 'animate-[wiggle_0.7s_ease-in-out_infinite]'
            : ''
        }
      />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-blue-600 px-1 text-[9px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 lg:px-8">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BriefcaseBusiness size={22} />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Skill<span className="text-blue-600">Bridge</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Find Jobs
          </Link>

          <a
            href="/#categories"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Explore Skills
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {notificationBell}

              <Link
                to={dashboardPath}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && notificationBell}

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-1 border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <Link
            onClick={() => setMenuOpen(false)}
            to="/"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>

          <Link
            onClick={() => setMenuOpen(false)}
            to="/jobs"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Find Jobs
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/login"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Log in
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/register"
                className="block rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              onClick={() => setMenuOpen(false)}
              to={dashboardPath}
              className="block rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());

    navigate(`/jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 sm:flex-row"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="shrink-0 text-blue-600" size={21} />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Job title, skill or company"
          aria-label="Job title, skill or company"
          className="w-full border-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
        />
      </div>

      <div className="hidden w-px bg-slate-200 sm:block" />

      <div className="flex flex-1 items-center gap-3 px-3">
        <MapPin className="shrink-0 text-blue-600" size={21} />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City or remote"
          aria-label="City or remote"
          className="w-full border-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Search Jobs <ArrowRight size={18} />
      </button>
    </form>
  );
}

function CategoryCard({ category }) {
  const Icon = category.icon;

  return (
    <Link
      to={`/jobs?category=${encodeURIComponent(category.title)}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
    >
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}>
        <Icon size={23} />
      </div>

      <h3 className="mb-2 font-bold text-slate-900 group-hover:text-blue-600">
        {category.title}
      </h3>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{category.count}</p>
        <ArrowUpRight size={17} className="text-slate-400 transition group-hover:text-blue-600" />
      </div>
    </Link>
  );
}

function JobCard({ job }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white ${job.companyColor}`}>
            {job.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{job.company}</p>
            <p className="mt-1 text-xs text-slate-500">{job.posted}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSaved(!saved)}
          aria-label={saved ? 'Remove saved job' : 'Save job'}
          className={`rounded-lg border p-2 transition ${
            saved
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className="mb-3 mt-5 text-lg font-bold text-slate-900">{job.role}</h3>

      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 size={14} /> {job.type}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span key={tag} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-sm font-bold text-slate-900">{job.salary}</p>
      <Link
        to="/jobs"
        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View details <ArrowRight size={16} />
      </Link>
      </div>
    </article>
  );
}

function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles size={16} />
              Your skills. Your next opportunity.
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build your future with the right{' '}
              <span className="text-blue-600">opportunity.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover opportunities that match your skills, connect with
              employers, and take the next step in your career.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Explore Jobs <ArrowRight size={19} />
              </Link>
              <Link to="/login"                 
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
>
  Login
</Link>
              <Link
                to="/register"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                Create an Account
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </span>
                Student-friendly opportunities
              </span>
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </span>
                Career growth
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-blue-100/70 sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Your career dashboard</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">Find your next step</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <GraduationCap size={24} />
                </div>
              </div>

              <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">Profile strength</span>
                  <span className="text-sm font-bold text-blue-600">80%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-4/5 rounded-full bg-blue-600" />
                </div>
                <p className="mt-3 text-xs text-slate-500">Keep building your skills and experience.</p>
              </div>

              <div className="mb-4 flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Code2 size={23} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Frontend Developer</p>
                  <p className="mt-1 text-xs text-slate-500">React · JavaScript · Remote</p>
                </div>
                <ArrowUpRight className="text-slate-400" size={20} />
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users size={23} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Grow your network</p>
                  <p className="mt-1 text-xs text-slate-500">Connect with new opportunities</p>
                </div>
                <ArrowUpRight className="text-slate-400" size={20} />
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                <Sparkles className="shrink-0 text-blue-600" size={20} />
                <p className="text-sm leading-6 text-blue-900">
                  Your next opportunity starts with the skills you already have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <SearchBar />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="mr-1 text-slate-500">Popular skills:</span>
            
            {['React', 'Python', 'UI/UX', 'Java', 'Data Analysis'].map((skill) => (
              <Link
                key={skill}
                to={`/jobs?keyword=${encodeURIComponent(skill)}`}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
              Explore by interest
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Find your field
            </h2>
            <p className="mt-3 max-w-xl text-slate-500">
              Explore roles across different industries and find where your skills fit.
            </p>
          </div>
          <Link to="/jobs" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
            All categories <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </section>

      <section id="jobs" className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
                Opportunities for you
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Featured jobs
              </h2>
              <p className="mt-3 text-slate-500">
                A few roles to help you get started.
              </p>
            </div>
            <Link to="/jobs" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
              Browse all jobs <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
            >
              View all opportunities <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 -left-10 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Sparkles size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to take the next step?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
              Create your profile, showcase your skills, and start exploring opportunities with SkillBridge.
            </p>
            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Join SkillBridge <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SimplePage({ title, description }) {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <BriefcaseBusiness size={27} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
        <p className="mt-3 leading-6 text-slate-500">{description}</p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Home <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}

function JobsPage() {
  const params = new URLSearchParams(window.location.search);
  const keyword = (params.get('keyword') || '').toLowerCase();
  const location = (params.get('location') || '').toLowerCase();
  const category = params.get('category') || '';

  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword =
      !keyword ||
      `${job.role} ${job.company} ${job.tags.join(' ')}`.toLowerCase().includes(keyword);

    const matchesLocation =
      !location || job.location.toLowerCase().includes(location);

    const matchesCategory =
      !category ||
      (category === 'Development' && job.role.toLowerCase().includes('developer')) ||
      (category === 'Design & Creative' && job.role.toLowerCase().includes('designer')) ||
      (category === 'Data & Analytics' && job.role.toLowerCase().includes('analyst')) ||
      (category === 'Marketing' && job.tags.some((tag) => tag.toLowerCase().includes('marketing')));

    return matchesKeyword && matchesLocation && matchesCategory;
  });

  return (
    <main className="min-h-[65vh] bg-slate-50 px-5 py-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Explore opportunities</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Find your next job</h1>
        <p className="mt-3 text-slate-500">
          Browse sample opportunities that match your interests.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:col-span-2">
              <h2 className="text-lg font-bold text-slate-900">No matching sample jobs found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Try another keyword or location. These listings are currently sample data.
              </p>
              <Link to="/jobs" className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-700">
                View all sample jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function JobDetailsPage() {
  const id = Number(window.location.pathname.split('/').pop());
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <SimplePage
        title="Job not found"
        description="This sample job does not exist. Browse the available listings instead."
      />
    );
  }

  return (
    <main className="min-h-[65vh] bg-slate-50 px-5 py-14">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white ${job.companyColor}`}>
            {job.initials}
          </div>
          <div>
            <p className="font-semibold text-slate-700">{job.company}</p>
            <p className="mt-1 text-sm text-slate-500">{job.location}</p>
          </div>
        </div>

        <h1 className="mt-7 text-3xl font-extrabold text-slate-900">{job.role}</h1>
        <p className="mt-3 text-lg font-bold text-blue-600">{job.salary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-5">
          <h2 className="font-bold text-slate-900">About this opportunity</h2>
          <p className="mt-2 leading-7 text-slate-600">
            This is a sample listing for the SkillBridge project. The full job description and application process can be connected to your backend later.
          </p>
        </div>

        <Link to="/jobs" className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">
          <ArrowRight className="rotate-180" size={17} /> Back to jobs
        </Link>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <BriefcaseBusiness size={19} />
          </div>
          <span className="font-extrabold text-slate-900">
            Skill<span className="text-blue-600">Bridge</span>
          </span>
        </Link>

        <p className="text-sm text-slate-500">
          Connecting skills with opportunities.
        </p>

        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} SkillBridge
        </p>
      </div>
    </footer>
  );
}

  
export default function App() {
  const { token, user } = useAuth();
  const previousConversations = useRef(null);

  useEffect(() => {
    previousConversations.current = null;

    if (!token || !user) return undefined;

    let cancelled = false;
    let checking = false;

    const checkMessages = async () => {
      if (checking || cancelled) return;

      checking = true;

      try {
        const response = await api.get('/messages');

        if (cancelled) return;

        const conversations = Array.isArray(response.data)
          ? response.data
          : [];

        const current = new Map();

        conversations.forEach((conversation) => {
          const person = conversation.user;
          const id = person?._id || person?.id;

          if (!id) return;

          current.set(String(id), {
            name:
              person.name ||
              person.companyName ||
              person.company?.name ||
              'New message',
            unread: Number(conversation.unread) || 0,
            last:
              typeof conversation.last === 'string'
                ? conversation.last
                : conversation.last?.text || '',
          });
        });

        // Save the initial state without showing old-message popups.
        if (previousConversations.current === null) {
          previousConversations.current = current;
          return;
        }

        const previous = previousConversations.current;

        current.forEach((conversation, id) => {
          const old = previous.get(id);

          if (old && conversation.unread > old.unread) {
            const preview = conversation.last.trim();
            const message =
              preview.length > 80
                ? `${preview.slice(0, 80)}…`
                : preview;

            toast(
              `${conversation.name}: ${message || 'Sent you a message'}`,
              {
                icon: '💬',
                id: `new-message-${id}`,
                duration: 5000,
              }
            );
          }
        });

        previousConversations.current = current;
      } catch (error) {
        console.error(
          'Message check failed:',
          error.response?.data?.message || error.message
        );
      } finally {
        checking = false;
      }
    };

    checkMessages();

    const interval = setInterval(checkMessages, 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, user?._id, user?.id]);

  return (

    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<StudentRegistration />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<MyProfile />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/register/employer" element={<EmployerRegistration />} />
        <Route path="/employer/manage-jobs" element={<ManageJobs />} />
        <Route path="/employer/manage-applicants" element={<ManageApplicants />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/student/applications" element={<Applications />} />
        <Route path="/employer/interviews" element={<InterviewScheduling />} />
        <Route path="/employer/profile" element={<PublicEmployerProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/student/resumes" element={<ResumeManagement />} />
        <Route path="/student/resume-builder" element={<ResumeBuilder />} />
        <Route path="/student/portfolio" element={<ViewPortfolio />} />
        <Route path="/student/portfolio/edit" element={<EditPortfolio />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/student/trending-skills" element={<TrendingSkills />}/>
        <Route path="/messages" element={<Messages />} />
        <Route path="/student/career-chatbot" element={<CareerChatbot />} />
        <Route
          path="*"
          element={
            <SimplePage
              title="Page not found"
              description="The page you're looking for doesn't exist."
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}