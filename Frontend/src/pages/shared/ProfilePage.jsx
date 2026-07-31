import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { patientApi } from '../../api/patient.api';
import ErrorAlert from '../../components/shared/ErrorAlert';
import { PageHeader } from '../../components/shared/PageHeader';

function normalizeProfile(profile) {
  return {
    firstName: profile?.firstName || profile?.first_name || profile?.full_name || '',
    lastName: profile?.lastName || profile?.last_name || '',
    email: profile?.email || profile?.emailAddress || '',
    phoneNumber:
      profile?.phoneNumber || profile?.phone || profile?.phone_number || '',
    dateOfBirth:
      profile?.dateOfBirth || profile?.date_of_birth || '',
    gender: profile?.gender || '',
    bloodType: profile?.bloodType || profile?.blood_type || ''
  };
}

export function ProfilePage() {
  const { user, patientId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodType: ''
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!patientId) {
        if (mounted) {
          setError('Missing patient identity.');
          setLoading(false);
        }
        return;
      }

      try {
        setError('');
        setLoading(true);

        const profileData = await patientApi.getProfile(patientId);

        if (mounted) {
          setForm(normalizeProfile(profileData));
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load profile.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!patientId) {
      setError('Missing patient identity.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await patientApi.updateProfile(patientId, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodType: form.bloodType
      });
      setSuccess('Profile saved successfully.');
    } catch (saveError) {
      setError(saveError?.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border bg-white py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="View and update your patient profile."
        icon={User}
        badge="Patient"
      />

      {error && <ErrorAlert message={error} />}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="First Name" value={form.firstName} onChange={handleChange('firstName')} />
          <InputField label="Last Name" value={form.lastName} onChange={handleChange('lastName')} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField type="email" label="Email" value={form.email} onChange={handleChange('email')} />
          <InputField label="Phone Number" value={form.phoneNumber} onChange={handleChange('phoneNumber')} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InputField type="date" label="Date of Birth" value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} />
          <InputField label="Gender" value={form.gender} onChange={handleChange('gender')} />
          <InputField label="Blood Type" value={form.bloodType} onChange={handleChange('bloodType')} />
        </div>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export default ProfilePage;