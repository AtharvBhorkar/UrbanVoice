import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const ALL_USERS = [
  { name: 'ananya_r', sub: 'Nandanvan · Civic reporter', avatar: 'AR', ring: 'from-signal to-volt' },
  { name: 'lift_watch_towerb', sub: 'Lake View Apartments', avatar: 'LW', ring: 'from-volt to-emerald-400' },
  { name: 'ward5_watch', sub: 'Ram Nagar Crossing', avatar: 'W5', ring: 'from-signal to-rose-400' },
  { name: 'greenpark_rwa', sub: 'Green Park Society', avatar: 'GP', ring: 'from-volt to-signal' },
  { name: 'municipal_ward5', sub: 'Municipal Ward 5', avatar: 'M5', ring: 'from-emerald-400 to-volt' },
  { name: 'sunrise_apartments', sub: 'Sunrise Apartments', avatar: 'SA', ring: 'from-rose-400 to-signal' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = ALL_USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

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
            placeholder="Search"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-ink-900 border border-ink-800 text-[14.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-volt/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          {results.map((u, i) => (
            <button
              key={i}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ink-900 transition-colors text-left"
            >
              <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${u.ring} p-[1.5px] shrink-0`}>
                <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-text-dark font-body">{u.avatar}</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold font-body text-text-dark truncate">{u.name}</p>
                <p className="text-[12.5px] text-text-dark-muted font-body truncate">{u.sub}</p>
              </div>
            </button>
          ))}

          {results.length === 0 && (
            <p className="text-[13.5px] text-text-dark-muted font-body px-3 py-6 text-center">
              No accounts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}