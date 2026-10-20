import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

import {
  BriefcaseBusiness,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

async function handleSubmit(event) {
  event.preventDefault();
  setBusy(true);

  try {
    const user = await login(email, password);

    toast.success('Login successful!');

    navigate(
      user.role === 'employer'
        ? '/employer/dashboard'
        : '/student/dashboard'
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      error.message ||
      'Login failed!'
    );
  } finally {
    setBusy(false);
  }
}

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-slate-50 px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 md:grid-cols-2">

        {/* Left panel */}
        <div className="hidden flex-col justify-between bg-blue-600 p-10 text-white md:flex lg:p-12">
          <Link to="/" className="flex w-fit items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <BriefcaseBusiness size={22} />
            </div>
            <span className="text-xl font-extrabold">SkillBridge</span>
          </Link>

          <div className="py-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <BriefcaseBusiness size={28} />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Your next opportunity starts here.
            </h1>

            <p className="mt-5 leading-7 text-blue-100">
              Sign in to explore opportunities, showcase your skills, and take
              the next step in your career.
            </p>
          </div>

          <p className="text-sm text-blue-100">
            Connecting skills with opportunities.
          </p>
        </div>

        {/* Login form */}
        <div className="p-7 sm:p-10 lg:p-12">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-lg font-extrabold text-slate-900 md:hidden"
          >
            <BriefcaseBusiness className="text-blue-600" size={24} />
            Skill<span className="-ml-2 text-blue-600">Bridge</span>
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
              Welcome back
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your details to continue to SkillBridge.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                <Mail size={19} className="shrink-0 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full border-0 bg-transparent py-3.5 text-sm text-slate-800 outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast('Password reset is not available yet.')
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                <LockKeyhole
                  size={19}
                  className="shrink-0 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full border-0 bg-transparent py-3.5 text-sm text-slate-800 outline-none focus:ring-0"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Signing in...' : 'Sign In'}
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">
              NEW TO SKILLBRIDGE?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            By continuing, you agree to SkillBridge&apos;s terms and privacy
            policy.
          </p>
        </div>
      </div>
    </main>
  );
}
