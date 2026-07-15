import { Routes, Route, Navigate } from 'react-router-dom';

import { SuperAdminDashboardPage } from '../pages/super-admin/SuperAdminDashboardPage';
import { SuperAdminHospitalsPage } from '../pages/super-admin/SuperAdminHospitalsPage';
import { SuperAdminAuditLogsPage } from '../pages/super-admin/SuperAdminAuditLogsPage';
import { SuperAdminSystemConfigPage } from '../pages/super-admin/SuperAdminSystemConfigPage';
import { SuperAdminHospitalAdminsPage } from '../pages/super-admin/SuperAdminHospitalAdminsPage';

export function SuperAdminRoutes() {
  return (
    <Routes>
      {/* Default /super-admin -> dashboard */}
      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />

      <Route
        path="dashboard"
        element={<SuperAdminDashboardPage />}
      />

      <Route
        path="hospitals"
        element={<SuperAdminHospitalsPage />}
      />

      <Route
        path="hospital-admins"
        element={<SuperAdminHospitalAdminsPage />}
      />

      <Route
        path="audit-logs"
        element={<SuperAdminAuditLogsPage />}
      />

      <Route
        path="platform"
        element={<SuperAdminSystemConfigPage />}
      />

      {/* fallback */}
      <Route
        path="*"
        element={<Navigate to="dashboard" replace />}
      />
    </Routes>
  );
}