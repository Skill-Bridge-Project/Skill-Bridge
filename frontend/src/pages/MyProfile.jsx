import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  Pencil,
  ArrowLeft,
  Globe,
  Save,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyProfile() {
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    education: user?.education || '',
    course: user?.course || '',
    bio: user?.bio || '',
    skills: Array.isArray(user?.skills)
      ? user.skills.join(', ')
      : user?.skills || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
  });

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    const updatedUser = {
      ...user,
      ...form,
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setUser(updatedUser);
    setEditing(false);
    toast.success('Profile updated for this session.');
  };

  const initials = (form.name || 'Student')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const fields = [
    { label: 'Full Name', name: 'name', icon: UserRound, required: true },
    {
      label: 'Email Address',
      name: 'email',
      icon: Mail,
      type: 'email',
      required: true,
    },
    { label: 'Phone Number', name: 'phone', icon: Phone },
    { label: 'Location', name: 'location', icon: MapPin },
    {
      label: 'College / University',
      name: 'education',
      icon: GraduationCap,
    },
    {
      label: 'Course / Degree',
      name: 'course',
      icon: BriefcaseBusiness,
    },
  ];

  const skillList = form.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  const professionalLinks = [
    { label: 'GitHub', name: 'github' },
    { label: 'LinkedIn', name: 'linkedin' },
    { label: 'Portfolio', name: 'portfolio' },
  ];

  const inputClass =
    'w-full bg-white py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400';

  const containerClass =
    'flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-blue-500';

  return (
    <main className="min-h-screen bg-blue-50/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/student/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Student Account
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your information and showcase your skills to employers.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="px-6 pb-7 sm:px-9">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-3xl font-extrabold text-blue-700 shadow-sm">
                  {initials}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {form.name || 'Your Name'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {form.course || 'Student'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditing((previous) => !previous)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {editing ? <X size={17} /> : <Pencil size={17} />}
                {editing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-7">
              {editing ? (
                <form onSubmit={handleSave}>
                  <h3 className="mb-5 text-lg font-bold text-slate-900">
                    Edit Your Information
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields.map(
                      ({ label, name, icon: Icon, type, required }) => (
                        <div key={name}>
                          <label
                            htmlFor={name}
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            {label}
                          </label>

                          <div className={containerClass}>
                            <Icon
                              size={18}
                              className="shrink-0 text-blue-500"
                            />

                            <input
                              id={name}
                              name={name}
                              type={type || 'text'}
                              value={form[name]}
                              onChange={updateField}
                              required={required}
                              className={inputClass}
                              placeholder={`Enter ${label.toLowerCase()}`}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      About Me
                    </label>

                    <textarea
                      id="bio"
                      name="bio"
                      value={form.bio}
                      onChange={updateField}
                      rows={4}
                      maxLength={500}
                      placeholder="Introduce yourself, your interests, and career goals..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="skills"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Skills
                    </label>

                    <input
                      id="skills"
                      name="skills"
                      value={form.skills}
                      onChange={updateField}
                      placeholder="React, JavaScript, Python"
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                    />

                    <p className="mt-1 text-xs text-slate-500">
                      Separate each skill with a comma.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-3">
                    {professionalLinks.map(({ label, name }) => (
                      <div key={name}>
                        <label
                          htmlFor={name}
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          {label} URL
                        </label>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-blue-500">
                          <Globe
                            size={17}
                            className="shrink-0 text-blue-500"
                          />

                          <input
                            id={name}
                            name={name}
                            type="url"
                            value={form[name]}
                            onChange={updateField}
                            placeholder="https://..."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-slate-900">
                    About Me
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                    {form.bio ||
                      'Add a short introduction about yourself, your interests, and career goals.'}
                  </p>

                  <h3 className="mb-4 mt-8 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <UserRound size={20} className="text-blue-600" />
                    Contact & Education
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Email', value: form.email, icon: Mail },
                      { label: 'Phone', value: form.phone, icon: Phone },
                      { label: 'Location', value: form.location, icon: MapPin },
                      {
                        label: 'College',
                        value: form.education,
                        icon: GraduationCap,
                      },
                      {
                        label: 'Course',
                        value: form.course,
                        icon: BriefcaseBusiness,
                      },
                    ].map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                      >
                        <Icon
                          size={19}
                          className="mt-0.5 shrink-0 text-blue-600"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500">
                            {label}
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                            {value || 'Not added yet'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="mb-4 mt-8 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Code2 size={20} className="text-blue-600" />
                    Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skillList.length > 0 ? (
                      skillList.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        Add your skills using Edit Profile.
                      </p>
                    )}
                  </div>

                  <h3 className="mb-4 mt-8 text-lg font-bold text-slate-900">
                    Professional Links
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {professionalLinks
                      .filter(({ name }) => form[name])
                      .map(({ label, name }) => (
                        <a
                          key={name}
                          href={form[name]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-600"
                        >
                          <Globe size={17} />
                          {label}
                        </a>
                      ))}

                    {!form.github &&
                      !form.linkedin &&
                      !form.portfolio && (
                        <p className="text-sm text-slate-500">
                          Add your professional links when editing your profile.
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}