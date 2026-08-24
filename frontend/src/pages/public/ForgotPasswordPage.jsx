import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import prob1 from '../../assets/prob1.png';
import prob2 from '../../assets/prob2.png';
import prob3 from '../../assets/prob3.png';
import prob4 from '../../assets/prob4.png';
import prob5 from '../../assets/prob5.png';
import prob6 from '../../assets/prob6.png';
import prob7 from '../../assets/prob7.png';
import prob8 from '../../assets/prob8.png';
import logo from '../../assets/logo.png';

const HERO_IMAGES = [prob1, prob2, prob3, prob4, prob5, prob6, prob7, prob8];

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((i) => (i + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Enter the email linked to your account.');
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 700));
            setSubmitted(true);
        } catch (err) {
            setError('Could not send the reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-ink-950 flex items-stretch overflow-hidden">
            <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-10 lg:px-16 py-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <img src={logo} alt="UrbanVoice" className="h-8 w-auto" />
                    <span className="font-display text-lg text-text-dark">UrbanVoice</span>
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto py-4">
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1.5 text-xs font-body text-text-dark-muted hover:text-volt transition-colors mb-6"
                                >
                                    <ArrowLeft size={14} />
                                    Back to login
                                </Link>

                                <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-volt font-body">
                                    <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                                    Reset password
                                </span>
                                <h1 className="font-display text-4xl sm:text-5xl text-text-dark mt-4 leading-[1.1]">
                                    Forgot your password?
                                </h1>
                                <p className="font-body text-text-dark-muted mt-3 text-[15px]">
                                    No worries — enter your email and we'll send you a link to reset it.
                                </p>

                                <div className="mt-9 rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:p-7">
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div className="relative">
                                            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full rounded-xl bg-ink-800 border border-ink-600 pl-11 pr-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-sm font-body text-red-400">{error}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-volt text-ink-950 font-body font-semibold py-3 hover:bg-volt-dim transition-colors disabled:opacity-60"
                                        >
                                            {loading ? 'Sending link…' : 'Send reset link'}
                                            {!loading && <ArrowRight size={16} />}
                                        </button>
                                    </form>
                                </div>

                                <p className="text-center text-sm font-body text-text-dark-muted mt-6">
                                    Remembered your password?{' '}
                                    <Link to="/login" className="text-volt font-medium hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-8 text-center">
                                    <div className="mx-auto h-14 w-14 rounded-full bg-volt-soft flex items-center justify-center">
                                        <CheckCircle2 size={28} className="text-volt" />
                                    </div>
                                    <h1 className="font-display text-2xl sm:text-3xl text-text-dark mt-5 leading-[1.15]">
                                        Check your inbox
                                    </h1>
                                    <p className="font-body text-text-dark-muted mt-3 text-[15px]">
                                        We've sent a password reset link to{' '}
                                        <span className="text-text-dark font-medium">{email}</span>.
                                        It may take a minute to arrive.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="w-full mt-7 flex items-center justify-center gap-2 rounded-xl bg-volt text-ink-950 font-body font-semibold py-3 hover:bg-volt-dim transition-colors"
                                    >
                                        Back to login
                                        <ArrowRight size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSubmitted(false)}
                                        className="w-full mt-3 text-sm font-body text-text-dark-muted hover:text-volt transition-colors"
                                    >
                                        Didn't get it? Try another email
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10">
                <div className="relative h-[80%] w-[85%] rounded-3xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={imageIndex}
                            src={HERO_IMAGES[imageIndex]}
                            alt=""
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-volt font-body">
                            <MapPin size={14} />
                            Never lose access
                        </span>
                        <p className="font-display text-2xl text-text-dark mt-2 max-w-sm">
                            One link and you're back to tracking every issue in your city.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}