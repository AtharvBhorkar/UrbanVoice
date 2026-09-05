import { useState } from 'react';
import {
  Search, Loader2, MapPin, Calendar, AlertCircle, Clock,
  CheckCircle2, XCircle, RefreshCcw, Ticket,
} from 'lucide-react';
import { getComplaintById } from '../../services/api.js';

const STATUS_META = {
  Pending: { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
  'In Progress': { color: 'text-[#f5f3cd]', bg: 'bg-[#f5f3cd]/10', icon: RefreshCcw },
  Resolved: { color: 'text-[#f5f3cd]', bg: 'bg-[#f5f3cd]/10', icon: CheckCircle2 },
  Rejected: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
};

export default function TrackComplaintPage() {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [complaint, setComplaint] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = ticketId.trim();
    if (!query) return;

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const { data } = await getComplaintById(query);
      setComplaint(data);
    } catch (err) {
      setError(
        err?.response?.status === 404
          ? 'No complaint found with this ID. Double-check your ticket ID and try again.'
          : 'Something went wrong while fetching this complaint. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const meta = complaint ? STATUS_META[complaint.status] || STATUS_META.Pending : null;
  const StatusIcon = meta?.icon;

  return (
    <div className="min-h-screen bg-[#f3e8d2] px-6 md:px-12 pt-24 md:pt-32 pb-20">
      <div className="max-w-[720px] mx-auto">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide uppercase font-body text-black">
          <Ticket size={14} className="text-black" />
          Track complaint
        </span>
        <h1 className="font-display font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] mt-4 text-black">
          Where's my complaint right now?
        </h1>
        <p className="font-body text-[15px] text-black mt-4 leading-relaxed">
          Enter your ticket ID (e.g. <span className="text-black font-semibold">UV-2026-00123</span>) to see its live status.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Enter your ticket ID"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#122951] border border-[#f5f3cd]/30 text-[#f5f3cd] font-body text-[14px] placeholder:text-[#f5f3cd]/60 focus:outline-none focus:border-[#f5f3cd] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !ticketId.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#f5f3cd] text-black font-semibold font-body text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Track
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="font-body text-[14px] text-black">{error}</p>
          </div>
        )}

        {complaint && (
          <div className="mt-8 rounded-2xl border border-[#f5f3cd]/30 bg-[#122951] p-5 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-body text-[12px] text-[#f5f3cd] uppercase tracking-wide">
                  Ticket ID
                </p>
                <p className="font-display font-bold text-[18px] text-[#f5f3cd]">
                  {complaint.ticketId || complaint._id}
                </p>
              </div>
              {meta && (
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${meta.bg} ${meta.color} font-semibold font-body text-[13px]`}>
                  <StatusIcon size={14} />
                  {complaint.status}
                </span>
              )}
            </div>

            <p className="font-body text-[14px] text-[#f5f3cd] mt-5 leading-relaxed">
              {complaint.caption || 'No description provided.'}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 pt-5 border-t border-[#f5f3cd]/30">
              {complaint.category && (
                <span className="font-body text-[13px] text-[#f5f3cd]">
                  <strong className="text-[#f5f3cd]">Category:</strong> {complaint.category}
                </span>
              )}
              {complaint.department && (
                <span className="font-body text-[13px] text-[#f5f3cd]">
                  <strong className="text-[#f5f3cd]">Department:</strong> {complaint.department}
                </span>
              )}
              {complaint.location && (
                <span className="inline-flex items-center gap-1.5 font-body text-[13px] text-[#f5f3cd]">
                  <MapPin size={13} className="text-[#f5f3cd]" /> {complaint.location}
                </span>
              )}
              {complaint.createdAt && (
                <span className="inline-flex items-center gap-1.5 font-body text-[13px] text-[#f5f3cd]">
                  <Calendar size={13} className="text-[#f5f3cd]" /> Filed on {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {Array.isArray(complaint.statusHistory) && complaint.statusHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#f5f3cd]/30">
                <h3 className="font-display font-bold text-[14px] text-[#f5f3cd] mb-4">
                  Status timeline
                </h3>
                <div className="flex flex-col gap-4">
                  {complaint.statusHistory.map((entry, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#f5f3cd] mt-1.5 shrink-0" />
                      <div>
                        <p className="font-body text-[13px] font-semibold text-[#f5f3cd]">
                          {entry.status}
                        </p>
                        {entry.note && (
                          <p className="font-body text-[13px] text-[#f5f3cd] mt-0.5">
                            {entry.note}
                          </p>
                        )}
                        {entry.date && (
                          <p className="font-body text-[12px] text-[#f5f3cd]/70 mt-0.5">
                            {new Date(entry.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}