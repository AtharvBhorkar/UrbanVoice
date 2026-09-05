import { Building2, Home as HomeIcon } from 'lucide-react';

export const RAW_ITEMS = [
  { user: 'ananya_r', avatar: 'AR', ring: 'from-signal to-volt', category: 'Civic', location: 'Nandanvan, Nagpur', caption: 'Potholes on the main stretch after every monsoon.', likes: 1420, comments: 186, shares: 94, followers: 3200, views: 18400, icon: Building2 },
  { user: 'lift_watch_towerb', avatar: 'LW', ring: 'from-volt to-emerald-400', category: 'Society', location: 'Lake View Apartments', caption: 'Lift in Tower B down again — third time this month.', likes: 2310, comments: 340, shares: 210, followers: 5100, views: 41200, icon: HomeIcon },
  { user: 'ward5_watch', avatar: 'W5', ring: 'from-signal to-rose-400', category: 'Civic', location: 'Ram Nagar Crossing', caption: 'Waterlogging every monsoon at this crossing.', likes: 980, comments: 112, shares: 60, followers: 2100, views: 12300, icon: Building2 },
  { user: 'greenpark_rwa', avatar: 'GP', ring: 'from-volt to-signal', category: 'Society', location: 'Green Park Society', caption: 'Garbage collection missed for the third day running.', likes: 1670, comments: 205, shares: 130, followers: 3900, views: 22800, icon: HomeIcon },
  { user: 'municipal_ward5', avatar: 'M5', ring: 'from-emerald-400 to-volt', category: 'Civic', location: 'Municipal Ward 5', caption: 'Streetlights out along the whole ward road.', likes: 760, comments: 88, shares: 41, followers: 1800, views: 9600, icon: Building2 },
  { user: 'sunrise_apartments', avatar: 'SA', ring: 'from-rose-400 to-signal', category: 'Society', location: 'Sunrise Apartments', caption: 'Water tank overflow flooding the basement.', likes: 540, comments: 61, shares: 28, followers: 1400, views: 7200, icon: HomeIcon },
  { user: 'sitabuldi_speaks', avatar: 'SS', ring: 'from-signal to-volt', category: 'Civic', location: 'Sitabuldi, Nagpur', caption: 'Illegal parking blocking the hospital gate.', likes: 2890, comments: 402, shares: 265, followers: 6300, views: 51000, icon: Building2 },
  { user: 'dharampeth_diaries', avatar: 'DD', ring: 'from-volt to-rose-400', category: 'Civic', location: 'Dharampeth, Nagpur', caption: 'Open manhole near the market square, unmarked.', likes: 3120, comments: 455, shares: 310, followers: 7200, views: 62800, icon: Building2 },
  { user: 'civil_lines_watch', avatar: 'CL', ring: 'from-emerald-400 to-signal', category: 'Civic', location: 'Civil Lines, Nagpur', caption: 'Tree fell on the footpath, still not cleared.', likes: 410, comments: 39, shares: 15, followers: 950, views: 5100, icon: Building2 },
  { user: 'sadar_society', avatar: 'SD', ring: 'from-signal to-emerald-400', category: 'Society', location: 'Sadar, Nagpur', caption: 'CCTV cameras non-functional for two weeks.', likes: 890, comments: 96, shares: 44, followers: 2000, views: 10900, icon: HomeIcon },
  { user: 'nandanvan_rwa', avatar: 'NR', ring: 'from-volt to-emerald-400', category: 'Society', location: 'Nandanvan, Nagpur', caption: 'Society gate lock broken since Sunday.', likes: 320, comments: 28, shares: 9, followers: 780, views: 3900, icon: HomeIcon },
  { user: 'ramnagar_updates', avatar: 'RU', ring: 'from-signal to-rose-400', category: 'Civic', location: 'Ram Nagar, Nagpur', caption: 'Drainage line choked, foul smell in the lane.', likes: 610, comments: 70, shares: 24, followers: 1500, views: 7900, icon: Building2 },
  { user: 'greenpark_watch', avatar: 'GW', ring: 'from-volt to-signal', category: 'Society', location: 'Green Park Society', caption: 'Elevator inspection certificate expired.', likes: 250, comments: 19, shares: 6, followers: 600, views: 2800, icon: HomeIcon },
  { user: 'sunrise_civic', avatar: 'SC', ring: 'from-rose-400 to-volt', category: 'Civic', location: 'Sunrise Apartments', caption: 'Speed breaker missing warning sign, near-miss reported.', likes: 1180, comments: 140, shares: 78, followers: 2700, views: 15600, icon: Building2 },
  { user: 'ward5_reporter', avatar: 'WR', ring: 'from-emerald-400 to-rose-400', category: 'Civic', location: 'Municipal Ward 5', caption: 'Garbage van skipped the entire lane again.', likes: 175, comments: 12, shares: 4, followers: 420, views: 2100, icon: Building2 },
];
function computeScore(it) {
  return it.likes * 1 + it.comments * 2 + it.shares * 3 + it.followers * 0.4 + it.views * 0.05;
}

export const RANKED = RAW_ITEMS
  .map((it) => ({ ...it, score: Math.round(computeScore(it)) }))
  .sort((a, b) => b.score - a.score)
  .map((it, i) => ({ ...it, rank: i + 1 }));

export function fmt(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return n;
}