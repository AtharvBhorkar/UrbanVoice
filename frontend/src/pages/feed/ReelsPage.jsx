import { useState, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Send, Volume2, VolumeX, Play, MapPin } from 'lucide-react';
import reel1 from '../../assets/reel1.mp4';
import hero1 from '../../assets/hero1.mp4';
import section1 from '../../assets/section1.mp4';
import communityHero from '../../assets/community_hero.mp4';

const REELS = [
  {
    id: 1,
    user: 'lift_watch_towerb',
    location: 'Lake View Apartments',
    caption: 'Lift in Tower B down again. Third time this month.',
    likes: 356,
    comments: 47,
    video: reel1,
  },
  {
    id: 2,
    user: 'ward5_watch',
    location: 'Ram Nagar Crossing',
    caption: 'Waterlogging every monsoon at this crossing.',
    likes: 210,
    comments: 29,
    video: hero1,
  },
  {
    id: 3,
    user: 'greenpark_rwa',
    location: 'Green Park Society',
    caption: 'Garbage collection missed for the third day running.',
    likes: 189,
    comments: 22,
    video: section1,
  },
  {
    id: 4,
    user: 'nagpur_roads',
    location: 'Nandanvan, Nagpur',
    caption: 'Potholes everywhere after the rain — someone will get hurt.',
    likes: 412,
    comments: 63,
    video: communityHero,
  },
];

function ReelItem({ item }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);

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

  return (
    <div className="relative w-full h-screen snap-start flex items-center justify-center bg-black">
      <div className="relative w-[420px] h-[94vh] max-h-[880px] rounded-2xl overflow-hidden bg-ink-900">
        <video
          ref={videoRef}
          src={item.video}
          autoPlay
          loop
          muted={muted}
          playsInline
          onClick={togglePlay}
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
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px]">
              <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
                <span className="text-[10px] font-semibold font-body">
                  {item.user.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <span className="text-[13.5px] font-semibold font-body">{item.user}</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-text-dark-muted font-body mb-1.5">
            <MapPin size={11} />
            {item.location}
          </div>
          <p className="text-[13.5px] font-body leading-relaxed">{item.caption}</p>
        </div>

      </div>

      <div className="absolute right-[calc(50%-198px)] bottom-8 flex flex-col items-center gap-5 z-20">
        <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center gap-1">
          <Heart size={26} className={liked ? 'text-signal fill-signal' : 'text-text-dark'} />
          <span className="text-[11px] font-body text-text-dark-muted">
            {liked ? item.likes + 1 : item.likes}
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={26} className="text-text-dark" />
          <span className="text-[11px] font-body text-text-dark-muted">{item.comments}</span>
        </button>
        <button onClick={() => setSaved((v) => !v)}>
          <Bookmark size={24} className={saved ? 'text-volt fill-volt' : 'text-text-dark'} />
        </button>
        <button>
          <Send size={22} className="text-text-dark" />
        </button>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  return (
    <div className="ml-[76px] h-screen overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide">
      {REELS.map((item) => (
        <ReelItem key={item.id} item={item} />
      ))}
    </div>
  );
}