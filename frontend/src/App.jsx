import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import IntroLoader from './components/IntroLoader.jsx';
import HomeFeedPage from './pages/feed/HomeFeedPage.jsx';
import CreatePostPage from './pages/feed/CreatePostPage.jsx';
import CreateReelPage from './pages/feed/CreateReelPage.jsx';
import NotificationsPage from './pages/feed/NotificationsPage.jsx';
import ReelsPage from './pages/feed/ReelsPage.jsx';
import ProfilePage from './pages/feed/ProfilePage.jsx';
import UserProfilePage from './pages/feed/UserProfilePage.jsx';
import LeaderboardPage from './pages/feed/LeaderboardPage.jsx';
import MyBadgesPage from './pages/feed/MyBadgesPage.jsx';
import SearchPage from './pages/feed/SearchPage.jsx';
import MessagesPage from './pages/feed/MessagesPage.jsx';
import HelpFAQ from './pages/feed/HelpFAQ.jsx';import LandingPage from './pages/public/LandingPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import CommunityImpactPage from './pages/extra/CommunityImpactPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';

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
  '/feed', '/reels', '/search', '/messages', '/explore', '/leaderboard', '/create', '/create-reel',
  '/notifications', '/profile', '/my-complaints', '/my-badges',
  '/saved-issues', '/settings', '/help',
];
export default function App() {
  const { pathname } = useLocation();
  const isAppRoute = APP_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  if (isAuthRoute) {
    return (
      <>
        <IntroLoader />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </>
    );
  }

  if (isAppRoute) {
    return (
      <>
        <IntroLoader title="Urban's Reel" subtitle="Solve your problems with UrbanVoice" />
        <Sidebar />
        <Routes>
          <Route path="/feed" element={<HomeFeedPage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/explore" element={<AppPlaceholder title="Explore" />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/create-reel" element={<CreateReelPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<UserProfilePage />} />
          <Route path="/my-complaints" element={<AppPlaceholder title="My Complaints" />} />
          <Route path="/my-badges" element={<MyBadgesPage />} />
          <Route path="/saved-issues" element={<AppPlaceholder title="Saved Issues" />} />
          <Route path="/settings" element={<AppPlaceholder title="Settings" />} />
          <Route path="/help" element={<HelpFAQ />} />        </Routes>
      </>
    );
  }

  return (
    <>
      <IntroLoader />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/community-impact" element={<CommunityImpactPage />} />
      </Routes>
      <Footer />
    </>
  );
}