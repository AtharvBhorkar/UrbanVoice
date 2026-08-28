import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Volume2, VolumeX, Play, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CommentsModal from '../../components/CommentsModal';

const MEDIA_BASE = 'http://localhost:5000';

function ReelItem({ item, currentUserId, onToggleLike, onOpenComments, commentBump, onShare }) {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [viewRegistered, setViewRegistered] = useState(false);
  const [shareCount, setShareCount] = useState(item.shares || 0);
  const [hasShared, setHasShared] = useState(false);
  const [sharing, setSharing] = useState(false);
  const videoRef = useRef(null);

  const liked = item.likes?.includes(currentUserId);
  const likeCount = item.likes?.length || 0;

  const handleShareClick = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const res = await api.addShare(item._id).catch(() => null);
      if (res) {
        setShareCount(res.data.shares);
        setHasShared(true);
      }

      const shareUrl = `${window.location.origin}/reels`;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'UrbanVoice Reel', text: item.caption, url: shareUrl });
        } catch {
          // user cancelled the native share sheet — no error toast needed
        }
      } else {
        await navigator.clipboard?.writeText(shareUrl);
        onShare?.('Link copied — share it anywhere.');
      }
    } finally {
      setSharing(false);
    }
  };
  const videoUrl = item.mediaUrl ? `${MEDIA_BASE}${item.mediaUrl}` : null;

  useEffect(() => {
    api.getComments(item._id)
      .then((res) => setCommentCount(res.data.length))
      .catch(() => setCommentCount(0));
  }, [item._id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying((v) => !v);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  // Register a view once, when the reel has played a bit
  const handleTimeUpdate = () => {
    if (!viewRegistered && videoRef.current && videoRef.current.currentTime > 3) {
      setViewRegistered(true);
      api.addView(item._id).catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-screen snap-start flex items-center justify-center bg-black">
      <div className="relative w-[420px] h-[94vh] max-h-[880px] rounded-2xl overflow-hidden bg-ink-900">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={muted}
          playsInline
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover cursor-pointer"
        />

        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-ink-950/60 flex items-center justify-center z-20"
          >
            <Play size={26} className="text-text-dark fill-text-dark ml-1" />
          </button>
        )}

        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-ink-950/60 flex items-center justify-center text-text-dark z-20"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

        <div className="absolute left-4 right-16 bottom-8 text-text-dark z-10">
          <button
            onClick={() => navigate(`/profile/${item.user?.username}`)}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px]">
              <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                {item.user?.avatar ? (
                  <img src={`${MEDIA_BASE}${item.user.avatar}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-semibold font-body">
                    {item.user?.username?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[13.5px] font-semibold font-body hover:underline">{item.user?.username}</span>
          </button>
          <div className="flex items-center gap-1 text-[12px] text-text-dark-muted font-body mb-1.5">
            <MapPin size={11} />
            {item.location}
          </div>
          <p className="text-[13.5px] font-body leading-relaxed">{item.caption}</p>
        </div>
      </div>

      <div className="absolute right-[calc(50%-198px)] bottom-8 flex flex-col items-center gap-5 z-20">
        <button onClick={() => onToggleLike(item._id)} className="flex flex-col items-center gap-1">
          <Heart size={26} className={liked ? 'text-signal fill-signal' : 'text-text-dark'} />
          <span className="text-[11px] font-body text-text-dark-muted">{likeCount}</span>
        </button>
        <button onClick={() => onOpenComments(item._id)} className="flex flex-col items-center gap-1">
          <MessageCircle size={26} className="text-text-dark" />
          <span className="text-[11px] font-body text-text-dark-muted">{commentCount + (commentBump || 0)}</span>
        </button>
        <button onClick={handleShareClick} disabled={sharing} className="flex flex-col items-center gap-1">
          <Send size={22} className="text-text-dark" />
          <span className="text-[11px] font-body text-text-dark-muted">{shareCount}</span>
        </button>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const { user } = useAuth();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsOpenFor, setCommentsOpenFor] = useState(null);
  const [commentBumps, setCommentBumps] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  useEffect(() => {
    api.getComplaints('reel')
      .then((res) => setReels(res.data))
      .catch((err) => console.error('Failed to load reels', err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleLike = async (id) => {
    try {
      await api.toggleLike(id);
      setReels((prev) =>
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
      console.error('Like failed', err);
    }
  };

  if (loading) {
    return (
      <div className="ml-[76px] h-screen flex items-center justify-center bg-black">
        <p className="text-text-dark-muted font-body">Loading reels...</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="ml-[76px] h-screen flex items-center justify-center bg-black">
        <p className="text-text-dark-muted font-body">No reels yet. Be the first to post one!</p>
      </div>
    );
  }

  return (
    <div className="ml-[76px] h-screen overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide">
      {reels.map((item) => (
        <ReelItem
          key={item._id}
          item={item}
          currentUserId={user?._id}
          onToggleLike={handleToggleLike}
          onOpenComments={setCommentsOpenFor}
          commentBump={commentBumps[item._id]}
          onShare={showToast}
        />
      ))}

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
    </div>
  );
}