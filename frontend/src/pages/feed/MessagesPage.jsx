import { useState } from 'react';
import {
  Search as SearchIcon, SquarePen, Phone, Video, Info,
  Smile, Mic, Image as ImageIcon, Send,
} from 'lucide-react';

const NOTES = [
  { name: 'Your note', isSelf: true },
  { name: 'ananya_r', text: 'Try a fun fact...', avatar: 'AR', ring: 'from-signal to-volt' },
  { name: 'ward5_watch', text: 'Namo Namo', avatar: 'W5', ring: 'from-volt to-emerald-400' },
];

const CONVERSATIONS = [
  {
    name: 'ananya_r', username: 'ananya_r', avatar: 'AR',
    ring: 'from-signal to-volt', preview: 'Nandanvan · Civic reporter', time: '2d',
    unread: false, bold: false,
    messages: [],
  },
  {
    name: 'lift_watch_towerb', username: 'lift_watch_towerb', avatar: 'LW',
    ring: 'from-volt to-emerald-400', preview: 'Lake View Apartments', time: '5h',
    unread: false, bold: false,
    messages: [],
  },
  {
    name: 'ward5_watch', username: 'ward5_watch', avatar: 'W5',
    ring: 'from-signal to-rose-400', preview: 'Ram Nagar Crossing', time: '9h',
    unread: false, bold: false,
    messages: [],
  },
  {
    name: 'greenpark_rwa', username: 'greenpark_rwa', avatar: 'GP',
    ring: 'from-volt to-signal', preview: 'Green Park Society', time: '1d',
    unread: false, bold: false,
    messages: [],
  },
  {
    name: 'municipal_ward5', username: 'municipal_ward5', avatar: 'M5',
    ring: 'from-emerald-400 to-volt', preview: 'Municipal Ward 5', time: '2w',
    unread: false, bold: false,
    messages: [],
  },
  {
    name: 'sunrise_apartments', username: 'sunrise_apartments', avatar: 'SA',
    ring: 'from-rose-400 to-signal', preview: 'Sunrise Apartments', time: '3w',
    unread: false, bold: false,
    messages: [],
  },
];

function Avatar({ label, ring, size = 'w-14 h-14' }) {
  return (
    <div className={`${size} rounded-full bg-gradient-to-tr ${ring} p-[2px] shrink-0`}>
      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-text-dark font-body">{label}</span>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [draft, setDraft] = useState('');

  const results = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const active = activeIndex !== null ? CONVERSATIONS[activeIndex] : null;

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950 flex">
      {/* ===== LEFT: conversation list ===== */}
      <div className="w-[320px] shrink-0 border-r border-ink-800 flex flex-col h-screen">
        <div className="px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal shrink-0" />
            <h1 className="text-[17px] font-display font-bold text-text-dark leading-none">
              Urban's<span className="text-volt"></span> Voice
            </h1>
          </div>
          <button aria-label="New message">
            <SquarePen size={19} className="text-text-dark" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="relative mb-4">
            <SearchIcon
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-ink-900 border border-ink-800 text-[13.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-volt/40 transition-colors"
            />
          </div>

          {!query && (
            <div className="flex items-start gap-4 overflow-x-auto pb-2 mb-2 scrollbar-hide">
              {NOTES.map((n, i) =>
                n.isSelf ? (
                  <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-ink-700 flex items-center justify-center">
                      <span className="text-text-dark-muted text-lg">+</span>
                    </div>
                    <span className="text-[11px] text-text-dark-muted font-body">{n.name}</span>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-16 relative">
                    {n.text && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-max max-w-[100px] px-2.5 py-1.5 rounded-2xl bg-ink-800 border border-ink-700 text-[10.5px] text-text-dark font-body text-center">
                        {n.text}
                      </div>
                    )}
                    <Avatar label={n.avatar} ring={n.ring} />
                    <span className="text-[11px] text-text-dark-muted font-body truncate w-full text-center">
                      {n.name}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {results.map((c, i) => {
            const realIndex = CONVERSATIONS.indexOf(c);
            const isActive = realIndex === activeIndex;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(realIndex)}
                className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors text-left relative ${
                  isActive ? 'bg-ink-800' : 'hover:bg-ink-900/60'
                }`}
              >
                <Avatar label={c.avatar} ring={c.ring} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-body text-text-dark truncate ${c.bold ? 'font-semibold' : 'font-medium'}`}>
                    {c.name}
                  </p>
                  <p className={`text-[12.5px] font-body truncate ${c.bold ? 'text-text-dark' : 'text-text-dark-muted'}`}>
                    {c.preview} · {c.time}
                  </p>
                </div>
                {c.unread && <span className="w-2.5 h-2.5 rounded-full bg-signal shrink-0" />}
              </button>
            );
          })}

          {results.length === 0 && (
            <p className="text-[13.5px] text-text-dark-muted font-body px-2 py-6 text-center">
              No conversations found.
            </p>
          )}
        </div>
      </div>

      {/* ===== RIGHT: chat thread ===== */}
      <div className="flex-1 flex flex-col h-screen">
        {!active ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-text-dark flex items-center justify-center">
              <SquarePen size={30} className="text-text-dark" />
            </div>
            <p className="text-[18px] font-display font-bold text-text-dark">Your messages</p>
            <p className="text-[13.5px] font-body text-text-dark-muted">Select a conversation to start chatting.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 shrink-0">
              <div className="flex items-center gap-3">
                <Avatar label={active.avatar} ring={active.ring} size="w-10 h-10" />
                <div>
                  <p className="text-[14.5px] font-semibold font-body text-text-dark">{active.name}</p>
                  <p className="text-[12px] font-body text-text-dark-muted">{active.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-text-dark">
                <button aria-label="Call"><Phone size={19} /></button>
                <button aria-label="Video call"><Video size={19} /></button>
                <button aria-label="Conversation info"><Info size={19} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col items-center text-center mb-8">
                <Avatar label={active.avatar} ring={active.ring} size="w-20 h-20" />
                <p className="text-[19px] font-display font-bold text-text-dark mt-3">{active.name}</p>
                <p className="text-[13px] font-body text-text-dark-muted mt-0.5">{active.username} · UrbanVoice</p>
                <button className="mt-3 px-4 py-2 rounded-lg bg-ink-800 text-[13px] font-semibold font-body text-text-dark hover:bg-ink-700 transition-colors">
                  View profile
                </button>
              </div>

              <div className="flex flex-col gap-1.5 max-w-[560px] mx-auto">
                {active.messages.length === 0 && (
                  <p className="text-[13px] font-body text-text-dark-muted text-center mt-8">
                    No messages yet. Say hi!
                  </p>
                )}
                {active.messages.map((m, i) => (
                  <div key={i}>
                    {m.date && (
                      <p className="text-[11.5px] font-body text-text-dark-muted text-center my-3">
                        {m.date}
                      </p>
                    )}
                    <div className={`flex items-end gap-2 ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      {m.from === 'them' && <Avatar label={active.avatar} ring={active.ring} size="w-6 h-6" />}
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-3xl text-[14px] font-body leading-snug ${
                          m.from === 'me'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-ink-800 text-text-dark rounded-bl-md'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 shrink-0">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-ink-700 bg-ink-950">
                <button aria-label="Emoji"><Smile size={19} className="text-text-dark-muted" /></button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-[14px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
                />
                <button aria-label="Voice message"><Mic size={18} className="text-text-dark-muted" /></button>
                <button aria-label="Send image"><ImageIcon size={18} className="text-text-dark-muted" /></button>
                {draft.trim() ? (
                  <button aria-label="Send" onClick={() => setDraft('')}>
                    <Send size={18} className="text-signal" />
                  </button>
                ) : (
                  <button aria-label="Stickers">
                    <Smile size={18} className="text-text-dark-muted opacity-0" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}