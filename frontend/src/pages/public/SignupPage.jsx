import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Mail, ArrowRight, MapPin, Phone, AtSign, User, Camera, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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

export default function SignupPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        confirmPassword: '',
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((i) => (i + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.username || !form.email || !form.password) {
            setError('Please fill in name, username, email and password.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!agreed) {
            setError('Please agree to the Terms and Privacy Policy to continue.');
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 700));
            navigate('/feed');
        } catch (err) {
            setError('Could not create your account. Please try again.');
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
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase text-volt font-body">
                            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                            Join the movement
                        </span>
                        <h1 className="font-display text-4xl sm:text-5xl text-text-dark mt-4 leading-[1.1]">
                            Your voice, your city.
                        </h1>
                        <p className="font-body text-text-dark-muted mt-3 text-[15px]">
                            Create an account to report issues, earn badges, and see your impact go live.
                        </p>

                        <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:p-7">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 rounded-xl bg-ink-800 border border-ink-600 text-text-dark font-body font-medium py-3 hover:bg-ink-700 transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
                                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
                                    <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
                                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
                                </svg>
                                Continue with Google
                            </button>

                            <div className="flex items-center gap-3 my-5">
                                <span className="h-px flex-1 bg-ink-700" />
                                <span className="text-xs font-body text-text-dark-muted uppercase tracking-wide">or</span>
                                <span className="h-px flex-1 bg-ink-700" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Avatar upload */}
                                <div className="flex items-center gap-4 pb-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative h-14 w-14 shrink-0 rounded-full bg-ink-800 border border-ink-600 flex items-center justify-center overflow-hidden hover:border-signal transition-colors"
                                    >
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Camera size={18} className="text-text-dark-muted" />
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <p className="text-sm font-body text-text-dark">Profile photo</p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-xs font-body text-volt hover:underline"
                                            >
                                                {avatarPreview ? 'Change photo' : 'Upload photo (optional)'}
                                            </button>
                                            {avatarPreview && (
                                                <button
                                                    type="button"
                                                    onClick={() => setAvatarPreview(null)}
                                                    className="text-xs font-body text-text-dark-muted hover:text-red-400 flex items-center gap-1"
                                                >
                                                    <X size={12} /> Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={updateField('name')}
                                            placeholder="Full name"
                                            className="w-full rounded-xl bg-ink-800 border border-ink-600 pl-11 pr-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <AtSign size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
                                        <input
                                            type="text"
                                            value={form.username}
                                            onChange={updateField('username')}
                                            placeholder="Username"
                                            className="w-full rounded-xl bg-ink-800 border border-ink-600 pl-11 pr-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={updateField('email')}
                                        placeholder="Enter your email"
                                        className="w-full rounded-xl bg-ink-800 border border-ink-600 pl-11 pr-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={updateField('phone')}
                                            placeholder="Phone number"
                                            className="w-full rounded-xl bg-ink-800 border border-ink-600 pl-11 pr-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted" />
                                        <input
                                            type="text"
                                            value={form.city}
                                            onChange={updateField('city')}
                                            placeholder="City"
                                            className="w-full rounded-xl bg-ink-800 border border-ink-600 pl-11 pr-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={updateField('password')}
                                        placeholder="Password"
                                        className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                    />
                                    <input
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={updateField('confirmPassword')}
                                        placeholder="Confirm password"
                                        className="w-full rounded-xl bg-ink-800 border border-ink-600 px-4 py-3 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
                                    />
                                </div>

                                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-ink-600 bg-ink-800 accent-volt"
                                    />
                                    <span className="text-xs font-body text-text-dark-muted leading-relaxed">
                                        I agree to UrbanVoice's{' '}
                                        <Link to="/terms" className="text-volt hover:underline">Terms</Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className="text-volt hover:underline">Privacy Policy</Link>.
                                    </span>
                                </label>

                                {error && (
                                    <p className="text-sm font-body text-red-400">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-volt text-ink-950 font-body font-semibold py-3 hover:bg-volt-dim transition-colors disabled:opacity-60"
                                >
                                    {loading ? 'Creating account…' : 'Create account'}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-sm font-body text-text-dark-muted mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-volt font-medium hover:underline">
                                Log in
                            </Link>
                        </p>
                    </motion.div>
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
                            Post it. Get it fixed.
                        </span>
                        <p className="font-display text-2xl text-text-dark mt-2 max-w-sm">
                            Every report, like, and share pushes your city's issues closer to resolved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}