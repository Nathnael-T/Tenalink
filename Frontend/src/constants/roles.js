export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export function getDashboardRoute(role) {
  switch (role) {
    case ROLES.DOCTOR:
      return '/doctor/dashboard';
    case ROLES.HOSPITAL_ADMIN:
      return '/admin/dashboard';
    case ROLES.SUPER_ADMIN:
      return '/super-admin/dashboard';
    case ROLES.PATIENT:
    default:
      return '/patient/dashboard';
  }
}
