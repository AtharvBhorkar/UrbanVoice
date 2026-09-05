import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, Film, User } from 'lucide-react';

export default function MobileBottomNav() {
  const navigate = useNavigate();

  const ITEMS = [
    { icon: Home, to: '/feed', label: 'Home' },
    { icon: Film, to: '/reels', label: 'Voice Reels' },
    { icon: PlusSquare, to: '/create', label: 'Create' },
    { icon: Search, to: '/search', label: 'Search' },
    { icon: User, to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink-950 border-t border-ink-800 flex items-center justify-around py-2 px-1">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-text-dark' : 'text-text-dark-muted'
            }`
          }
        >
          <item.icon size={23} strokeWidth={2} />
        </NavLink>
      ))}
    </nav>
  );
}