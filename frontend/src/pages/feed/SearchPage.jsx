import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import * as api from '../../services/api';

const MEDIA_BASE = 'http://localhost:5000';
const RINGS = ['from-signal to-volt', 'from-volt to-emerald-400', 'from-signal to-rose-400', 'from-volt to-signal', 'from-emerald-400 to-volt', 'from-rose-400 to-signal'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      api.searchUsers(query.trim())
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300); // debounce so it doesn't fire on every keystroke

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950 px-6 py-6">
      <div className="max-w-[640px] mx-auto">
        <div className="relative mb-8">
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted"
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-ink-900 border border-ink-800 text-[14.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-volt/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          {loading && (
            <p className="text-[13.5px] text-text-dark-muted font-body px-3 py-6 text-center">
              Searching...
            </p>
          )}

          {!loading && results.map((u, i) => (
            <button
              key={u._id}
              onClick={() => navigate(`/profile/${u.username}`)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ink-900 transition-colors text-left"
            >
              <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${RINGS[i % RINGS.length]} p-[1.5px] shrink-0`}>
                <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                  {u.avatar ? (
                    <img src={`${MEDIA_BASE}${u.avatar}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[11px] font-semibold text-text-dark font-body">
                      {u.username.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold font-body text-text-dark truncate">{u.username}</p>
                <p className="text-[12.5px] text-text-dark-muted font-body truncate">
                  {u.location || u.fullName || ''}
                </p>
              </div>
            </button>
          ))}

          {!loading && query.trim() && results.length === 0 && (
            <p className="text-[13.5px] text-text-dark-muted font-body px-3 py-6 text-center">
              No accounts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}