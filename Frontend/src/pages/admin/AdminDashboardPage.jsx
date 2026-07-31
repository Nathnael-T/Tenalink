import { useEffect, useState } from 'react';
import { Users, UserCog, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { getUserStats } from '../../api/users.api';
import { getAuditLogs, getAuditLogsByAdmin } from '../../api/admin.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonStatCard } from '../../components/shared/SkeletonCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { FileText } from 'lucide-react';

export function AdminDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const adminId = user?.adminId;
        const [statsData, logsData] = await Promise.allSettled([
          getUserStats(),
          adminId ? getAuditLogsByAdmin(adminId) : getAuditLogs(),
        ]);
        if (!mounted) return;
        if (statsData.status === 'fulfilled' && statsData.value) setStats(statsData.value);
        if (logsData.status === 'fulfilled' && Array.isArray(logsData.value)) setRecentLogs(logsData.value.slice(0, 5));
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load dashboard data.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.adminId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Hospital Admin Dashboard"
          subtitle="Hospital overview and user management"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hospital Admin Dashboard"
        subtitle="Hospital overview and user management"
      />

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-bento shadow-bento border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Users</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.totalUsers ?? '—'}</p>
            </div>
            <Users className="text-teal-600" size={32} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-bento shadow-bento border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Doctors</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.doctors ?? '—'}</p>
            </div>
            <UserCog className="text-teal-600" size={32} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-bento shadow-bento border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Hospital Admins</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.admins ?? '—'}</p>
            </div>
            <ShieldCheck className="text-teal-600" size={32} />
          </div>
        </div>
      </div>

      {/* User breakdown */}
      <div className="p-6 bg-white rounded-bento shadow-bento border border-neutral-200">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
          User Breakdown
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <span className="font-medium text-neutral-900">Patients</span>
            <span className="text-2xl font-bold text-neutral-900">{stats?.patients ?? '—'}</span>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <span className="font-medium text-neutral-900">Doctors / Providers</span>
            <span className="text-2xl font-bold text-neutral-900">{stats?.doctors ?? '—'}</span>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <span className="font-medium text-neutral-900">Admins</span>
            <span className="text-2xl font-bold text-neutral-900">{stats?.admins ?? '—'}</span>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <span className="font-medium text-neutral-900">Super Admins</span>
            <span className="text-2xl font-bold text-neutral-900">{stats?.superAdmins ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* Recent Audit Activity */}
      <div className="p-6 bg-white rounded-bento shadow-bento border border-neutral-200">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
          Recent Audit Activity
        </h2>
        <div className="space-y-4">
          {recentLogs.length === 0 ? (
            <EmptyState
              title="No audit activity"
              description="Audit logs will appear here as actions are recorded."
              icon={FileText}
            />
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {log.actorName || 'System'}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">{log.action}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-neutral-200 text-neutral-700">
                    {log.role || '—'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminDashboardPage;
