import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { RoleSidebar } from './navigation/RoleSidebar';
import { TopNav } from './navigation/TopNav';
import { ROLES } from '../../constants/roles';

const getRoleFromPath = (pathname) => {
  if (pathname.startsWith('/doctor')) return ROLES.DOCTOR;
  if (pathname.startsWith('/admin')) return ROLES.HOSPITAL_ADMIN;
  if (pathname.startsWith('/super-admin')) return ROLES.SUPER_ADMIN;
  return ROLES.PATIENT;
};

export function Layout() {
  const { pathname } = useLocation();
  const role = getRoleFromPath(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      
      {/* LEFT SIDEBAR */}
      <RoleSidebar
        role={role}
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="min-h-screen lg:pl-72">
        <TopNav role={role} onMenuClick={openSidebar} />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}