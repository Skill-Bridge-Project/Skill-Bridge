import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Search, BriefcaseBusiness, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const fallbackSkills = [
  { name: 'React', category: 'Development' },
  { name: 'JavaScript', category: 'Development' },
  { name: 'Python', category: 'Data & AI' },
  { name: 'SQL', category: 'Data & Analytics' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Node.js', category: 'Development' },
  { name: 'Machine Learning', category: 'Data & AI' },
  { name: 'Cybersecurity', category: 'Security' },
  { name: 'Cloud Computing', category: 'Cloud' },
  { name: 'Data Analysis', category: 'Data & Analytics' },
  { name: 'Figma', category: 'Design' },
  { name: 'Git & GitHub', category: 'Development' },
];

export default function TrendingSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);

    try {
      // Update this endpoint if your backend uses a different route.
      const response = await api.get('/trending');
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.skills || data.trendingSkills || data.data || [];

      const normalized = list
        .map((skill) => {
          if (typeof skill === 'string') {
            return { name: skill, category: 'Career Skills' };
          }

          return {
            ...skill,
            name: skill.name || skill.skill || skill.title || '',
            category: skill.category || skill.field || 'Career Skills',
          };
        })
        .filter((skill) => skill.name);

      setSkills(normalized);
      setUsingFallback(false);
    } catch (error) {
      console.error('Failed to fetch trending skills:', error.response?.data || error.message);
      setSkills(fallbackSkills);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) =>
    `${skill.name} ${skill.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <TrendingUp size={18} /> CAREER INSIGHTS
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Trending Skills
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Explore in-demand skills and discover what to learn next for your career.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSkills}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/15 p-3">
              <TrendingUp size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Build skills that move you forward</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Explore technology, design, data and security skills to help guide your learning journey.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore skills</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? 'Loading skills...' : `${filteredSkills.length} skills available`}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4">
            <Search size={18} className="text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search skills..."
              className="w-full min-w-0 bg-transparent py-3 text-sm outline-none sm:w-64"
            />
          </div>
        </div>

        {usingFallback && !loading && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Showing sample skills because the trending-skills API could not be reached. Connect the correct backend endpoint to load live data.
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Search className="mx-auto mb-3 text-slate-400" size={30} />
            <h3 className="font-bold text-slate-900">No skills found</h3>
            <p className="mt-2 text-sm text-slate-500">Try another search term.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill, index) => (
              <article
                key={skill._id || skill.name}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BriefcaseBusiness size={21} />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <TrendingUp className="mr-1 inline" size={13} />
                    Explore
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                  {skill.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{skill.category}</p>

                <Link
                  to={`/jobs?keyword=${encodeURIComponent(skill.name)}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Find related jobs <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/student/dashboard"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
