import TaskCard from './TaskCard';

const LABELS = { BACKLOG: 'Backlog', IN_FLOW: 'In Flow', DONE: 'Done' };

export default function Column({ status, tasks, onAdvance, onDelete, currentUserId }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-display text-lg text-ink">{LABELS[status]}</h2>
        <span className="font-mono text-xs text-slate bg-paperdim rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="space-y-3 min-h-[120px]">
        {tasks.length === 0 && (
          <div className="border border-dashed border-paperdim rounded-xl p-6 text-center">
            <p className="text-slate text-xs font-body">Nothing here yet.</p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAdvance={onAdvance}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
