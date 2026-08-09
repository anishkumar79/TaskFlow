export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-ink flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden">
        <div className="relative z-10">
          <span className="font-mono text-xs tracking-[0.3em] text-current uppercase">TaskFlow</span>
          <h1 className="font-display text-5xl text-paper mt-6 leading-[1.1]">
            Work finds<br />its current.
          </h1>
          <p className="text-slate mt-6 max-w-sm font-body">
            Tasks don't sit in lists — they move through backlog, flow, and done,
            and your team can see exactly where the current is carrying things.
          </p>
        </div>

        {/* Signature element: three stage markers connected by an animated current */}
        <div className="relative z-10 flex items-center gap-3 mt-16">
          {['Backlog', 'In Flow', 'Done'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-3">
              <div className="flex flex-col gap-2 items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${i === 1 ? 'bg-current' : 'bg-inksoft border border-slate'}`} />
                <span className="font-mono text-[10px] text-slate uppercase tracking-wider">{stage}</span>
              </div>
              {i < 2 && <div className="w-16 h-px bg-gradient-current bg-[length:200%_100%] animate-flow" />}
            </div>
          ))}
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-current/10 blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-paper">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl text-ink mb-2">{title}</h2>
          <p className="text-slate font-body mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
