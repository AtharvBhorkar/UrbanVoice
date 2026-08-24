import { motion } from 'framer-motion';
import { Trophy, Flame, MapPin, TrendingUp, Building2, Home as HomeIcon } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const PODIUM = [
  { rank: 2, name: 'ward5_watch', points: 2140, resolved: 38, avatar: 'W5' },
  { rank: 1, name: 'ananya_r', points: 2980, resolved: 51, avatar: 'AR' },
  { rank: 3, name: 'greenpark_rwa', points: 1870, resolved: 29, avatar: 'GP' },
];

const RANKED_LIST = [
  { rank: 4, name: 'lift_watch_towerb', points: 1620, resolved: 24, category: 'Society', avatar: 'LW' },
  { rank: 5, name: 'municipal_ward5', points: 1440, resolved: 21, category: 'Civic', avatar: 'M5' },
  { rank: 6, name: 'nagpur_roads', points: 1290, resolved: 19, category: 'Civic', avatar: 'NR' },
  { rank: 7, name: 'sunrise_apartments', points: 1105, resolved: 16, category: 'Society', avatar: 'SA' },
  { rank: 8, name: 'lake_view_society', points: 980, resolved: 14, category: 'Society', avatar: 'LV' },
  { rank: 9, name: 'ward_12_civic', points: 860, resolved: 12, category: 'Civic', avatar: 'W1' },
  { rank: 10, name: 'ram_nagar_watch', points: 740, resolved: 10, category: 'Civic', avatar: 'RN' },
];

function Section({ children, className = '' }) {
  return (
    <section className={`px-6 md:px-12 ${className}`}>
      <div className="max-w-[1000px] mx-auto">{children}</div>
    </section>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="bg-paper-50 dark:bg-ink-950 text-text-light dark:text-text-dark transition-colors">
      <Section className="pt-[160px] pb-16 md:pt-[190px] md:pb-20 bg-navy text-center">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-signal font-body"
          >
            <Trophy size={14} />
            This month's top reporters
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-[36px] md:text-[52px] mt-5 tracking-tight text-volt"
          >
            The people keeping
            <br />
            their city honest.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-body text-[16px] md:text-[18px] text-volt/70 mt-5 max-w-xl mx-auto leading-relaxed"
          >
            Ranked by issues reported, resolved, and backed by the community.
          </motion.p>
        </motion.div>
      </Section>

      <Section className="pb-20 md:pb-24 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}
          className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto"
        >
          {PODIUM.map((p) => (
            <motion.div
              key={p.rank}
              variants={fadeUp}
              className={`flex flex-col items-center ${p.rank === 1 ? 'order-2' : p.rank === 2 ? 'order-1' : 'order-3'}`}
            >
              <div className={`relative rounded-full bg-gradient-to-tr from-signal to-volt p-[2.5px] ${p.rank === 1 ? 'w-20 h-20' : 'w-16 h-16'}`}>
                <div className="w-full h-full rounded-full bg-navy flex items-center justify-center">
                  <span className="text-text-dark font-bold font-body text-[13px]">{p.avatar}</span>
                </div>
                <span className={`absolute -top-2 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-body ${
                  p.rank === 1 ? 'bg-volt text-ink-950' : 'bg-ink-800 text-volt border border-volt/40'
                }`}>
                  {p.rank}
                </span>
              </div>
              <p className="font-body font-semibold text-[13.5px] text-volt mt-3 truncate max-w-[100px]">{p.name}</p>
              <p className="font-body text-[12px] text-volt/50 mt-0.5">{p.points.toLocaleString()} pts</p>
              <div
                className={`w-full rounded-t-xl mt-4 bg-volt/10 border border-volt/20 flex items-end justify-center ${
                  p.rank === 1 ? 'h-24' : p.rank === 2 ? 'h-16' : 'h-12'
                }`}
              >
                <span className="font-display font-bold text-[22px] text-volt/30 mb-1">{p.rank}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>
      <Section className="py-16 md:py-20 bg-volt">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-8">
          <h2 className="font-display font-bold text-[22px] md:text-[26px] text-navy">Full rankings</h2>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="flex flex-col gap-2"
        >
          {RANKED_LIST.map((r) => {
            const Icon = r.category === 'Civic' ? Building2 : HomeIcon;
            return (
              <motion.div
                key={r.rank}
                variants={fadeUp}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-navy/10 hover:border-navy/25 transition-colors"
              >
                <span className="w-6 text-center font-display font-bold text-[15px] text-navy/40">{r.rank}</span>
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <span className="text-navy text-[11px] font-bold font-body">{r.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-[14px] text-navy truncate">{r.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon size={11} className="text-navy/40" />
                    <span className="text-[12px] text-navy/50 font-body">{r.category}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-[15px] text-navy">{r.points.toLocaleString()}</p>
                  <p className="text-[11.5px] text-navy/50 font-body flex items-center gap-1 justify-end">
                    <TrendingUp size={10} />
                    {r.resolved} resolved
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>
      <Section className="py-24 md:py-28 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
          className="rounded-[28px] bg-volt px-8 py-14 md:px-14 md:py-16 text-center"
        >
          <Flame size={26} className="text-signal mx-auto" />
          <h2 className="font-display font-bold text-[26px] md:text-[36px] leading-tight text-navy mt-4">
            Report your first issue,
            <br />climb the board.
          </h2>
          <button className="mt-7 px-7 py-3 rounded-full bg-navy text-volt font-semibold font-body hover:-translate-y-0.5 transition-transform">
            Report an issue
          </button>
        </motion.div>
      </Section>
    </div>
  );
}