import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Grid3x3, Clapperboard,
  Plus, ShieldCheck, MoreHorizontal, X, Award,
  Heart, MessageCircle, Share2, Eye,
  Bookmark, VolumeX, Volume2, ChevronLeft, ChevronRight, Send,
} from 'lucide-react';
import { BADGES, SUPREME, isUnlocked } from '../../data/badges.js';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FollowListModal from '../../components/FollowListModal';

const MEDIA_BASE = 'http://localhost:5000';

const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say', 'Custom'];

const STORAGE_KEY = 'urbanvoice_profile_data';

const loadStoredProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const HIGHLIGHTS = [
  { id: 1, label: 'Ward 5 Fix', thumb: null },
];

const TABS = [
  { id: 'reels', icon: Clapperboard, label: 'Voice Reels' },
  { id: 'posts', icon: Grid3x3, label: 'Voice Posts' }
];

const POSTS = [
  {
    id: 1,
    tone: 'from-signal/30 to-ink-900',
    likes: 128,
    time: '2 days ago',
    caption: 'Streetlight outage on the main road for over a week now. Filed a complaint — hoping for a quick fix.',
    commentsList: [],
  },
  {
    id: 2,
    tone: 'from-volt/25 to-ink-900',
    likes: 94,
    time: '5 days ago',
    caption: 'Garbage pileup near the bus stop. Reported to the municipal helpline, tagging authorities for action.',
    commentsList: [],
  },
];

const INITIAL_REELS = [
  {
    id: 1,
    tone: 'from-emerald-400/25 to-ink-900',
    likes: '3.1k',
    comments: 455,
    shares: 310,
    views: '62.8k',
    time: '1 day ago',
    location: 'Dharampeth, Nagpur',
    caption: 'Open manhole near the market square, unmarked. Reported to the ward office — still waiting on action. Tagging local authorities for visibility.',
    commentsList: [],
  },
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('reels');

  const USER = {
    username: user?.username || '',
    fullName: user?.fullName || '',
    posts: 0, // will be replaced by real count below via realPosts.length + realReels.length
    followers: user?.followers?.length || 0,
    following: user?.following?.length || 0,
    role: 'Civic Reporter',
    bio: user?.bio || '',
    thread: user?.username || '',
  };
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [followModal, setFollowModal] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [avatarViewOpen, setAvatarViewOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(() => loadStoredProfile().profileImage || null);
  const imageInputRef = useRef(null);
  const [profileBio, setProfileBio] = useState(() => loadStoredProfile().profileBio ?? USER.bio);
  const [profileGender, setProfileGender] = useState(() => loadStoredProfile().profileGender || 'Male');
  const [bioDraft, setBioDraft] = useState('');
  const [genderDraft, setGenderDraft] = useState('Male');
  const [profileWebsite, setProfileWebsite] = useState(() => loadStoredProfile().profileWebsite || '');
  const [profileWebsiteLabel, setProfileWebsiteLabel] = useState(() => loadStoredProfile().profileWebsiteLabel || '');
  const [websiteDraft, setWebsiteDraft] = useState('');
  const [websiteLabelDraft, setWebsiteLabelDraft] = useState('');
  const [openPostIndex, setOpenPostIndex] = useState(null);
  const [postLiked, setPostLiked] = useState(false);
  const [postSaved, setPostSaved] = useState(false);
  const [postCommentDraft, setPostCommentDraft] = useState('');
  const [postOptionsOpen, setPostOptionsOpen] = useState(false);
  const [confirmDeletePostOpen, setConfirmDeletePostOpen] = useState(false);
  const [editingPostCaption, setEditingPostCaption] = useState(false);
  const [postCaptionDraft, setPostCaptionDraft] = useState('');
  const [openReelIndex, setOpenReelIndex] = useState(null);
  const [reelMuted, setReelMuted] = useState(true);
  const [reelOptionsOpen, setReelOptionsOpen] = useState(false);
  const [reels, setReels] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    api.getComplaintsByUser(user._id, 'post').then((res) => setPosts(res.data)).catch(() => {});
    api.getComplaintsByUser(user._id, 'reel').then((res) => setReels(res.data)).catch(() => {});
  }, [user?._id]);

  useEffect(() => {
    if (user?.avatar) {
      setProfileImage(`${MEDIA_BASE}${user.avatar}`);
    }
  }, [user?.avatar]);

  const [reelComments, setReelComments] = useState([]);
  const [reelCommentDraft, setReelCommentDraft] = useState('');

  useEffect(() => {
    if (openReelIndex === null || !reels[openReelIndex]) return;
    api.getComments(reels[openReelIndex]._id)
      .then((res) => setReelComments(res.data))
      .catch(() => setReelComments([]));
  }, [openReelIndex, reels]);

  const [postComments, setPostComments] = useState([]);

  useEffect(() => {
    if (openPostIndex === null || !posts[openPostIndex]) return;
    api.getComments(posts[openPostIndex]._id)
      .then((res) => setPostComments(res.data))
      .catch(() => setPostComments([]));
  }, [openPostIndex, posts]);

  const handlePostLikeToggle = async () => {
    const post = posts[openPostIndex];
    if (!post) return;
    try {
      await api.toggleLike(post._id);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== post._id) return p;
          const already = p.likes.includes(user._id);
          return { ...p, likes: already ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id] };
        })
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handlePostSaveToggle = async () => {
    const post = posts[openPostIndex];
    if (!post) return;
    try {
      await api.toggleSave(post._id);
      await refreshUser();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleReelLikeToggle = async () => {
    const reel = reels[openReelIndex];
    if (!reel) return;
    try {
      await api.toggleLike(reel._id);
      setReels((prev) =>
        prev.map((r) => {
          if (r._id !== reel._id) return r;
          const already = r.likes.includes(user._id);
          return { ...r, likes: already ? r.likes.filter((id) => id !== user._id) : [...r.likes, user._id] };
        })
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleReelCommentSend = async () => {
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingCaption, setEditingCaption] = useState(false);
  const [captionDraft, setCaptionDraft] = useState('');
  const [toast, setToast] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const commentInputRef = useRef(null);
  const postCommentInputRef = useRef(null);
  const reelCommentInputRef = useRef(null);

  const handlePostComment = () => {
    const text = commentDraft.trim();
    if (!text) return;
    setReels((prev) =>
      prev.map((r, i) =>
        i === openReelIndex
          ? { ...r, commentsList: [...(r.commentsList || []), { user: USER.username, text }] }
          : r
      )
    );
    setCommentDraft('');
  };

  const handlePostCommentSubmit = async () => {
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const handleChangePhotoClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.updateProfile(formData);
      await refreshUser();
      setProfileImage(`${MEDIA_BASE}${res.data.avatar}`);
      showToast('Profile photo updated.');
    } catch (err) {
      showToast('Could not update profile photo.');
    }
    e.target.value = '';
  };

  const handleOpenEditProfile = () => {
    setBioDraft(profileBio);
    setGenderDraft(profileGender);
    setWebsiteDraft(profileWebsite);
    setWebsiteLabelDraft(profileWebsiteLabel);
    setEditProfileOpen(true);
  };

  const handleSubmitEditProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('bio', bioDraft);
      formData.append('gender', genderDraft);
      formData.append('website', websiteDraft.trim());
      await api.updateProfile(formData);
      await refreshUser();
      setProfileBio(bioDraft);
      setProfileGender(genderDraft);
      setProfileWebsite(websiteDraft.trim());
      setProfileWebsiteLabel(websiteLabelDraft.trim());
      setEditProfileOpen(false);
      showToast('Profile updated.');
    } catch (err) {
      showToast('Could not update profile.');
    }
  };

  const handleDeletePost = () => {
    setPosts((prev) => prev.filter((_, i) => i !== openPostIndex));
    setConfirmDeletePostOpen(false);
    setPostOptionsOpen(false);
    setOpenPostIndex(null);
    showToast('Post deleted.');
  };

  const handleStartEditPost = () => {
    setPostCaptionDraft(posts[openPostIndex]?.caption || '');
    setEditingPostCaption(true);
    setPostOptionsOpen(false);
  };

  const handleSavePostCaption = () => {
    setPosts((prev) =>
      prev.map((p, i) => (i === openPostIndex ? { ...p, caption: postCaptionDraft } : p))
    );
    setEditingPostCaption(false);
    showToast('Description updated.');
  };

  const handleSharePost = async () => {
    const post = posts[openPostIndex];
    const shareUrl = `https://urbanvoice.app/post/${post?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'UrbanVoice Post', text: post?.caption, url: shareUrl });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard?.writeText(shareUrl);
      showToast('Link copied — share it anywhere.');
    }
    setPostOptionsOpen(false);
  };

  const handleCopyPostLink = async () => {
    const post = posts[openPostIndex];
    await navigator.clipboard?.writeText(`https://urbanvoice.app/post/${post?.id}`);
    showToast('Link copied to clipboard.');
    setPostOptionsOpen(false);
  };

  const handleDeleteReel = () => {
    setReels((prev) => prev.filter((_, i) => i !== openReelIndex));
    setConfirmDeleteOpen(false);
    setReelOptionsOpen(false);
    setOpenReelIndex(null);
    showToast('Reel deleted.');
  };

  const handleStartEdit = () => {
    setCaptionDraft(reels[openReelIndex]?.caption || '');
    setEditingCaption(true);
    setReelOptionsOpen(false);
  };

  const handleSaveCaption = () => {
    setReels((prev) =>
      prev.map((r, i) => (i === openReelIndex ? { ...r, caption: captionDraft } : r))
    );
    setEditingCaption(false);
    showToast('Description updated.');
  };

  const handleShareReel = async () => {
    const reel = reels[openReelIndex];
    const shareUrl = `https://urbanvoice.app/reel/${reel?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'UrbanVoice Reel', text: reel?.caption, url: shareUrl });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard?.writeText(shareUrl);
      showToast('Link copied — share it anywhere.');
    }
    setReelOptionsOpen(false);
  };

  const handleCopyLink = async () => {
    const reel = reels[openReelIndex];
    await navigator.clipboard?.writeText(`https://urbanvoice.app/reel/${reel?.id}`);
    showToast('Link copied to clipboard.');
    setReelOptionsOpen(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profileImage,
          profileBio,
          profileGender,
          profileWebsite,
          profileWebsiteLabel,
          posts,
          reels,
        })
      );
    } catch {
    }
  }, [profileImage, profileBio, profileGender, profileWebsite, profileWebsiteLabel, posts, reels]);

  const realBadgeCount = user?.badges?.length || 0;
  const earnedBadges = useMemo(() => {
    const allTiers = [...BADGES].reverse();
    const unlocked = allTiers.slice(0, realBadgeCount);
    if (realBadgeCount >= BADGES.length + 1 && isUnlocked(SUPREME)) unlocked.unshift(SUPREME);
    return unlocked;
  }, [realBadgeCount]);

  const visibleBadges = earnedBadges.slice(0, 5);

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-4 sm:px-8 py-6 sm:py-10">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-10 mb-8 text-center sm:text-left">
          <button
            onClick={() => profileImage && setAvatarViewOpen(true)}
            className={`w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full bg-gradient-to-tr from-signal to-volt p-[3px] shrink-0 ${profileImage ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt={USER.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[28px] font-semibold text-text-dark font-body">AB</span>
              )}
            </div>
          </button>

          <div className="flex-1 min-w-0 pt-2 w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4 flex-wrap">
              <h1 className="text-[22px] font-body font-normal text-text-dark">{USER.username}</h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: [
                    'drop-shadow(0 0 0px rgba(212,255,0,0.8))',
                    'drop-shadow(0 0 6px rgba(212,255,0,0.9))',
                    'drop-shadow(0 0 0px rgba(212,255,0,0.8))',
                  ],
                }}
                transition={{
                  opacity: { delay: 0.3, duration: 0.5, ease: 'easeOut' },
                  scale: { delay: 0.3, duration: 0.5, ease: 'easeOut' },
                  filter: { delay: 0.8, duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <Link to="/my-badges" className="block hover:scale-110 transition-transform">
                  <ShieldCheck size={18} className="text-volt" fill="currentColor" />
                </Link>
              </motion.div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 mb-4">
              <span className="text-[14px] font-body text-text-dark">
                <strong className="font-semibold">{posts.length + reels.length}</strong> posts
              </span>
              <button onClick={() => setFollowModal('followers')} className="text-[14px] font-body text-text-dark hover:underline">
                <strong className="font-semibold">{USER.followers}</strong> Subscribers
              </button>
              <button onClick={() => setFollowModal('following')} className="text-[14px] font-body text-text-dark hover:underline">
                <strong className="font-semibold">{USER.following}</strong> Subscriptions
              </button>
            </div>

                        <div className="text-[14px] font-body leading-relaxed mb-5 max-w-[420px] mx-auto sm:mx-0">
              <p className="text-text-dark-muted text-[13px]">{USER.role}</p>
              <p className="font-semibold text-text-dark mt-0.5">{USER.fullName}</p>
              <p className="text-text-dark-muted mt-1.5">{profileBio}</p>

              <div className="flex flex-col gap-1 mt-2">
  {profileWebsite && (
    <a
      href={/^https?:\/\//i.test(profileWebsite) ? profileWebsite : `https://${profileWebsite}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 font-semibold hover:underline truncate w-fit"
    >
      {profileWebsiteLabel || profileWebsite}
    </a>
  )}
  <p className="text-blue-500 font-semibold">@{USER.thread}</p>
</div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2.5 w-full">
              <button
                onClick={handleOpenEditProfile}
                className="px-6 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-[13.5px] font-semibold font-body text-text-dark transition-colors"
              >
                Edit profile
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[12.5px] font-semibold font-body text-text-dark-muted uppercase tracking-wide mb-3 px-1">
            Badges earned · {earnedBadges.length}
          </p>

          {earnedBadges.length === 0 ? (
            <p className="text-[13px] font-body text-text-dark-muted px-1">No badges earned yet.</p>
          ) : (
            <div className="relative">
              <div className="flex items-start gap-5 justify-center sm:justify-start flex-wrap">
                {visibleBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.level}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.4, ease: 'easeOut' }}
                    >
                      <Link
                        to="/my-badges"
                        className="flex flex-col items-center gap-1.5 w-16 shrink-0 group"
                      >
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.colors.disc} flex items-center justify-center border-2 border-ink-950 group-hover:scale-105 transition-transform`}
                        >
                          <Icon size={24} className="text-ink-950" strokeWidth={2.2} />
                        </div>
                        <span className="text-[11px] text-text-dark-muted font-body truncate w-full text-center group-hover:text-text-dark transition-colors">
                          {badge.title}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                {earnedBadges.length > 5 && (
                  <div className="relative flex flex-col items-center gap-1.5 w-16 shrink-0">
                    <div className="absolute -left-14 top-0 w-14 h-16 bg-gradient-to-r from-transparent to-ink-950 backdrop-blur-[2px] pointer-events-none" />
                    <button
                      onClick={() => setBadgesModalOpen(true)}
                      className="w-16 h-16 rounded-full border border-ink-700 bg-ink-900 flex items-center justify-center text-[11px] font-semibold font-body text-text-dark-muted hover:text-text-dark hover:border-ink-600 transition-colors"
                    >
                      +{earnedBadges.length - 5}
                    </button>
                    <button
                      onClick={() => setBadgesModalOpen(true)}
                      className="text-[11px] font-semibold font-body text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      View all
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
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
              <span className="text-[11px] font-semibold font-body tracking-wide uppercase">
                {tab.label}
              </span>
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
                  onClick={() => { setOpenPostIndex(i); setPostLiked(false); setPostSaved(false); }}
                  className="aspect-square bg-ink-800 cursor-pointer hover:brightness-110 transition-all overflow-hidden"
                >
                  {p.mediaUrl && (
                    <img src={`${MEDIA_BASE}${p.mediaUrl}`} alt="" className="w-full h-full object-cover" />
                  )}
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
                className="group relative aspect-[9/16] bg-ink-800 cursor-pointer overflow-hidden"
              >
                {r.mediaUrl && (
                  <video
                    src={`${MEDIA_BASE}${r.mediaUrl}#t=0.1`}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}
                <Clapperboard size={14} className="absolute top-2 left-2 text-text-dark/80 z-10" />

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
                onClick={(e) => { e.stopPropagation(); setOpenReelIndex((i) => i - 1); setEditingCaption(false); }}
                aria-label="Previous reel"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 border border-ink-700 flex items-center justify-center text-text-dark hover:bg-ink-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {openReelIndex < reels.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenReelIndex((i) => i + 1); setEditingCaption(false); }}
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
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-ink-800 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt={USER.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-semibold text-text-dark font-body">AB</span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-semibold font-body text-text-dark truncate">{USER.username}</span>
                        <ShieldCheck size={13} className="text-volt shrink-0" fill="currentColor" />
                      </div>
                      <p className="text-[11.5px] font-body text-text-dark-muted truncate">{reels[openReelIndex].location}</p>
                    </div>
                  </div>
                  <button
                    aria-label="More options"
                    className="shrink-0"
                    onClick={() => setReelOptionsOpen(true)}
                  >
                    <MoreHorizontal size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {editingCaption ? (
                    <div>
                      <textarea
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value.slice(0, 2200))}
                        rows={4}
                        autoFocus
                        className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-[#f5d576]/40 resize-none"
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingCaption(false)}
                          className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold font-body text-text-dark-muted hover:text-text-dark transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCaption}
                          className="px-3.5 py-1.5 rounded-lg bg-[#f5d576] hover:bg-[#e8c65e] text-ink-950 text-[12.5px] font-semibold font-body transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13.5px] font-body text-text-dark leading-relaxed">
                      <span className="font-semibold">{USER.username}</span>{' '}
                      <span className="text-text-dark-muted">{reels[openReelIndex].caption}</span>
                    </p>
                  )}

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
                        <Heart size={22} className={reels[openReelIndex].likes?.includes(user._id) ? 'text-signal fill-signal' : 'text-text-dark'} />
                      </button>
                      <button
                        aria-label="Comment"
                        onClick={() => reelCommentInputRef.current?.focus({ preventScroll: false })}
                      >
                        <MessageCircle size={22} className="text-text-dark" />
                      </button>
                      <button aria-label="Share" onClick={handleShareReel}>
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
                      onKeyDown={(e) => { if (e.key === 'Enter') handleReelCommentSend(); }}
                      placeholder="Add a Citizen Note..."
                      className="flex-1 bg-transparent text-[13px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
                    />
                    <button
                      onClick={handleReelCommentSend}
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
                onClick={(e) => { e.stopPropagation(); setOpenPostIndex((i) => i - 1); setPostLiked(false); setPostSaved(false); }}
                aria-label="Previous post"
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 border border-ink-700 flex items-center justify-center text-text-dark hover:bg-ink-800 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {openPostIndex < posts.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setOpenPostIndex((i) => i + 1); setPostLiked(false); setPostSaved(false); }}
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
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-ink-800 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt={USER.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-semibold text-text-dark font-body">AB</span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-semibold font-body text-text-dark truncate">{USER.username}</span>
                        <ShieldCheck size={13} className="text-volt shrink-0" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <button
                    aria-label="More options"
                    className="shrink-0"
                    onClick={() => setPostOptionsOpen(true)}
                  >
                    <MoreHorizontal size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {editingPostCaption ? (
                    <div>
                      <textarea
                        value={postCaptionDraft}
                        onChange={(e) => setPostCaptionDraft(e.target.value.slice(0, 2200))}
                        rows={4}
                        autoFocus
                        className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-[#f5d576]/40 resize-none"
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingPostCaption(false)}
                          className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold font-body text-text-dark-muted hover:text-text-dark transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePostCaption}
                          className="px-3.5 py-1.5 rounded-lg bg-[#f5d576] hover:bg-[#e8c65e] text-ink-950 text-[12.5px] font-semibold font-body transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13.5px] font-body text-text-dark leading-relaxed">
                      <span className="font-semibold">{USER.username}</span>{' '}
                      <span className="text-text-dark-muted">{posts[openPostIndex].caption}</span>
                    </p>
                  )}

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
                        <Heart size={22} className={posts[openPostIndex].likes?.includes(user._id) ? 'text-signal fill-signal' : 'text-text-dark'} />
                      </button>
                      <button
                        aria-label="Comment"
                        onClick={() => postCommentInputRef.current?.focus({ preventScroll: false })}
                      >
                        <MessageCircle size={22} className="text-text-dark" />
                      </button>
                      <button aria-label="Share" onClick={handleSharePost}>
                        <Send size={20} className="text-text-dark" />
                      </button>
                    </div>
                    <button onClick={handlePostSaveToggle} aria-label="Save">
                      <Bookmark size={20} className={user?.savedIssues?.some((id) => (id?._id || id) === posts[openPostIndex]._id) ? 'text-text-dark fill-text-dark' : 'text-text-dark'} />
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

      <AnimatePresence>
        {postOptionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPostOptionsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] rounded-2xl bg-ink-900 border border-ink-700 overflow-hidden"
            >
              <button
                onClick={() => { setPostOptionsOpen(false); setConfirmDeletePostOpen(true); }}
                className="w-full text-center py-3.5 text-[14.5px] font-semibold font-body text-signal border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleStartEditPost}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleSharePost}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Share to...
              </button>
              <button
                onClick={handleCopyPostLink}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Copy link
              </button>
              <button
                onClick={() => setPostOptionsOpen(false)}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark-muted hover:bg-ink-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeletePostOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDeletePostOpen(false)}
            className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] rounded-2xl bg-ink-900 border border-ink-700 overflow-hidden text-center"
            >
              <div className="px-6 pt-6 pb-5">
                <p className="text-[15px] font-semibold font-body text-text-dark mb-1.5">Delete post?</p>
                <p className="text-[13px] font-body text-text-dark-muted leading-relaxed">
                  This can't be undone. The post will be permanently removed from your profile.
                </p>
              </div>
              <button
                onClick={handleDeletePost}
                className="w-full text-center py-3.5 text-[14.5px] font-semibold font-body text-signal border-t border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDeletePostOpen(false)}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark-muted border-t border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reelOptionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReelOptionsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] rounded-2xl bg-ink-900 border border-ink-700 overflow-hidden"
            >
              <button
                onClick={() => { setReelOptionsOpen(false); setConfirmDeleteOpen(true); }}
                className="w-full text-center py-3.5 text-[14.5px] font-semibold font-body text-signal border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleStartEdit}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleShareReel}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Share to...
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark border-b border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Copy link
              </button>
              <button
                onClick={() => setReelOptionsOpen(false)}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark-muted hover:bg-ink-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDeleteOpen(false)}
            className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] rounded-2xl bg-ink-900 border border-ink-700 overflow-hidden text-center"
            >
              <div className="px-6 pt-6 pb-5">
                <p className="text-[15px] font-semibold font-body text-text-dark mb-1.5">Delete reel?</p>
                <p className="text-[13px] font-body text-text-dark-muted leading-relaxed">
                  This can't be undone. The reel will be permanently removed from your profile.
                </p>
              </div>
              <button
                onClick={handleDeleteReel}
                className="w-full text-center py-3.5 text-[14.5px] font-semibold font-body text-signal border-t border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="w-full text-center py-3.5 text-[14.5px] font-body text-text-dark-muted border-t border-ink-800 hover:bg-ink-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {avatarViewOpen && profileImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAvatarViewOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center px-6"
          >
            <button
              onClick={() => setAvatarViewOpen(false)}
              aria-label="Close"
              className="absolute top-5 right-6 text-text-dark hover:text-text-dark-muted transition-colors"
            >
              <X size={26} />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              src={profileImage}
              alt={USER.username}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editProfileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditProfileOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[520px] max-h-[85vh] rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 shrink-0">
                <h2 className="text-[16px] font-display font-bold text-text-dark">Edit profile</h2>
                <button onClick={() => setEditProfileOpen(false)} aria-label="Close">
                  <X size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-signal to-volt p-[2px] shrink-0">
                      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt={USER.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[14px] font-semibold text-text-dark font-body">AB</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold font-body text-text-dark">{USER.username}</p>
                      <p className="text-[12.5px] font-body text-text-dark-muted">{USER.fullName}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePhotoClick}
                    className="px-4 py-1.5 rounded-lg bg-[#f5d576]/15 hover:bg-[#f5d576]/25 text-[13px] font-semibold font-body text-[#f5d576] transition-colors"
                  >
                    Change photo
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-[13px] font-semibold font-body text-text-dark mb-2">Bio</p>
                  <textarea
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value.slice(0, 150))}
                    rows={3}
                    className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-[#f5d576]/40 resize-none"
                  />
                  <p className="text-right text-[11px] font-body text-text-dark-muted mt-1">{bioDraft.length} / 150</p>
                </div>

                <div className="mb-6">
                  <p className="text-[13px] font-semibold font-body text-text-dark mb-2">Website</p>
                  <input
                    type="text"
                    value={websiteDraft}
                    onChange={(e) => setWebsiteDraft(e.target.value)}
                    placeholder="Website"
                    className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2.5 text-[13.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-[#f5d576]/40"
                  />
                </div>

                {websiteDraft.trim() && (
                  <div className="mb-6">
                    <p className="text-[13px] font-semibold font-body text-text-dark mb-2">Display name for link</p>
                    <input
                      type="text"
                      value={websiteLabelDraft}
                      onChange={(e) => setWebsiteLabelDraft(e.target.value.slice(0, 30))}
                      placeholder="e.g. My Portfolio"
                      className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2.5 text-[13.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-[#f5d576]/40"
                    />
                    <p className="text-[11px] font-body text-text-dark-muted mt-1.5">
                      Instead of showing the full link, this name will appear on your profile and open your website when clicked.
                    </p>
                  </div>
                )}

                <div className="mb-2">
                  <p className="text-[13px] font-semibold font-body text-text-dark mb-2">Gender</p>
                  <select
                    value={genderDraft}
                    onChange={(e) => setGenderDraft(e.target.value)}
                    className="w-full bg-ink-950 border border-ink-700 rounded-lg px-3 py-2.5 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-[#f5d576]/40"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <p className="text-[11px] font-body text-text-dark-muted mt-1.5">This won't be part of your public profile.</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-ink-800 shrink-0">
                <button
                  onClick={handleSubmitEditProfile}
                  className="w-full py-2.5 rounded-lg bg-[#f5d576] hover:bg-[#e8c65e] text-ink-950 text-[13.5px] font-semibold font-body transition-colors"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {badgesModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBadgesModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[560px] max-h-[80vh] rounded-2xl border border-ink-700 bg-ink-900 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#f5d576]" />
                  <h2 className="text-[16px] font-display font-bold text-text-dark">
                    Badges earned · {earnedBadges.length}
                  </h2>
                </div>
                <button onClick={() => setBadgesModalOpen(false)} aria-label="Close">
                  <X size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
                {earnedBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <Link
                      key={badge.level}
                      to="/my-badges"
                      onClick={() => setBadgesModalOpen(false)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.colors.disc} flex items-center justify-center border-2 border-ink-950 group-hover:scale-105 transition-transform`}
                      >
                        <Icon size={24} className="text-ink-950" strokeWidth={2.2} />
                      </div>
                      <span className="text-[11px] text-text-dark-muted font-body text-center leading-snug group-hover:text-text-dark transition-colors">
                        {badge.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FollowListModal
        open={!!followModal}
        onClose={() => setFollowModal(null)}
        username={USER.username}
        type={followModal}
      />
    </div>
  );
}