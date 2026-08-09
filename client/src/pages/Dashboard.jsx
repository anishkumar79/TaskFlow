import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import NewTaskModal from '../components/NewTaskModal';
import ActivityFeed from '../components/ActivityFeed';

const STATUSES = ['BACKLOG', 'IN_FLOW', 'DONE'];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleAdvance(id, status) {
    const previous = tasks;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await api.updateTask(id, { status });
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const previous = tasks;
    setTasks((ts) => ts.filter((t) => t.id !== id));
    try {
      await api.deleteTask(id);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  function handleCreated(task) {
    setTasks((ts) => [task, ...ts]);
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar onNewTask={() => setShowModal(true)} />

      <main className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        <div className="flex-1">
          <h1 className="font-display text-3xl text-ink mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-slate font-body mb-6">Here's where everything stands right now.</p>

          {error && (
            <div className="bg-ember/10 border border-ember/30 text-ember text-sm rounded-lg px-4 py-2.5 mb-6 font-body">
              {error}
            </div>
          )}

          <div className="flex gap-6 overflow-x-auto pb-4">
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onAdvance={handleAdvance}
                onDelete={handleDelete}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </div>

        <ActivityFeed />
      </main>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </div>
  );
}
