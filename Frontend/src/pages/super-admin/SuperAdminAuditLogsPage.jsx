import { useEffect, useMemo, useState } from 'react';
import { getAuditLogs } from '../../api/admin.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonTable } from '../../components/shared/SkeletonCard';
import { FileText } from 'lucide-react';

const ROLE_MAP = {
  ROLE_PATIENT: 'Patient',
  ROLE_PROVIDER: 'Doctor',
  ROLE_ADMIN: 'Hospital Admin',
  ROLE_SUPER_ADMIN: 'Platform Admin',
};

export function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAuditLogs();
        if (mounted) setLogs(Array.isArray(data?.content) ? data.content : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load audit logs.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const mappedLogs = useMemo(
    () =>
      logs.map((log) => ({
        ...log,
        displayTimestamp: new Date(log.timestamp).toLocaleString(),
        displayRole: ROLE_MAP[log.role] || log.role || '—',
      })),
    [logs]
  );

  const actionTypes = useMemo(() => {
    const actions = new Set(logs.map((l) => l.action));
    return ['ALL', ...actions];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (actionFilter === 'ALL') return mappedLogs;
    return mappedLogs.filter((log) => log.action === actionFilter);
  }, [mappedLogs, actionFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Audit Logs</h1>
          <p className="mt-2 text-slate-600">Cross-service audit trail for all platform actions.</p>
        </div>
        <SkeletonTable rows={6} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Audit Logs</h1>
        <p className="mt-2 text-slate-600">
          Cross-service audit trail for all platform actions.
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
        >
          {actionTypes.map((action) => (
            <option key={action} value={action}>
              {action === 'ALL' ? 'All Actions' : action}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-500">
          {filteredLogs.length} entries
        </span>
      </div>

      {/* Logs table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Timestamp</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Actor</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Role</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Action</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">{log.displayTimestamp}</td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {log.actorName || `Admin ${log.adminId?.slice(0, 8) || '—'}`}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {log.displayRole}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{log.action}</td>
                <td className="px-6 py-4 text-slate-600">{log.targetResource}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <EmptyState
            title="No audit logs"
            description="Audit logs will appear here as actions are recorded across all services."
            icon={FileText}
          />
        )}
      </div>
    </div>
  );
}

export default SuperAdminAuditLogsPage;
