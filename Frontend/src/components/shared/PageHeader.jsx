import { Link } from 'react-router-dom';

export function PageHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
  action,
  secondaryAction,
  className = '',
  children
}) {
  const renderAction = (item, variant = 'primary') => {
    if (!item) return null;

    const baseClassName = variant === 'secondary'
      ? 'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50'
      : 'inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700';

    if (item.to) {
      return (
        <Link to={item.to} className={baseClassName}>
          {item.label}
        </Link>
      );
    }

    return (
      <button type="button" onClick={item.onClick} className={baseClassName}>
        {item.label}
      </button>
    );
  };

  return (
    <section className={`app-card-section ${className}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {(badge || Icon) && (
            <div className="flex items-center gap-2">
              {Icon ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
              ) : null}
              {badge ? (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                  {badge}
                </span>
              ) : null}
            </div>
          )}

          <h1 className="mt-3 text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          )}
        </div>

        {(action || secondaryAction) && (
          <div className="flex flex-wrap items-center gap-3">
            {secondaryAction ? renderAction(secondaryAction, 'secondary') : null}
            {action ? renderAction(action, 'primary') : null}
          </div>
        )}
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
