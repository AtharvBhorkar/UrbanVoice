import { Award, Shield, Crown, Gem, Star, Flame, Diamond, Zap } from 'lucide-react';

// ---- Mock current user progress ----
export const CURRENT_POINTS = 15420;
export const HAS_POSTED = true;

// ---- helpers ----
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

export function fmt(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return n;
}

function buildTier(startLevel, endLevel, startPts, endPts, tierName, icon, colors) {
  const n = endLevel - startLevel + 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 1 : i / (n - 1);
    const pts = Math.round(startPts + (endPts - startPts) * t);
    out.push({
      level: startLevel + i,
      title: `${tierName} ${ROMAN[i] || i + 1}`,
      points: pts,
      tier: tierName,
      icon,
      colors,
    });
  }
  return out;
}

export const GOLD = { disc: 'from-[#fff6da] via-[#f5d576] to-[#b8860b]', text: 'text-[#f5d576]', ring: 'ring-[#f5d576]/50', glow: 'rgba(245,213,118,0.5)' };
export const BRONZE = { disc: 'from-[#e3a367] via-[#c8823f] to-[#7a4c1f]', text: 'text-[#e3a367]', ring: 'ring-[#e3a367]/40', glow: 'rgba(227,163,103,0.4)' };
export const SILVER = { disc: 'from-[#f6f6fa] via-[#cfcfd9] to-[#8f8f9c]', text: 'text-[#d9d9e3]', ring: 'ring-[#cfcfd9]/40', glow: 'rgba(207,207,217,0.4)' };
export const EMERALD = { disc: 'from-[#a8f5cf] via-[#3ecf8e] to-[#0f7a52]', text: 'text-emerald-400', ring: 'ring-emerald-400/40', glow: 'rgba(62,207,142,0.45)' };
export const SAPPHIRE = { disc: 'from-[#bcd8ff] via-[#5b9dff] to-[#1d4fd6]', text: 'text-blue-400', ring: 'ring-blue-400/40', glow: 'rgba(91,157,255,0.45)' };
export const RUBY = { disc: 'from-[#ffb3c1] via-[#ff5c7c] to-[#a3123f]', text: 'text-signal', ring: 'ring-signal/40', glow: 'rgba(255,92,124,0.45)' };
export const PLATINUM = { disc: 'from-[#ffffff] via-[#e4e4f2] to-[#a9a9c2]', text: 'text-text-dark', ring: 'ring-white/40', glow: 'rgba(228,228,242,0.5)' };

export const BADGES = [
  {
    level: 1,
    title: 'First Voice',
    points: 0,
    tier: 'Starter',
    icon: Zap,
    colors: GOLD,
    special: 'post',
    challenge: 'Share your first post or reel',
  },
  ...buildTier(2, 7, 500, 1000, 'Bronze Voice', Award, BRONZE),
  ...buildTier(8, 20, 2000, 20000, 'Silver Voice', Shield, SILVER),
  ...buildTier(21, 30, 22000, 40000, 'Gold Voice', Crown, GOLD),
  ...buildTier(31, 35, 45000, 65000, 'Emerald Voice', Gem, EMERALD),
  ...buildTier(36, 42, 66000, 78000, 'Sapphire Voice', Star, SAPPHIRE),
  ...buildTier(43, 50, 80000, 100000, 'Ruby Voice', Flame, RUBY),
  ...buildTier(51, 55, 150000, 830000, 'Platinum Voice', Diamond, PLATINUM),
  {
    level: 56,
    title: 'Jr. Leader',
    points: 1000000,
    tier: 'Platinum Voice',
    icon: Diamond,
    colors: PLATINUM,
    challenge: 'Reach 1M combined engagement points',
  },
];

export const SUPREME = {
  level: 57,
  title: 'Supreme Leader',
  points: 10000000,
  icon: Crown,
  colors: GOLD,
  challenge: 'Reach 10M combined engagement points — the highest honor in UrbanVoice',
};

export const TIER_ORDER = ['Starter', 'Bronze Voice', 'Silver Voice', 'Gold Voice', 'Emerald Voice', 'Sapphire Voice', 'Ruby Voice', 'Platinum Voice'];

export function isUnlocked(badge) {
  if (badge.special === 'post') return HAS_POSTED;
  return CURRENT_POINTS >= badge.points;
}