import { Link } from 'react-router-dom';
import { timeAgo } from '../lib/utils';

export default function NotificationPanel({ items, onRead, onReadAll }) {
  return (
    <div className="dropdown-content z-30 mt-2 w-80 rounded-lg border border-base-300 bg-base-100 shadow-lg">
      <div className="flex items-center justify-between border-b border-base-300 px-4 py-3">
        <span className="text-sm font-semibold">Notifications</span>
        <button className="text-xs text-primary hover:underline" onClick={onReadAll}>Mark all as read</button>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {items.length === 0 && <li className="px-4 py-8 text-center text-sm muted">You are all caught up.</li>}
        {items.slice(0, 6).map((n) => (
          <li key={n._id} className={`border-b border-base-300/60 px-4 py-3 text-sm ${n.read ? '' : 'bg-base-200'}`}>
            <Link to={n.link || '/notifications'} onClick={() => !n.read && onRead(n._id)} className="block">
              <p className="font-medium">{n.title}</p>
              <p className="muted">{n.message}</p>
              <p className="mt-1 text-xs muted">{timeAgo(n.createdAt)}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/notifications" className="block px-4 py-2.5 text-center text-sm text-primary hover:bg-base-200">View all notifications</Link>
    </div>
  );
}
