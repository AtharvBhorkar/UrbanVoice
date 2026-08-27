import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, UserPlus, AtSign, Megaphone, CheckCheck,
} from 'lucide-react';
import * as api from '../../services/api';

const MEDIA_BASE = 'http://localhost:5000';
const RINGS = ['from-signal to-volt', 'from-volt to-rose-400', 'from-volt to-signal', 'from-emerald-400 to-volt', 'from-emerald-400 to-signal', 'from-signal to-rose-400', 'from-rose-400 to-signal'];

const TYPE_META = {
  like: { icon: Heart, color: 'text-signal', bg: 'bg-signal/15' },
  comment: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/15' },
  follow: { icon: UserPlus, color: 'text-volt', bg: 'bg-volt/15' },
  share: { icon: AtSign, color: 'text-volt', bg: 'bg-volt/15' },
  status_update: { icon: Megaphone, color: 'text-[#f5d576]', bg: 'bg-[#f5d576]/15' },
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function NotificationRow({ n, onRead, index }) {
  const meta = TYPE_META[n.type] || TYPE_META.status_update;
  const Icon = meta.icon;
  const ring = RINGS[index % RINGS.length];
  const avatarUrl = n.sender?.avatar ? `${MEDIA_BASE}${n.sender.avatar}` : null;
  const initials = n.sender?.username?.slice(0, 2).toUpperCase() || 'UV';

  return (
    <motion.button
      onClick={() => onRead(n._id)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
        !n.isRead ? 'bg-ink-800/50 hover:bg-ink-800' : 'hover:bg-ink-900/60'
      }`}
    >
      <div className="relative shrink-0">
        <div className={`rounded-full bg-gradient-to-tr ${ring} p-[1.5px] w-11 h-11`}>
          <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10.5px] font-semibold text-text-dark font-body">{initials}</span>
            )}
          </div>
        </div>
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${meta.bg} flex items-center justify-center border-2 border-ink-950`}>
          <Icon size={11} className={meta.color} fill={n.type === 'like' ? 'currentColor' : 'none'} />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-body text-text-dark leading-snug">{n.message}</p>
        <span className="text-[11.5px] font-body text-text-dark-muted">{timeAgo(n.createdAt)}</span>
      </div>

      {!n.isRead && <span className="w-2 h-2 rounded-full bg-signal shrink-0" />}
    </motion.button>
  );
}

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications()
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Failed to load notifications', err))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await api.markNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  // No per-notification read endpoint on the backend yet, so opening one just
  // reflects it as read locally for now (mark-all handles the persisted state).
  const markRead = (id) => setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));

  // "New" = last 24h, "Earlier" = older — since backend doesn't group these itself
  const isRecent = (dateStr) => Date.now() - new Date(dateStr).getTime() < 24 * 60 * 60 * 1000;
  const newItems = items.filter((n) => isRecent(n.createdAt));
  const earlierItems = items.filter((n) => !isRecent(n.createdAt));
  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950 px-8 py-8">
      <div className="max-w-[640px] mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-display font-bold text-text-dark">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-[12.5px] font-semibold font-body text-volt hover:text-volt-dim transition-colors"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>

        {loading && (
          <p className="text-[13.5px] font-body text-text-dark-muted text-center mt-20">Loading...</p>
        )}

        {!loading && newItems.length > 0 && (
          <div className="mb-6">
            <p className="text-[12.5px] font-semibold font-body text-text-dark-muted uppercase tracking-wide mb-2 px-1">New</p>
            <div className="flex flex-col gap-1">
              {newItems.map((n, i) => (
                <NotificationRow key={n._id} n={n} onRead={markRead} index={i} />
              ))}
            </div>
          </div>
        )}

        {!loading && earlierItems.length > 0 && (
          <div>
            <p className="text-[12.5px] font-semibold font-body text-text-dark-muted uppercase tracking-wide mb-2 px-1">Earlier</p>
            <div className="flex flex-col gap-1">
              {earlierItems.map((n, i) => (
                <NotificationRow key={n._id} n={n} onRead={markRead} index={newItems.length + i} />
              ))}
            </div>
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="text-[13.5px] font-body text-text-dark-muted text-center mt-20">
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
}