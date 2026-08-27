import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3x3, Clapperboard, ShieldCheck, Heart, Share2, Eye } from 'lucide-react';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FollowListModal from '../../components/FollowListModal';

const MEDIA_BASE = 'http://localhost:5000';

const TABS = [
  { id: 'reels', icon: Clapperboard, label: 'Reels' },
  { id: 'posts', icon: Grid3x3, label: 'Posts' },
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
      <div className="min-h-screen ml-[76px] bg-ink-950 flex items-center justify-center">
        <p className="text-text-dark-muted font-body">Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen ml-[76px] bg-ink-950 flex items-center justify-center">
        <p className="text-text-dark-muted font-body">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950 px-8 py-10">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-start gap-10 mb-8">
          <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-tr from-signal to-volt p-[3px] shrink-0">
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

          <div className="flex-1 min-w-0 pt-2">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <h1 className="text-[22px] font-body font-normal text-text-dark">{profile.username}</h1>
              {profile.badges?.length > 0 && <ShieldCheck size={18} className="text-volt" fill="currentColor" />}
            </div>

            <div className="flex items-center gap-8 mb-4">
              <span className="text-[14px] font-body text-text-dark">
                <strong className="font-semibold">{posts.length + reels.length}</strong> posts
              </span>
              <button onClick={() => setFollowModal('followers')} className="text-[14px] font-body text-text-dark hover:underline">
                <strong className="font-semibold">{profile.followers?.length || 0}</strong> followers
              </button>
              <button onClick={() => setFollowModal('following')} className="text-[14px] font-body text-text-dark hover:underline">
                <strong className="font-semibold">{profile.following?.length || 0}</strong> following
              </button>
            </div>

            <div className="text-[14px] font-body leading-relaxed mb-5 max-w-[420px]">
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

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleFollowToggle}
                disabled={followBusy}
                className={`px-6 py-1.5 rounded-lg text-[13.5px] font-semibold font-body transition-colors disabled:opacity-60 ${
                  isFollowing ? 'bg-ink-800 hover:bg-ink-700 text-text-dark' : 'bg-volt hover:bg-volt-dim text-ink-950'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
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
                Message
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-16 border-t border-ink-800 mb-1">
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
                  className="aspect-square bg-ink-800 overflow-hidden"
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
                className="group relative aspect-[9/16] bg-ink-800 overflow-hidden"
              >
                <Clapperboard size={14} className="absolute top-2 left-2 text-text-dark/80 z-10" />
                {r.mediaUrl && (
                  <img 
                    src={`${MEDIA_BASE}${r.mediaUrl}`} 
                    alt="" 
                    className="w-full h-full object-cover" 
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

      <FollowListModal
        open={!!followModal}
        onClose={() => setFollowModal(null)}
        username={username}
        type={followModal}
      />
    </div>
  );
}