import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import IntroLoader from './components/IntroLoader.jsx';
import HomeFeedPage from './pages/feed/HomeFeedPage.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminComplaintsListPage from './pages/admin/AdminComplaintsListPage.jsx';
import AdminComplaintDetailPage from './pages/admin/AdminComplaintDetailPage.jsx';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage.jsx';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage.jsx';
import AdminCategoryManagementPage from './pages/admin/AdminCategoryManagementPage.jsx';
import AdminReportsExportPage from './pages/admin/AdminReportsExportPage.jsx';
import CreatePostPage from './pages/feed/CreatePostPage.jsx';
import CreateReelPage from './pages/feed/CreateReelPage.jsx';
import NotificationsPage from './pages/feed/NotificationsPage.jsx';
import SettingsPage from './pages/feed/SettingsPage.jsx';
import ReelsPage from './pages/feed/ReelsPage.jsx';
import ProfilePage from './pages/feed/ProfilePage.jsx';
import UserProfilePage from './pages/feed/UserProfilePage.jsx';
import LeaderboardPage from './pages/feed/LeaderboardPage.jsx';
import MyBadgesPage from './pages/feed/MyBadgesPage.jsx';
import SearchPage from './pages/feed/SearchPage.jsx';
import MessagesPage from './pages/feed/MessagesPage.jsx';
import HelpFAQ from './pages/feed/HelpFAQ.jsx';
import MyComplaintsPage from './pages/feed/MyComplaintsPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import CommunityImpactPage from './pages/extra/CommunityImpactPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';

function AppPlaceholder({ title }) {
  return (
    <div className="min-h-screen ml-0 md:ml-[76px] flex items-center justify-center bg-ink-950">
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
  const { isAuthenticated, loading } = useAuth();
  const isAppRoute = APP_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/complaints" element={<AdminComplaintsListPage />} />
          <Route path="/admin/complaints/:id" element={<AdminComplaintDetailPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/users" element={<AdminUserManagementPage />} />
          <Route path="/admin/categories" element={<AdminCategoryManagementPage />} />
          <Route path="/admin/reports" element={<AdminReportsExportPage />} />
        </Route>
      </Routes>
    );
  }

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
    if (loading) return null;
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return (
      <>
        <IntroLoader title="Urban's Reel" subtitle="Solve your problems with UrbanVoice" />
        <Sidebar />
        <MobileBottomNav />
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
          <Route path="/my-complaints" element={<MyComplaintsPage />} />
          <Route path="/my-badges" element={<MyBadgesPage />} />
          <Route path="/saved-issues" element={<AppPlaceholder title="Saved Issues" />} />
          <Route path="/settings" element={<SettingsPage />} />
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