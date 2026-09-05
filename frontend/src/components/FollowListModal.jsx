import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as api from '../services/api';

const MEDIA_BASE = 'http://localhost:5000';

export default function FollowListModal({ open, onClose, username, type }) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const fetcher = type === 'followers' ? api.getFollowersList : api.getFollowingList;
    fetcher(username)
      .then((res) => setList(res.data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [open, username, type]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] max-h-[70vh] rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-800 shrink-0">
              <h2 className="text-[15px] font-display font-bold text-text-dark capitalize">{type === 'followers' ? 'Subscribers' : 'Subscriptions'}</h2>
              <button onClick={onClose} aria-label="Close">
                <X size={18} className="text-text-dark-muted hover:text-text-dark transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {loading && (
                <p className="text-[13px] text-text-dark-muted font-body text-center py-8">Loading...</p>
              )}
              {!loading && list.length === 0 && (
                <p className="text-[13px] text-text-dark-muted font-body text-center py-8">
                  No {type === 'followers' ? 'subscribers' : 'subscriptions'} yet.
                </p>
              )}
              {!loading &&
                list.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => {
                      onClose();
                      navigate(`/profile/${u.username}`);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-800 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                        {u.avatar ? (
                          <img src={`${MEDIA_BASE}${u.avatar}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-semibold text-text-dark font-body">
                            {u.username.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold font-body text-text-dark truncate">{u.username}</p>
                      {u.fullName && (
                        <p className="text-[12px] font-body text-text-dark-muted truncate">{u.fullName}</p>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}