import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import reel1 from '../../assets/reel1.mp4';
import {
  Heart, MessageCircle, Send, Volume2, VolumeX,  MapPin, Building2, Home as HomeIcon, MoreHorizontal, Play,
  Flag, EyeOff, Share2, Link2, Check, Crown, Shield, Rocket,} from 'lucide-react';

const LEADERS = [
  { rank: 1, name: 'dharampeth_diaries', ring: 'from-volt to-rose-400' },
  { rank: 2, name: 'sitabuldi_speaks', ring: 'from-signal to-volt' },
  { rank: 3, name: 'lift_watch_towerb', ring: 'from-volt to-emerald-400' },
  { rank: 4, name: 'greenpark_rwa', ring: 'from-volt to-signal' },
  { rank: 5, name: 'ananya_r', ring: 'from-signal to-volt' },
];

const RANK_MEDALS = {
  1: { Icon: Crown, disc: 'from-[#fff6da] via-[#f5d576] to-[#b8860b]' },
  2: { Icon: Shield, disc: 'from-[#f6f6fa] via-[#cfcfd9] to-[#8f8f9c]' },
  3: { Icon: Rocket, disc: 'from-[#f3caa0] via-[#e0a458] to-[#8b5a24]' },
};

const FEED_ITEMS = [
    {
    type: 'post',
    user: 'ananya_r',
    category: 'Civic',
    location: 'Nandanvan, Nagpur',
    time: '2h',
    caption: 'This road in Nandanvan has been full of potholes for weeks — barely passable after the rain, someone\u2019s going to get hurt.',
    likes: 142,
    comments: 18,
    tone: 'from-signal/30 to-ink-900',
    icon: Building2,
    image: 'https://i.ibb.co/KpQ67GMN/Chat-GPT-Image-Aug-24-2026-01-46-06-AM.png',
  },
  {
    type: 'reel',
    user: 'lift_watch_towerb',
    category: 'Society',
    location: 'Lake View Apartments',
    time: '5h',
    caption: 'Lift in Tower B down again. Third time this month.',
    likes: 356,
    comments: 47,
    tone: 'from-volt/25 to-ink-900',
    icon: HomeIcon,
    video: reel1,
  },
  {
    type: 'post',
    user: 'ward5_watch',
    category: 'Civic',
    location: 'Ram Nagar Crossing',
    time: '9h',
    caption: 'Waterlogging every monsoon at this crossing. Attaching photos from this morning.',
    likes: 89,
    comments: 11,
    tone: 'from-signal/25 to-ink-900',
    icon: Building2,
  },
  {
    type: 'reel',
    user: 'greenpark_rwa',
    category: 'Society',
    location: 'Green Park Society',
    time: '1d',
    caption: 'Garbage collection missed for the third day running — video from the back gate.',
    likes: 210,
    comments: 29,
    tone: 'from-volt/20 to-ink-900',
    icon: HomeIcon,
  },
];

const TOP_REPORTERS = [
  { name: 'ananya_r', sub: 'Followed by ward12_civic', avatar: 'AR' },
  { name: 'lift_watch_towerb', sub: 'Suggested for you', avatar: 'LW' },
  { name: 'ward5_watch', sub: 'Followed by nagpur_roads', avatar: 'W5' },
  { name: 'greenpark_rwa', sub: 'Followed by sunrise_apts', avatar: 'GP' },
  { name: 'municipal_ward5', sub: 'Suggested for you', avatar: 'M5' },
];

function PostOptionsMenu({ onReport, onNotInterested, onShare, onCopyLink }) {  const [open, setOpen] = useState(false);
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

function FeedCard({ item, showToast }) {  
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hidden, setHidden] = useState(false);
  const videoRef = useRef(null);
  const Icon = item.icon;

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

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px]">
            <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-text-dark font-body">
                {item.user.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-semibold font-body text-text-dark">{item.user}</span>
              <span className="text-text-dark-muted">·</span>
              <span className="text-[12.5px] text-text-dark-muted font-body">{item.time}</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-text-dark-muted font-body">
              <MapPin size={11} />
              {item.location}
            </div>
          </div>
        </div>
        <PostOptionsMenu
          onReport={() => alert(`${item.user}'s post has been reported. Our team will review it.`)}
          onNotInterested={() => setHidden(true)}
          onShare={async () => {
            const shareUrl = `https://urbanvoice.app/post/${item.user}`;
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
            await navigator.clipboard?.writeText(`https://urbanvoice.app/post/${item.user}`);
            showToast('Link copied to clipboard.');
          }}
        />
      </div>

      <div className={`relative aspect-square ${item.image || item.video ? 'bg-ink-800' : `bg-gradient-to-br ${item.tone}`} flex items-center justify-center overflow-hidden`}>
        {item.video ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={muted}
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          >
            <source src={item.video} type="video/mp4" />
          </video>
        ) : item.image ? (
          <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
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
          <button onClick={() => setLiked((v) => !v)}>
            <Heart
              size={22}
              className={liked ? 'text-signal fill-signal' : 'text-text-dark'}
            />
          </button>
          <button><MessageCircle size={22} className="text-text-dark" /></button>
          <button><Send size={20} className="text-text-dark" /></button>
        </div>
      </div>

      <div className="px-4 pt-2 pb-4">
        <p className="text-[13.5px] font-semibold font-body text-text-dark">
          {liked ? item.likes + 1 : item.likes} likes
        </p>
        <p className="text-[13.5px] font-body text-text-dark mt-1 leading-relaxed">
          <span className="font-semibold">{item.user}</span>{' '}
          <span className="text-text-dark-muted">{item.caption}</span>
        </p>
        <p className="text-[12.5px] font-body text-text-dark-muted mt-1">
          View all {item.comments} comments
        </p>
      </div>
    </div>
  );
}

export default function HomeFeedPage() {
  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950">
      <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

        <div>
          <div className="flex items-start gap-4 overflow-x-auto pb-5 mb-2 scrollbar-hide">
            {[LEADERS[3], LEADERS[1], LEADERS[0], LEADERS[2], LEADERS[4]].map((s) => (
              <StoryRing key={s.rank} {...s} />
            ))}
          </div>

          <div className="flex flex-col gap-6 max-w-[500px] mx-auto lg:mx-0">
            {FEED_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FeedCard item={item} showToast={showToast} />              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block pt-2 sticky top-6 self-start h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-volt/20 border border-volt/40 flex items-center justify-center">
              <span className="text-volt text-[12px] font-bold font-body">AB</span>
            </div>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold font-body text-text-dark">atharv_b</p>
              <p className="text-[12.5px] text-text-dark-muted font-body">Atharv Bhorkar</p>
            </div>
            <button className="text-[12.5px] font-semibold font-body text-signal">Switch</button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold font-body text-text-dark-muted">Top reporters</p>
            <button className="text-[12px] font-semibold font-body text-text-dark">See all</button>
          </div>

          <div className="flex flex-col gap-3.5">
            {TOP_REPORTERS.map((r, i) => (
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
                <button className="text-[12.5px] font-semibold font-body text-signal shrink-0">Follow</button>
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
    </div>
  );
}