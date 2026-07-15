import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  Clock,
  Pill,
  User
} from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthContext';
import { useTimelineSearch } from '../../../context/TimelineSearchContext';
import { getPrescriptions } from '../../../api/prescriptions.api';

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' }
];

function getStatusStyles(status) {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700';
    case 'COMPLETED':
      return 'border-blue-200 bg-blue-100 text-blue-700';
    case 'CANCELLED':
      return 'border-red-200 bg-red-100 text-red-700';
    default:
      return 'border-slate-200 bg-slate-100 text-slate-700';
  }
}

export function PrescriptionsPage() {
  const { patientId } = useAuth();
  const { searchTerm } = useTimelineSearch();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let mounted = true;

    async function loadPrescriptions() {
      try {
        setLoading(true);
        setError('');

        if (!patientId) {
          setError('Unable to load prescriptions. Missing patient profile.');
          setPrescriptions([]);
          return;
        }

        const data = await getPrescriptions(patientId);

        if (mounted) {
          setPrescriptions(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load prescriptions.');
          setPrescriptions([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPrescriptions();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const filteredPrescriptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return prescriptions.filter((prescription) => {
      const matchesStatus =
        statusFilter === 'ALL' || prescription.status === statusFilter;
      const matchesMedication =
        !query || prescription.medication?.toLowerCase().includes(query);

      return matchesStatus && matchesMedication;
    });
  }, [prescriptions, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      
        <h2 className="text-2xl font-bold text-black">Prescriptions</h2>
        <p className="text-sm text-slate-600">
          Active medications and prescription history from your care team.
        </p>
      

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
         
           <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatusFilter(filter.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  statusFilter === filter.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-xl border bg-white py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Pill size={36} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            No Prescriptions Found
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-600">
            No prescriptions match your current status filter or medication search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <Pill className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {prescription.medication}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {prescription.dosage} — {prescription.frequency}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                    prescription.status
                  )}`}
                >
                  {prescription.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <InfoRow icon={Clock} label="Duration" value={prescription.duration} />
                <InfoRow
                  icon={User}
                  label="Prescribed By"
                  value={prescription.prescribedBy}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Prescribed Date"
                  value={prescription.prescribedDate}
                />
                <InfoRow icon={Pill} label="Prescription ID" value={prescription.id} />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Instructions</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {prescription.instructions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-slate-400" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {value || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionsPage;
