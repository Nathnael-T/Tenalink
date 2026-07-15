import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onRetry, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-red-800">Something went wrong</p>
        <p className="mt-0.5 text-sm text-red-700">{message}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-200"
          >
            Try again
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
