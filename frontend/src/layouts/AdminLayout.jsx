import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';

export default function AdminLayout() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <AdminSidebar />
      <main className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}