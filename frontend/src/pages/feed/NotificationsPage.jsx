import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, UserPlus, AtSign, Megaphone, MapPin, CheckCheck,
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1, group: 'new', type: 'like', user: 'sitabuldi_speaks', avatar: 'SS', ring: 'from-signal to-volt',
    text: 'liked your complaint about the blocked hospital gate.', time: '2m', unread: true,
  },
  {
    id: 2, group: 'new', type: 'comment', user: 'dharampeth_diaries', avatar: 'DD', ring: 'from-volt to-rose-400',
    text: 'commented: "Same issue near my lane too, tagging the ward office."', time: '18m', unread: true,
  },
  {
    id: 3, group: 'new', type: 'follow', user: 'greenpark_rwa', avatar: 'GP', ring: 'from-volt to-signal',
    text: 'started following you.', time: '41m', unread: true,
  },
  {
    id: 4, group: 'new', type: 'system', user: 'UrbanVoice', avatar: 'UV', ring: 'from-emerald-400 to-volt',
    text: 'Your complaint "Waterlogging at Ram Nagar Crossing" was marked Resolved by Municipal Ward 5.', time: '1h', unread: true,
  },
  {
    id: 5, group: 'earlier', type: 'mention', user: 'lift_watch_towerb', avatar: 'LW', ring: 'from-emerald-400 to-signal',
    text: 'mentioned you in a reel comment.', time: '5h', unread: false,
  },
  {
    id: 6, group: 'earlier', type: 'like', user: 'ananya_r', avatar: 'AR', ring: 'from-signal to-rose-400',
    text: 'and 24 others liked your reel.', time: '9h', unread: false,
  },
  {
    id: 7, group: 'earlier', type: 'comment', user: 'ward5_watch', avatar: 'W5', ring: 'from-signal to-rose-400',
    text: 'commented: "Reported this to the corporator, awaiting reply."', time: '1d', unread: false,
  },
  {
    id: 8, group: 'earlier', type: 'follow', user: 'sunrise_apartments', avatar: 'SA', ring: 'from-rose-400 to-signal',
    text: 'started following you.', time: '2d', unread: false,
  },
  {
    id: 9, group: 'earlier', type: 'system', user: 'UrbanVoice', avatar: 'UV', ring: 'from-emerald-400 to-volt',
    text: 'You earned the "Active Reporter" badge for 10 verified complaints.', time: '3d', unread: false,
  },
  {
    id: 10, group: 'earlier', type: 'like', user: 'civil_lines_watch', avatar: 'CL', ring: 'from-emerald-400 to-signal',
    text: 'liked your comment on Green Park Society post.', time: '5d', unread: false,
  },
];

const TYPE_META = {
  like: { icon: Heart, color: 'text-signal', bg: 'bg-signal/15' },
  comment: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/15' },
  follow: { icon: UserPlus, color: 'text-volt', bg: 'bg-volt/15' },
  mention: { icon: AtSign, color: 'text-volt', bg: 'bg-volt/15' },
  system: { icon: Megaphone, color: 'text-[#f5d576]', bg: 'bg-[#f5d576]/15' },
};

function NotificationRow({ n, onRead }) {
  const meta = TYPE_META[n.type];
  const Icon = meta.icon;

  return (
    <motion.button
      onClick={() => onRead(n.id)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
        n.unread ? 'bg-ink-800/50 hover:bg-ink-800' : 'hover:bg-ink-900/60'
      }`}
    >
      <div className="relative shrink-0">
        <div className={`rounded-full bg-gradient-to-tr ${n.ring} p-[1.5px] w-11 h-11`}>
          <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
            <span className="text-[10.5px] font-semibold text-text-dark font-body">{n.avatar}</span>
          </div>
        </div>
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${meta.bg} flex items-center justify-center border-2 border-ink-950`}>
          <Icon size={11} className={meta.color} fill={n.type === 'like' ? 'currentColor' : 'none'} />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-body text-text-dark leading-snug">
          <span className="font-semibold">{n.user}</span>{' '}
          <span className="text-text-dark-muted">{n.text}</span>
        </p>
        <span className="text-[11.5px] font-body text-text-dark-muted">{n.time} ago</span>
      </div>

      {n.unread && <span className="w-2 h-2 rounded-full bg-signal shrink-0" />}
    </motion.button>
  );
}

export default function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const newItems = items.filter((n) => n.group === 'new');
  const earlierItems = items.filter((n) => n.group === 'earlier');
  const unreadCount = items.filter((n) => n.unread).length;

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

        {newItems.length > 0 && (
          <div className="mb-6">
            <p className="text-[12.5px] font-semibold font-body text-text-dark-muted uppercase tracking-wide mb-2 px-1">New</p>
            <div className="flex flex-col gap-1">
              {newItems.map((n) => (
                <NotificationRow key={n.id} n={n} onRead={markRead} />
              ))}
            </div>
          </div>
        )}

        {earlierItems.length > 0 && (
          <div>
            <p className="text-[12.5px] font-semibold font-body text-text-dark-muted uppercase tracking-wide mb-2 px-1">Earlier</p>
            <div className="flex flex-col gap-1">
              {earlierItems.map((n) => (
                <NotificationRow key={n.id} n={n} onRead={markRead} />
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <p className="text-[13.5px] font-body text-text-dark-muted text-center mt-20">
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
}