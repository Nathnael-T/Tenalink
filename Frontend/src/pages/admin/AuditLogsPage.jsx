import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import AuditFilters from '../../features/Audit/components/AuditFilters';
import { AuditLogEntryCard } from '../../features/Audit/components/AuditLogCard';
import { getAuditLogs, getAuditLogsByAdmin } from '../../api/admin.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonCard } from '../../components/shared/SkeletonCard';
import { FileText } from 'lucide-react';

const ROLE_MAP = {
  ROLE_PATIENT: 'Patient',
  ROLE_PROVIDER: 'Doctor',
  ROLE_ADMIN: 'Hospital Admin',
  ROLE_SUPER_ADMIN: 'Platform Admin',
};

const AuditLogsPage = () => {
  const { user } = useAuth();
  const [role, setRole] = useState('ALL');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const adminId = user?.adminId;
        const data = adminId ? await getAuditLogsByAdmin(adminId) : await getAuditLogs();
        if (mounted) setLogs(Array.isArray(data?.content) ? data.content : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load audit logs.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.adminId]);

  const mappedLogs = useMemo(
    () =>
      logs.map((log) => ({
        id: log.id,
        timestamp: new Date(log.timestamp).toLocaleString(),
        user: log.actorName || `Admin ${log.adminId?.slice(0, 8) || '—'}`,
        summary: `${log.action} on ${log.targetResource}`,
        role: ROLE_MAP[log.role] || log.role || '—',
        hospital: 'TenaLink Platform',
        actionType: log.action,
        targetRecord: log.targetResource,
      })),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    if (role === 'ALL') return mappedLogs;
    return mappedLogs.filter((log) => log.role === role);
  }, [mappedLogs, role]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-gray-500">Loading audit logs...</p>
        </div>
        <div className="space-y-4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-gray-500">
          Audit logs are immutable and cannot be modified.
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      <AuditFilters selectedRole={role} setSelectedRole={setRole} />

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <EmptyState
            title="No audit logs"
            description="Audit logs will appear here as actions are recorded."
            icon={FileText}
          />
        ) : (
          filteredLogs.map((log) => (
            <AuditLogEntryCard key={log.id} entry={log} />
          ))
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
