import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  MapPin, TrendingUp, Users, CheckCircle2,
  Clock, ArrowRight, ChevronRight, Star, X, Building2,
  Lightbulb, Construction, ZoomIn,
} from 'lucide-react';
import communityHeroVideo from '../../assets/community_hero.mp4';
import nandanvanIllustration from '../../assets/ward-nandanvan.png';
import greenParkIllustration from '../../assets/ward-green-park.png';
import ramNagarIllustration from '../../assets/ward-ram-nagar.png';
import lakeViewIllustration from '../../assets/ward-lake-view.png';
import ward12Illustration from '../../assets/ward-12.png';
import comCard1 from '../../assets/com_card1.png';
import comCard2 from '../../assets/com_card2.png';
import comCard3 from '../../assets/com_card3.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function Section({ children, className = '' }) {
  return (
    <section className={`px-6 md:px-12 ${className}`}>
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}

function Eyebrow({ children, dark = false }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body ${
      dark ? 'text-volt' : 'text-signal'
    }`}>
      <span className="w-1.5 h-1.5 rounded-full bg-signal" />
      {children}
    </span>
  );
}

function TypingText({ text, className = '', speed = 60, startDelay = 1000 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

function Squiggle({ className = '' }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className={className}>
      <path
        d="M1 7C2.5 2 4 2 5 5.5C6 9 7.5 9 8.5 5C9.5 1 11 1 13 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProgressRing({ resolved, total, pct, size = 76 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const gapDeg = 18;
  const trackLen = circumference * ((360 - gapDeg) / 360);
  const fillLen = trackLen * (pct / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${trackLen} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${gapDeg / 2} ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="url(#ringGradient)" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${fillLen} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${gapDeg / 2} ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4f942" />
            <stop offset="100%" stopColor="#f5c542" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-body font-bold text-[14px] text-volt leading-tight">{resolved}/{total}</p>
        <p className="font-body text-[9px] text-volt/50 leading-tight">resolved</p>
      </div>
    </div>
  );
}

const CITY_STATS = [
  { icon: CheckCircle2, num: '2,400+', label: 'Issues resolved' },
  { icon: Users, num: '180+', label: 'Communities active' },
  { icon: MapPin, num: '12', label: 'Cities covered' },
  { icon: Clock, num: '48hrs', label: 'Avg. resolution time' },
];

const WARD_BREAKDOWN = [
  {
    name: 'Nandanvan', status: 'Making steady progress', squiggle: false,
    resolved: 34, total: 41, illustration: nandanvanIllustration,
    civicCount: 27, societyCount: 14, trend: 12, avgTime: '2.1 days',
    topReporter: 'nandanvan_watch',
    recentIssues: [
      { title: 'Pothole stretch near main road', category: 'Civic', status: 'Resolved' },
      { title: 'Streetlight outage, Sector 4', category: 'Civic', status: 'Resolved' },
      { title: 'Overflowing garbage bin', category: 'Civic', status: 'In progress' },
    ],
  },
  {
    name: 'Green Park Society', status: 'Great going!', squiggle: true,
    resolved: 22, total: 25, illustration: greenParkIllustration,
    civicCount: 6, societyCount: 19, trend: 18, avgTime: '1.4 days',
    topReporter: 'greenpark_rwa',
    recentIssues: [
      { title: 'Garbage collection missed', category: 'Society', status: 'Resolved' },
      { title: 'Gate security light not working', category: 'Society', status: 'Resolved' },
      { title: 'Clubhouse AC maintenance', category: 'Society', status: 'In progress' },
    ],
  },
  {
    name: 'Ram Nagar', status: 'On the right track', squiggle: false,
    resolved: 18, total: 30, illustration: ramNagarIllustration,
    civicCount: 25, societyCount: 5, trend: 6, avgTime: '3.5 days',
    topReporter: 'ward5_watch',
    recentIssues: [
      { title: 'Waterlogging at main crossing', category: 'Civic', status: 'In progress' },
      { title: 'Broken footpath tiles', category: 'Civic', status: 'Resolved' },
      { title: 'Traffic signal malfunction', category: 'Civic', status: 'Pending' },
    ],
  },
  {
    name: 'Lake View Apartments', status: 'Almost there!', squiggle: true,
    resolved: 15, total: 17, illustration: lakeViewIllustration,
    civicCount: 2, societyCount: 15, trend: 24, avgTime: '0.9 days',
    topReporter: 'lift_watch_towerb',
    recentIssues: [
      { title: 'Lift maintenance, Tower B', category: 'Society', status: 'Resolved' },
      { title: 'Water tank cleaning overdue', category: 'Society', status: 'Resolved' },
      { title: 'Parking area lighting', category: 'Society', status: 'In progress' },
    ],
  },
  {
    name: 'Ward 12', status: 'Making real impact', squiggle: true,
    resolved: 29, total: 36, illustration: ward12Illustration,
    civicCount: 31, societyCount: 5, trend: 15, avgTime: '2.8 days',
    topReporter: 'ward_12_civic',
    recentIssues: [
      { title: 'Streetlight repaired, MG Road', category: 'Civic', status: 'Resolved' },
      { title: 'Drainage blockage', category: 'Civic', status: 'Resolved' },
      { title: 'Road resurfacing request', category: 'Civic', status: 'In progress' },
    ],
  },
];

const STORIES = [
  {
    title: 'Streetlight fixed in 3 days',
    location: 'MG Road, Ward 12',
    desc: 'Reported broken streetlight, AI flagged it high-priority due to nearby school, resolved within 72 hours.',
    category: 'Civic',
    icon: Building2,
    cardBg: 'from-amber-50 via-orange-50 to-amber-100/60',
    tagBg: 'bg-white/80 text-amber-700',
    tagIconColor: 'text-amber-600',
    fixedBg: 'bg-amber-400/90 text-amber-950',
    illoBg: 'from-amber-200/50 to-orange-200/50',
    illoIconColor: 'text-amber-500/40',
    footerBg: 'bg-white/60',
    statIconBg: 'bg-amber-200/70 text-amber-700',
    checkColor: 'text-amber-600',
    buttonBg: 'bg-amber-500 hover:bg-amber-600',
    resolvedIn: '3 days',
    statNum: '120+',
    statLabel: 'Residents helped',
    image: comCard1,
    reportedBy: 'nandanvan_watch',
    timeline: [
      { label: 'Reported', detail: 'Streetlight outage flagged near school zone' },
      { label: 'AI flagged high-priority', detail: 'Proximity to school triggered urgency boost' },
      { label: 'Assigned to ward team', detail: 'Routed to Ward 12 electrical maintenance' },
      { label: 'Resolved', detail: 'Streetlight repaired and tested within 72 hours' },
    ],
  },
  {
    title: 'Lift repaired after 40 upvotes',
    location: 'Lake View Apartments',
    desc: 'Community backing pushed an ignored maintenance request to the top of the RWA\'s queue.',
    category: 'Society',
    icon: Users,
    cardBg: 'from-violet-50 via-purple-50 to-violet-100/60',
    tagBg: 'bg-white/80 text-violet-700',
    tagIconColor: 'text-violet-600',
    fixedBg: 'bg-violet-400/90 text-violet-950',
    illoBg: 'from-violet-200/50 to-purple-200/50',
    illoIconColor: 'text-violet-500/40',
    footerBg: 'bg-white/60',
    statIconBg: 'bg-violet-200/70 text-violet-700',
    checkColor: 'text-violet-600',
    buttonBg: 'bg-violet-500 hover:bg-violet-600',
    resolvedIn: '5 days',
    statNum: '40+',
    statLabel: 'Residents upvoted',
    image: comCard2,
    reportedBy: 'lift_watch_towerb',
    timeline: [
      { label: 'Reported', detail: 'Lift maintenance request filed by resident' },
      { label: '40 upvotes received', detail: 'Neighbours backed the request within days' },
      { label: 'Escalated to RWA', detail: 'Community backing pushed it to top of queue' },
      { label: 'Resolved', detail: 'Lift repaired and back in service' },
    ],
  },
  {
    title: 'Pothole stretch resurfaced',
    location: 'Nandanvan, Nagpur',
    desc: 'A 200m stretch flagged by 12 separate reports was clustered and resurfaced in one municipal visit.',
    category: 'Civic',
    icon: Building2,
    cardBg: 'from-emerald-50 via-green-50 to-emerald-100/60',
    tagBg: 'bg-white/80 text-emerald-700',
    tagIconColor: 'text-emerald-600',
    fixedBg: 'bg-emerald-400/90 text-emerald-950',
    illoBg: 'from-emerald-200/50 to-green-200/50',
    illoIconColor: 'text-emerald-500/40',
    footerBg: 'bg-white/60',
    statIconBg: 'bg-emerald-200/70 text-emerald-700',
    checkColor: 'text-emerald-600',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-600',
    resolvedIn: '6 days',
    statNum: '12',
    statLabel: 'Reports merged',
    image: comCard3,
    reportedBy: 'ward_12_civic',
    timeline: [
      { label: 'Multiple reports filed', detail: '12 separate reports on the same stretch' },
      { label: 'Reports clustered', detail: 'System merged duplicates into one issue' },
      { label: 'Municipal visit scheduled', detail: 'Single visit planned to cover full stretch' },
      { label: 'Resolved', detail: '200m stretch resurfaced in one visit' },
    ],
  },
];

export default function CommunityImpactPage() {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <div className="bg-paper-50 dark:bg-ink-950 text-text-light dark:text-text-dark transition-colors">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(90deg, #d4f942, #ffffff, #d4f942, #a8e600);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientShift 4s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section className="relative pt-32 md:pt-40 pb-40 md:pb-56 bg-navy min-h-[110vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={communityHeroVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 via-40% to-[#0a1628]/20" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-24 md:pt-20 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow dark>Community impact</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display font-bold text-[30px] leading-[1.15] sm:text-[36px] md:text-[54px] mt-5 tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
            >
              <span className="block md:whitespace-nowrap gradient-text">What happens when</span>
              <span className="block md:whitespace-nowrap gradient-text">a city actually listens.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-body text-[17px] md:text-[20px] text-volt/80 mt-7 leading-relaxed max-w-xl drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)] min-h-[2em]"
            >
              <TypingText
                text="Every number below is an issue someone reported, a community that backed it, and a problem that actually got fixed."
                speed={35}
                startDelay={900}
              />
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 via-40% to-transparent z-[1]" />
      </section>

      <Section className="py-4 md:py-5 bg-[#f5f3cd] border-y border-navy/10">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {CITY_STATS.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-signal/10 flex items-center justify-center mb-1.5">
                <s.icon size={14} className="text-signal" />
              </div>
              <p className="font-display font-bold text-[22px] md:text-[28px] text-navy">{s.num}</p>
              <p className="font-body text-[12px] text-navy/60 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section className="py-24 md:py-32 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
          className="max-w-2xl mx-auto text-center flex flex-col items-center"
        >
          <Eyebrow dark>By neighbourhood</Eyebrow>
          <h2 className="font-display font-bold text-[24px] sm:text-[28px] md:text-[38px] mt-4 text-white leading-tight md:whitespace-nowrap">
            Where things are <span className="text-signal">actually getting</span> fixed.
          </h2>
          <p className="font-body text-[15px] md:text-[16px] text-volt/60 mt-5 leading-relaxed max-w-md">
            Real issues. Real progress. Track how your neighbourhoods are improving every day.
          </p>
          <div className="flex items-center gap-1.5 mt-5">
            <span className="w-8 h-[3px] rounded-full bg-signal" />
            <span className="w-1.5 h-1.5 rounded-full bg-signal/50" />
          </div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="flex flex-col gap-4 mt-10"
        >
          {WARD_BREAKDOWN.map((w, i) => {
            const pct = Math.round((w.resolved / w.total) * 100);
            const isTop = i === 0;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group relative flex items-stretch gap-0 rounded-3xl overflow-hidden border transition-colors ${
                  isTop ? 'border-volt/40 bg-volt/[0.06]' : 'border-white/10 bg-white/[0.03] hover:border-volt/20'
                }`}
              >
                <div className="relative w-[104px] sm:w-[136px] md:w-[156px] shrink-0 overflow-hidden">
                  <img
                    src={w.illustration}
                    alt={`Illustration for ${w.name}`}
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy/90" />
                  <span className="absolute top-3 left-3 font-display font-black text-[26px] text-white/25 leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {isTop && (
                    <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-full bg-volt text-ink-950 text-[9.5px] font-bold font-body uppercase tracking-wide">
                      Top ward
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-3 sm:gap-5 px-3.5 sm:px-5 md:px-7 py-4 sm:py-5">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-[15px] sm:text-[18px] md:text-[19px] text-white truncate">{w.name}</p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-volt/10">
                      <p className="font-body text-[12px] text-volt">{w.status}</p>
                      {w.squiggle && <Squiggle className="text-volt/70" />}
                    </div>

                    <div className="relative h-[3px] rounded-full bg-white/10 overflow-hidden mt-4 max-w-[280px]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-signal to-volt"
                      />
                    </div>
                  </div>

                  <ProgressRing resolved={w.resolved} total={w.total} pct={pct} size={56} />

                  <button
                    type="button"
                    aria-label={`View details for ${w.name}`}
                    onClick={() => setSelectedWard(w)}
                    className="hidden sm:flex shrink-0 w-9 h-9 rounded-full border border-white/15 text-volt/70 items-center justify-center hover:bg-volt hover:text-navy hover:border-volt transition-colors"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </Section>

      <Section className="py-14 md:py-20 bg-volt relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-navy/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={stagger}
          className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={fadeUp}><Eyebrow>Real outcomes</Eyebrow></motion.div>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-[28px] md:text-[42px] mt-4 text-navy leading-tight">
            A few issues that didn't
            <br className="hidden md:block" /> stay issues for long.
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-[15px] text-navy/60 mt-5 max-w-md leading-relaxed">
            Every story here started as a single report — and ended with something actually fixed.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 relative z-10"
        >
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`group relative rounded-3xl bg-gradient-to-br ${s.cardBg} p-5 flex flex-col shadow-[0_4px_20px_-8px_rgba(10,22,40,0.15)] hover:shadow-[0_16px_40px_-12px_rgba(10,22,40,0.25)] transition-shadow duration-300 overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-body ${s.tagBg}`}>
                  <s.icon size={12} className={s.tagIconColor} />
                  {s.category}
                  <span className="text-navy/30 font-normal">·</span>
                  <span className="text-navy/50 font-normal">{s.location}</span>
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold font-body ${s.fixedBg}`}>
                  <CheckCircle2 size={11} />
                  Fixed
                </span>
              </div>

              <h3 className="font-display font-bold text-[19px] text-navy leading-snug">{s.title}</h3>
              <p className="font-body text-[13.5px] text-navy/60 mt-2 leading-relaxed">{s.desc}</p>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(s.image);
                }}
                className="relative h-24 my-4 rounded-2xl overflow-hidden cursor-zoom-in"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-navy">
                    <ZoomIn size={15} />
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-between gap-3 rounded-2xl ${s.footerBg} px-4 py-3 mt-auto`}>
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.statIconBg}`}>
                    <Users size={14} />
                  </span>
                  <div>
                    <p className="font-display font-bold text-[14px] text-navy leading-tight">{s.statNum}</p>
                    <p className="font-body text-[10px] text-navy/50 leading-tight">{s.statLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className={s.checkColor} />
                    <div>
                      <p className="font-body text-[10px] text-navy/50 leading-tight">Resolved in</p>
                      <p className="font-display font-bold text-[13px] text-navy leading-tight">{s.resolvedIn}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`View details for ${s.title}`}
                    onClick={() => setSelectedStory(s)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${s.buttonBg}`}
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
            className="fixed inset-0 z-[100] bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-navy border border-volt/15 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedStory(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-ink-950/50 text-volt flex items-center justify-center hover:bg-ink-950 transition-colors"
              >
                <X size={16} />
              </button>

              <div
                onClick={() => setLightboxImage(selectedStory.image)}
                className="relative h-40 shrink-0 overflow-hidden cursor-zoom-in group"
              >
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>

              <div className="px-6 md:px-8 pb-8 pt-2 relative overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold font-body ${selectedStory.tagBg}`}>
                    <selectedStory.icon size={11} className={selectedStory.tagIconColor} />
                    {selectedStory.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold font-body ${selectedStory.fixedBg}`}>
                    <CheckCircle2 size={10} />
                    Fixed
                  </span>
                </div>

                <h3 className="font-display font-bold text-[24px] text-white">{selectedStory.title}</h3>
                <p className="flex items-center gap-1.5 text-[13px] text-volt/50 font-body mt-1.5">
                  <MapPin size={11} />
                  {selectedStory.location}
                </p>

                <p className="font-body text-[14.5px] text-volt/70 mt-4 leading-relaxed">
                  {selectedStory.desc}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
                    <p className="font-display font-bold text-[15px] text-volt">{selectedStory.statNum}</p>
                    <p className="font-body text-[10px] text-volt/50 mt-1">{selectedStory.statLabel}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
                    <p className="font-display font-bold text-[15px] text-volt">{selectedStory.resolvedIn}</p>
                    <p className="font-body text-[10px] text-volt/50 mt-1">Resolved in</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
                    <p className="font-display font-bold text-[12px] text-volt truncate">{selectedStory.reportedBy}</p>
                    <p className="font-body text-[10px] text-volt/50 mt-1">Reported by</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-body text-[12px] font-semibold text-volt/50 uppercase tracking-wide mb-3">
                    Timeline
                  </p>
                  <div className="flex flex-col gap-4">
                    {selectedStory.timeline.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-body ${
                            i === selectedStory.timeline.length - 1
                              ? `${selectedStory.fixedBg}`
                              : 'bg-white/10 text-volt/70'
                          }`}>
                            {i === selectedStory.timeline.length - 1 ? <CheckCircle2 size={12} /> : i + 1}
                          </span>
                          {i !== selectedStory.timeline.length - 1 && (
                            <span className="w-px flex-1 bg-white/10 mt-1" />
                          )}
                        </div>
                        <div className="pb-1">
                          <p className="font-body text-[13.5px] font-semibold text-white leading-tight">{step.label}</p>
                          <p className="font-body text-[12.5px] text-volt/50 mt-1 leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/create"
                  className="block w-full mt-6 py-3 rounded-full bg-volt text-navy font-semibold font-body text-center hover:-translate-y-0.5 transition-transform"
                >
                  Report a similar issue
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWard(null)}
            className="fixed inset-0 z-[100] bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-navy border border-volt/15 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedWard(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-ink-950/50 text-volt flex items-center justify-center hover:bg-ink-950 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="h-40 relative shrink-0">
                <img
                  src={selectedWard.illustration}
                  alt={selectedWard.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
              </div>

              <div className="px-6 md:px-8 pb-8 -mt-8 relative overflow-y-auto no-scrollbar">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-volt/10 mb-3">
                  <p className="font-body text-[12px] text-volt">{selectedWard.status}</p>
                  {selectedWard.squiggle && <Squiggle className="text-volt/70" />}
                </div>

                <h3 className="font-display font-bold text-[24px] text-white">{selectedWard.name}</h3>

                <div className="flex items-center gap-6 mt-5">
                  <ProgressRing
                    resolved={selectedWard.resolved}
                    total={selectedWard.total}
                    pct={Math.round((selectedWard.resolved / selectedWard.total) * 100)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-volt/60 font-body text-[13px] mb-1.5">
                      <Building2 size={13} />
                      Civic &amp; society issues
                    </div>
                    <p className="font-body text-[14px] text-volt/70 leading-relaxed">
                      {selectedWard.resolved} out of {selectedWard.total} reported issues have
                      been resolved in this neighbourhood so far.
                    </p>
                  </div>
                </div>

                <div className="relative h-[3px] rounded-full bg-white/10 overflow-hidden mt-6">
                  <div
                    style={{ width: `${Math.round((selectedWard.resolved / selectedWard.total) * 100)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-signal to-volt"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
                    <p className="font-display font-bold text-[17px] text-volt flex items-center justify-center gap-1">
                      <TrendingUp size={13} className="text-signal" />
                      +{selectedWard.trend}%
                    </p>
                    <p className="font-body text-[10.5px] text-volt/50 mt-1">This month</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
                    <p className="font-display font-bold text-[17px] text-volt">{selectedWard.avgTime}</p>
                    <p className="font-body text-[10.5px] text-volt/50 mt-1">Avg. resolution</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
                    <p className="font-display font-bold text-[13px] text-volt truncate">{selectedWard.topReporter}</p>
                    <p className="font-body text-[10.5px] text-volt/50 mt-1">Top reporter</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-body text-[12px] font-semibold text-volt/50 uppercase tracking-wide mb-2.5">
                    Issue breakdown
                  </p>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(selectedWard.civicCount / (selectedWard.civicCount + selectedWard.societyCount)) * 100}%` }}
                      className="bg-signal"
                    />
                    <div
                      style={{ width: `${(selectedWard.societyCount / (selectedWard.civicCount + selectedWard.societyCount)) * 100}%` }}
                      className="bg-volt"
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-2.5">
                    <span className="flex items-center gap-1.5 text-[12px] font-body text-volt/60">
                      <span className="w-2 h-2 rounded-full bg-signal" />
                      Civic ({selectedWard.civicCount})
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-body text-volt/60">
                      <span className="w-2 h-2 rounded-full bg-volt" />
                      Society ({selectedWard.societyCount})
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-body text-[12px] font-semibold text-volt/50 uppercase tracking-wide mb-2.5">
                    Recent issues
                  </p>
                  <div className="flex flex-col gap-2">
                    {selectedWard.recentIssues.map((issue, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {issue.category === 'Civic'
                            ? <Building2 size={13} className="text-signal shrink-0" />
                            : <MapPin size={13} className="text-volt shrink-0" />}
                          <p className="font-body text-[13px] text-white truncate">{issue.title}</p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10.5px] font-semibold font-body ${
                          issue.status === 'Resolved'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : issue.status === 'In progress'
                              ? 'bg-signal/15 text-signal'
                              : 'bg-white/10 text-volt/60'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/create"
                  className="block w-full mt-6 py-3 rounded-full bg-volt text-navy font-semibold font-body text-center hover:-translate-y-0.5 transition-transform"
                >
                  Post your area's issue as a Reel
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Section className="py-6 md:py-8 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
          className="group rounded-[24px] bg-[#f5f3cd] px-6 py-7 md:px-10 md:py-9 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
            style={{
              backgroundImage: "url('https://i.ibb.co/mCHTFFPL/cta-banner-without-white-bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-orange-300/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[11px] font-semibold tracking-wide uppercase text-black/70 font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Join the movement
            </span>

            <h2 className="font-display font-bold text-[19px] sm:text-[24px] md:text-[36px] leading-tight text-black mt-3 max-w-lg">
              Your neighbourhood could be next on this list.
            </h2>

            <p className="font-body text-[14px] md:text-[16px] text-black/60 mt-3 max-w-md leading-relaxed">
              Every issue reported brings us closer to a better city. Join the movement today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button onClick={() => navigate('/feed')} className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a1628] text-volt font-semibold font-body text-[14px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
                Report an issue
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}