import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm muted">
        <p>© {new Date().getFullYear()} SkillBridge. Learn. Create. Work.</p>
        <div className="flex gap-5">
          <Link to="/jobs" className="hover:text-base-content">Browse opportunities</Link>
          <Link to="/trending" className="hover:text-base-content">Trending skills</Link>
          <Link to="/register/employer" className="hover:text-base-content">For employers</Link>
        </div>
      </div>
    </footer>
  );
}
