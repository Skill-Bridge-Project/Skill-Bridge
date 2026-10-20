import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Building2,
  User,
  Mail,
  Phone,
  LockKeyhole,
  Globe,
  MapPin,
  Eye,
  EyeOff,
  BriefcaseBusiness,
  ArrowLeft,
} from 'lucide-react';

const EmployerRegistration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    location: '',
    recruiterName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          role: 'employer',
          name: form.recruiterName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          companyName: form.companyName.trim(),
          industry: form.industry,
          companySize: form.companySize,
          website: form.website.trim(),
          phone: form.phone.trim(),
          location: form.location.trim(),
        }
      );

      toast.success('Employer account created successfully!');

      navigate('/login', {
        state: {
          email: response.data.user?.email || form.email.trim(),
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Registration failed. Please check your server connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

  const labelClass =
    'mb-1.5 block text-sm font-medium text-slate-700';

  const iconClass =
    'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400';

  const renderInput = ({
    label,
    name,
    placeholder,
    icon: Icon,
    type = 'text',
    required = false,
    rightElement = null,
    autoComplete,
  }) => (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <Icon className={iconClass} />

        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`${inputClass} ${rightElement ? 'pr-11' : ''}`}
        />

        {rightElement && (
          <button
            type="button"
            onClick={rightElement.onClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={rightElement.label}
          >
            <rightElement.icon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  const renderSelect = ({
    label,
    name,
    placeholder,
    options,
    required = false,
  }) => (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Create Employer Account
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Join SkillBridge to discover and connect with talent.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            {/* Company Information */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">
                  Company Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderInput({
                  label: 'Company Name',
                  name: 'companyName',
                  placeholder: 'Enter company name',
                  icon: Building2,
                  required: true,
                })}

                {renderSelect({
                  label: 'Industry',
                  name: 'industry',
                  placeholder: 'Select industry',
                  required: true,
                  options: [
                    { value: 'Information Technology', label: 'Information Technology' },
                    { value: 'Education', label: 'Education' },
                    { value: 'Healthcare', label: 'Healthcare' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Manufacturing', label: 'Manufacturing' },
                    { value: 'Retail', label: 'Retail' },
                    { value: 'Other', label: 'Other' },
                  ],
                })}

                {renderSelect({
                  label: 'Company Size',
                  name: 'companySize',
                  placeholder: 'Select company size',
                  required: true,
                  options: [
                    { value: '1-10', label: '1–10 employees' },
                    { value: '11-50', label: '11–50 employees' },
                    { value: '51-200', label: '51–200 employees' },
                    { value: '201-500', label: '201–500 employees' },
                    { value: '501-1000', label: '501–1,000 employees' },
                    { value: '1000+', label: '1,000+ employees' },
                  ],
                })}

                {renderInput({
                  label: 'Company Website',
                  name: 'website',
                  placeholder: 'https://example.com',
                  icon: Globe,
                  type: 'url',
                })}

                {renderInput({
                  label: 'Company Location',
                  name: 'location',
                  placeholder: 'City, State',
                  icon: MapPin,
                  required: true,
                })}
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Recruiter Information */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">
                  Recruiter Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderInput({
                  label: 'Recruiter Name',
                  name: 'recruiterName',
                  placeholder: 'Enter your full name',
                  icon: User,
                  required: true,
                  autoComplete: 'name',
                })}

                {renderInput({
                  label: 'Work Email',
                  name: 'email',
                  placeholder: 'you@company.com',
                  icon: Mail,
                  type: 'email',
                  required: true,
                  autoComplete: 'email',
                })}

                {renderInput({
                  label: 'Phone Number',
                  name: 'phone',
                  placeholder: 'Enter phone number',
                  icon: Phone,
                  type: 'tel',
                  autoComplete: 'tel',
                })}
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Account Security */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">
                  Account Security
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {renderInput({
                  label: 'Password',
                  name: 'password',
                  placeholder: 'Minimum 8 characters',
                  icon: LockKeyhole,
                  type: showPassword ? 'text' : 'password',
                  required: true,
                  autoComplete: 'new-password',
                  rightElement: {
                    icon: showPassword ? EyeOff : Eye,
                    label: showPassword ? 'Hide password' : 'Show password',
                    onClick: () => setShowPassword((previous) => !previous),
                  },
                })}

                {renderInput({
                  label: 'Confirm Password',
                  name: 'confirmPassword',
                  placeholder: 'Re-enter your password',
                  icon: LockKeyhole,
                  type: showConfirmPassword ? 'text' : 'password',
                  required: true,
                  autoComplete: 'new-password',
                  rightElement: {
                    icon: showConfirmPassword ? EyeOff : Eye,
                    label: showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password',
                    onClick: () =>
                      setShowConfirmPassword((previous) => !previous),
                  },
                })}
              </div>
            </section>

            {/* Terms and Conditions */}
            <div className="rounded-lg bg-slate-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600"
                />

                <span className="text-sm leading-6 text-slate-600">
                  I agree to the SkillBridge terms and conditions and confirm
                  that the information provided is accurate.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Employer Account'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          SkillBridge · Connecting talent with opportunity
        </p>
      </div>
    </div>
  );
};

export default EmployerRegistration;

