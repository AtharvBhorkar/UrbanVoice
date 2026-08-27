import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Heart, MessageCircle, Share2, Users, Eye,
  MapPin, Sparkles, Play, Info, X, Shield, Rocket, TrendingUp,
} from 'lucide-react';
import { useEffect } from 'react';
import * as api from '../../services/api';

const MEDIA_BASE = 'http://localhost:5000';
const RINGS = [
  'from-volt to-rose-400', 'from-signal to-volt', 'from-volt to-emerald-400',
  'from-volt to-signal', 'from-signal to-volt', 'from-emerald-400 to-volt',
];

function fmt(n) {
  if (n === undefined || n === null) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

const MEDALS = {
  1: {
    title: 'Civic Crown',
    Icon: Crown,
    disc: 'from-[#fff6da] via-[#f5d576] to-[#b8860b]',
    ribbon: 'from-[#f5d576] to-[#b8860b]',
    glow: 'rgba(245,213,118,0.6)',
    chipBg: 'bg-[#f5d576]/10',
    chipBorder: 'border-[#f5d576]/35',
    chipText: 'text-[#f5d576]',
  },
  2: {
    title: 'Ward Champion',
    Icon: Shield,
    disc: 'from-[#f6f6fa] via-[#cfcfd9] to-[#8f8f9c]',
    ribbon: 'from-[#cfcfd9] to-[#8f8f9c]',
    glow: 'rgba(207,207,217,0.55)',
    chipBg: 'bg-[#cfcfd9]/10',
    chipBorder: 'border-[#cfcfd9]/30',
    chipText: 'text-[#d9d9e3]',
  },
  3: {
    title: 'Rising Voice',
    Icon: Rocket,
    disc: 'from-[#f3caa0] via-[#e0a458] to-[#8b5a24]',
    ribbon: 'from-[#e0a458] to-[#8b5a24]',
    glow: 'rgba(224,164,88,0.55)',
    chipBg: 'bg-[#e0a458]/10',
    chipBorder: 'border-[#e0a458]/35',
    chipText: 'text-[#e0a458]',
  },
};

function MedalDisc({ rank, discSize = 30, iconSize = 14 }) {
  const medal = MEDALS[rank];
  if (!medal) return null;
  const { Icon } = medal;

  return (
    <div className="absolute -bottom-1 -right-1 z-20">
      {/* ribbon tails */}
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 flex gap-[3px] -z-10">
        <span
          className={`w-[6px] h-4 bg-gradient-to-b ${medal.ribbon}`}
          style={{ clipPath: 'polygon(0 0,100% 0,100% 65%,50% 100%,0 65%)', transform: 'rotate(-16deg)' }}
        />
        <span
          className={`w-[6px] h-4 bg-gradient-to-b ${medal.ribbon}`}
          style={{ clipPath: 'polygon(0 0,100% 0,100% 65%,50% 100%,0 65%)', transform: 'rotate(16deg)' }}
        />
      </div>

      {/* medal disc */}
      <motion.div
        animate={
          rank === 1
            ? {
                filter: [
                  `drop-shadow(0 0 2px ${medal.glow})`,
                  `drop-shadow(0 0 9px ${medal.glow})`,
                  `drop-shadow(0 0 2px ${medal.glow})`,
                ],
              }
            : undefined
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: discSize, height: discSize }}
        className={`rounded-full bg-gradient-to-br ${medal.disc} flex items-center justify-center border-[2.5px] border-ink-950 shadow-md`}
      >
        <Icon size={iconSize} className="text-ink-950" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}

function RoyalCard({ item, onClick, isSelected }) {
  const isFirst = item.rank === 1;
  const isPodium = item.rank <= 3;
  const Icon = item.icon;

  const crownColor =
    item.rank === 1 ? 'text-[#f5d576]' : item.rank === 2 ? 'text-[#d9d9e3]' : item.rank === 3 ? 'text-[#e0a458]' : 'text-text-dark-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.rank * 0.05, duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`relative shrink-0 flex flex-col items-center rounded-3xl border px-5 pt-8 pb-5 transition-transform cursor-pointer ${
        isSelected ? 'ring-2 ring-[#f5d576] ring-offset-2 ring-offset-ink-950' : ''
      } ${
        isFirst
          ? 'w-[210px] z-10 scale-110 border-[#f5d576]/50 bg-gradient-to-b from-[#3a3418]/60 via-ink-900 to-ink-900 shadow-[0_0_40px_-8px_rgba(245,213,118,0.35)]'
          : isPodium
          ? 'w-[180px] border-ink-700 bg-ink-900 shadow-lg'
          : 'w-[150px] border-ink-800 bg-ink-900/70 mt-6'
      }`}
    >
      {isFirst && (
        <motion.div
          className="absolute top-3 right-3"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.25, 0.9], rotate: [0, 15, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles
            size={18}
            fill="currentColor"
            className="text-[#f5d576] drop-shadow-[0_0_10px_rgba(245,213,118,0.9)]"
          />
        </motion.div>
      )}

      {isFirst ? (
        <motion.div
          className="absolute -top-1"
          animate={{ filter: [
            'drop-shadow(0 0 4px rgba(245,213,118,0.6))',
            'drop-shadow(0 0 14px rgba(245,213,118,1))',
            'drop-shadow(0 0 4px rgba(245,213,118,0.6))',
          ] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Crown size={30} strokeWidth={1.6} className={crownColor} fill="currentColor" />
        </motion.div>
      ) : (
        <Crown
          size={isPodium ? 22 : 16}
          strokeWidth={1.6}
          className={`absolute -top-1 ${crownColor} ${
            isPodium ? 'drop-shadow-[0_0_6px_rgba(245,213,118,0.5)]' : ''
          }`}
          fill={item.rank <= 3 ? 'currentColor' : 'none'}
        />
      )}

      <div className="relative">
        <div
          className={`rounded-full bg-gradient-to-tr ${item.ring} p-[2px] ${
            isFirst ? 'w-20 h-20' : isPodium ? 'w-16 h-16' : 'w-12 h-12'
          }`}
        >
          <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className={`font-semibold text-text-dark font-body ${isFirst ? 'text-[15px]' : 'text-[11px]'}`}>
                {item.avatar}
              </span>
            )}
          </div>
        </div>
        <MedalDisc rank={item.rank} discSize={isFirst ? 32 : isPodium ? 26 : 0} iconSize={isFirst ? 15 : 12} />
      </div>

      {MEDALS[item.rank] ? (
        <span
          className={`mt-3 px-3 py-1 rounded-full border ${MEDALS[item.rank].chipBg} ${MEDALS[item.rank].chipBorder}`}
        >
          <span className={`text-[10.5px] font-bold font-body tracking-wide whitespace-nowrap ${MEDALS[item.rank].chipText}`}>
            {MEDALS[item.rank].title}
          </span>
        </span>
      ) : (
        <span className="mt-3 w-7 h-7 rounded-full flex items-center justify-center font-display font-bold bg-ink-800 text-text-dark-muted text-[11px]">
          {item.rank}
        </span>
      )}

      <p className={`mt-2 font-semibold font-body text-text-dark text-center truncate w-full ${isFirst ? 'text-[14px]' : 'text-[12.5px]'}`}>
        {item.user}
      </p>
      <div className="flex items-center gap-1 text-[11px] text-text-dark-muted font-body mt-0.5">
        <MapPin size={10} />
        <span className="truncate max-w-[120px]">{item.location}</span>
      </div>

    </motion.div>
  );
}

function ListRow({ item, index }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.4) }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-ink-800/50 transition-colors border-b border-ink-800 last:border-b-0"
    >
      <span className="w-7 text-[13px] font-display font-bold text-text-dark-muted text-center shrink-0">
        {item.rank}
      </span>

      <div className={`rounded-full bg-gradient-to-tr ${item.ring} p-[1.5px] shrink-0`}>
        <div className="w-9 h-9 rounded-full bg-ink-800 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-text-dark font-body">{item.avatar}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold font-body text-text-dark truncate">{item.user}</p>
        <div className="flex items-center gap-1 text-[11.5px] text-text-dark-muted font-body">
          <MapPin size={10} />
          <span className="truncate">{item.location}</span>
          <span>·</span>
          <span>{item.category}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3.5 text-text-dark-muted shrink-0">
        <span className="flex items-center gap-1 text-[11.5px] font-body"><Heart size={13} />{fmt(item.likes)}</span>
        <span className="flex items-center gap-1 text-[11.5px] font-body"><MessageCircle size={13} />{fmt(item.comments)}</span>
        <span className="flex items-center gap-1 text-[11.5px] font-body"><Share2 size={13} />{fmt(item.shares)}</span>
        <span className="flex items-center gap-1 text-[11.5px] font-body"><Users size={13} />{fmt(item.followers)}</span>
        <span className="flex items-center gap-1 text-[11.5px] font-body"><Eye size={13} />{fmt(item.views)}</span>
        <span className="flex items-center gap-1 text-[11.5px] font-semibold font-body text-[#f5d576]"><TrendingUp size={13} />{fmt(item.score)}</span>
      </div>

    </motion.div>
  );
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then((res) => {
        const mapped = res.data.map((u, i) => ({
          rank: u.rank,
          user: u.username,
          avatar: u.username.slice(0, 2).toUpperCase(),
          avatarUrl: u.avatar ? `${MEDIA_BASE}${u.avatar}` : null,
          ring: RINGS[i % RINGS.length],
          location: u.location || '',
          category: '',
          caption: `${u.fullName || u.username} has earned ${fmt(u.score)} points from ${fmt(u.totalLikes)} likes, ${fmt(u.totalComments)} comments and ${fmt(u.totalShares)} shares.`,
          likes: u.totalLikes,
          comments: u.totalComments,
          shares: u.totalShares,
          followers: u.followersCount,
          views: u.totalViews,
          score: u.score,
        }));
        setRanked(mapped);
      })
      .catch((err) => console.error('Failed to load leaderboard', err))
      .finally(() => setLoading(false));
  }, []);

  const tabsWithCounts = [
    { label: 'Top 10', count: 10 },
    { label: 'Top 20', count: 20 },
    { label: 'Top 30', count: 30 },
    { label: 'All', count: ranked.length },
  ];

  const top5 = ranked.slice(0, 5);
  const podiumOrder = [top5[3], top5[1], top5[0], top5[2], top5[4]].filter(Boolean);

  const visibleList = useMemo(() => ranked.slice(0, tabsWithCounts[activeTab].count), [activeTab, ranked]);

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950 px-8 py-8">
      <div className="max-w-[900px] mx-auto">

        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-[#f5d576]" fill="currentColor" />
            <h1 className="text-[24px] font-display font-bold text-text-dark">Community Leaderboard</h1>
          </div>
          <button
            onClick={() => setRulesOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-900 border border-ink-700 text-[12.5px] font-semibold font-body text-text-dark-muted hover:text-[#f5d576] hover:border-[#f5d576]/40 transition-colors shrink-0"
          >
            <Info size={14} />
            Rules
          </button>
        </div>
        <p className="text-[13.5px] font-body text-text-dark-muted mb-8">
          Ranked by likes, comments, shares, followers and views combined.
        </p>

        {/* ===== Royal Top 5 ===== */}
        <div className="-mx-40">
          <div className="flex items-end justify-center gap-8 overflow-x-auto pt-6 pb-4 mb-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {podiumOrder.map((item) => (
              <RoyalCard
                key={item.user}
                item={item}
                isSelected={selectedCard?.user === item.user}
                onClick={() => setSelectedCard(selectedCard?.user === item.user ? null : item)}
              />
            ))}
          </div>
        </div>

        {/* ===== Selected card detail panel ===== */}
        <AnimatePresence mode="wait">
          {selectedCard && (
            <motion.div
              key={selectedCard.user}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden mb-10"
            >
              <div className="rounded-2xl border border-[#f5d576]/30 bg-gradient-to-b from-[#2a2610]/40 to-ink-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full bg-gradient-to-tr ${selectedCard.ring} p-[2px] w-14 h-14 shrink-0`}>
                      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
                        <span className="text-[13px] font-semibold text-text-dark font-body">{selectedCard.avatar}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[15px] font-semibold font-body text-text-dark">{selectedCard.user}</p>
                        {MEDALS[selectedCard.rank] ? (
                          <span
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${MEDALS[selectedCard.rank].chipBg} ${MEDALS[selectedCard.rank].chipBorder}`}
                          >
                            {(() => {
                              const MedalIcon = MEDALS[selectedCard.rank].Icon;
                              return <MedalIcon size={11} className={MEDALS[selectedCard.rank].chipText} />;
                            })()}
                            <span className={`text-[11px] font-semibold font-body whitespace-nowrap ${MEDALS[selectedCard.rank].chipText}`}>
                              {MEDALS[selectedCard.rank].title}
                            </span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-ink-800 border border-ink-700 text-[11px] font-semibold font-body text-text-dark-muted">
                            Rank #{selectedCard.rank}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-text-dark-muted font-body mt-0.5">
                        <MapPin size={11} />
                        {selectedCard.location} · {selectedCard.category}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-[12px] font-semibold font-body text-text-dark-muted hover:text-text-dark transition-colors shrink-0"
                  >
                    Close
                  </button>
                </div>

                <p className="text-[13.5px] font-body text-text-dark-muted mt-4 leading-relaxed">
                  {selectedCard.caption}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-5">
                  {[
                    { label: 'Likes', value: selectedCard.likes, icon: Heart },
                    { label: 'Comments', value: selectedCard.comments, icon: MessageCircle },
                    { label: 'Shares', value: selectedCard.shares, icon: Share2 },
                    { label: 'Followers', value: selectedCard.followers, icon: Users },
                    { label: 'Views', value: selectedCard.views, icon: Eye },
                    { label: 'Points', value: selectedCard.score, icon: TrendingUp, highlight: true },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 ${
                        stat.highlight
                          ? 'bg-[#f5d576]/10 border-[#f5d576]/35'
                          : 'bg-ink-950/60 border-ink-800'
                      }`}
                    >
                      <stat.icon size={16} className="text-[#f5d576]" />
                      <span className={`text-[14px] font-display font-bold ${stat.highlight ? 'text-[#f5d576]' : 'text-text-dark'}`}>
                        {fmt(stat.value)}
                      </span>
                      <span className="text-[10.5px] font-body text-text-dark-muted">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => navigate(`/profile/${selectedCard.user}`)}
                    className="flex items-center justify-center gap-2 mt-5 px-6 py-2 rounded-full bg-[#f5d576] hover:bg-[#e8c65e] text-ink-950 text-[13px] font-semibold font-body transition-colors"
                  >
                    <Play size={14} fill="currentColor" />
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Tabs ===== */}
        <div className="flex items-center gap-2 mb-4">
          {tabsWithCounts.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold font-body transition-colors ${
                activeTab === i
                  ? 'bg-[#f5d576] text-ink-950'
                  : 'bg-ink-900 border border-ink-700 text-text-dark-muted hover:text-text-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== Ranked list ===== */}
        <div className="rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="px-2 py-2"
            >
              {loading && (
                <p className="text-center text-text-dark-muted font-body py-10">Loading leaderboard...</p>
              )}
              {!loading && visibleList.length === 0 && (
                <p className="text-center text-text-dark-muted font-body py-10">No activity yet. Be the first to earn points!</p>
              )}
              {!loading && visibleList.map((item, i) => (
                <ListRow key={item.user} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== Rules modal ===== */}
      <AnimatePresence>
        {rulesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRulesOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] rounded-2xl border border-[#f5d576]/30 bg-ink-900 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-[#f5d576]" fill="currentColor" />
                  <h2 className="text-[16px] font-display font-bold text-text-dark">Leaderboard Rules</h2>
                </div>
                <button onClick={() => setRulesOpen(false)} aria-label="Close">
                  <X size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                </button>
              </div>

              <p className="text-[13px] font-body text-text-dark-muted mb-4 leading-relaxed">
                Rank ek combined engagement score se decide hota hai, jisme har metric ka alag weight hai:
              </p>

              <div className="flex flex-col gap-2.5 mb-5">
                {[
                  { icon: Share2, label: 'Shares', weight: '×3', points: '3 pts', note: 'sabse zyada weight' },
                  { icon: MessageCircle, label: 'Comments', weight: '×2', points: '2 pts', note: 'high engagement signal' },
                  { icon: Heart, label: 'Likes', weight: '×1', points: '1 pt', note: 'base weight' },
                  { icon: Users, label: 'Followers', weight: '×0.4', points: '0.4 pt', note: 'reach ka indicator' },
                  { icon: Eye, label: 'Views', weight: '×0.05', points: '0.05 pt', note: 'high volume, low weight' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-ink-950/60 border border-ink-800">
                    <r.icon size={15} className="text-[#f5d576] shrink-0" />
                    <span className="text-[12.5px] font-semibold font-body text-text-dark w-20 shrink-0">{r.label}</span>
                    <span className="text-[12px] font-body text-text-dark-muted flex-1">{r.note}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10.5px] font-body text-text-dark-muted">per unit</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#f5d576]/10 border border-[#f5d576]/25 text-[11.5px] font-bold font-body text-[#f5d576]">
                        {r.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[12px] font-body text-text-dark-muted leading-relaxed">
                Top 5 ranks har roz naye engagement data ke saath refresh hote hain. Score jitna zyada, rank utna upar.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}