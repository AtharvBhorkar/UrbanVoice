import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MEDIA_BASE = 'http://localhost:5000';

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function CommentsModal({ complaintId, open, onClose, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open || !complaintId) return;
    setLoading(true);
    api.getComments(complaintId)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, complaintId]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await api.addComment(complaintId, text);
      setComments((prev) => [...prev, res.data]);
      setDraft('');
      onCommentAdded?.();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] max-h-[70vh] rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-800 shrink-0">
              <h2 className="text-[15px] font-display font-bold text-text-dark">Citizen Notes</h2>
              <button onClick={onClose} aria-label="Close">
                <X size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <p className="text-[13px] text-text-dark-muted font-body text-center py-8">Loading...</p>
              )}
              {!loading && comments.length === 0 && (
                <p className="text-[13px] text-text-dark-muted font-body text-center py-8">
                  No comments yet. Say something!
                </p>
              )}
              {!loading && comments.map((c) => (
                <div key={c._id} className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                      {c.user?.avatar ? (
                        <img src={`${MEDIA_BASE}${c.user.avatar}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-semibold text-text-dark font-body">
                          {c.user?.username?.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-body text-text-dark leading-snug">
                      <span className="font-semibold">{c.user?.username}</span>{' '}
                      <span className="text-text-dark-muted">{c.text}</span>
                    </p>
                    <span className="text-[11px] font-body text-text-dark-muted">{timeAgo(c.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 px-4 py-3 border-t border-ink-800 shrink-0">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-[13px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
              />
              <button onClick={handleSend} disabled={!draft.trim() || sending} aria-label="Send">
                <Send size={17} className={draft.trim() ? 'text-signal' : 'text-text-dark-muted'} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}