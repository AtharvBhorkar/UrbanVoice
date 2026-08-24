import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import HomeFeedPage from './pages/feed/HomeFeedPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';

function Placeholder({ title }) {
  return (
    <div className="min-h-[140vh] pt-[72px] flex items-start justify-center bg-paper-50 dark:bg-ink-950 transition-colors">
      <p className="mt-32 font-display text-2xl text-text-light dark:text-text-dark">
        {title} — page coming next
      </p>
    </div>
  );
}

function AppPlaceholder({ title }) {
  return (
    <div className="min-h-screen ml-[76px] flex items-center justify-center bg-ink-950">
      <p className="font-display text-2xl text-text-dark">
        {title} — page coming next
      </p>
    </div>
  );
}

const APP_ROUTES = [
  '/feed', '/reels', '/explore', '/leaderboard', '/create',
  '/notifications', '/profile', '/my-complaints', '/my-badges',
  '/saved-issues', '/settings',
];

export default function App() {
  const { pathname } = useLocation();
  const isAppRoute = APP_ROUTES.some((route) => pathname.startsWith(route));

  if (isAppRoute) {
    return (
      <>
        <Sidebar />
        <Routes>
          <Route path="/feed" element={<HomeFeedPage />} />
          <Route path="/reels" element={<AppPlaceholder title="Reels" />} />
          <Route path="/explore" element={<AppPlaceholder title="Explore" />} />
          <Route path="/leaderboard" element={<AppPlaceholder title="Leaderboard" />} />
          <Route path="/create" element={<AppPlaceholder title="Report an issue" />} />
          <Route path="/notifications" element={<AppPlaceholder title="Notifications" />} />
          <Route path="/profile" element={<AppPlaceholder title="My Profile" />} />
          <Route path="/my-complaints" element={<AppPlaceholder title="My Complaints" />} />
          <Route path="/my-badges" element={<AppPlaceholder title="My Badges" />} />
          <Route path="/saved-issues" element={<AppPlaceholder title="Saved Issues" />} />
          <Route path="/settings" element={<AppPlaceholder title="Settings" />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Placeholder title="Login" />} />
        <Route path="/signup" element={<Placeholder title="Signup" />} />
      </Routes>
      <Footer />
    </>
  );
}