import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon, SquarePen, Send,
} from 'lucide-react';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MEDIA_BASE = 'http://localhost:5000';

function Avatar({ user, size = 'w-14 h-14' }) {
  const avatarUrl = user?.avatar ? `${MEDIA_BASE}${user.avatar}` : null;
  const label = user?.username?.slice(0, 2).toUpperCase() || '??';
  return (
    <div className={`${size} rounded-full bg-gradient-to-tr from-signal to-volt p-[2px] shrink-0`}>
      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[11px] font-semibold text-text-dark font-body">{label}</span>
        )}
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

export default function MessagesPage() {
  const { user: me } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const bottomRef = useRef(null);

  const loadConversations = () => {
    api.getConversations()
      .then((res) => setConversations(res.data))
      .catch((err) => console.error('Failed to load conversations', err))
      .finally(() => setLoadingConvos(false));
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const withId = searchParams.get('with');
    const withUsername = searchParams.get('username');
    if (withId) {
      openConversation({ _id: withId, username: withUsername || '...' });
    }
  }, [searchParams]);

  const openConversation = (user) => {
    setActiveUser(user);
    setLoadingChat(true);
    api.getConversation(user._id)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Failed to load conversation', err))
      .finally(() => setLoadingChat(false));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !activeUser) return;
    setDraft('');
    try {
      const res = await api.sendMessage(activeUser._id, text);
      setMessages((prev) => [...prev, res.data]);
      loadConversations();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const results = conversations.filter((c) =>
    c.user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 flex">
      <div className="w-[320px] shrink-0 border-r border-ink-800 flex flex-col h-screen">
        <div className="px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal shrink-0" />
            <h1 className="text-[17px] font-display font-bold text-text-dark leading-none">
              Urban<span className="text-volt">Voice</span>
            </h1>
          </div>
        </div>

        <div className="px-5 pt-2">
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
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {loadingConvos && (
            <p className="text-[13px] text-text-dark-muted font-body px-2 py-6 text-center">Loading...</p>
          )}

          {!loadingConvos && results.map((c) => {
            const isActive = activeUser?._id === c.user._id;
            return (
              <button
                key={c.user._id}
                onClick={() => openConversation(c.user)}
                className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors text-left relative ${
                  isActive ? 'bg-ink-800' : 'hover:bg-ink-900/60'
                }`}
              >
                <Avatar user={c.user} size="w-12 h-12" />
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-body text-text-dark truncate ${c.unread ? 'font-semibold' : 'font-medium'}`}>
                    {c.user.username}
                  </p>
                  <p className={`text-[12.5px] font-body truncate ${c.unread ? 'text-text-dark' : 'text-text-dark-muted'}`}>
                    {c.lastMessage} · {timeAgo(c.lastMessageAt)}
                  </p>
                </div>
                {c.unread && <span className="w-2.5 h-2.5 rounded-full bg-signal shrink-0" />}
              </button>
            );
          })}

          {!loadingConvos && results.length === 0 && (
            <p className="text-[13.5px] text-text-dark-muted font-body px-2 py-6 text-center">
              No conversations yet.
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen">
        {!activeUser ? (
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
                <Avatar user={activeUser} size="w-10 h-10" />
                <div>
                  <p className="text-[14.5px] font-semibold font-body text-text-dark">{activeUser.username}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col items-center text-center mb-8">
                <Avatar user={activeUser} size="w-20 h-20" />
                <p className="text-[19px] font-display font-bold text-text-dark mt-3">{activeUser.username}</p>
                <p className="text-[13px] font-body text-text-dark-muted mt-0.5">UrbanVoice</p>
              </div>

              <div className="flex flex-col gap-1.5 max-w-[560px] mx-auto">
                {loadingChat && (
                  <p className="text-[13px] font-body text-text-dark-muted text-center mt-8">Loading...</p>
                )}
                {!loadingChat && messages.length === 0 && (
                  <p className="text-[13px] font-body text-text-dark-muted text-center mt-8">
                    No messages yet. Say hi!
                  </p>
                )}
                {!loadingChat && messages.map((m) => {
                  const isMe = m.sender._id === me?._id || m.sender.username === me?.username;
                  return (
                    <div key={m._id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && <Avatar user={m.sender} size="w-6 h-6" />}
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-3xl text-[14px] font-body leading-snug ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-ink-800 text-text-dark rounded-bl-md'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 shrink-0">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-ink-700 bg-ink-950">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-[14px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
                />
                <button aria-label="Send" onClick={handleSend} disabled={!draft.trim()}>
                  <Send size={18} className={draft.trim() ? 'text-signal' : 'text-text-dark-muted'} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}