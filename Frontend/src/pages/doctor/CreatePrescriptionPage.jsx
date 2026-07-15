import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { createPrescription } from '../../api/prescriptions.api';

export function CreatePrescriptionPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { doctorId } = useAuth();

  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      setSubmitError('Missing patient ID.');
      return;
    }

    if (!doctorId) {
      setSubmitError('Missing doctor identity. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await createPrescription({
        patientId,
        doctorId,
        medication,
        dosage,
        prescribedAt: new Date().toISOString(),
      });

      setSuccess(true);

      setTimeout(() => {
        navigate(`/doctor/patients/${patientId}`);
      }, 1200);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to issue prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Create Prescription
        </h1>

        <p className="mt-2 text-slate-600">
          Issue a prescription for patient {patientId}.
        </p>
      </div>

      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">{submitError}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-800">
            Prescription issued successfully.
          </p>

          <p className="mt-1 text-sm text-green-700">
            Returning to patient summary...
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Medication
          </label>

          <input
            required
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Dosage
          </label>

          <input
            required
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Reason
          </label>

          <input
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Duration
          </label>

          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Instructions
          </label>

          <textarea
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting
            ? 'Issuing Prescription...'
            : 'Issue Prescription'}
        </button>
      </form>
    </div>
  );
}

export default CreatePrescriptionPage;