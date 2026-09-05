import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, Clock, Loader2, CheckCircle2, XCircle, AlertTriangle, MapPin, Tag, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

const MEDIA_BASE = 'http://localhost:5000';

const STATUS_TABS = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const STATUS_STYLES = {
  Pending: { bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/30', icon: Clock },
  'In Progress': { bg: 'bg-sky-400/10', text: 'text-sky-400', border: 'border-sky-400/30', icon: Loader2 },
  Resolved: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/30', icon: CheckCircle2 },
  Rejected: { bg: 'bg-red-400/10', text: 'text-red-400', border: 'border-red-400/30', icon: XCircle },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold font-body ${style.bg} ${style.text} ${style.border}`}>
      <Icon size={12} className={status === 'In Progress' ? 'animate-spin' : ''} />
      {status}
    </span>
  );
}

function ComplaintCard({ complaint, index }) {
  const mediaUrl = complaint.mediaUrl ? `${MEDIA_BASE}${complaint.mediaUrl}` : null;
  const slaBreached =
    complaint.status !== 'Resolved' &&
    complaint.status !== 'Rejected' &&
    complaint.expectedResolutionDate &&
    new Date() > new Date(complaint.expectedResolutionDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      className="rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden flex flex-col sm:flex-row"
    >
      <div className="w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-ink-800">
        {mediaUrl ? (
          complaint.mediaType === 'video' ? (
            <video src={mediaUrl} className="w-full h-full object-cover" muted />
          ) : (
            <img src={mediaUrl} alt={complaint.caption} className="w-full h-full object-cover" />
          )
        ) : null}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-body text-text-dark-muted">#{complaint.ticketId}</p>
            <p className="text-[14px] font-body text-text-dark line-clamp-2 mt-0.5">
              {complaint.caption || 'No description'}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11.5px] font-body text-text-dark-muted mt-1">
          <span className="inline-flex items-center gap-1">
            <Tag size={12} /> {complaint.category} · {complaint.department}
          </span>
          {complaint.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {complaint.location}
            </span>
          )}
          <span>Priority: {complaint.priorityScore}</span>
        </div>

        {slaBreached && (
          <div className="inline-flex items-center gap-1.5 text-[11.5px] font-body text-red-400 mt-1">
            <AlertTriangle size={12} /> SLA breached — resolution overdue
          </div>
        )}

        {complaint.status === 'Resolved' && complaint.resolutionNote && (
          <p className="text-[12px] font-body text-text-dark-muted mt-1 border-t border-ink-800 pt-2">
            <span className="text-emerald-400 font-semibold">Resolution: </span>
            {complaint.resolutionNote}
          </p>
        )}

        <p className="text-[10.5px] font-body text-text-dark-muted/70 mt-auto pt-1">
          Filed on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
}

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = (showLoader = true) => {
    if (!user?._id) return;
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    api.getComplaintsByUser(user._id)
      .then((res) => setComplaints(res.data || []))
      .catch(() => setComplaints([]))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchComplaints(true);
  }, [user?._id]);

  useEffect(() => {
    const onFocus = () => fetchComplaints(false);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user?._id]);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return complaints;
    return complaints.filter((c) => c.status === activeTab);
  }, [complaints, activeTab]);

  const counts = useMemo(() => {
    const base = { All: complaints.length, Pending: 0, 'In Progress': 0, Resolved: 0, Rejected: 0 };
    complaints.forEach((c) => { base[c.status] = (base[c.status] || 0) + 1; });
    return base;
  }, [complaints]);

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-8 py-8">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-[#f5d576]" />
            <h1 className="text-[24px] font-display font-bold text-text-dark">My Complaints</h1>
          </div>
          <button
            onClick={() => fetchComplaints(false)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-[12.5px] font-body text-text-dark-muted hover:text-text-dark border border-ink-700 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <p className="text-[13.5px] font-body text-text-dark-muted mb-6">
          Track the status of every issue you've reported.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold font-body border transition-colors ${
                activeTab === tab
                  ? 'bg-[#f5d576] text-ink-950 border-[#f5d576]'
                  : 'bg-ink-900 text-text-dark-muted border-ink-700 hover:border-ink-600'
              }`}
            >
              {tab} {counts[tab] ? `(${counts[tab]})` : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[13px] font-body text-text-dark-muted">Loading your complaints…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-ink-800 bg-ink-900 p-10 text-center">
            <p className="text-[14px] font-body text-text-dark-muted">
              {activeTab === 'All' ? "You haven't filed any complaints yet." : `No ${activeTab.toLowerCase()} complaints.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((c, i) => (
              <ComplaintCard key={c._id} complaint={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}