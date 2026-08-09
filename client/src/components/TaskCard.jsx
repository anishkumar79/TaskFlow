const STATUS_ORDER = ['BACKLOG', 'IN_FLOW', 'DONE'];

export default function TaskCard({ task, onAdvance, onDelete, currentUserId }) {
  const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(task.status) + 1];
  const isOwner = task.createdBy?.id === currentUserId;

  return (
    <div className="bg-white border border-paperdim rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-body font-medium text-ink text-sm leading-snug">{task.title}</h3>
        {isOwner && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-slate hover:text-ember text-xs opacity-0 group-hover:opacity-100 transition-opacity font-mono"
            aria-label="Delete task"
          >
            ✕
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-slate text-xs mt-1.5 font-body line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="font-mono text-[10px] text-slate">
            {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
          </span>
        </div>
        {nextStatus && (
          <button
            onClick={() => onAdvance(task.id, nextStatus)}
            className="font-mono text-[10px] uppercase tracking-wider text-currentdim hover:text-current border border-current/30 hover:border-current rounded-full px-2.5 py-1 transition-colors"
          >
            Move to {nextStatus.replace('_', ' ').toLowerCase()} →
          </button>
        )}
      </div>
    </div>
  );
}
