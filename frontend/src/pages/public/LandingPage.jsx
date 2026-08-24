import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import hero1 from '../../assets/hero1.mp4';
import section1 from '../../assets/section1.mp4';
import card1 from '../../assets/card1.png';
import card2 from '../../assets/card2.png';
import feature1 from '../../assets/card1.png';
import card3 from '../../assets/card3.png';
import card4 from '../../assets/card4.png';
import card5 from '../../assets/card5.png';
import card6 from '../../assets/card6.png';
import card7 from '../../assets/card7.png';
import {
    MapPin, Building2, Home as HomeIcon, ShieldCheck,
    Sparkles, Users, TrendingUp, ArrowRight, MessageSquare,
    Heart, Trophy, CheckCircle2, Target, Clock,
} from 'lucide-react';

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
        <section className={`px-6 md:px-10 lg:px-16 ${className}`}>
            <div className="max-w-none w-full">{children}</div>
        </section>
    );
}

function Eyebrow({ children, variant = 'dark' }) {
    const textColor = variant === 'dark' ? 'text-volt' : 'text-black';
    return (
        <span className={`inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase ${textColor} font-body`}>
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

export default function LandingPage() {
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
                .frame-glow-border {
                    background: linear-gradient(120deg, #d4f942, #a8e600, #f5f3cd, #d4f942, #a8e600);
                    background-size: 300% 300%;
                    animation: gradientShift 6s ease-in-out infinite;
                }
                .frame-animated-bg {
                    background: linear-gradient(135deg, #d4f942, #2b2b2b, #a8e600, #141414, #d4f942);
                    background-size: 400% 400%;
                    animation: gradientShift 14s ease-in-out infinite;
                }
            `}</style>

            <Section className="relative pt-32 md:pt-40 pb-40 md:pb-56 bg-navy min-h-[110vh] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={hero1} type="video/mp4" />
                </video>

                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 via-40% to-[#0a1628]/20" />

                <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-24 md:pt-20 text-center">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                        className="max-w-4xl mx-auto flex flex-col items-center"
                    >
                        <motion.div variants={fadeUp} className="flex justify-center">
                            <Eyebrow>Live in your city</Eyebrow>
                        </motion.div>
                        <motion.h1
                            variants={fadeUp}
                            className="font-display font-black text-[34px] leading-[1.15] md:text-[48px] lg:text-[56px] mt-5 tracking-tight text-volt"
                        >
                            <span className="whitespace-nowrap gradient-text">One voice for every issue.</span>
                            <br />
                            <span className="whitespace-nowrap gradient-text">One platform for real change.</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            className="font-body text-[17px] md:text-[19px] text-volt/70 mt-6 max-w-lg mx-auto leading-relaxed min-h-[4.5em] md:min-h-[3em]"
                        >
                            <TypingText text="Report issues, track progress, and drive change — government or private, all in one place." speed={55} startDelay={1000} />
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mt-9">
                            <button className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-volt text-black font-semibold font-body hover:bg-volt-dim hover:-translate-y-0.5 transition-all duration-200">
                                Report an issue
                                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <button className="px-6 py-3.5 rounded-full border border-volt/30 text-volt font-medium font-body hover:border-volt transition-colors">
                                See how it works
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 via-40% to-transparent z-[1]" />
            </Section>

            <Section className="py-5 md:py-6 border-y border-navy/10 bg-[#f5f3cd]">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={stagger}
                    className="grid grid-cols-2 md:grid-cols-4 gap-y-4 text-center"
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
                            className={`px-4 flex md:flex-col items-center justify-center gap-3 md:gap-1.5 ${i !== 0 ? 'md:border-l border-navy/10' : ''} ${i === 2 ? 'border-l md:border-l border-navy/10' : ''}`}
                        >
                            <div className="w-7 h-7 rounded-full bg-signal/10 flex items-center justify-center shrink-0">
                                <s.icon size={14} className="text-signal" />
                            </div>
                            <p className="font-display font-bold text-[20px] md:text-[28px] text-black leading-none">{s.num}</p>
                            <p className="font-body text-[12px] md:text-[13px] text-black/60">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>

            <Section className="py-24 md:py-32 bg-navy">
                <div className="grid md:grid-cols-2 gap-14 md:gap-10 items-center">
                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={stagger}
                        className="max-w-xl"
                    >
                        <motion.div variants={fadeUp}>
                            <Eyebrow>The problem</Eyebrow>
                        </motion.div>
                        <motion.h2
                            variants={fadeUp}
                            className="font-display font-bold text-[30px] md:text-[42px] leading-tight mt-5 text-volt"
                        >
                            Complaints go nowhere because no one knows where they went.
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            className="font-body text-[16px] md:text-[18px] text-volt/70 mt-6 leading-relaxed"
                        >
                            A civic issue gets lost between departments. A society issue gets buried
                            in a WhatsApp group. There's no single place to raise it, follow it, and
                            see it actually get fixed — until now.
                        </motion.p>
                        <motion.div variants={fadeUp} className="w-14 h-[3px] rounded-full bg-signal mt-8" />
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
                        className="relative"
                        onMouseEnter={handleVideoHoverStart}
                        onMouseLeave={handleVideoHoverEnd}
                    >
                        <div
                            className="frame-animated-bg relative rounded-md p-4 md:p-5 shadow-2xl shadow-black/60"
                            style={{
                                boxShadow:
                                    'inset 2px 2px 4px rgba(255,255,255,0.08), inset -3px -3px 8px rgba(0,0,0,0.7), 0 25px 40px -10px rgba(0,0,0,0.6)',
                            }}
                        >
                            <div
                                className="bg-[#f5f3cd] rounded-sm"
                                style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)' }}
                            >
                                <div className="relative overflow-hidden aspect-video bg-black shadow-inner cursor-pointer">
                                    <video
                                        ref={problemVideoRef}
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover scale-110"
                                    >
                                        <source src={section1} type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/40 blur-xl rounded-full -z-10" />
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-signal/10 blur-2xl -z-10" />
                    </motion.div>
                </div>
            </Section>

            <Section className="pb-8 md:pb-10 bg-[#f5f3cd]">
                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}
                    className="flex flex-col items-center text-center py-6 md:py-8"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/10">
                        <Eyebrow variant="light">Built for both</Eyebrow>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        className="font-display font-bold text-[32px] md:text-[48px] mt-6 max-w-3xl text-black leading-[1.15]"
                    >
                        Every kind of public issue,
                        <br />
                        <span className="relative inline-block mt-1">
                            <span className="relative z-10">one platform.</span>
                            <span className="absolute left-0 bottom-1 md:bottom-2 w-full h-3 md:h-4 bg-orange-300/50 -z-0 rounded" />
                        </span>
                    </motion.h2>
                    <motion.div variants={fadeUp} className="flex items-center gap-1.5 mt-5">
                        <span className="w-8 h-[3px] rounded-full bg-orange-500" />
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="w-3 h-[3px] rounded-full bg-orange-300" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
                    className="grid md:grid-cols-2 gap-6 mt-10"
                >
                    <motion.div
                        variants={fadeUp}
                        className="group relative rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 min-h-[220px] md:min-h-[230px]"
                    >
                        <div className="relative z-10 p-6 md:p-7 max-w-[62%]">
                            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Building2 size={20} className="text-orange-500" />
                            </div>
                            <h3 className="font-display font-bold text-[20px] mt-4 text-black">
                                Government &amp; <span className="text-orange-500">civic</span>
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-6 h-[2px] rounded-full bg-orange-500" />
                                <span className="w-1 h-1 rounded-full bg-orange-300" />
                            </div>
                            <p className="font-body text-[13px] text-black/60 mt-3 leading-relaxed">
                                Roads, water supply, electricity, sanitation, public safety —
                                routed straight to the ward or department responsible.
                            </p>
                            <button className="mt-4 w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-500 group/btn transition-colors">
                                <ArrowRight size={15} className="text-orange-500 group-hover/btn:text-white transition-colors" />
                            </button>
                        </div>

                        <div className="absolute right-0 top-0 w-[50%] h-full pointer-events-none">
                            <img src={card1} alt="" className="w-full h-full object-contain object-right-bottom" />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="group relative rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 min-h-[220px] md:min-h-[230px]"
                    >
                        <div className="relative z-10 p-6 md:p-7 max-w-[62%]">
                            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <HomeIcon size={20} className="text-emerald-600" />
                            </div>
                            <h3 className="font-display font-bold text-[20px] mt-4 text-black">
                                Community <span className="text-emerald-600">&amp; private</span>
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-6 h-[2px] rounded-full bg-emerald-600" />
                                <span className="w-1 h-1 rounded-full bg-emerald-300" />
                            </div>
                            <p className="font-body text-[13px] text-black/60 mt-3 leading-relaxed">
                                Society maintenance, RWA matters, local vendors, neighbourhood
                                disputes — visible to the people who can actually fix them.
                            </p>
                            <button className="mt-4 w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-600 group/btn transition-colors">
                                <ArrowRight size={15} className="text-emerald-600 group-hover/btn:text-white transition-colors" />
                            </button>
                        </div>

                        <div className="absolute right-0 top-0 w-[50%] h-full pointer-events-none">
                            <img src={card2} alt="" className="w-full h-full object-contain object-right-bottom" />
                        </div>
                    </motion.div>
                </motion.div>
            </Section>

            <Section className="py-12 md:py-16 bg-navy relative overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-volt/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-signal/5 blur-3xl pointer-events-none" />

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={stagger}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    <motion.div variants={fadeUp}>
                        <Eyebrow>How it works</Eyebrow>
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="font-display font-bold text-[32px] md:text-[46px] mt-4 text-white">
                        From report to <span className="text-volt">resolved.</span>
                    </motion.h2>
                    <motion.div variants={fadeUp} className="mt-3 flex flex-col items-center">
                        <p className="font-body text-[15px] text-volt/50">Simple steps. Real impact.</p>
                        <span className="block w-8 h-[3px] rounded-full bg-volt mt-2" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
                    className="relative grid md:grid-cols-4 gap-8 md:gap-0 mt-8"
                >
                    {[
                        { icon: MessageSquare, title: 'Report', desc: 'Describe the issue, drop a pin, add a photo.' },
                        { icon: Sparkles, title: 'AI sorts it', desc: 'Category and urgency are detected automatically.' },
                        { icon: Users, title: 'Community backs it', desc: 'Neighbours upvote and add context.' },
                        { icon: CheckCircle2, title: 'It gets resolved', desc: 'Track every status change until it\'s closed.' },
                    ].map((step, i) => (
                        <div key={i} className="relative flex items-stretch">
                            <motion.div
                                variants={fadeUp}
                                className="group relative rounded-2xl border border-volt/15 bg-white/[0.02] p-5 pb-6 hover:bg-white/[0.05] hover:border-volt/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden md:mr-6 w-full"
                            >
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-volt to-transparent opacity-70 group-hover:opacity-100 blur-[1px] transition-opacity" />

                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-full bg-navy border border-volt/30 flex items-center justify-center group-hover:border-volt group-hover:shadow-lg group-hover:shadow-volt/30 transition-all">
                                        <step.icon size={19} className="text-volt" />
                                    </div>
                                    <span className="font-display text-[34px] font-black text-white/5 leading-none">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="font-display font-bold text-[19px] mt-6 text-white">{step.title}</h3>
                                <span className="block w-7 h-[2.5px] rounded-full bg-volt mt-2.5 mb-3" />
                                <p className="font-body text-[14px] text-white/50 leading-relaxed">
                                    {step.desc}
                                </p>
                            </motion.div>

                            {i < 3 && (
                                <div className="hidden md:flex items-center justify-center absolute top-[42px] -right-[6px] z-10 w-12">
                                    <span className="absolute left-0 w-full h-px border-t border-dashed border-volt/40" />
                                    <span className="relative w-9 h-9 rounded-full bg-navy border border-volt/40 flex items-center justify-center">
                                        <ArrowRight size={14} className="text-volt" />
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}
                    className="relative mt-6 rounded-2xl border border-volt/15 bg-white/[0.02] px-6 md:px-8 py-6 flex items-center justify-between gap-6 overflow-hidden"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-11 h-11 rounded-full bg-navy border border-volt/30 flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} className="text-volt" />
                        </div>
                        <div>
                            <p className="font-display font-semibold text-[15px] md:text-[16px] text-volt">Transparency at every step.</p>
                            <p className="font-body text-[13px] text-white/50 mt-0.5">You're always in the loop.</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-8 h-8 rounded-full bg-volt/5 blur-md absolute right-10" />
                </motion.div>
            </Section>

            <Section className="py-20 md:py-28 bg-[#f5f3cd]">
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={stagger} className="flex flex-col items-center text-center">
                    <motion.div variants={fadeUp}>
                        <Eyebrow variant="light">Why UrbanVoice</Eyebrow>
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="font-display font-bold text-[26px] md:text-[42px] mt-4 text-black leading-tight max-w-4xl whitespace-nowrap">
                        Everything a <span className="text-orange-500">resolved issue</span> needs.
                    </motion.h2>
                    <motion.p variants={fadeUp} className="font-body text-[15px] md:text-[16px] text-black/60 mt-4 max-w-lg leading-relaxed">
                        Powerful tools and transparency to make sure no issue goes unseen or unresolved.
                    </motion.p>
                    <motion.div variants={fadeUp} className="flex items-center gap-1.5 mt-5">
                        <span className="w-8 h-[3px] rounded-full bg-orange-500" />
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
                    className="grid md:grid-cols-3 gap-5 mt-12"
                >
                    {[
                        {
                            icon: Sparkles, title: 'AI-powered triage',
                            desc: 'Every report is auto-categorised and prioritised the moment it\'s filed.',
                            iconBg: 'bg-orange-100', iconColor: 'text-orange-500', numColor: 'text-orange-500/15',
                            cardBg: 'from-orange-50/70 to-white', border: 'border-orange-200', arrowBg: 'bg-orange-100 hover:bg-orange-500', arrowColor: 'text-orange-500',
                            dotColor: 'bg-orange-500', dotColorFaded: 'bg-orange-500/40',
                            img: feature1,
                        },
                        {
                            icon: MapPin, title: 'Map view',
                            desc: 'See what\'s happening block by block, not buried in a list.',
                            iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', numColor: 'text-emerald-500/15',
                            cardBg: 'from-emerald-50/70 to-white', border: 'border-emerald-200', arrowBg: 'bg-emerald-100 hover:bg-emerald-600', arrowColor: 'text-emerald-600',
                            dotColor: 'bg-emerald-600', dotColorFaded: 'bg-emerald-600/40',
                            img: card3,
                        },
                        {
                            icon: ShieldCheck, title: 'Real-time tracking',
                            desc: 'A visible timeline from submitted to resolved — no guessing.',
                            iconBg: 'bg-violet-100', iconColor: 'text-violet-600', numColor: 'text-violet-500/15',
                            cardBg: 'from-violet-50/70 to-white', border: 'border-violet-200', arrowBg: 'bg-violet-100 hover:bg-violet-600', arrowColor: 'text-violet-600',
                            dotColor: 'bg-violet-600', dotColorFaded: 'bg-violet-600/40',
                            img: card4,
                        },
                        {
                            icon: Trophy, title: 'Community leaderboard',
                            desc: 'The most active reporters get recognised, not ignored.',
                            iconBg: 'bg-blue-100', iconColor: 'text-blue-600', numColor: 'text-blue-500/15',
                            cardBg: 'from-blue-50/70 to-white', border: 'border-blue-200', arrowBg: 'bg-blue-100 hover:bg-blue-600', arrowColor: 'text-blue-600',
                            dotColor: 'bg-blue-600', dotColorFaded: 'bg-blue-600/40',
                            img: card5,
                        },
                        {
                            icon: TrendingUp, title: 'Admin dashboard',
                            desc: 'Authorities see load, priority and trends at a glance.',
                            iconBg: 'bg-amber-100', iconColor: 'text-amber-600', numColor: 'text-amber-500/15',
                            cardBg: 'from-amber-50/70 to-white', border: 'border-amber-200', arrowBg: 'bg-amber-100 hover:bg-amber-600', arrowColor: 'text-amber-600',
                            dotColor: 'bg-amber-600', dotColorFaded: 'bg-amber-600/40',
                            img: card6,
                        },
                        {
                            icon: Heart, title: 'Public upvoting',
                            desc: 'The issues that affect the most people rise to the top.',
                            iconBg: 'bg-rose-100', iconColor: 'text-rose-500', numColor: 'text-rose-500/15',
                            cardBg: 'from-rose-50/70 to-white', border: 'border-rose-200', arrowBg: 'bg-rose-100 hover:bg-rose-500', arrowColor: 'text-rose-500',
                            dotColor: 'bg-rose-500', dotColorFaded: 'bg-rose-500/40',
                            img: card7,
                        },
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className={`group relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.cardBg} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[280px]`}
                        >
                            <div className="relative z-10 p-6 pb-8 max-w-[62%]">
                                <div className="flex items-start justify-between">
                                    <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center`}>
                                        <f.icon size={20} className={f.iconColor} />
                                    </div>
                                </div>
                                <h3 className="font-display font-bold text-[18px] mt-5 text-black">{f.title}</h3>
                                <p className="font-body text-[13.5px] text-black/60 mt-2 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>

                            <div className="absolute left-6 bottom-6 z-10 flex items-center gap-2">
                                <span className={`w-6 h-[2.5px] rounded-full ${f.dotColor}`} />
                                <span className={`w-1.5 h-1.5 rounded-full ${f.dotColorFaded}`} />
                            </div>

                            <div className="absolute right-2 bottom-2 w-[52%] h-[62%] pointer-events-none">
                                {f.img && <img src={f.img} alt="" className="w-full h-full object-contain object-right-bottom" />}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </Section>

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

                        <h2 className="font-display font-bold text-[16px] md:text-[28px] leading-tight text-black mt-3 max-w-none whitespace-nowrap">
                            Your city is listening. Give it something to hear.
                        </h2>

                        <p className="font-body text-[13px] md:text-[14px] text-black/60 mt-2.5 max-w-md leading-relaxed">
                            Join thousands already reporting, tracking and resolving issues in their neighbourhoods.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                            <button className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a1628] text-volt font-semibold font-body text-[14px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
                                Get started — it's free
                                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <button className="px-5 py-2.5 rounded-full border border-black/20 text-black font-medium font-body text-[14px] hover:border-black/40 hover:bg-black/5 transition-colors">
                                See how it works
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Section>
        </div>
    );
}