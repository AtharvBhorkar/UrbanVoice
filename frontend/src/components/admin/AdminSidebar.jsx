import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Users,
  FolderKanban,
  FileDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/complaints', label: 'Complaints', icon: ClipboardList },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/categories', label: 'Categories', icon: FolderKanban },
  { to: '/admin/reports', label: 'Reports', icon: FileDown },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-ink-900 border-b border-ink-700 flex items-center justify-between px-4 z-40">
        <h1 className="font-display text-base text-text-dark tracking-tight">
          UrbanVoice <span className="text-signal">Admin</span>
        </h1>
        <button
          onClick={() => setIsOpen(true)}
          className="text-text-dark-muted hover:text-text-dark"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-ink-900 border-r border-ink-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-5 py-6 border-b border-ink-700 flex items-center justify-between">
          <h1 className="font-display text-lg text-text-dark tracking-tight">
            UrbanVoice <span className="text-signal">Admin</span>
          </h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-text-dark-muted hover:text-text-dark"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl font-body text-sm transition-colors ${
                  isActive
                    ? 'bg-signal-soft text-signal'
                    : 'text-text-dark-muted hover:bg-ink-800 hover:text-text-dark'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-ink-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-body text-sm text-text-dark-muted hover:bg-ink-800 hover:text-text-dark transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}