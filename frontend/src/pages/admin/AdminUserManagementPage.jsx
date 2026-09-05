import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { getAllUsersAdmin, updateUserAdmin } from '../../services/api.js';

const ROLES = ['user', 'admin'];
const DEPARTMENTS = ['Water', 'Electricity', 'Sanitation', 'Roads', 'Civic', 'Society', 'General'];

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [drafts, setDrafts] = useState({}); 

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllUsersAdmin();
      setUsers(res.data);
      const initialDrafts = {};
      res.data.forEach((u) => {
        initialDrafts[u._id] = { role: u.role, department: u.department };
      });
      setDrafts(initialDrafts);
    } catch (err) {
      setError(err.response?.data?.message || 'Users load nahi ho paaye.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDraftChange = (userId, key, value) => {
    setDrafts((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [key]: value },
    }));
  };

  const isDirty = (user) => {
    const d = drafts[user._id];
    return d && (d.role !== user.role || d.department !== user.department);
  };

  const handleSave = async (user) => {
    const draft = drafts[user._id];
    setSavingId(user._id);
    try {
      const res = await updateUserAdmin(user._id, draft);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? res.data : u)));
      setSavedId(user._id);
      setTimeout(() => setSavedId(null), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update fail ho gaya.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-text-dark">User Management</h1>
        <p className="font-body text-sm text-text-dark-muted mt-1">
          Roles aur departments assign karein
        </p>
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-signal" size={24} />
          </div>
        ) : error ? (
          <p className="font-body text-sm text-red-400 p-6">{error}</p>
        ) : users.length === 0 ? (
          <p className="font-body text-sm text-text-dark-muted p-6">Koi user nahi mila.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">User</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Email</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Role</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Department</th>
                <th className="text-left font-body text-xs text-text-dark-muted uppercase tracking-wide px-5 py-3">Points</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5 min-w-[160px]">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center font-body text-xs text-text-dark-muted shrink-0">
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-body text-sm text-text-dark truncate">{u.fullName}</p>
                        <p className="font-body text-xs text-text-dark-muted truncate">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      value={drafts[u._id]?.role ?? u.role}
                      onChange={(e) => handleDraftChange(u._id, 'role', e.target.value)}
                      className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1.5 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={drafts[u._id]?.department ?? u.department}
                      onChange={(e) => handleDraftChange(u._id, 'department', e.target.value)}
                      className="bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1.5 font-body text-sm text-text-dark focus:outline-none focus:border-signal"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-text-dark">{u.points}</td>
                  <td className="px-5 py-3">
                    {isDirty(u) && (
                      <button
                        onClick={() => handleSave(u)}
                        disabled={savingId === u._id}
                        className="flex items-center gap-1.5 bg-signal hover:bg-signal-dim disabled:opacity-50 text-ink-950 font-body font-medium text-xs rounded-lg px-3 py-1.5 transition-colors"
                      >
                        {savingId === u._id ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : savedId === u._id ? (
                          <Check size={12} />
                        ) : null}
                        {savingId === u._id ? 'Saving...' : savedId === u._id ? 'Saved' : 'Save'}
                      </button>
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