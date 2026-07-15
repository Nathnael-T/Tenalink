import { Routes, Route, Navigate } from 'react-router-dom';

import AuditLogsPage from '../pages/admin/AuditLogsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminDoctorsPage } from '../pages/admin/AdminDoctorsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminPatientsPage } from '../pages/admin/AdminPatientsPage';
import { AdminAppointmentsPage } from '../pages/admin/AdminAppointmentsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { HospitalsPage } from '../pages/shared/HospitalsPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />

      <Route
        path="dashboard"
        element={<AdminDashboardPage />}
      />

      <Route
        path="hospitals"
        element={<HospitalsPage />}
      />

      <Route
        path="doctors"
        element={<AdminDoctorsPage />}
      />

      <Route
        path="patients"
        element={<AdminPatientsPage />}
      />

      <Route
        path="appointments"
        element={<AdminAppointmentsPage />}
      />

      <Route
        path="settings"
        element={<AdminSettingsPage />}
      />

      <Route
        path="users"
        element={<AdminUsersPage />}
      />

      <Route
        path="audit-logs"
        element={<AuditLogsPage />}
      />

      <Route
        path="*"
        element={<Navigate to="dashboard" replace />}
      />
    </Routes>
  );
}