export function Logo({
  size = 40,
  className = '',
  variant = 'light'
}) {
  const colors = variant === 'dark' ? {
    main: '#2563eb',
    center: '#1d4ed8',
    inner: '#eff6ff'
  } : {
    main: '#3b82f6',
    center: '#2563eb',
    inner: '#eff6ff'
  };
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}><rect x="18" y="8" width="12" height="32" fill={colors.main} rx="2" /><rect x="8" y="18" width="32" height="12" fill={colors.main} rx="2" /><circle cx="24" cy="24" r="6" fill={colors.center} /><circle cx="24" cy="24" r="3" fill={colors.inner} /></svg>;
}
