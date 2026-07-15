import { useEffect, useState } from 'react';
import { Settings, Plus, Trash2, Save } from 'lucide-react';
import { getSystemConfigs, createSystemConfig, updateSystemConfig, deleteSystemConfig } from '../../api/systemConfig.api';

export function SuperAdminSystemConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newConfig, setNewConfig] = useState({ configKey: '', configValue: '', description: '' });
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSystemConfigs();
      setConfigs(data);
    } catch (err) {
      setError(err?.message || 'Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getSystemConfigs();
        if (mounted) setConfigs(data);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load system configuration');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCreate = async () => {
    if (!newConfig.configKey.trim() || !newConfig.configValue.trim()) return;
    try {
      setSubmitting(true);
      await createSystemConfig(newConfig);
      setNewConfig({ configKey: '', configValue: '', description: '' });
      setShowForm(false);
      await fetchConfigs();
    } catch (err) {
      setError(err?.message || 'Failed to create config');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (key) => {
    try {
      await updateSystemConfig(key, { configValue: editValue });
      setEditingKey(null);
      setEditValue('');
      await fetchConfigs();
    } catch (err) {
      setError(err?.message || 'Failed to update config');
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete config "${key}"?`)) return;
    try {
      await deleteSystemConfig(key);
      await fetchConfigs();
    } catch (err) {
      setError(err?.message || 'Failed to delete config');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-600">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Configuration</h1>
          <p className="mt-2 text-slate-600">Manage platform-wide key-value settings.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Config
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add Config Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Add Configuration</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              placeholder="Config Key (e.g. max_appointments_per_day)"
              value={newConfig.configKey}
              onChange={e => setNewConfig({ ...newConfig, configKey: e.target.value })}
              className="rounded-lg border p-3"
            />
            <input
              placeholder="Value"
              value={newConfig.configValue}
              onChange={e => setNewConfig({ ...newConfig, configValue: e.target.value })}
              className="rounded-lg border p-3"
            />
            <input
              placeholder="Description (optional)"
              value={newConfig.description}
              onChange={e => setNewConfig({ ...newConfig, description: e.target.value })}
              className="rounded-lg border p-3"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="mt-4 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Config'}
          </button>
        </div>
      )}

      {/* Config Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Key</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Value</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Updated</th>
              <th className="px-6 py-3 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {configs.map(cfg => (
              <tr key={cfg.id || cfg.configKey} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-900">
                  {cfg.configKey}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {editingKey === cfg.configKey ? (
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="rounded border px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <span className="font-mono text-xs">{cfg.configValue}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {cfg.description || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {cfg.updatedAt ? new Date(cfg.updatedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {editingKey === cfg.configKey ? (
                      <button
                        onClick={() => handleUpdate(cfg.configKey)}
                        className="rounded bg-green-600 px-2 py-1 text-white text-xs"
                      >
                        <Save size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingKey(cfg.configKey);
                          setEditValue(cfg.configValue);
                        }}
                        className="rounded bg-blue-600 px-2 py-1 text-white text-xs"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cfg.configKey)}
                      className="rounded bg-red-600 px-2 py-1 text-white text-xs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {configs.length === 0 && (
          <div className="text-center py-10">
            <Settings size={32} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-neutral-600">No system configuration entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminSystemConfigPage;
