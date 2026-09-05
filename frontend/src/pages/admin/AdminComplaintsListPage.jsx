import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, ImageOff } from 'lucide-react';
import { getAllComplaintsAdmin } from '../../services/api.js';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const CATEGORIES = ['Civic', 'Society', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Other'];
const DEPARTMENTS = ['Water', 'Electricity', 'Sanitation', 'Roads', 'Civic', 'Society', 'General'];

const STATUS_BADGE = {
  Pending: 'text-amber-400 bg-amber-400/10',
  'In Progress': 'text-blue-400 bg-blue-400/10',
  Resolved: 'text-emerald-400 bg-emerald-400/10',
  Rejected: 'text-text-dark-muted bg-ink-700',
};

export default function AdminComplaintsListPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '', department: '' });

  const loadComplaints = async (activeFilters) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (activeFilters.status) params.status = activeFilters.status;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.department) params.department = activeFilters.department;

      const res = await getAllComplaintsAdmin(params);
      setComplaints(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Complaints load nahi ho paayi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints(filters);
  }, []);

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    loadComplaints(next);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-text-dark">Complaints</h1>
        <p className="font-body text-sm text-text-dark-muted mt-1">
          Sabhi citizen complaints, priority se sorted
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap gap-3">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full sm:w-auto bg-ink-900 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full sm:w-auto bg-ink-900 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="w-full sm:w-auto bg-ink-900 border border-ink-700 rounded-xl px-3 py-2 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-signal" size={24} />
          </div>
        ) : error ? (
          <p className="font-body text-sm text-red-400 p-6">{error}</p>
        ) : complaints.length === 0 ? (
          <p className="font-body text-sm text-text-dark-muted p-6">
            Is filter ke saath koi complaint nahi mili.
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Ticket</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3"></th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Category</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Department</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Status</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Priority</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">User</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Created</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">SLA</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800 transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/complaints/${c._id}`} className="font-body text-sm text-signal hover:underline">
                      {c.ticketId}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    {c.mediaType === 'image' && c.mediaUrl ? (
                      <img
                        src={c.mediaUrl.startsWith('http') ? c.mediaUrl : `http://localhost:5000${c.mediaUrl}`}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-ink-800 flex items-center justify-center">
                        <ImageOff size={14} className="text-text-dark-muted" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark">{c.category}</td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark">{c.department}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark">{c.priorityScore}</td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark-muted">{c.user?.username || '—'}</td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark-muted">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    {c.slaBreached && (
                      <span className="inline-flex items-center gap-1 text-xs font-body font-medium text-signal bg-signal-soft px-2.5 py-1 rounded-full">
                        <AlertTriangle size={11} />
                        Breached
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}