  import { Routes, Route, Navigate } from 'react-router-dom';

  import { DoctorDashboardPage } from '../pages/doctor/DoctorDashboardPage';
  import { DoctorPatientsPage } from '../pages/doctor/DoctorPatientsPage';
  import { DoctorPatientSummaryPage } from '../pages/doctor/DoctorPatientSummaryPage';
  import { DoctorPatientTimelinePage } from '../pages/doctor/DoctorPatientTimelinePage';
  import { AddMedicalEventPage } from '../pages/doctor/AddMedicalEventPage';
  import { DoctorAppointmentsPage } from '../pages/doctor/DoctorAppointmentsPage';
  import { CreatePrescriptionPage } from '../pages/doctor/CreatePrescriptionPage';
  import { DoctorPrescriptionsPage } from '../pages/doctor/DoctorPrescriptionsPage';

  export function DoctorRoutes() {
    return (
      <Routes>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<DoctorDashboardPage />}
        />

        <Route
          path="patients"
          element={<DoctorPatientsPage />}
        />
  
        <Route
          path="patients/:patientId"
          element={<DoctorPatientSummaryPage />}
        />

        <Route
          path="patients/:patientId/timeline"
          element={<DoctorPatientTimelinePage />}
        />

        <Route
          path="patients/:patientId/add-event"
          element={<AddMedicalEventPage />}
        />

        <Route
          path="patients/:patientId/prescribe"
          element={<CreatePrescriptionPage />}
        />

        <Route
          path="appointments"
          element={<DoctorAppointmentsPage />}
        />

        <Route
          path="prescriptions"
          element={<DoctorPrescriptionsPage />}
        />

        <Route
          path="*"
          element={<Navigate to="dashboard" replace />}
        />
      </Routes>
    );
  }

  export default DoctorRoutes;