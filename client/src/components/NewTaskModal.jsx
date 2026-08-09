import { useState, useEffect } from 'react';
import { api } from '../api';

export default function NewTaskModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [teammates, setTeammates] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getUsers().then(setTeammates).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const task = await api.createTask({
        title,
        description,
        assignedToId: assignedToId ? Number(assignedToId) : null,
      });
      onCreated(task);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-30 p-4">
      <div className="bg-paper rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="font-display text-2xl text-ink mb-4">New task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-1.5">Title</label>
            <input
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current"
              placeholder="Write the migration script"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-1.5">
              Description <span className="normal-case text-slate/70">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current resize-none"
            />
          </div>
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-1.5">Assign to</label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-paperdim bg-white text-ink font-body focus:outline-none focus:ring-2 focus:ring-current"
            >
              <option value="">Unassigned</option>
              {teammates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-ember text-sm font-body">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-paperdim text-ink font-body py-2.5 rounded-lg hover:bg-paperdim/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-ink text-paper font-body font-medium py-2.5 rounded-lg hover:bg-inksoft transition-colors disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
