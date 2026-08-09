import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/board');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set up your board in under a minute.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-1.5">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current"
            placeholder="Anish Kumar"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current"
            placeholder="you@team.com"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current"
            placeholder="At least 6 characters"
          />
        </div>

        {error && <p className="text-ember text-sm font-body">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-body font-medium py-2.5 rounded-lg hover:bg-inksoft transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-slate text-sm mt-6 font-body">
        Already have an account?{' '}
        <Link to="/login" className="text-current font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
