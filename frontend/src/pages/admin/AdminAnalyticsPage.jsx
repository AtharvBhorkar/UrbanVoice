import { useEffect, useMemo, useState } from 'react';
import { Loader2, Users, FileText, Clock, AlertTriangle } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { getAnalytics, getAllComplaintsAdmin } from '../../services/api.js';

const STATUS_COLORS = {
  Pending: '#F59E0B',
  'In Progress': '#60A5FA',
  Resolved: '#34D399',
  Rejected: '#3A3B40',
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="font-body text-xs text-text-dark-muted uppercase tracking-wide truncate">{label}</p>
        <p className="font-display text-lg sm:text-xl text-text-dark mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5 ${className}`}>
      <h3 className="font-display text-sm text-text-dark mb-4">{title}</h3>
      <div className="h-56 sm:h-64 lg:h-72">{children}</div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [analyticsRes, complaintsRes] = await Promise.all([
          getAnalytics(),
          getAllComplaintsAdmin({}),
        ]);
        setAnalytics(analyticsRes.data);
        setComplaints(complaintsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Analytics load nahi ho paayi.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: 'Pending', value: analytics.pending },
      { name: 'In Progress', value: analytics.inProgress },
      { name: 'Resolved', value: analytics.resolved },
      { name: 'Rejected', value: analytics.rejected },
    ].filter((d) => d.value > 0);
  }, [analytics]);

  const categoryData = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  const departmentData = useMemo(() => {
    const counts = {};
    complaints.forEach((c) => {
      counts[c.department] = (counts[c.department] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-signal" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="font-body text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-text-dark">Analytics</h1>
        <p className="font-body text-sm text-text-dark-muted mt-1">
          Platform-wide complaint metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={FileText}
          label="Total Complaints"
          value={analytics.totalComplaints}
          accent="bg-navy-soft text-navy"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={analytics.totalUsers}
          accent="bg-signal-soft text-signal"
        />
        <StatCard
          icon={Clock}
          label="Avg Resolution"
          value={`${analytics.avgResolutionDays}d`}
          accent="bg-emerald-400/10 text-emerald-400"
        />
        <StatCard
          icon={AlertTriangle}
          label="SLA Breached"
          value={analytics.slaBreached}
          accent="bg-signal-soft text-signal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Status Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Legend
                wrapperStyle={{ fontFamily: 'Inter', fontSize: 12, color: '#94969C' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1B1C1F',
                  border: '1px solid #26272B',
                  borderRadius: 12,
                  fontFamily: 'Inter',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26272B" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94969C', fontSize: 11 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#94969C', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1B1C1F',
                  border: '1px solid #26272B',
                  borderRadius: 12,
                  fontFamily: 'Inter',
                  fontSize: 12,
                }}
                cursor={{ fill: 'rgba(201,162,39,0.06)' }}
              />
              <Bar dataKey="count" fill="#C9A227" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints by Department" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26272B" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94969C', fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fill: '#94969C', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#1B1C1F',
                  border: '1px solid #26272B',
                  borderRadius: 12,
                  fontFamily: 'Inter',
                  fontSize: 12,
                }}
                cursor={{ fill: 'rgba(18,42,82,0.15)' }}
              />
              <Bar dataKey="count" fill="#122A52" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}