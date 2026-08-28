import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentsModal from '../../components/CommentsModal';
import {
  Heart, MessageCircle, Send, Volume2, VolumeX, MapPin, Building2, Home as HomeIcon, MoreHorizontal, Play,
  Flag, EyeOff, Share2, Link2, Check, Crown, Shield, Rocket,
} from 'lucide-react';

const MEDIA_BASE = 'http://localhost:5000';

const RANK_MEDALS = {
  1: { Icon: Crown, disc: 'from-[#fff6da] via-[#f5d576] to-[#b8860b]' },
  2: { Icon: Shield, disc: 'from-[#f6f6fa] via-[#cfcfd9] to-[#8f8f9c]' },
  3: { Icon: Rocket, disc: 'from-[#f3caa0] via-[#e0a458] to-[#8b5a24]' },
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

function PostOptionsMenu({ onReport, onNotInterested, onShare, onCopyLink }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleCopyLink = () => {
    onCopyLink?.();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 900);
  };

  const OPTIONS = [
    { label: 'Report', icon: Flag, danger: true, onClick: () => { onReport?.(); setOpen(false); } },
    { label: 'Not interested', icon: EyeOff, onClick: () => { onNotInterested?.(); setOpen(false); } },
    { label: 'Share to...', icon: Share2, onClick: () => { onShare?.(); setOpen(false); } },
    { label: copied ? 'Copied!' : 'Copy link', icon: copied ? Check : Link2, onClick: handleCopyLink },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen((v) => !v)} aria-label="More options">
        <MoreHorizontal size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-ink-900 border border-ink-800 shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={opt.onClick}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-[13.5px] font-body text-left hover:bg-ink-800 transition-colors ${
                  opt.danger ? 'text-signal' : 'text-text-dark'
                } ${i !== OPTIONS.length - 1 ? 'border-b border-ink-800' : ''}`}
              >
                <opt.icon size={15} className="shrink-0" />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryRing({ name, ring, rank }) {
  const medal = RANK_MEDALS[rank];
  const isCenter = rank === 1;
  const crownColor =
    rank === 1 ? 'text-[#f5d576]' : rank === 2 ? 'text-[#d9d9e3]' : rank === 3 ? 'text-[#e0a458]' : 'text-text-dark-muted';

  return (
    <div className={`flex flex-col items-center gap-1.5 shrink-0 ${isCenter ? 'w-20' : 'w-16'}`}>
      <div className="relative pt-3">
        <Crown
          size={isCenter ? 20 : rank <= 3 ? 16 : 13}
          strokeWidth={1.6}
          fill={rank <= 3 ? 'currentColor' : 'none'}
          className={`absolute -top-0.5 left-1/2 -translate-x-1/2 z-10 ${crownColor} ${
            rank === 1 ? 'drop-shadow-[0_0_8px_rgba(245,213,118,0.8)]' : ''
          }`}
        />
        <div
          className={`rounded-full bg-gradient-to-tr ${ring} p-[2px] ${
            isCenter ? 'w-[70px] h-[70px]' : 'w-14 h-14'
          }`}
        >
          <div className="w-full h-full rounded-full bg-ink-950 p-[2px]">
            <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
              <span className={`font-semibold text-text-dark font-body ${isCenter ? 'text-[13px]' : 'text-[11px]'}`}>
                {name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {medal ? (
          <div
            className={`absolute -bottom-1 -right-1 rounded-full bg-gradient-to-br ${medal.disc} flex items-center justify-center border-2 border-ink-950 ${
              isCenter ? 'w-6 h-6' : 'w-5 h-5'
            }`}
          >
            <medal.Icon size={isCenter ? 12 : 10} className="text-ink-950" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-ink-800 border-2 border-ink-950 flex items-center justify-center">
            <span className="text-[10px] font-bold font-body text-text-dark">{rank}</span>
          </div>
        )}
      </div>
      <span className={`text-text-dark-muted font-body truncate w-full text-center ${isCenter ? 'text-[12px] font-semibold text-text-dark' : 'text-[11px]'}`}>
        {name}
      </span>
    </div>
  );
}

function FeedCard({ item, currentUserId, showToast, onToggleLike, onOpenComments, commentBump }) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [commentCount, setCommentCount] = useState(null);
  const videoRef = useRef(null);
  const Icon = item.type === 'reel' ? HomeIcon : Building2;

  const liked = item.likes?.includes(currentUserId);
  const likeCount = item.likes?.length || 0;

  useEffect(() => {
    api.getComments(item._id)
      .then((res) => setCommentCount(res.data.length))
      .catch(() => setCommentCount(0));
  }, [item._id]);

  if (hidden) {
    return (
      <div className="rounded-2xl border border-ink-800 bg-ink-900 px-5 py-6 flex items-center justify-between">
        <p className="text-[13.5px] font-body text-text-dark-muted">Post hidden. You won't see this often.</p>
        <button
          onClick={() => setHidden(false)}
          className="text-[12.5px] font-semibold font-body text-signal shrink-0 ml-3"
        >
          Undo
        </button>
      </div>
    );
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((v) => !v);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const mediaUrl = item.mediaUrl ? `${MEDIA_BASE}${item.mediaUrl}` : null;

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px]">
            <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
              {item.user?.avatar ? (
                <img src={`${MEDIA_BASE}${item.user.avatar}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-semibold text-text-dark font-body">
                  {item.user?.username?.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-semibold font-body text-text-dark">{item.user?.username}</span>
              <span className="text-text-dark-muted">·</span>
              <span className="text-[12.5px] text-text-dark-muted font-body">{timeAgo(item.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-text-dark-muted font-body">
              <MapPin size={11} />
              {item.location}
            </div>
          </div>
        </div>
        <PostOptionsMenu
          onReport={() => showToast('Reported. Our team will review it.')}
          onNotInterested={() => setHidden(true)}
          onShare={async () => {
            await api.addShare(item._id).catch(() => {});
            const shareUrl = `${window.location.origin}/feed`;
            if (navigator.share) {
              try {
                await navigator.share({ title: 'UrbanVoice Post', text: item.caption, url: shareUrl });
              } catch {
                console.log('Share cancelled');
              }
            } else {
              await navigator.clipboard?.writeText(shareUrl);
              showToast('Link copied — share it anywhere.');
            }
          }}
          onCopyLink={async () => {
            await navigator.clipboard?.writeText(`${window.location.origin}/feed`);
            showToast('Link copied to clipboard.');
          }}
        />
      </div>

      <div className="relative aspect-square bg-ink-800 flex items-center justify-center overflow-hidden">
        {item.mediaType === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={muted}
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : mediaUrl ? (
          <img src={mediaUrl} alt={item.caption} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-ink-950/40 flex items-center justify-center backdrop-blur-sm">
            <Icon size={34} className="text-text-dark/70" />
          </div>
        )}

        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ink-950/70 backdrop-blur-sm text-[11px] font-semibold font-body text-volt">
          {item.category}
        </span>

        {item.type === 'reel' && (
          <>
            {!playing && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-ink-950/60 flex items-center justify-center"
              >
                <Play size={22} className="text-text-dark fill-text-dark ml-0.5" />
              </button>
            )}
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-ink-950/60 flex items-center justify-center text-text-dark"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => onToggleLike(item._id)}>
            <Heart size={22} className={liked ? 'text-signal fill-signal' : 'text-text-dark'} />
          </button>
          <button onClick={() => onOpenComments(item._id)}><MessageCircle size={22} className="text-text-dark" /></button>
          <button><Send size={20} className="text-text-dark" /></button>
        </div>
      </div>

      <div className="px-4 pt-2 pb-4">
        <p className="text-[13.5px] font-semibold font-body text-text-dark">{likeCount} likes</p>
        <p className="text-[13.5px] font-body text-text-dark mt-1 leading-relaxed">
          <span className="font-semibold">{item.user?.username}</span>{' '}
          <span className="text-text-dark-muted">{item.caption}</span>
        </p>
        {commentCount !== null && (commentCount + (commentBump || 0)) > 0 && (
          <p className="text-[12.5px] font-body text-text-dark-muted mt-1">
            View all {commentCount + (commentBump || 0)} comments
          </p>
        )}
      </div>
    </div>
  );
}

export default function HomeFeedPage() {
  const { user } = useAuth();
  const [toast, setToast] = useState('');
  const [commentsOpenFor, setCommentsOpenFor] = useState(null);
  const [commentBumps, setCommentBumps] = useState({});
  const [feedItems, setFeedItems] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [topReporters, setTopReporters] = useState([]);
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const loadFeed = async () => {
    try {
      const res = await api.getComplaints();
      setFeedItems(res.data);
    } catch (err) {
      console.error('Failed to load feed', err);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await api.getLeaderboard();
      const RINGS = ['from-volt to-rose-400', 'from-signal to-volt', 'from-volt to-emerald-400', 'from-volt to-signal', 'from-signal to-volt'];
      const top5 = res.data.slice(0, 5).map((u, i) => ({ rank: i + 1, name: u.username, ring: RINGS[i % RINGS.length] }));
      setLeaders(top5);
      setTopReporters(res.data.slice(0, 5).map((u) => ({ name: u.username, sub: `${u.score} points`, avatar: u.username.slice(0, 2).toUpperCase(), userId: u._id })));
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    }
  };

  useEffect(() => {
    Promise.all([loadFeed(), loadLeaderboard()]).finally(() => setLoading(false));
  }, []);

  const handleToggleLike = async (id) => {
    // optimistic-ish: call backend then refresh that item's likes from response isn't returned fully, so just refetch feed
    try {
      await api.toggleLike(id);
      setFeedItems((prev) =>
        prev.map((it) => {
          if (it._id !== id) return it;
          const already = it.likes.includes(user._id);
          return {
            ...it,
            likes: already ? it.likes.filter((uid) => uid !== user._id) : [...it.likes, user._id],
          };
        })
      );
    } catch (err) {
      showToast('Could not update like.');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.toggleFollow(userId);
      showToast('Follow updated.');
    } catch (err) {
      showToast('Could not follow user.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen ml-[76px] bg-ink-950 flex items-center justify-center">
        <p className="text-text-dark-muted font-body">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950">
      <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

        <div>
          {leaders.length > 0 && (
            <div className="flex items-start gap-4 overflow-x-auto pb-5 mb-2 scrollbar-hide">
              {leaders.map((s) => (
                <StoryRing key={s.rank} {...s} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-6 max-w-[500px] mx-auto lg:mx-0">
            {feedItems.length === 0 && (
              <p className="text-center text-text-dark-muted font-body py-10">
                No posts yet. Be the first to report an issue!
              </p>
            )}
            {feedItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FeedCard item={item} currentUserId={user?._id} showToast={showToast} onToggleLike={handleToggleLike} onOpenComments={setCommentsOpenFor} commentBump={commentBumps[item._id]} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block pt-2 sticky top-6 self-start h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-volt/20 border border-volt/40 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={`${MEDIA_BASE}${user.avatar}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-volt text-[12px] font-bold font-body">{user?.username?.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold font-body text-text-dark">{user?.username}</p>
              <p className="text-[12.5px] text-text-dark-muted font-body">{user?.fullName}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold font-body text-text-dark-muted">Top reporters</p>
          </div>

          <div className="flex flex-col gap-3.5">
            {topReporters.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                  <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-text-dark font-body">{r.avatar}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold font-body text-text-dark truncate">{r.name}</p>
                  <p className="text-[11.5px] text-text-dark-muted font-body truncate">{r.sub}</p>
                </div>
                <button
                  onClick={() => handleFollow(r.userId)}
                  className="text-[12.5px] font-semibold font-body text-signal shrink-0"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] px-4 py-2.5 rounded-full bg-ink-800 border border-ink-700 text-[13px] font-semibold font-body text-text-dark shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <CommentsModal
        complaintId={commentsOpenFor}
        open={!!commentsOpenFor}
        onClose={() => setCommentsOpenFor(null)}
        onCommentAdded={() =>
          setCommentBumps((prev) => ({
            ...prev,
            [commentsOpenFor]: (prev[commentsOpenFor] || 0) + 1,
          }))
        }
      />
    </div>
  );
}