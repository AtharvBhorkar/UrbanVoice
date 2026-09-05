import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ImageOff, CheckCircle2 } from 'lucide-react';
import { getComplaintById, updateComplaintStatus } from '../../services/api.js';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const STATUS_BADGE = {
  Pending: 'text-amber-400 bg-amber-400/10',
  'In Progress': 'text-blue-400 bg-blue-400/10',
  Resolved: 'text-emerald-400 bg-emerald-400/10',
  Rejected: 'text-text-dark-muted bg-ink-700',
};

const MEDIA_BASE = 'http://localhost:5000';

export default function AdminComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newStatus, setNewStatus] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const res = await getComplaintById(id);
      setComplaint(res.data);
      setNewStatus(res.data.status);
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint load nahi ho paayi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (newStatus === 'Resolved' && !resolutionNote.trim()) {
      setFormError('Resolved karne ke liye resolution note zaroori hai.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === 'Resolved') {
        payload.resolutionNote = resolutionNote.trim();
      }
      const res = await updateComplaintStatus(id, payload);
      setComplaint(res.data);
      setResolutionNote('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Status update fail ho gaya.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-signal" size={28} />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="p-8">
        <p className="font-body text-sm text-red-400">{error || 'Complaint nahi mili.'}</p>
      </div>
    );
  }

  const mediaUrl = complaint.mediaUrl?.startsWith('http')
    ? complaint.mediaUrl
    : `${MEDIA_BASE}${complaint.mediaUrl}`;
  const resolutionImageUrl = complaint.resolutionImage
    ? (complaint.resolutionImage.startsWith('http') ? complaint.resolutionImage : `${MEDIA_BASE}${complaint.resolutionImage}`)
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
      <button
        onClick={() => navigate('/admin/complaints')}
        className="flex items-center gap-1.5 font-body text-sm text-text-dark-muted hover:text-text-dark transition-colors"
      >
        <ArrowLeft size={16} />
        Back to complaints
      </button>

      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="font-display text-xl sm:text-2xl text-text-dark break-all">{complaint.ticketId}</h1>
            <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[complaint.status]}`}>
              {complaint.status}
            </span>
            {complaint.slaBreached && (
              <span className="text-xs font-body font-medium text-signal bg-signal-soft px-2.5 py-1 rounded-full whitespace-nowrap">
                SLA Breached
              </span>
            )}
          </div>
          <p className="font-body text-sm text-text-dark-muted mt-1">
            {complaint.category} · {complaint.department} · Priority {complaint.priorityScore}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden">
            {complaint.mediaType === 'video' ? (
              <video src={mediaUrl} controls className="w-full max-h-96 object-contain bg-ink-950" />
            ) : complaint.mediaUrl ? (
              <img src={mediaUrl} alt="" className="w-full max-h-96 object-contain bg-ink-950" />
            ) : (
              <div className="h-48 flex items-center justify-center">
                <ImageOff className="text-text-dark-muted" size={24} />
              </div>
            )}
            <div className="p-4 sm:p-5 space-y-3">
              {complaint.caption && (
                <p className="font-body text-sm text-text-dark">{complaint.caption}</p>
              )}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 pt-2 border-t border-ink-800">
                <div>
                  <p className="font-body text-xs text-text-dark-muted uppercase tracking-wide">Location</p>
                  <p className="font-body text-sm text-text-dark mt-0.5">{complaint.location || '—'}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-text-dark-muted uppercase tracking-wide">Reported by</p>
                  <p className="font-body text-sm text-text-dark mt-0.5">
                    {complaint.isAnonymous ? 'Anonymous' : (complaint.user?.username || '—')}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-text-dark-muted uppercase tracking-wide">Created</p>
                  <p className="font-body text-sm text-text-dark mt-0.5">
                    {new Date(complaint.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-text-dark-muted uppercase tracking-wide">Expected Resolution</p>
                  <p className="font-body text-sm text-text-dark mt-0.5">
                    {complaint.expectedResolutionDate
                      ? new Date(complaint.expectedResolutionDate).toLocaleDateString('en-IN')
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {complaint.status === 'Resolved' && complaint.resolutionNote && (
            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <h3 className="font-display text-sm text-text-dark">Resolution</h3>
              </div>
              <p className="font-body text-sm text-text-dark">{complaint.resolutionNote}</p>
              {resolutionImageUrl && (
                <img src={resolutionImageUrl} alt="" className="mt-3 rounded-xl max-h-64 object-cover" />
              )}
            </div>
          )}

          <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5">
            <h3 className="font-display text-sm text-text-dark mb-4">Status History</h3>
            {complaint.statusHistory?.length === 0 ? (
              <p className="font-body text-sm text-text-dark-muted">Koi history nahi hai.</p>
            ) : (
              <div className="space-y-4">
                {[...complaint.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`w-2 h-2 rounded-full mt-1.5 ${STATUS_BADGE[h.status]?.split(' ')[0].replace('text-', 'bg-')}`} />
                      {i !== complaint.statusHistory.length - 1 && (
                        <span className="w-px flex-1 bg-ink-700 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-body text-sm text-text-dark">{h.status}</p>
                      {h.note && <p className="font-body text-xs text-text-dark-muted mt-0.5">{h.note}</p>}
                      <p className="font-body text-xs text-text-dark-muted mt-0.5">
                        {new Date(h.date).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5 h-fit lg:sticky lg:top-6">
          <h3 className="font-display text-sm text-text-dark mb-4">Update Status</h3>
          <form onSubmit={handleStatusUpdate} className="space-y-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-ink-800 border border-ink-700 rounded-xl px-3 py-2.5 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {newStatus === 'Resolved' && (
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Resolution note (zaroori)"
                rows={4}
                className="w-full bg-ink-800 border border-ink-700 rounded-xl px-3 py-2.5 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal resize-none"
              />
            )}

            {formError && (
              <p className="font-body text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-signal hover:bg-signal-dim disabled:opacity-50 text-ink-950 font-body font-medium text-sm rounded-xl px-4 py-2.5 transition-colors"
            >
              {submitting ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
