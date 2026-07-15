export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-3 app-card-section ${className}`}>
      <div className="h-4 w-2/5 rounded bg-slate-200" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 rounded bg-slate-100" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 4 }) {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex gap-4 border-b border-slate-100 pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 flex-1 rounded bg-slate-200" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="h-3 flex-1 rounded bg-slate-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-3 w-1/2 rounded bg-slate-200" />
      <div className="mt-3 h-7 w-1/3 rounded bg-slate-100" />
      <div className="mt-2 h-2 w-2/3 rounded bg-slate-100" />
    </div>
  );
}
