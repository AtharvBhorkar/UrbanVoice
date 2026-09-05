import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  Users, ClipboardList, Clock, Loader2, CheckCircle2, XCircle, Timer, AlertTriangle,
} from 'lucide-react';
import { getAnalytics, getAllComplaintsAdmin } from '../../services/api.js';

const STATUS_COLORS = {
  Pending: '#F5B942',
  'In Progress': '#4C8DFF',
  Resolved: '#34C77B',
  Rejected: '#94969C',
};

function StatCard({ icon: Icon, label, value, tone = 'default' }) {
  const toneClasses = {
    default: 'text-text-dark',
    signal: 'text-signal',
    danger: 'text-red-400',
  };
  return (
    <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <span className="font-body text-xs text-text-dark-muted uppercase tracking-wide truncate">
          {label}
        </span>
        <Icon size={16} className="text-text-dark-muted shrink-0" />
      </div>
      <p className={`font-display text-xl sm:text-2xl truncate ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [needsAttention, setNeedsAttention] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, complaintsRes] = await Promise.all([
          getAnalytics(),
          getAllComplaintsAdmin(),
        ]);
        setAnalytics(analyticsRes.data);

        const complaints = complaintsRes.data;
        const priority = complaints
          .filter((c) => c.slaBreached || (c.status === 'Pending' && c.priorityScore > 0))
          .sort((a, b) => {
            if (a.slaBreached !== b.slaBreached) return a.slaBreached ? -1 : 1;
            return b.priorityScore - a.priorityScore;
          })
          .slice(0, 5);
        setNeedsAttention(priority);
      } catch (err) {
        setError(err.response?.data?.message || 'Dashboard load nahi ho paya.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const pieData = [
    { name: 'Pending', value: analytics.pending },
    { name: 'In Progress', value: analytics.inProgress },
    { name: 'Resolved', value: analytics.resolved },
    { name: 'Rejected', value: analytics.rejected },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl text-text-dark">Dashboard</h1>
        <p className="font-body text-sm text-text-dark-muted mt-1">
          UrbanVoice ka overall snapshot
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} />
        <StatCard icon={ClipboardList} label="Total Complaints" value={analytics.totalComplaints} />
        <StatCard icon={Clock} label="Pending" value={analytics.pending} />
        <StatCard icon={Loader2} label="In Progress" value={analytics.inProgress} />
        <StatCard icon={CheckCircle2} label="Resolved" value={analytics.resolved} />
        <StatCard icon={XCircle} label="Rejected" value={analytics.rejected} />
        <StatCard icon={Timer} label="Avg Resolution (days)" value={analytics.avgResolutionDays} />
        <StatCard
          icon={AlertTriangle}
          label="SLA Breaches"
          value={analytics.slaBreached}
          tone={analytics.slaBreached > 0 ? 'danger' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-6">
          <h2 className="font-display text-base text-text-dark mb-4">Status Distribution</h2>
          {pieData.length === 0 ? (
            <p className="font-body text-sm text-text-dark-muted">Abhi tak koi complaint nahi hai.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1B1C1F',
                    border: '1px solid #26272B',
                    borderRadius: 12,
                    fontFamily: 'Inter',
                    fontSize: 13,
                    color: '#F3F3EF',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[entry.name] }}
                />
                <span className="font-body text-xs text-text-dark-muted">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-6">
          <h2 className="font-display text-base text-text-dark mb-4">Needs Attention</h2>
          {needsAttention.length === 0 ? (
            <p className="font-body text-sm text-text-dark-muted">
              Sab kuch under control hai — koi urgent complaint nahi.
            </p>
          ) : (
            <div className="space-y-2">
              {needsAttention.map((c) => (
                <Link
                  key={c._id}
                  to={`/admin/complaints/${c._id}`}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-ink-800 hover:bg-ink-700 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-body text-sm text-text-dark truncate">{c.ticketId}</p>
                    <p className="font-body text-xs text-text-dark-muted truncate">
                      {c.category} · {c.department}
                    </p>
                  </div>
                  {c.slaBreached ? (
                    <span className="shrink-0 ml-3 text-xs font-body font-medium text-signal bg-signal-soft px-2.5 py-1 rounded-full">
                      SLA Breached
                    </span>
                  ) : (
                    <span className="shrink-0 ml-3 text-xs font-body font-medium text-text-dark-muted bg-ink-700 px-2.5 py-1 rounded-full">
                      Priority {c.priorityScore}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}