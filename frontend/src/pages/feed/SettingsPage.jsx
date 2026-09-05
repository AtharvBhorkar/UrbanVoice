import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Bell, Lock, Sliders, Database, LogOut, Trash2,
  Camera, ChevronRight, Loader2, Check, X, Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

const MEDIA_BASE = 'http://localhost:5000';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'data', label: 'Data & Account', icon: Database },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi'];
const MESSAGE_PERMISSION_OPTIONS = [
  { value: 'everyone', label: 'Everyone' },
  { value: 'followers', label: 'Subscribers only' },
];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${
        checked ? 'bg-volt' : 'bg-ink-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink-950 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function Row({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-ink-800 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[14px] font-body font-medium text-text-dark">{title}</p>
        {description && (
          <p className="text-[12.5px] font-body text-text-dark-muted mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl p-5 sm:p-6 mb-5">
      <h2 className="text-[15px] font-display font-semibold text-text-dark mb-1">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    website: user?.website || '',
    gender: user?.gender || 'Prefer not to say',
    location: user?.location || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${MEDIA_BASE}${user.avatar}` : null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    likes: true, comments: true, follows: true, messages: true,
    complaintUpdates: true, email: false,
    ...(user?.notificationPrefs || {}),
  });
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(user?.showOnLeaderboard ?? true);
  const [whoCanMessage, setWhoCanMessage] = useState(user?.whoCanMessage || 'everyone');
  const [whoCanComment, setWhoCanComment] = useState(user?.whoCanComment || 'everyone');
  const [dataSaver, setDataSaver] = useState(user?.dataSaver || false);
  const [language, setLanguage] = useState(user?.language || 'English');
  const [defaultWard, setDefaultWard] = useState(user?.defaultWard || '');
  const [savingKey, setSavingKey] = useState(null);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState({ loading: false, error: '', success: '' });

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockedLoading, setBlockedLoading] = useState(false);
  const [unblockingId, setUnblockingId] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (activeTab === 'privacy') loadBlockedUsers();
  }, [activeTab]);

  const loadBlockedUsers = async () => {
    setBlockedLoading(true);
    try {
      const res = await api.getBlockedUsers();
      setBlockedUsers(res.data);
    } catch (err) {
      console.error('Failed to load blocked users', err);
    } finally {
      setBlockedLoading(false);
    }
  };
  const pushSetting = async (key, payload) => {
    setSavingKey(key);
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        formData.append(k, typeof v === 'object' ? JSON.stringify(v) : v);
      });
      await api.updateProfile(formData);
      await refreshUser();
    } catch (err) {
      console.error(`Failed to save ${key}`, err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleNotifChange = (key, value) => {
    const next = { ...notifPrefs, [key]: value };
    setNotifPrefs(next);
    pushSetting('notificationPrefs', { notificationPrefs: next });
  };

  const handlePrivateToggle = (value) => {
    setIsPrivate(value);
    pushSetting('isPrivate', { isPrivate: value });
  };

  const handleLeaderboardToggle = (value) => {
    setShowOnLeaderboard(value);
    pushSetting('showOnLeaderboard', { showOnLeaderboard: value });
  };

  const handleWhoCanMessage = (value) => {
    setWhoCanMessage(value);
    pushSetting('whoCanMessage', { whoCanMessage: value });
  };

  const handleWhoCanComment = (value) => {
    setWhoCanComment(value);
    pushSetting('whoCanComment', { whoCanComment: value });
  };

  const handleDataSaver = (value) => {
    setDataSaver(value);
    pushSetting('dataSaver', { dataSaver: value });
  };

  const handleLanguage = (value) => {
    setLanguage(value);
    pushSetting('language', { language: value });
  };

  const handleDefaultWardBlur = () => {
    pushSetting('defaultWard', { defaultWard });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveAccount = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('bio', form.bio);
      formData.append('website', form.website);
      formData.append('gender', form.gender);
      formData.append('location', form.location);
      if (avatarFile) formData.append('avatar', avatarFile);

      await api.updateProfile(formData);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus({ loading: true, error: '', success: '' });

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ loading: false, error: "New passwords don't match", success: '' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwStatus({ loading: false, error: 'New password must be at least 6 characters', success: '' });
      return;
    }

    try {
      await api.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwStatus({ loading: false, error: '', success: 'Password updated successfully' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to update password',
        success: '',
      });
    }
  };

  const handleUnblock = async (userId) => {
    setUnblockingId(userId);
    try {
      await api.toggleBlockUser(userId);
      setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Failed to unblock', err);
    } finally {
      setUnblockingId(null);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await api.exportMyData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `urbanvoice-data-${user?.username || 'export'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data', err);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account', err);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-[24px] font-display font-bold text-text-dark mb-1">Settings</h1>
        <p className="text-[13.5px] font-body text-text-dark-muted mb-6">
          Manage your account, privacy and app preferences.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible md:w-[220px] shrink-0 pb-1 md:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors text-[13.5px] font-body font-medium ${
                  activeTab === tab.id
                    ? 'bg-ink-800 text-text-dark'
                    : 'text-text-dark-muted hover:bg-ink-900 hover:text-text-dark'
                }`}
              >
                <tab.icon size={17} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'account' && (
              <>
                <SectionCard title="Profile Photo">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-signal to-volt p-[3px] shrink-0">
                      <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[20px] font-semibold text-text-dark font-body">
                            {user?.username?.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-[13px] font-semibold font-body text-text-dark cursor-pointer transition-colors">
                      <Camera size={15} />
                      Change photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </SectionCard>

                <SectionCard title="Personal Info">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Username</label>
                      <input
                        value={user?.username || ''}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark-muted cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Full name</label>
                      <input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Bio</label>
                      <textarea
                        value={form.bio}
                        maxLength={150}
                        rows={3}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Website</label>
                      <input
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                      />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Location</label>
                      <input
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                      />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                      >
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={handleSaveAccount}
                      disabled={saving}
                      className="px-6 py-2 rounded-lg bg-volt hover:bg-volt-dim text-ink-950 text-[13.5px] font-semibold font-body transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {saving && <Loader2 size={14} className="animate-spin" />}
                      Save changes
                    </button>
                    {saved && (
                      <span className="flex items-center gap-1.5 text-[13px] font-body text-signal">
                        <Check size={14} /> Saved
                      </span>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Security">
                  <form onSubmit={handleChangePassword} className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Current password</label>
                      <input
                        type="password"
                        value={pwForm.currentPassword}
                        onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">New password</label>
                      <input
                        type="password"
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-body text-text-dark-muted mb-1.5 block">Confirm new password</label>
                      <input
                        type="password"
                        value={pwForm.confirmPassword}
                        onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-ink-950 border border-ink-800 text-[13.5px] font-body text-text-dark focus:outline-none focus:border-signal"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={pwStatus.loading}
                        className="px-6 py-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-[13.5px] font-semibold font-body text-text-dark transition-colors disabled:opacity-60 flex items-center gap-2"
                      >
                        {pwStatus.loading && <Loader2 size={14} className="animate-spin" />}
                        Update password
                      </button>
                      {pwStatus.error && (
                        <span className="text-[12.5px] font-body text-red-400">{pwStatus.error}</span>
                      )}
                      {pwStatus.success && (
                        <span className="flex items-center gap-1.5 text-[13px] font-body text-signal">
                          <Check size={14} /> {pwStatus.success}
                        </span>
                      )}
                    </div>
                  </form>
                </SectionCard>
              </>
            )}

            {activeTab === 'notifications' && (
              <SectionCard title="Notification preferences">
                <Row title="Backed" description="Someone backs your report">
                  <Toggle checked={notifPrefs.likes} disabled={savingKey === 'notificationPrefs'} onChange={(v) => handleNotifChange('likes', v)} />
                </Row>
                <Row title="Comments" description="Someone comments on your post">
                  <Toggle checked={notifPrefs.comments} disabled={savingKey === 'notificationPrefs'} onChange={(v) => handleNotifChange('comments', v)} />
                </Row>
                <Row title="New subscribers" description="Someone subscribes to your reports">
                  <Toggle checked={notifPrefs.follows} disabled={savingKey === 'notificationPrefs'} onChange={(v) => handleNotifChange('follows', v)} />
                </Row>
                <Row title="Messages" description="New direct messages">
                  <Toggle checked={notifPrefs.messages} disabled={savingKey === 'notificationPrefs'} onChange={(v) => handleNotifChange('messages', v)} />
                </Row>
                <Row title="Complaint status updates" description="Your complaint moves to In Progress / Resolved">
                  <Toggle checked={notifPrefs.complaintUpdates} disabled={savingKey === 'notificationPrefs'} onChange={(v) => handleNotifChange('complaintUpdates', v)} />
                </Row>
                <Row title="Email notifications" description="Also send important updates to your email">
                  <Toggle checked={notifPrefs.email} disabled={savingKey === 'notificationPrefs'} onChange={(v) => handleNotifChange('email', v)} />
                </Row>
              </SectionCard>
            )}

            {activeTab === 'privacy' && (
              <>
                <SectionCard title="Privacy & safety">
                  <Row title="Private account" description="Only approved subscribers can see your reports">
                    <Toggle checked={isPrivate} disabled={savingKey === 'isPrivate'} onChange={handlePrivateToggle} />
                  </Row>
                  <Row title="Show me on leaderboard" description="Turn off to hide your name from the public leaderboard">
                    <Toggle checked={showOnLeaderboard} disabled={savingKey === 'showOnLeaderboard'} onChange={handleLeaderboardToggle} />
                  </Row>
                  <Row title="Who can message me">
                    <select
                      value={whoCanMessage}
                      onChange={(e) => handleWhoCanMessage(e.target.value)}
                      disabled={savingKey === 'whoCanMessage'}
                      className="px-3 py-1.5 rounded-lg bg-ink-950 border border-ink-800 text-[13px] font-body text-text-dark focus:outline-none focus:border-signal"
                    >
                      {MESSAGE_PERMISSION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Row>
                  <Row title="Who can comment on my posts">
                    <select
                      value={whoCanComment}
                      onChange={(e) => handleWhoCanComment(e.target.value)}
                      disabled={savingKey === 'whoCanComment'}
                      className="px-3 py-1.5 rounded-lg bg-ink-950 border border-ink-800 text-[13px] font-body text-text-dark focus:outline-none focus:border-signal"
                    >
                      {MESSAGE_PERMISSION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Row>
                </SectionCard>

                <SectionCard title="Blocked accounts">
                  {blockedLoading ? (
                    <p className="text-[13px] font-body text-text-dark-muted flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </p>
                  ) : blockedUsers.length === 0 ? (
                    <p className="text-[13px] font-body text-text-dark-muted">You haven't blocked anyone.</p>
                  ) : (
                    blockedUsers.map((u) => (
                      <Row key={u._id} title={u.fullName} description={`@${u.username}`}>
                        <button
                          onClick={() => handleUnblock(u._id)}
                          disabled={unblockingId === u._id}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-[12.5px] font-semibold font-body text-text-dark transition-colors disabled:opacity-60"
                        >
                          {unblockingId === u._id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                          Unblock
                        </button>
                      </Row>
                    ))
                  )}
                  <p className="text-[12px] font-body text-text-dark-muted mt-3">
                    Tip: you can block someone from their profile page.
                  </p>
                </SectionCard>
              </>
            )}

            {activeTab === 'preferences' && (
              <SectionCard title="App preferences">
                <Row title="Data saver" description="Reduce video quality and disable autoplay on mobile data">
                  <Toggle checked={dataSaver} disabled={savingKey === 'dataSaver'} onChange={handleDataSaver} />
                </Row>
                <Row title="Language">
                  <select
                    value={language}
                    onChange={(e) => handleLanguage(e.target.value)}
                    disabled={savingKey === 'language'}
                    className="px-3 py-1.5 rounded-lg bg-ink-950 border border-ink-800 text-[13px] font-body text-text-dark focus:outline-none focus:border-signal"
                  >
                    {LANGUAGE_OPTIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </Row>
                <Row title="Default ward / area" description="Auto-fill this location when filing a new complaint">
                  <input
                    value={defaultWard}
                    onChange={(e) => setDefaultWard(e.target.value)}
                    onBlur={handleDefaultWardBlur}
                    placeholder="e.g. Ward 5, Nandanvan"
                    className="px-3 py-1.5 rounded-lg bg-ink-950 border border-ink-800 text-[13px] font-body text-text-dark focus:outline-none focus:border-signal w-48"
                  />
                </Row>
                <p className="text-[12px] font-body text-text-dark-muted mt-3">
                  Language preference is saved to your account. Full in-app translation isn't wired up yet.
                </p>
              </SectionCard>
            )}

            {activeTab === 'data' && (
              <>
                <SectionCard title="Your content">
                  <Row title="My complaints" description="View everything you've reported">
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex items-center gap-1 text-[13px] font-semibold font-body text-signal hover:text-signal-dim transition-colors"
                    >
                      View <ChevronRight size={14} />
                    </button>
                  </Row>
                  <Row title="Download my data" description="Export your profile and complaints as a JSON file">
                    <button
                      onClick={handleExportData}
                      disabled={exporting}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-[12.5px] font-semibold font-body text-text-dark transition-colors disabled:opacity-60"
                    >
                      {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                      Export
                    </button>
                  </Row>
                </SectionCard>

                <SectionCard title="Account">
                  <Row title="Log out" description="Sign out of UrbanVoice on this device">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-[12.5px] font-semibold font-body text-text-dark transition-colors"
                    >
                      <LogOut size={14} /> Log out
                    </button>
                  </Row>
                  <Row title="Delete account" description="Permanently remove your account (your posts/comments stay, just unlinked)">
                    {!deleteConfirm ? (
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[12.5px] font-semibold font-body text-red-400 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-[12.5px] font-semibold font-body text-white transition-colors disabled:opacity-60"
                        >
                          {deleting && <Loader2 size={13} className="animate-spin" />}
                          Confirm delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="text-[12px] font-semibold font-body text-text-dark-muted underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </Row>
                </SectionCard>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}