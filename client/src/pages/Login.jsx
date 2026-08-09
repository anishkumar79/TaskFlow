import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/board');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to pick up where the flow left off.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-ember text-sm font-body">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-body font-medium py-2.5 rounded-lg hover:bg-inksoft transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-slate text-sm mt-6 font-body">
        New to TaskFlow?{' '}
        <Link to="/signup" className="text-current font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
