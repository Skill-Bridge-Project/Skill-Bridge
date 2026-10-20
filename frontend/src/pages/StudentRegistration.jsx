
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  UserRound,
  Mail,
  LockKeyhole,
  GraduationCap,
  CalendarDays,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentRegistration() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    degree: '',
    graduationYear: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setF((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await register({ ...f, role: 'student' });
      toast.success('Account created. Welcome to SkillBridge.');
      nav('/student/dashboard');
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

  const iconClass =
    'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400';

  const fields = [
    { key: 'name', label: 'Full name', placeholder: 'Enter your full name', icon: UserRound, required: true },
    { key: 'email', label: 'Email address', placeholder: 'you@example.com', icon: Mail, type: 'email', required: true },
    { key: 'college', label: 'College / University', placeholder: 'Enter your college name', icon: GraduationCap },
    { key: 'degree', label: 'Degree / Course', placeholder: 'e.g. B.Sc. Computer Science', icon: BriefcaseBusiness },
    { key: 'graduationYear', label: 'Graduation year', placeholder: 'e.g. 2027', icon: CalendarDays, type: 'number' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-blue-600">Bridge</span>
            </span>
          </Link>

          <p className="text-sm text-slate-600">
            Already a member?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </header>

      {/* Registration */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">

          {/* Left panel */}
          <section className="hidden flex-col justify-between bg-blue-600 p-10 text-white md:flex lg:p-12">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <BriefcaseBusiness size={26} />
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
                Your journey starts here
              </p>

              <h1 className="text-4xl font-bold leading-tight">
                Turn your skills into opportunities.
              </h1>

              <p className="mt-5 leading-7 text-blue-100">
                Create your student profile, discover opportunities, and
                take the next step in your career with SkillBridge.
              </p>
            </div>

            <div className="mt-12 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="font-semibold">Learn. Connect. Grow.</p>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Your skills have potential. Find opportunities to put them
                into practice.
              </p>
            </div>
          </section>

          {/* Form panel */}
          <section className="p-6 sm:p-9 lg:p-10">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 md:hidden">
                <GraduationCap size={25} />
              </div>

              <p className="text-sm font-semibold tracking-wide text-blue-600">
                STUDENT REGISTRATION
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in your details to get started with SkillBridge.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {fields.map(({ key, label, placeholder, icon: Icon, type = 'text', required = false }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                  </label>

                  <div className="relative">
                    <Icon size={18} className={iconClass} />
                    <input
                      id={key}
                      name={key}
                      type={type}
                      value={f[key]}
                      onChange={set(key)}
                      placeholder={placeholder}
                      required={required}
                      min={type === 'number' ? 2020 : undefined}
                      max={type === 'number' ? 2100 : undefined}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              ))}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <LockKeyhole size={18} className={iconClass} />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={f.password}
                    onChange={set('password')}
                    placeholder="Create a password"
                    minLength={6}
                    required
                    autoComplete="new-password"
                    className={`${inputClass} pl-11 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 6 characters.
                </p>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? 'Creating account...' : 'Create account'}
                {!busy && <ArrowRight size={18} />}
              </button>

              <p className="pt-3 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Log in
                </Link>
              </p>

              <p className="text-center text-xs text-slate-400">
                Registering as an employer?{' '}
                <Link
                  to="/register/employer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create an employer account
                </Link>
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}