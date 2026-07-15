import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { getSystemConfigs } from '../../api/systemConfig.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import EmptyState from '../../components/shared/EmptyState';

export function AdminSettingsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getSystemConfigs();
        if (mounted) setConfigs(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (mounted) setError(loadError?.message || 'Failed to load system configuration.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">System Settings</h1>
        <p className="text-neutral-600">Platform configuration and system parameters</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => window.location.reload()} />}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : configs.length === 0 ? (
        <EmptyState
          title="No configuration found"
          description="System configuration will appear here once set."
          icon={Settings}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Key</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Value</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {configs.map((config) => (
                <tr key={config.key || config.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{config.key}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{config.value}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{config.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminSettingsPage;
