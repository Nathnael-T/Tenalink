import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Plus,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Ambulance,
  Pencil,
  Trash2
} from 'lucide-react';
import { getHospitals, createHospital, deleteHospital as apiDeleteHospital } from '../../api/hospitals.api';

export function SuperAdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newHospital, setNewHospital] = useState({
    name: '',
    specialty: '',
    address: '',
    contact: '',
    waitTime: 15
  });

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getHospitals();
      setHospitals(Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []));
    } catch (err) {
      setError(err?.message || 'Failed to load hospitals');
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
        const data = await getHospitals();
        if (mounted) setHospitals(Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []));
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load hospitals');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const icuHospitals = hospitals.filter(h => h.icuAvailable);
    const ambulanceHospitals = hospitals.filter(h => h.ambulanceAccess);
    const averageWait = hospitals.length > 0
      ? Math.round(hospitals.reduce((sum, h) => sum + (h.waitTime || 0), 0) / hospitals.length)
      : 0;
    return {
      total: hospitals.length,
      active: hospitals.length,
      icu: icuHospitals.length,
      ambulance: ambulanceHospitals.length,
      averageWait
    };
  }, [hospitals]);

  const handleAddHospital = async () => {
    if (!newHospital.name.trim()) return;
    try {
      setSubmitting(true);
      await createHospital({
        name: newHospital.name,
        specialty: newHospital.specialty || 'General',
        address: newHospital.address,
        contact: newHospital.contact,
        waitTime: newHospital.waitTime,
        icuAvailable: false,
        labAvailable: false,
        pharmacyAvailable: false,
        radiologyAvailable: false,
        ambulanceAccess: false,
        glucoseAvailable: false
      });
      setNewHospital({ name: '', specialty: '', address: '', contact: '', waitTime: 15 });
      setShowForm(false);
      await fetchHospitals();
    } catch (err) {
      setError(err?.message || 'Failed to create hospital');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (!window.confirm('Delete this hospital?')) return;
    try {
      await apiDeleteHospital(hospitalId);
      setHospitals(prev => prev.filter(h => h.id !== hospitalId));
    } catch (err) {
      setError(err?.message || 'Failed to delete hospital');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-600">Loading hospitals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hospital Management</h1>
          <p className="mt-2 text-slate-600">Manage all hospitals across the platform.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Hospital
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Hospitals" value={stats.total} icon={Building2} />
        <StatCard title="Active" value={stats.active} icon={ShieldCheck} />
        <StatCard title="ICU Available" value={stats.icu} icon={ShieldCheck} />
        <StatCard title="Ambulance Access" value={stats.ambulance} icon={Ambulance} />
        <StatCard title="Avg Wait" value={`${stats.averageWait}m`} icon={Clock} />
      </div>

      {/* Add Hospital Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Add Hospital</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Hospital Name"
              value={newHospital.name}
              onChange={e => setNewHospital({ ...newHospital, name: e.target.value })}
              className="rounded-lg border p-3"
            />
            <input
              placeholder="Specialty"
              value={newHospital.specialty}
              onChange={e => setNewHospital({ ...newHospital, specialty: e.target.value })}
              className="rounded-lg border p-3"
            />
            <input
              placeholder="Address"
              value={newHospital.address}
              onChange={e => setNewHospital({ ...newHospital, address: e.target.value })}
              className="rounded-lg border p-3"
            />
            <input
              placeholder="Contact"
              value={newHospital.contact}
              onChange={e => setNewHospital({ ...newHospital, contact: e.target.value })}
              className="rounded-lg border p-3"
            />
          </div>
          <button
            onClick={handleAddHospital}
            disabled={submitting}
            className="mt-4 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Hospital'}
          </button>
        </div>
      )}

      {/* Hospitals */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-slate-900">{hospital.name}</h3>
              <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                {hospital.address || '—'}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                {hospital.contact || '—'}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                {hospital.waitTime ?? '—'} min wait
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="rounded-lg bg-blue-600 px-3 py-2 text-white">
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDeleteHospital(hospital.id)}
                className="rounded-lg bg-red-600 px-3 py-2 text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {hospitals.length === 0 && (
        <div className="text-center py-10">
          <p className="text-neutral-600">No hospitals registered yet.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Icon size={24} className="text-blue-600" />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-600">{title}</p>
    </div>
  );
}

export default SuperAdminHospitalsPage;
