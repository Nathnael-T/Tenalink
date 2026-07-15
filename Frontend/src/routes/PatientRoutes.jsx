import { Routes, Route, Navigate } from 'react-router-dom';
import { HospitalsPage } from '../pages/patient/HospitalsPage';
import { PatientDashboardPage } from '../pages/patient/PatientDashboardPage';
import { AppointmentsPage } from '../pages/patient/AppointmentsPage';
import { ProfilePage } from '../pages/shared/ProfilePage';
import { DoctorsPage } from '../pages/patient/DoctorsPage';
import { BookAppointmentPage } from '../pages/patient/BookAppointmentPage';
import { MedicalHistoryLayout } from '../pages/patient/MedicalHistoryLayout';
import { PatientTimelinePage } from '../pages/patient/PatientTimelinePage';
import LabsPage from '../pages/patient/history/LabsPage';
import DocumentsPage from '../pages/patient/history/DocumentsPage';
import HistoryPrescriptionsPage from '../pages/patient/history/PrescriptionsPage';

export function PatientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/patient/dashboard" replace />} />
      <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
      <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
      <Route path="/patient/appointments" element={<AppointmentsPage />} />
      <Route path="/patient/profile" element={<ProfilePage />} />
      <Route path="/patient/hospitals" element={<HospitalsPage />} />
      <Route path="/patient/doctors" element={<DoctorsPage />} />
      <Route path="/patient/book-appointment" element={<BookAppointmentPage />} />

      <Route path="/patient/history/*" element={<MedicalHistoryLayout />}>
        <Route index element={<Navigate to="timeline" replace />} />
        <Route path="timeline" element={<PatientTimelinePage />} />
        <Route path="prescriptions" element={<HistoryPrescriptionsPage />} />
        <Route path="labs" element={<LabsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="*" element={<Navigate to="timeline" replace />} />
      </Route> 
    </Routes>
  );
}

