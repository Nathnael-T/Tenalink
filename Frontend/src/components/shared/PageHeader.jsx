export function PageHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`app-card-section ${className}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-900 truncate">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-600 leading-6">{subtitle}</p>
          )}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
