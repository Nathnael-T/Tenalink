import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  ClipboardList,
  FileClock,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  User,
  Users,
  X
} from 'lucide-react';

import { Logo } from '../../shared/Logo';
import { useAuth } from '../../../app/providers/AuthContext';
import { ROLES } from '../../../constants/roles';

const navItemsByRole = {
  [ROLES.DOCTOR]: [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Patients', path: '/doctor/patients', icon: Users }
  ],
  [ROLES.PATIENT]: [
    { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Medical History', path: '/patient/history', icon: ClipboardList },
    { label: 'Profile', path: '/patient/profile', icon: User }
  ],
  [ROLES.HOSPITAL_ADMIN]: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Patients', path: '/admin/patients', icon: Users },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileClock },
    { label: 'System Settings', path: '/admin/settings', icon: ClipboardList }
  ],
  [ROLES.SUPER_ADMIN]: [
    { label: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
    { label: 'Hospitals', path: '/super-admin/hospitals', icon: Building2 },
    { label: 'Hospital Admins', path: '/super-admin/hospital-admins', icon: Users },
    { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: FileClock },
    { label: 'Platform Management', path: '/super-admin/platform', icon: ClipboardList }
  ]
};

export function RoleSidebar({
  role,
  open,
  onClose
}) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const navItems = navItemsByRole[role] || [];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl flex flex-col transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >

        {/* header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <Logo size={34} variant="dark" />
            <div>
              <p className="text-sm font-bold">TenaLink</p>
              <p className="text-xs text-slate-500">
                Workspace
              </p>
            </div>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}

        
        </nav>

        {/* logout */}
        <div className="border-t border-slate-200 p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>
    </>
  );
}