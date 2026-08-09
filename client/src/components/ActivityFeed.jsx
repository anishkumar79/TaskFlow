import { useEffect, useState } from 'react';
import { api } from '../api';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function ActivityFeed() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const data = await api.getNotifications();
        if (!cancelled) setNotifications(data);
      } catch {
        // Feed is a nice-to-have — a failed poll shouldn't disturb the board.
      }
    }
    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="w-72 shrink-0 hidden xl:block">
      <div className="sticky top-24">
        <h2 className="font-mono text-xs uppercase tracking-wider text-slate mb-3">Activity</h2>
        <div className="space-y-3">
          {notifications.length === 0 && (
            <p className="text-slate text-xs font-body">Nothing has moved yet.</p>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="border-l-2 border-current/40 pl-3">
              <p className="text-ink text-xs font-body leading-snug">{n.message}</p>
              <p className="text-slate text-[10px] font-mono mt-0.5">{timeAgo(n.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
