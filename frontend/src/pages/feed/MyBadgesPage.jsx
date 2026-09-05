import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Lock, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import {
  BADGES, SUPREME, TIER_ORDER, isUnlocked, fmt,
} from '../../data/badges.js';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

function BadgeCard({ badge, index, currentPoints, hasPosted }) {
  const unlocked = isUnlocked(badge, currentPoints, hasPosted);
  const Icon = badge.icon;
  const progress = badge.special === 'post'
    ? (hasPosted ? 100 : 0)
    : Math.min(100, (currentPoints / badge.points) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.5) }}
      className={`relative rounded-2xl border p-4 flex flex-col items-center text-center transition-colors ${
        unlocked ? `border-ink-700 bg-ink-900 ${badge.colors ? `ring-1 ${badge.colors.ring}` : ''}` : 'border-ink-800 bg-ink-900/40'
      }`}
    >
      <span className="absolute top-2.5 left-2.5 text-[10px] font-display font-bold text-text-dark-muted">
        #{badge.level}
      </span>

      <div className="relative mb-2.5 mt-1">
        <div
          className={`w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center border-2 border-ink-950 ${
            unlocked ? badge.colors.disc : 'from-ink-800 to-ink-800'
          }`}
        >
          <Icon size={22} className={unlocked ? 'text-ink-950' : 'text-ink-700'} strokeWidth={2.2} />
        </div>
        {!unlocked && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-ink-950 border-2 border-ink-800 flex items-center justify-center">
            <Lock size={11} className="text-text-dark-muted" />
          </div>
        )}
        {unlocked && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-ink-950 border-2 border-emerald-400/60 flex items-center justify-center">
            <CheckCircle2 size={12} className="text-emerald-400" />
          </div>
        )}
      </div>

      <p className={`text-[12.5px] font-semibold font-body ${unlocked ? 'text-text-dark' : 'text-text-dark-muted'}`}>
        {badge.title}
      </p>

      <p className="text-[10.5px] font-body text-text-dark-muted mt-1 leading-snug min-h-[26px]">
        {badge.challenge || `Earn ${fmt(badge.points)} points`}
      </p>

      {badge.special !== 'post' && (
        <>
          <div className="w-full h-1.5 rounded-full bg-ink-800 mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${unlocked ? 'bg-emerald-400' : 'bg-[#f5d576]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-body text-text-dark-muted mt-1">
            {fmt(Math.min(currentPoints, badge.points))} / {fmt(badge.points)}
          </span>
        </>
      )}
    </motion.div>
  );
}

export default function MyBadgesPage() {
  const { user } = useAuth();
  const [hasPosted, setHasPosted] = useState(false);
  const currentPoints = user?.points || 0;

  useEffect(() => {
    if (!user?._id) return;
    api.getComplaintsByUser(user._id)
      .then((res) => setHasPosted((res.data?.length || 0) > 0))
      .catch(() => setHasPosted(false));
  }, [user?._id]);

  const unlockedCount = useMemo(
    () => BADGES.filter((b) => isUnlocked(b, currentPoints, hasPosted)).length,
    [currentPoints, hasPosted]
  );
  const supremeUnlocked = currentPoints >= SUPREME.points;
  const supremeProgress = Math.min(100, (currentPoints / SUPREME.points) * 100);

  const grouped = TIER_ORDER.map((tierName) => ({
    tierName,
    items: BADGES.filter((b) => b.tier === tierName),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-8 py-8">
      <div className="max-w-[1000px] mx-auto">

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-[#f5d576]" />
            <h1 className="text-[24px] font-display font-bold text-text-dark">My Badges</h1>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-900 border border-ink-700">
            <TrendingUp size={13} className="text-[#f5d576]" />
            <span className="text-[12.5px] font-semibold font-body text-[#f5d576]">{fmt(currentPoints)} points</span>
          </div>
        </div>
        <p className="text-[13.5px] font-body text-text-dark-muted mb-8">
          {unlockedCount} / 57 badges unlocked · Complete each challenge to unlock the next badge.
        </p>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-3xl p-6 mb-10 overflow-hidden border ${
            supremeUnlocked ? 'border-[#f5d576]/50' : 'border-ink-700'
          }`}
          style={{
            background: supremeUnlocked
              ? 'linear-gradient(135deg, rgba(245,213,118,0.15), rgba(255,92,124,0.1), rgba(91,157,255,0.12))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          }}
        >
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <motion.div
                animate={
                  supremeUnlocked
                    ? {
                        filter: [
                          'drop-shadow(0 0 6px rgba(245,213,118,0.5))',
                          'drop-shadow(0 0 22px rgba(245,213,118,0.9))',
                          'drop-shadow(0 0 6px rgba(245,213,118,0.5))',
                        ],
                      }
                    : undefined
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-ink-950 ${
                  supremeUnlocked
                    ? 'bg-gradient-to-br from-[#fff6da] via-[#f5d576] to-[#b8860b]'
                    : 'bg-gradient-to-br from-ink-800 to-ink-800'
                }`}
              >
                <Crown size={34} className={supremeUnlocked ? 'text-ink-950' : 'text-ink-700'} fill="currentColor" strokeWidth={1.5} />
              </motion.div>
              {!supremeUnlocked && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-ink-950 border-2 border-ink-800 flex items-center justify-center">
                  <Lock size={13} className="text-text-dark-muted" />
                </div>
              )}
              {supremeUnlocked && (
                <Sparkles size={16} className="absolute -top-1 -right-1 text-[#f5d576]" fill="currentColor" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[19px] font-display font-bold text-text-dark">Supreme Leader</p>
                <span className="px-2 py-0.5 rounded-full bg-[#f5d576]/15 border border-[#f5d576]/35 text-[10.5px] font-bold font-body text-[#f5d576]">
                  #57 · Final Badge
                </span>
              </div>
              <p className="text-[12.5px] font-body text-text-dark-muted mt-1">{SUPREME.challenge}</p>

              <div className="w-full h-2 rounded-full bg-ink-800 mt-3 overflow-hidden max-w-[420px]">
                <div
                  className={`h-full rounded-full ${supremeUnlocked ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#f5d576] to-[#b8860b]'}`}
                  style={{ width: `${supremeProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-body text-text-dark-muted mt-1 block">
                {fmt(Math.min(currentPoints, SUPREME.points))} / {fmt(SUPREME.points)} points
              </span>
            </div>
          </div>
        </motion.div>

        {grouped.map((group) => (
          <div key={group.tierName} className="mb-9">
            <p className="text-[12.5px] font-semibold font-body text-text-dark-muted uppercase tracking-wide mb-3 px-1">
              {group.tierName} · Levels {group.items[0].level}–{group.items[group.items.length - 1].level}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {group.items.map((badge, i) => (
                <BadgeCard key={badge.level} badge={badge} index={i} currentPoints={currentPoints} hasPosted={hasPosted} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}