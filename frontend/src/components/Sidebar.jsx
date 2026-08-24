import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Clapperboard, Compass, Trophy, MessageSquarePlus, PlusSquare,
  Search, MessageCircle, Bell, User, FileText, Award, Bookmark,
  Settings, HelpCircle, Info, Sun, Moon, LogOut, Menu,
} from 'lucide-react';
import logo from '../assets/logo.png';

const NAV_ITEMS = [
  { icon: Home, label: 'Home Feed', to: '/feed' },
  { icon: Clapperboard, label: 'Reels', to: '/reels' },
  { icon: Compass, label: 'Explore', to: '/explore' },
  { icon: Search, label: 'Search', to: '/search' },
  { icon: MessageCircle, label: 'Messages', to: '/messages', badge: 3 },
  { icon: PlusSquare, label: 'Create', to: '/create' },
  { icon: Trophy, label: 'Leaderboard', to: '/leaderboard' },
];

const PROFILE_MENU = [
  { icon: User, label: 'My Profile', to: '/profile' },
  { icon: FileText, label: 'My Complaints', to: '/my-complaints' },
  { icon: Award, label: 'My Badges', to: '/my-badges' },
  { icon: Bookmark, label: 'Saved Issues', to: '/saved-issues' },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const profileRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => { setExpanded(false); setProfileOpen(false); setMoreOpen(false); }}
      animate={{ width: expanded ? 240 : 76 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-ink-950 border-r border-ink-800 flex flex-col justify-between py-6 overflow-hidden"
    >
      <div>
        <NavLink to="/" className="flex items-center gap-3.5 px-[22px] mb-8">
          <img src={logo} alt="" className="w-8 h-8 object-contain shrink-0" />
          <span
            className={`font-display font-bold text-[17px] text-text-dark whitespace-nowrap transition-opacity duration-200 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Urban<span className="text-volt">Voice</span>
          </span>
        </NavLink>

        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors whitespace-nowrap relative ${
                  isActive
                    ? 'bg-ink-800 text-text-dark'
                    : 'text-text-dark-muted hover:bg-ink-900 hover:text-text-dark'
                }`
              }
            >
              <span className="relative shrink-0">
                <item.icon size={22} strokeWidth={2} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-signal text-[10px] font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span
                className={`text-[14.5px] font-body font-medium transition-opacity duration-200 ${
                  expanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}

          <NavLink
            to="/create"
            className="flex items-center gap-4 px-3 py-3 mt-2 rounded-xl bg-volt text-ink-950 hover:bg-volt-dim transition-colors whitespace-nowrap"
          >
            <MessageSquarePlus size={22} className="shrink-0" strokeWidth={2.2} />
            <span
              className={`text-[14.5px] font-body font-semibold transition-opacity duration-200 ${
                expanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Report Issue
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-1 px-3">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors whitespace-nowrap relative ${
              isActive
                ? 'bg-ink-800 text-text-dark'
                : 'text-text-dark-muted hover:bg-ink-900 hover:text-text-dark'
            }`
          }
        >
          <span className="relative shrink-0">
            <Bell size={22} strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-signal" />
          </span>
          <span
            className={`text-[14.5px] font-body font-medium transition-opacity duration-200 ${
              expanded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Notifications
          </span>
        </NavLink>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((v) => !v); setMoreOpen(false); }}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-text-dark-muted hover:bg-ink-900 hover:text-text-dark transition-colors whitespace-nowrap"
          >
            <span className="w-[22px] h-[22px] rounded-full bg-volt/20 border border-volt/40 flex items-center justify-center shrink-0">
              <span className="text-volt text-[10px] font-bold font-body">AB</span>
            </span>
            <span
              className={`text-[14.5px] font-body font-medium transition-opacity duration-200 ${
                expanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Profile
            </span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-full bottom-0 ml-2 w-56 rounded-2xl bg-ink-900 border border-ink-700 shadow-2xl py-2"
              >
                {PROFILE_MENU.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-body text-text-dark hover:bg-ink-800 transition-colors"
                  >
                    <item.icon size={17} />
                    {item.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={moreRef}>
          <button
            onClick={() => { setMoreOpen((v) => !v); setProfileOpen(false); }}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-text-dark-muted hover:bg-ink-900 hover:text-text-dark transition-colors whitespace-nowrap"
          >
            <Menu size={22} className="shrink-0" strokeWidth={2} />
            <span
              className={`text-[14.5px] font-body font-medium transition-opacity duration-200 ${
                expanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              More
            </span>
          </button>

          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-full bottom-0 ml-2 w-60 rounded-2xl bg-ink-900 border border-ink-700 shadow-2xl py-2"
              >
                <NavLink
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-body text-text-dark hover:bg-ink-800 transition-colors"
                >
                  <Settings size={17} />
                  Settings
                </NavLink>
                <NavLink
                  to="/help"
                  className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-body text-text-dark hover:bg-ink-800 transition-colors"
                >
                  <HelpCircle size={17} />
                  Help &amp; FAQ
                </NavLink>
                <NavLink
                  to="/about"
                  className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-body text-text-dark hover:bg-ink-800 transition-colors"
                >
                  <Info size={17} />
                  About UrbanVoice
                </NavLink>

                <button
                  onClick={() => setIsDark((v) => !v)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-body text-text-dark hover:bg-ink-800 transition-colors"
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                  Switch to {isDark ? 'light' : 'dark'} mode
                </button>

                <div className="h-px bg-ink-700 my-1.5 mx-4" />

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-body text-signal hover:bg-ink-800 transition-colors">
                  <LogOut size={17} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}