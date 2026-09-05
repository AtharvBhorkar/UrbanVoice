import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid3x3, Clapperboard, ShieldCheck, Heart, Share2, Eye,
  X, ChevronLeft, ChevronRight, MessageCircle, Send, Bookmark, Volume2, VolumeX,
} from 'lucide-react';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FollowListModal from '../../components/FollowListModal';

function timeAgo(dateStr) {
  if (!dateStr) return '';
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

const MEDIA_BASE = 'http://localhost:5000';

const TABS = [
  { id: 'reels', icon: Clapperboard, label: 'Voice Reels' },
  { id: 'posts', icon: Grid3x3, label: 'Voice Posts' },
];

export default function UserProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('reels');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [followModal, setFollowModal] = useState(null); // 'followers' | 'following' | null

  const [openPostIndex, setOpenPostIndex] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [postCommentDraft, setPostCommentDraft] = useState('');
  const postCommentInputRef = useRef(null);

  const [openReelIndex, setOpenReelIndex] = useState(null);
  const [reelComments, setReelComments] = useState([]);
  const [reelCommentDraft, setReelCommentDraft] = useState('');
  const [reelMuted, setReelMuted] = useState(true);
  const reelCommentInputRef = useRef(null);

  useEffect(() => {
    if (openPostIndex === null || !posts[openPostIndex]) return;
    api.getComments(posts[openPostIndex]._id)
      .then((res) => setPostComments(res.data))
      .catch(() => setPostComments([]));
  }, [openPostIndex, posts]);

  useEffect(() => {
    if (openReelIndex === null || !reels[openReelIndex]) return;
    api.getComments(reels[openReelIndex]._id)
      .then((res) => setReelComments(res.data))
      .catch(() => setReelComments([]));
  }, [openReelIndex, reels]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handlePostLikeToggle = async () => {
    if (!requireAuth()) return;
    const post = posts[openPostIndex];
    if (!post) return;
    try {
      await api.toggleLike(post._id);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== post._id) return p;
          const already = p.likes.includes(currentUser._id);
          return { ...p, likes: already ? p.likes.filter((id) => id !== currentUser._id) : [...p.likes, currentUser._id] };
        })
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleReelLikeToggle = async () => {
    if (!requireAuth()) return;
    const reel = reels[openReelIndex];
    if (!reel) return;
    try {
      await api.toggleLike(reel._id);
      setReels((prev) =>
        prev.map((r) => {
          if (r._id !== reel._id) return r;
          const already = r.likes.includes(currentUser._id);
          return { ...r, likes: already ? r.likes.filter((id) => id !== currentUser._id) : [...r.likes, currentUser._id] };
        })
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handlePostSaveToggle = async () => {
    if (!requireAuth()) return;
    const post = posts[openPostIndex];
    if (!post) return;
    try {
      await api.toggleSave(post._id);
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handlePostCommentSubmit = async () => {
    if (!requireAuth()) return;
    const text = postCommentDraft.trim();
    const post = posts[openPostIndex];
    if (!text || !post) return;
    try {
      const res = await api.addComment(post._id, text);
      setPostComments((prev) => [...prev, res.data]);
      setPostCommentDraft('');
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  const handleReelCommentSubmit = async () => {
    if (!requireAuth()) return;
    const text = reelCommentDraft.trim();
    const reel = reels[openReelIndex];
    if (!text || !reel) return;
    try {
      const res = await api.addComment(reel._id, text);
      setReelComments((prev) => [...prev, res.data]);
      setReelCommentDraft('');
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  const handleShare = async (item, kind) => {
    await api.addShare(item._id).catch(() => {});
    const shareUrl = `${window.location.origin}/${kind === 'reel' ? 'reels' : 'feed'}?item=${item._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'UrbanVoice', text: item.caption, url: shareUrl });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard?.writeText(shareUrl);
    }
  };

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    api.getUserByUsername(username)
      .then(async (res) => {
        const profileData = res.data;
        setProfile(profileData);
        setIsFollowing(
          currentUser
            ? profileData.followers?.some((f) => f === currentUser._id || f?._id === currentUser._id)
            : false
        );

        const [postsRes, reelsRes] = await Promise.all([
          api.getComplaintsByUser(profileData._id, 'post'),
          api.getComplaintsByUser(profileData._id, 'reel'),
        ]);
        setPosts(postsRes.data);
        setReels(reelsRes.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username, currentUser?._id]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setFollowBusy(true);
    try {
      const res = await api.toggleFollow(profile._id);
      setIsFollowing(res.data.following);
      setProfile((p) => ({
        ...p,
        followers: res.data.following
          ? [...(p.followers || []), currentUser._id]
          : (p.followers || []).filter((f) => f !== currentUser._id),
      }));
    } catch (err) {
      console.error('Follow failed', err);
    } finally {
      setFollowBusy(false);
    }
  };

  if (currentUser && currentUser.username === username) {
    return <Navigate to="/profile" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-8 py-10">
        <p className="text-text-dark-muted font-body">Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-8 py-10">
        <p className="text-text-dark-muted font-body">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-10 mb-8 text-center sm:text-left">
          <div className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full bg-gradient-to-tr from-signal to-volt p-[3px] shrink-0">
            <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={`${MEDIA_BASE}${profile.avatar}`} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[28px] font-semibold text-text-dark font-body">
                  {profile.username.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-2 w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 flex-wrap">
              <h1 className="text-[22px] font-body font-normal text-text-dark">{profile.username}</h1>
              {profile.badges?.length > 0 && <ShieldCheck size={18} className="text-volt" fill="currentColor" />}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 mb-4">
              <span className="text-[14px] font-body text-text-dark">
                <strong className="font-semibold">{posts.length + reels.length}</strong> posts
              </span>
              <button onClick={() => setFollowModal('followers')} className="text-[14px] font-body text-text-dark hover:underline">
                <strong className="font-semibold">{profile.followers?.length || 0}</strong> Subscribers
              </button>
              <button onClick={() => setFollowModal('following')} className="text-[14px] font-body text-text-dark hover:underline">
                <strong className="font-semibold">{profile.following?.length || 0}</strong> Subscriptions
              </button>
            </div>

            <div className="text-[14px] font-body leading-relaxed mb-5 max-w-[420px] mx-auto sm:mx-0">
              <p className="font-semibold text-text-dark">{profile.fullName}</p>
              {profile.bio && <p className="text-text-dark-muted mt-1.5">{profile.bio}</p>}
              {profile.location && <p className="text-text-dark-muted mt-1 text-[13px]">{profile.location}</p>}
              {profile.website && (
                <a
                  href={/^https?:\/\//i.test(profile.website) ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-semibold hover:underline block mt-1 w-fit"
                >
                  {profile.website}
                </a>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2.5 w-full">
              <button
                onClick={handleFollowToggle}
                disabled={followBusy}
                className={`px-6 py-1.5 rounded-lg text-[13.5px] font-semibold font-body transition-colors disabled:opacity-60 ${
                  isFollowing ? 'bg-ink-800 hover:bg-ink-700 text-text-dark' : 'bg-volt hover:bg-volt-dim text-ink-950'
                }`}
              >
                {isFollowing ? 'Subscribed' : 'Subscribe'}
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  navigate(`/messages?with=${profile._id}&username=${profile.username}`);
                }}
                className="px-6 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-[13.5px] font-semibold font-body text-text-dark transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 sm:gap-16 border-t border-ink-800 mb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-3.5 border-t transition-colors ${
                activeTab === tab.id
                  ? 'border-text-dark text-text-dark'
                  : 'border-transparent text-text-dark-muted hover:text-text-dark'
              }`}
            >
              <tab.icon size={13} />
              <span className="text-[11px] font-semibold font-body tracking-wide uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'posts' ? (
          posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setOpenPostIndex(i)}
                  className="aspect-square bg-ink-800 overflow-hidden cursor-pointer hover:brightness-110 transition-all"
                >
                  {p.mediaUrl && <img src={`${MEDIA_BASE}${p.mediaUrl}`} alt="" className="w-full h-full object-cover" />}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-ink-700 flex items-center justify-center">
                <Grid3x3 size={22} className="text-text-dark-muted" />
              </div>
              <p className="text-[13.5px] font-body text-text-dark-muted">No posts yet.</p>
            </div>
          )
        ) : reels.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {reels.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setOpenReelIndex(i)}
                className="group relative aspect-[9/16] bg-ink-800 overflow-hidden cursor-pointer"
              >
                <Clapperboard size={14} className="absolute top-2 left-2 text-text-dark/80 z-10" />
                {r.mediaUrl && (
                  <video
                    src={`${MEDIA_BASE}${r.mediaUrl}#t=0.1`}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2.5 pt-8 pb-2.5 flex items-center justify-between z-10">
                  <span className="flex items-center gap-1 text-[11px] font-body text-text-dark">
                    <Heart size={12} className="fill-text-dark" />
                    {r.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-body text-text-dark">
                    <Share2 size={12} />
                    {r.shares || 0}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-body text-text-dark">
                    <Eye size={12} />
                    {r.views || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-ink-700 flex items-center justify-center">
              <Clapperboard size={22} className="text-text-dark-muted" />
            </div>
            <p className="text-[13.5px] font-body text-text-dark-muted">No reels yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openReelIndex !== null && reels[openReelIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenReelIndex(null)}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-6"
          >
            <button
              onClick={() => setOpenReelIndex(null)}
              aria-label="Close"
              className="absolute top-5 right-6 text-text-dark hover:text-text-dark-muted transition-colors"
            >
              <X size={26} />
            </button>

            {openReelIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenReelIndex((i) => i - 1); }}
                aria-label="Previous reel"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 border border-ink-700 flex items-center justify-center text-text-dark hover:bg-ink-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {openReelIndex < reels.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenReelIndex((i) => i + 1); }}
                aria-label="Next reel"
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 border border-ink-700 flex items-center justify-center text-text-dark hover:bg-ink-800 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[980px] h-[85vh] max-h-[720px] rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden flex"
            >
              <div className="relative w-[52%] shrink-0 bg-black flex items-center justify-center overflow-hidden">
                {reels[openReelIndex].mediaUrl && (
                  <video
                    src={`${MEDIA_BASE}${reels[openReelIndex].mediaUrl}`}
                    autoPlay
                    loop
                    muted={reelMuted}
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  onClick={() => setReelMuted((v) => !v)}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-ink-950/60 flex items-center justify-center text-text-dark"
                >
                  {reelMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-800 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                      {profile.avatar ? (
                        <img src={`${MEDIA_BASE}${profile.avatar}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-semibold text-text-dark font-body">
                          {profile.username?.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[13.5px] font-semibold font-body text-text-dark truncate">{profile.username}</span>
                    <p className="text-[11.5px] font-body text-text-dark-muted truncate">{reels[openReelIndex].location}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <p className="text-[13.5px] font-body text-text-dark leading-relaxed">
                    <span className="font-semibold">{profile.username}</span>{' '}
                    <span className="text-text-dark-muted">{reels[openReelIndex].caption}</span>
                  </p>

                  {reelComments.length > 0 && (
                    <div className="flex flex-col gap-3 mt-5">
                      {reelComments.map((c) => (
                        <p key={c._id} className="text-[13.5px] font-body text-text-dark leading-relaxed">
                          <span className="font-semibold">{c.user?.username}</span>{' '}
                          <span className="text-text-dark-muted">{c.text}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-ink-800">
                  <div className="flex items-center justify-between px-4 pt-3">
                    <div className="flex items-center gap-4">
                      <button onClick={handleReelLikeToggle} aria-label="Like">
                        <Heart size={22} className={reels[openReelIndex].likes?.includes(currentUser?._id) ? 'text-signal fill-signal' : 'text-text-dark'} />
                      </button>
                      <button
                        aria-label="Comment"
                        onClick={() => reelCommentInputRef.current?.focus({ preventScroll: false })}
                      >
                        <MessageCircle size={22} className="text-text-dark" />
                      </button>
                      <button aria-label="Share" onClick={() => handleShare(reels[openReelIndex], 'reel')}>
                        <Send size={20} className="text-text-dark" />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 pt-2.5">
                    <p className="text-[13px] font-semibold font-body text-text-dark">
                      {reels[openReelIndex].likes?.length || 0} Backed
                    </p>
                    <p className="text-[11px] font-body text-text-dark-muted mt-0.5">{timeAgo(reels[openReelIndex].createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 mt-1">
                    <input
                      ref={reelCommentInputRef}
                      value={reelCommentDraft}
                      onChange={(e) => setReelCommentDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleReelCommentSubmit(); }}
                      placeholder="Add a Citizen Note..."
                      className="flex-1 bg-transparent text-[13px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
                    />
                    <button
                      onClick={handleReelCommentSubmit}
                      disabled={!reelCommentDraft.trim()}
                      className="text-[13px] font-semibold font-body text-blue-500 hover:text-blue-400 disabled:text-text-dark-muted disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openPostIndex !== null && posts[openPostIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPostIndex(null)}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-6"
          >
            <button
              onClick={() => setOpenPostIndex(null)}
              aria-label="Close"
              className="absolute top-5 right-6 text-text-dark hover:text-text-dark-muted transition-colors"
            >
              <X size={26} />
            </button>

            {openPostIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenPostIndex((i) => i - 1); }}
                aria-label="Previous post"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 border border-ink-700 flex items-center justify-center text-text-dark hover:bg-ink-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {openPostIndex < posts.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenPostIndex((i) => i + 1); }}
                aria-label="Next post"
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 border border-ink-700 flex items-center justify-center text-text-dark hover:bg-ink-800 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[980px] h-[85vh] max-h-[720px] rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden flex"
            >
              <div className="relative w-[55%] shrink-0 bg-black flex items-center justify-center overflow-hidden">
                {posts[openPostIndex].mediaUrl ? (
                  <img
                    src={`${MEDIA_BASE}${posts[openPostIndex].mediaUrl}`}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Grid3x3 size={48} strokeWidth={1.2} className="text-text-dark/50" />
                )}
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-800 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                      {profile.avatar ? (
                        <img src={`${MEDIA_BASE}${profile.avatar}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-semibold text-text-dark font-body">
                          {profile.username?.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[13.5px] font-semibold font-body text-text-dark truncate">{profile.username}</span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <p className="text-[13.5px] font-body text-text-dark leading-relaxed">
                    <span className="font-semibold">{profile.username}</span>{' '}
                    <span className="text-text-dark-muted">{posts[openPostIndex].caption}</span>
                  </p>

                  {postComments.length > 0 && (
                    <div className="flex flex-col gap-3 mt-5">
                      {postComments.map((c) => (
                        <p key={c._id} className="text-[13.5px] font-body text-text-dark leading-relaxed">
                          <span className="font-semibold">{c.user?.username}</span>{' '}
                          <span className="text-text-dark-muted">{c.text}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-ink-800">
                  <div className="flex items-center justify-between px-4 pt-3">
                    <div className="flex items-center gap-4">
                      <button onClick={handlePostLikeToggle} aria-label="Like">
                        <Heart size={22} className={posts[openPostIndex].likes?.includes(currentUser?._id) ? 'text-signal fill-signal' : 'text-text-dark'} />
                      </button>
                      <button
                        aria-label="Comment"
                        onClick={() => postCommentInputRef.current?.focus({ preventScroll: false })}
                      >
                        <MessageCircle size={22} className="text-text-dark" />
                      </button>
                      <button aria-label="Share" onClick={() => handleShare(posts[openPostIndex], 'post')}>
                        <Send size={20} className="text-text-dark" />
                      </button>
                    </div>
                    <button onClick={handlePostSaveToggle} aria-label="Save">
                      <Bookmark size={20} className={currentUser?.savedIssues?.some((id) => (id?._id || id) === posts[openPostIndex]._id) ? 'text-text-dark fill-text-dark' : 'text-text-dark'} />
                    </button>
                  </div>

                  <div className="px-4 pt-2.5">
                    <p className="text-[13px] font-semibold font-body text-text-dark">
                      {posts[openPostIndex].likes?.length || 0} Backed
                    </p>
                    <p className="text-[11px] font-body text-text-dark-muted mt-0.5">{timeAgo(posts[openPostIndex].createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 mt-1">
                    <input
                      ref={postCommentInputRef}
                      value={postCommentDraft}
                      onChange={(e) => setPostCommentDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handlePostCommentSubmit(); }}
                      placeholder="Add a Citizen Note..."
                      className="flex-1 bg-transparent text-[13px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
                    />
                    <button
                      onClick={handlePostCommentSubmit}
                      disabled={!postCommentDraft.trim()}
                      className="text-[13px] font-semibold font-body text-blue-500 hover:text-blue-400 disabled:text-text-dark-muted disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FollowListModal
        open={!!followModal}
        onClose={() => setFollowModal(null)}
        username={username}
        type={followModal}
      />
    </div>
  );
}