import { useEffect, useState } from 'react';
import {
  Users,
  UserCog,
  CalendarDays,
  Activity,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { getUserStats } from '../../api/users.api';
import { getAuditLogs } from '../../api/admin.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';
import { SkeletonStatCard } from '../../components/shared/SkeletonCard';

export function SuperAdminDashboardPage() {
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
        const [statsData, logsData] = await Promise.allSettled([
          getUserStats(),
          getAuditLogs(),
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
  }, []);

  const cards = [
    { title: 'Patients', value: stats?.patients ?? '—', icon: Activity },
    { title: 'Doctors', value: stats?.doctors ?? '—', icon: Users },
    { title: 'Hospital Admins', value: stats?.admins ?? '—', icon: UserCog },
    { title: 'Platform Admins', value: stats?.superAdmins ?? '—', icon: ShieldCheck },
    { title: 'Total Users', value: stats?.totalUsers ?? '—', icon: CalendarDays },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Super Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Platform-wide overview and management.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Platform Management Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Platform-wide overview and management.
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon size={28} className="text-blue-600" />
                <span className="text-3xl font-bold text-slate-900">{card.value}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">{card.title}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Recent Audit Activity</h2>
        <div className="mt-4 space-y-3">
          {recentLogs.length === 0 ? (
            <EmptyState
              title="No audit activity"
              description="Cross-service audit logs will appear here as actions are recorded."
              icon={FileText}
            />
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {log.actorName || 'System'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {log.action} — {log.targetResource}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
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
