import { useAuth } from '../AuthContext';

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-paperdim bg-paper/95 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.3em] text-current uppercase">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onNewTask}
            className="bg-ink text-paper text-sm font-body font-medium px-4 py-2 rounded-lg hover:bg-inksoft transition-colors"
          >
            + New task
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-current/20 text-currentdim flex items-center justify-center font-display text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button onClick={logout} className="text-sm text-slate hover:text-ink font-body">
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="h-[2px] bg-gradient-current bg-[length:200%_100%] animate-flow" />
    </header>
  );
}
