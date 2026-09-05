import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', accessCode: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminLogin({
        emailOrUsername: formData.email,
        password: formData.password,
        accessCode: formData.accessCode,
      });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login fail ho gaya. Dobara try karo.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-ink-900 border border-ink-700 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={20} className="text-signal" />
          <h1 className="font-display text-xl text-text-dark">Admin Login</h1>
        </div>
        <p className="font-body text-sm text-text-dark-muted mb-6">
          UrbanVoice staff panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-sm text-text-dark-muted block mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-ink-800 border border-ink-700 rounded-2xl px-4 py-2.5 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
              placeholder="admin@urbanvoice.in"
            />
          </div>

          <div>
            <label className="font-body text-sm text-text-dark-muted block mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-ink-800 border border-ink-700 rounded-2xl px-4 py-2.5 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="font-body text-sm text-text-dark-muted flex items-center gap-1.5 mb-1.5">
              <KeyRound size={13} />
              Access Code
            </label>
            <input
              type="password"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              required
              className="w-full bg-ink-800 border border-ink-700 rounded-2xl px-4 py-2.5 font-body text-sm text-text-dark placeholder:text-text-dark-muted focus:outline-none focus:border-signal transition-colors"
              placeholder="Staff-only access code"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-signal hover:bg-signal-dim disabled:opacity-50 text-ink-950 font-body font-medium text-sm rounded-2xl px-4 py-2.5 transition-colors"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}