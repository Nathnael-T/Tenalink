import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing to show yet',
  description = '',
  actionText,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>
      )}
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
