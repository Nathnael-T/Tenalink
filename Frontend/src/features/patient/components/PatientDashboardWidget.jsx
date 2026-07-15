import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
export function PatientDashboardWidget({
  title,
  description,
  children
}) {
  return <Card className="h-full shadow-sm "><CardHeader><CardTitle>{title}</CardTitle>{description ? <p className="text-sm text-slate-500">{description}</p> : null}</CardHeader><CardContent>{children}</CardContent></Card>;
}
