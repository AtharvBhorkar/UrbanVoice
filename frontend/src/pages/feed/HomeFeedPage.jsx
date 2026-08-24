import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import reel1 from '../../assets/reel1.mp4';
import {
  Heart, MessageCircle, Bookmark, Send, Volume2, VolumeX,
  MapPin, Building2, Home as HomeIcon, MoreHorizontal, Play,
} from 'lucide-react';

const STORIES = [
  { name: 'ward_12_civic', ring: 'from-signal to-volt' },
  { name: 'green_park_rwa', ring: 'from-volt to-emerald-400' },
  { name: 'nagpur_roads', ring: 'from-signal to-rose-400' },
  { name: 'lake_view_society', ring: 'from-volt to-signal' },
  { name: 'municipal_ward5', ring: 'from-emerald-400 to-volt' },
  { name: 'sunrise_apartments', ring: 'from-rose-400 to-signal' },
];

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

function StoryRing({ name, ring }) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 w-16">
      <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${ring} p-[2px]`}>
        <div className="w-full h-full rounded-full bg-ink-950 p-[2px]">
          <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-text-dark font-body">
              {name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <span className="text-[11px] text-text-dark-muted font-body truncate w-full text-center">
        {name}
      </span>
    </div>
  );
}

function FeedCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const Icon = item.icon;

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
        <MoreHorizontal size={18} className="text-text-dark-muted" />
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
        <button onClick={() => setSaved((v) => !v)}>
          <Bookmark size={20} className={saved ? 'text-volt fill-volt' : 'text-text-dark'} />
        </button>
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
  return (
    <div className="min-h-screen ml-[76px] bg-ink-950">
      <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

        <div>
          <div className="flex items-start gap-4 overflow-x-auto pb-5 mb-2 scrollbar-hide">
            {STORIES.map((s, i) => (
              <StoryRing key={i} {...s} />
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
                <FeedCard item={item} />
              </motion.div>
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

          <div className="mt-10 text-[11.5px] text-text-dark-muted font-body leading-relaxed">
            <p>About · Help · Privacy · Terms · Locations</p>
            <p className="mt-3">© 2026 UrbanVoice</p>
          </div>
        </div>
      </div>
    </div>
  );
}