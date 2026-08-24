import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Building2, Home as HomeIcon, Sparkles, ShieldCheck,
  Users, Eye, Handshake, ArrowRight, Github, Linkedin, Instagram,
  AlertCircle, Shuffle, EyeOff, HelpCircle, MessageCircle, Lamp,
  Target, TrendingUp, CheckCircle2, MapPin,
} from 'lucide-react';

import aboutHeroVideo from '../../assets/about_hero.mp4';
import section1 from '../../assets/section1.mp4';
import founderPhoto from '../../assets/Atharv.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = '' }) {
  return (
    <section className={`px-6 md:px-12 ${className}`}>
      <div className="max-w-[1600px] mx-auto">{children}</div>
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

const approachPalettes = [
  { iconGrad: 'from-orange-400 to-orange-600', shadowColor: 'shadow-orange-500/50', glow: 'bg-orange-500', borderColor: 'border-orange-500/25', lineColor: 'from-orange-500/60', numColor: 'text-orange-400 border-orange-400/40', accent: 'bg-orange-400' },
  { iconGrad: 'from-emerald-400 to-emerald-600', shadowColor: 'shadow-emerald-500/50', glow: 'bg-emerald-500', borderColor: 'border-emerald-500/25', lineColor: 'from-emerald-500/60', numColor: 'text-emerald-400 border-emerald-400/40', accent: 'bg-emerald-400' },
  { iconGrad: 'from-violet-400 to-violet-600', shadowColor: 'shadow-violet-500/50', glow: 'bg-violet-500', borderColor: 'border-violet-500/25', lineColor: 'from-violet-500/60', numColor: 'text-violet-400 border-violet-400/40', accent: 'bg-violet-400' },
  { iconGrad: 'from-sky-400 to-sky-600', shadowColor: 'shadow-sky-500/50', glow: 'bg-sky-500', borderColor: 'border-sky-500/25', lineColor: 'from-sky-500/60', numColor: 'text-sky-400 border-sky-400/40', accent: 'bg-sky-400' },
  { iconGrad: 'from-pink-400 to-pink-600', shadowColor: 'shadow-pink-500/50', glow: 'bg-pink-500', borderColor: 'border-pink-500/25', lineColor: 'from-pink-500/60', numColor: 'text-pink-400 border-pink-400/40', accent: 'bg-pink-400' },
  { iconGrad: 'from-amber-400 to-amber-600', shadowColor: 'shadow-amber-500/50', glow: 'bg-amber-500', borderColor: 'border-amber-500/25', lineColor: 'from-amber-500/60', numColor: 'text-amber-400 border-amber-400/40', accent: 'bg-amber-400' },
  { iconGrad: 'from-cyan-400 to-cyan-600', shadowColor: 'shadow-cyan-500/50', glow: 'bg-cyan-500', borderColor: 'border-cyan-500/25', lineColor: 'from-cyan-500/60', numColor: 'text-cyan-400 border-cyan-400/40', accent: 'bg-cyan-400' },
  { iconGrad: 'from-rose-400 to-rose-600', shadowColor: 'shadow-rose-500/50', glow: 'bg-rose-500', borderColor: 'border-rose-500/25', lineColor: 'from-rose-500/60', numColor: 'text-rose-400 border-rose-400/40', accent: 'bg-rose-400' },
];

function getShuffledPalettes(count) {
  const shuffled = [...approachPalettes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function AboutPage() {
  const [approachColors] = useState(() => getShuffledPalettes(3));
  const problemVideoRef = useRef(null);

  const handleVideoHoverStart = () => {
    problemVideoRef.current?.play();
  };

  const handleVideoHoverEnd = () => {
    problemVideoRef.current?.pause();
  };

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
        .frame-animated-bg {
          background: linear-gradient(135deg, #d4f942, #2b2b2b, #a8e600, #141414, #d4f942);
          background-size: 400% 400%;
          animation: gradientShift 14s ease-in-out infinite;
        }
      `}</style>

      <section className="relative pt-32 md:pt-40 pb-40 md:pb-56 bg-navy min-h-[110vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={aboutHeroVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 via-40% to-[#0a1628]/20" />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-24 md:pt-20 text-center">
          <motion.div
            initial="hidden" animate="show" variants={stagger}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeUp}><Eyebrow dark>Why we built this</Eyebrow></motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display font-bold text-[36px] leading-[1.1] sm:text-[42px] md:text-[64px] mt-6 tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
            >
              <span className="block whitespace-nowrap gradient-text">Every complaint deserves</span>
              <span className="block whitespace-nowrap gradient-text">somewhere to go.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="font-body text-[17px] md:text-[20px] text-volt/80 mt-7 leading-relaxed max-w-xl drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)] min-h-[2em]"
            >
              <TypingText
                text={`UrbanVoice exists to bridge the gap between "someone should fix this" and "who do I tell?"`}
                speed={35}
                startDelay={900}
              />
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 via-40% to-transparent z-[1]" />
      </section>

      <Section className="py-24 md:py-32 bg-[#f5f3cd]">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid md:grid-cols-2 gap-14 items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-signal">
              <AlertCircle size={16} className="text-signal" />
              The problem
            </span>
            <h2 className="font-display font-bold text-[30px] md:text-[42px] leading-[1.15] mt-5 text-[#0a1628]">
              Complaints don&apos;t disappear.
              <br />
              <span className="relative inline-block text-signal">
                They just go unheard.
                <svg
                  className="absolute left-0 -bottom-2 w-full overflow-visible"
                  height="10"
                  viewBox="0 0 320 10"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <motion.path
                    d="M2 6 Q160 -2 318 6"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="400"
                    initial={{ strokeDashoffset: 400 }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: 'easeInOut' }}
                  />
                </svg>
              </span>
            </h2>
            <ul className="mt-8 space-y-4 max-w-md">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                <p className="font-body text-[16px] text-[#0a1628]/65 leading-relaxed">
                  A civic complaint bounces between departments with no
                  visible owner.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                <p className="font-body text-[16px] text-[#0a1628]/65 leading-relaxed">
                  A society issue gets typed into a WhatsApp group, scrolls
                  past, and is forgotten by evening.
                </p>
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {[
              {
                img: 'https://i.ibb.co/n8j7ypX8/Chat-GPT-Image-Aug-23-2026-10-20-04-PM.png',
                title: 'Bounces Between Departments',
                desc: 'No clear owner. No accountability. Complaints keep getting passed around.',
                fit: 'cover',
                cardBg: 'from-orange-50/80 to-white',
                imgBg: 'bg-orange-50',
                accent: 'bg-orange-400',
              },
              {
                img: 'https://i.ibb.co/jvn3dWJn/Chat-GPT-Image-Aug-23-2026-10-20-08-PM.png',
                title: 'Gets Lost in WhatsApp Groups',
                desc: "Important issues scroll past. No tracking. No record. Eventually, it's forgotten.",
                fit: 'contain',
                cardBg: 'from-emerald-50/80 to-white',
                imgBg: 'bg-emerald-50',
                accent: 'bg-emerald-400',
              },
              {
                img: 'https://i.ibb.co/2YLhm5ww/Chat-GPT-Image-Aug-23-2026-10-20-11-PM.png',
                title: 'No System. No Closure.',
                desc: 'Nobody is being dishonest — the system itself is the problem.',
                fit: 'cover',
                cardBg: 'from-violet-50/80 to-white',
                imgBg: 'bg-violet-50',
                accent: 'bg-violet-400',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.96 },
                  show: {
                    opacity: 1, y: 0, scale: 1,
                    transition: { duration: 0.55, ease: 'easeOut' },
                  },
                }}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                className={`rounded-2xl bg-gradient-to-br ${card.cardBg} border border-white/10 p-4 flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-default`}
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`relative rounded-xl ${card.imgBg} h-40 overflow-hidden flex items-center justify-center ${
                    card.fit === 'contain' ? 'p-3' : ''
                  }`}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className={`w-full h-full ${
                      card.fit === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                  />
                </motion.div>
                <h3 className="font-display font-semibold text-[15px] mt-5 text-[#0a1628] leading-snug">
                  {card.title}
                </h3>
                <p className="font-body text-[13px] text-[#0a1628]/55 mt-2 leading-relaxed">
                  {card.desc}
                </p>
                <div className="flex items-center gap-1.5 mt-4">
                  <span className={`h-[3px] w-6 rounded-full ${card.accent}`} />
                  <span className={`h-1.5 w-1.5 rounded-full ${card.accent} opacity-50`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      <Section className="py-24 md:py-32 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={stagger}
          className="text-center flex flex-col items-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-volt"
          >
            <Target size={14} className="text-volt" />
            Our approach
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-[28px] md:text-[40px] leading-[1.2] mt-4 max-w-2xl"
          >
            <span className="text-white">Three things make a </span>
            <span className="text-volt">complaint</span>
            <br className="hidden sm:block" />
            <span className="text-white">actually go </span>
            <span className="relative inline-block text-volt">
              somewhere.
              <svg
                className="absolute left-0 -bottom-1.5 w-full overflow-visible"
                height="8"
                viewBox="0 0 220 8"
                preserveAspectRatio="none"
                fill="none"
              >
                <motion.path
                  d="M2 5 Q110 -1 218 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="300"
                  initial={{ strokeDashoffset: 300 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: 'easeInOut' }}
                />
              </svg>
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-[15px] text-volt/50 mt-4 max-w-md mx-auto">
            UrbanVoice is built on three core principles that turn reporting
            into real action.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              icon: Sparkles,
              num: '01',
              title: 'It gets sorted instantly',
              desc: 'AI reads every report and assigns the right category and urgency the moment it\'s filed — no manual triage delay.',
            },
            {
              icon: Eye,
              num: '02',
              title: 'It stays visible',
              desc: 'A public status timeline means no complaint quietly disappears. Everyone can see exactly where it stands.',
            },
            {
              icon: Users,
              num: '03',
              title: 'The community backs it',
              desc: 'Issues that affect more people surface faster, because neighbours can upvote and add their own context.',
            },
          ].map((item, i) => ({ ...item, ...approachColors[i] })).map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`group relative p-7 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border ${item.borderColor} overflow-hidden hover:border-opacity-60 transition-all duration-300`}
            >
              <div
                className={`absolute -top-8 -left-8 w-32 h-32 rounded-full ${item.glow} blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              />

              <div className="relative flex items-center gap-3">
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.iconGrad} flex items-center justify-center shrink-0 shadow-[0_0_25px_-5px] ${item.shadowColor}`}>
                  <item.icon size={24} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 space-y-2 overflow-hidden">
                  <span className={`block h-[1.5px] w-10 rounded-full bg-gradient-to-r ${item.lineColor} to-transparent`} />
                  <span className={`block h-[1.5px] w-16 rounded-full bg-gradient-to-r ${item.lineColor} to-transparent opacity-70`} />
                  <span className={`block h-[1.5px] w-6 rounded-full bg-gradient-to-r ${item.lineColor} to-transparent opacity-40`} />
                </div>
              </div>

              <div className="relative flex items-center gap-2.5 mt-6">
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold font-body ${item.numColor}`}>
                  {item.num}
                </span>
                <h3 className="font-display font-semibold text-[17px] text-white">{item.title}</h3>
              </div>
              <p className="relative font-body text-[14px] text-white/45 mt-3 leading-relaxed">{item.desc}</p>

              <div className="relative flex items-center gap-1.5 mt-6">
                <span className={`h-[3px] w-8 rounded-full ${item.accent}`} />
                <span className="h-[3px] w-4 rounded-full bg-white/10" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section className="py-6 bg-[#f5f3cd] border-y border-navy/10">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {[
            { icon: CheckCircle2, num: '2,400+', label: 'Issues resolved' },
            { icon: Users, num: '180+', label: 'Communities active' },
            { icon: MapPin, num: '12', label: 'Cities covered' },
            { icon: TrendingUp, num: '48hrs', label: 'Avg. resolution time' },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`flex flex-col items-center text-center py-3 px-4 ${
                i !== 0 ? 'md:border-l border-navy/10' : ''
              } ${i === 1 ? 'border-l border-navy/10 md:border-l' : ''} ${
                i === 2 ? 'md:border-l border-navy/10' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-signal/15 flex items-center justify-center mb-3">
                <s.icon size={16} className="text-signal" />
              </div>
              <p className="font-display font-bold text-[28px] md:text-[36px] text-[#0a1628]">{s.num}</p>
              <p className="font-body text-[13px] text-[#0a1628]/70 mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section className="py-24 md:py-32 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={stagger}
          className="text-center flex flex-col items-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-volt"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            Built for both
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-[28px] md:text-[40px] leading-[1.2] mt-4 max-w-xl"
          >
            <span className="text-white">One inbox for every kind</span>
            <br className="hidden sm:block" />
            <span className="relative inline-block text-volt">
              of issue.
              <svg
                className="absolute left-0 -bottom-1.5 w-full overflow-visible"
                height="8"
                viewBox="0 0 180 8"
                preserveAspectRatio="none"
                fill="none"
              >
                <motion.path
                  d="M2 5 Q90 -1 178 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="260"
                  initial={{ strokeDashoffset: 260 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: 'easeInOut' }}
                />
              </svg>
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-[15px] text-volt/50 mt-4 max-w-md mx-auto">
            Whether it&apos;s a broken streetlight or a noisy neighbour,
            UrbanVoice routes it to the right place.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid md:grid-cols-2 gap-6 mt-12"
        >
          {[
            {
              icon: Building2,
              title: 'Government & civic',
              desc: 'Roads, water supply, electricity, sanitation, public safety — routed to the ward or department actually responsible for it.',
              iconGrad: 'from-orange-400 to-orange-600',
              shadowColor: 'shadow-orange-500/50',
              glow: 'bg-orange-500',
              borderColor: 'border-orange-500/25',
            },
            {
              icon: HomeIcon,
              title: 'Community & private',
              desc: 'Society maintenance, RWA matters, local vendors, neighbourhood disputes — seen by the people who can actually fix them.',
              iconGrad: 'from-emerald-400 to-emerald-600',
              shadowColor: 'shadow-emerald-500/50',
              glow: 'bg-emerald-500',
              borderColor: 'border-emerald-500/25',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`group relative rounded-3xl p-8 bg-gradient-to-b from-white/[0.04] to-transparent border ${item.borderColor} overflow-hidden hover:border-opacity-60 transition-all duration-300`}
            >
              <div
                className={`absolute -top-8 -left-8 w-32 h-32 rounded-full ${item.glow} blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              />
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.iconGrad} flex items-center justify-center shadow-[0_0_25px_-5px] ${item.shadowColor}`}>
                <item.icon size={24} className="text-white" strokeWidth={2} />
              </div>
              <h3 className="relative font-display font-semibold text-[22px] mt-6 text-volt">{item.title}</h3>
              <p className="relative font-body text-[15px] text-white/45 mt-3 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section className="py-24 md:py-32 bg-[#f5f3cd] relative overflow-hidden">
        <div className="absolute top-10 left-0 w-72 h-72 rounded-full bg-signal/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          className="text-center mb-16"
        >
          <Eyebrow>The person behind it</Eyebrow>
          <h2 className="font-display font-bold text-[28px] md:text-[40px] leading-tight mt-4 text-[#0a1628]">
            Meet the <span className="text-signal">Founder</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-16 md:gap-12 items-center relative z-10">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
            className="relative max-w-[340px] md:max-w-[400px] mx-auto md:order-1 order-2"
          >
            <motion.div
              whileHover={{ rotateY: 6, rotateX: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="relative"
            >
              <div
                className="absolute -inset-1.5 rounded-[28px] opacity-80 blur-md"
                style={{
                  background: 'linear-gradient(135deg, #d4f942, #ff7a45, #d4f942, #a8e600)',
                  backgroundSize: '300% 300%',
                  animation: 'gradientShift 6s ease-in-out infinite',
                }}
              />
              <div className="relative rounded-[24px] p-2 bg-[#0a1628] shadow-2xl shadow-black/40">
                <div className="rounded-[18px] overflow-hidden aspect-[4/5] bg-black">
                  <img
                    src={founderPhoto}
                    alt="Atharv Bhorkar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-5 -right-5 bg-[#0a1628] text-volt px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-body text-[12px] font-semibold whitespace-nowrap">Frontend Developer</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, type: 'spring' }}
              className="absolute -bottom-5 -left-5 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#0a1628]/10"
            >
              <span className="font-body text-[12px] font-semibold text-[#0a1628] whitespace-nowrap">
                mr.ATHARV
              </span>
            </motion.div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/30 blur-2xl rounded-full -z-10" />
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}
            className="md:order-2 order-1"
          >
            <motion.div variants={fadeUp} className="text-signal/30 font-display font-bold text-[64px] leading-none -mb-4">
              "
            </motion.div>

            <motion.h3
              variants={fadeUp}
              className="font-display font-bold text-[30px] md:text-[38px] text-[#0a1628] leading-tight"
            >
              Atharv Bhorkar
            </motion.h3>

            <motion.div variants={fadeUp} className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              <p className="font-body text-[14px] text-[#0a1628]/60 font-medium">
                Frontend Developer · Builder of UrbanVoice
              </p>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="font-body text-[17px] md:text-[19px] text-[#0a1628]/75 mt-6 leading-relaxed"
            >
              I kept watching real issues in my own city get raised and then
              quietly forgotten — no owner, no follow-up, no closure. UrbanVoice
              is my attempt to fix that: designed, built, and shipped solo,
              from the first wireframe to a working product that gives every
              complaint a place to go and a way to be seen.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3 mt-8">
              <a
                href="https://github.com/AtharvBhorkar"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-full bg-[#0a1628] flex items-center justify-center text-volt shadow-lg hover:shadow-signal/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Github size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a                href="https://www.linkedin.com/in/atharv-bhorkar-45524122a/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-full bg-[#0a1628] flex items-center justify-center text-volt shadow-lg hover:shadow-signal/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.instagram.com/atharv__155/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-full bg-[#0a1628] flex items-center justify-center text-volt shadow-lg hover:shadow-signal/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <div className="flex-1 h-[1px] bg-[#0a1628]/10 ml-2" />
            </motion.div>
          </motion.div>
        </div>
      </Section>

      <Section className="py-6 md:py-8 bg-navy">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
          className="rounded-[24px] bg-[#f5f3cd] px-6 py-7 md:px-10 md:py-9 text-center relative overflow-hidden"
          style={{
            backgroundImage: "url('https://i.ibb.co/mCHTFFPL/cta-banner-without-white-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-orange-300/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[11px] font-semibold tracking-wide uppercase text-black/70 font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Join the movement
            </span>

            <h2 className="font-display font-bold text-[22px] md:text-[36px] leading-tight text-black mt-3 max-w-none whitespace-nowrap">
              Got something to report? Let your voice be heard.
            </h2>

            <p className="font-body text-[14px] md:text-[16px] text-black/60 mt-3 max-w-md leading-relaxed">
              It takes less than a minute to file, and every step after that
              is visible to you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a1628] text-volt font-semibold font-body text-[14px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
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