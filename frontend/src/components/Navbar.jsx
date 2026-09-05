import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Explore', to: '/feed', badge: true },
  { label: 'Community', to: '/community-impact' },
];

function PulseUnderline() {
  return (
    <svg className="uv-pulse-track" viewBox="0 0 40 10" aria-hidden="true">
      <path className="uv-pulse-path" d="M0 5 H12 L16 1 L20 9 L24 3 L28 5 H40" />
      <motion.circle className="uv-pulse-dot" cx="40" cy="5" r="2" fill="#FF5A1F" />
    </svg>
  );
}

function ScribbleCircle({ className = '' }) {
  return (
    <svg
      className={`uv-scribble ${className}`}
      viewBox="0 0 140 60"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="uv-scribble-path"
        d="M42 6 C30 3 16 8 10 16 C4 24 3 30 9 34 C4 38 5 46 12 49 C20 54 30 50 38 53
           C48 57 60 56 68 52 C78 57 92 55 100 50 C110 53 124 48 128 40
           C134 33 132 24 126 20 C132 15 129 6 120 4 C110 1 96 5 88 3
           C78 0 64 2 56 5 C50 2 46 4 42 6 Z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <style>{`
        .uv-navlink {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 4px 2px;
        }
        .uv-pulse-track { width: 40px; height: 10px; overflow: visible; }
        .uv-pulse-path {
          fill: none;
          stroke: currentColor;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          transition: stroke-dashoffset 0.45s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .uv-navlink:hover .uv-pulse-path,
        .uv-navlink[data-active='true'] .uv-pulse-path { stroke-dashoffset: 0; }
        .uv-pulse-dot {
          opacity: 0;
          transform-origin: center;
          transition: opacity 0.2s ease 0.3s, transform 0.3s ease 0.3s;
        }
        .uv-navlink:hover .uv-pulse-dot,
        .uv-navlink[data-active='true'] .uv-pulse-dot { opacity: 1; transform: scale(1); }
        .uv-wordmark {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(0.95rem, 4.5vw, 1.28rem);
          letter-spacing: -0.03em;
          line-height: 1;
          white-space: nowrap;
        }
        .uv-wordmark-dot { color: #FF5A1F; }
        .uv-brand-mark { filter: drop-shadow(0 0 10px rgba(198, 255, 61, 0.25)); }

        .uv-nav-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #FF5A1F;
          box-shadow: 0 0 0 0 rgba(255, 90, 31, 0.6);
          animation: uv-dot-pulse 1.8s ease-out infinite;
        }
        @keyframes uv-dot-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 90, 31, 0.55); }
          70% { box-shadow: 0 0 0 6px rgba(255, 90, 31, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 90, 31, 0); }
        }

        .uv-wave-wrap {
          position: relative;
          display: inline-flex;
        }
        .uv-wave-svg {
          position: absolute;
          inset: -3px;
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .uv-wave-wrap:hover .uv-wave-svg { opacity: 1; }
        .uv-wave-rect {
          fill: none;
          stroke: #d4f942;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-dasharray: 5 6;
          animation: uv-wave-flow 1s linear infinite;
        }
        @keyframes uv-wave-flow {
          to { stroke-dashoffset: -22; }
        }
      `}</style>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(17,18,20,0.82)' : 'rgba(0,0,0,0)',
          borderColor: scrolled ? 'rgba(38,39,43,1)' : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-md ${
          scrolled ? 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]' : ''
        }`}
      >
        <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 h-16 md:h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">            <img src={logo} alt="" className="w-8 h-8 sm:w-9 sm:h-9 object-contain uv-brand-mark" />
            <span className="uv-wordmark text-text-light dark:text-text-dark">
              Urban<span className="text-volt">Voice</span>
              <span className="uv-wordmark-dot">.</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-5 lg:gap-9">            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `uv-navlink whitespace-nowrap text-[13.5px] lg:text-[15px] font-medium font-body transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${
                      scrolled
                        ? isActive
                          ? 'text-text-light dark:text-text-dark'
                          : 'text-text-light-muted dark:text-text-dark-muted hover:text-text-light dark:hover:text-text-dark'
                        : isActive
                          ? 'text-white'
                          : 'text-white/75 hover:text-white'
                    }`
                  }
                  data-active={pathname === link.to}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {link.label}
                    {link.badge && <span className="uv-nav-dot" />}
                  </span>
                  <PulseUnderline />
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">            {isAuthenticated ? (
              <span className="uv-wave-wrap rounded-full">
                <Link
                  to="/feed"
                  className="relative px-3.5 lg:px-5 py-2 rounded-full bg-navy text-volt whitespace-nowrap text-[13.5px] lg:text-[14.5px] font-semibold font-body hover:bg-navy-dim hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Explore
                </Link>
                <svg className="uv-wave-svg" preserveAspectRatio="none" viewBox="0 0 100 40" aria-hidden="true">
                  <rect x="2" y="2" width="96" height="36" rx="18" className="uv-wave-rect" />
                </svg>
              </span>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-2.5 lg:px-4 py-2 whitespace-nowrap text-[13.5px] lg:text-[14.5px] font-medium font-body text-text-light dark:text-text-dark hover:text-volt-dim dark:hover:text-volt transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="px-3.5 lg:px-5 py-2 rounded-full bg-navy text-volt whitespace-nowrap text-[13.5px] lg:text-[14.5px] font-semibold font-body hover:bg-navy-dim hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center shrink-0 text-text-light dark:text-text-dark"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-paper-100 dark:bg-ink-900 border-t border-paper-300 dark:border-ink-800"
            >
              <div className="px-4 sm:px-5 py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `block py-3.5 text-[15px] font-medium font-body border-b border-paper-200 dark:border-ink-800 last:border-b-0 ${
                          isActive
                            ? 'text-volt-dim dark:text-volt'
                            : 'text-text-light dark:text-text-dark'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}

                <div className="flex items-center gap-2 sm:gap-3 mt-4">
                  {isAuthenticated ? (
                    <Link
                      to="/feed"
                      className="flex-1 text-center py-2.5 rounded-full bg-volt text-ink-950 text-[14px] sm:text-[14.5px] font-semibold font-body"
                    >
                      Explore
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex-1 text-center py-2.5 rounded-full border border-paper-300 dark:border-ink-700 text-text-light dark:text-text-dark text-[14px] sm:text-[14.5px] font-medium font-body"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        className="flex-1 text-center py-2.5 rounded-full bg-volt text-ink-950 text-[14px] sm:text-[14.5px] font-semibold font-body"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}