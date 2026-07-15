export const recentPatients = [{
  id: 'PT-1042',
  name: 'Selam Bekele',
  activeProblem: 'Hypertension exacerbation follow-up',
  lastEncounter: '2026-05-28 · Emergency outpatient review',
  summaryRoute: '/doctor/patients/PT-1042'
}, {
  id: 'PT-1087',
  name: 'Abel Tadesse',
  activeProblem: 'Chronic heart disease review',
  lastEncounter: '2026-05-24 · Cardiology follow-up',
  summaryRoute: '/doctor/patients/PT-1087'
}, {
  id: 'PT-1099',
  name: 'Mekdes Ali',
  activeProblem: 'Asthma monitoring',
  lastEncounter: '2026-05-21 · Respiratory check-in',
  summaryRoute: '/doctor/patients/PT-1099'
}];
export const recentClinicalActivity = [{
  id: 'act-1',
  patientId: 'PT-1042',
  type: 'Diagnosis Added',
  title: 'Hypertension exacerbation documented',
  summary: 'Care review completed after emergency consultation.',
  timestamp: 'Today, 09:15 AM',
  timelineRoute: '/doctor/patients/PT-1042/timeline'
}, {
  id: 'act-2',
  patientId: 'PT-1087',
  type: 'Lab Result Uploaded',
  title: 'CBC uploaded to chart',
  summary: 'Laboratory result reviewed for current care plan.',
  timestamp: 'Yesterday, 02:40 PM',
  timelineRoute: '/doctor/patients/PT-1087/timeline'
}, {
  id: 'act-3',
  patientId: 'PT-1099',
  type: 'Prescription Issued',
  title: 'Amlodipine prescription updated',
  summary: 'Medication plan refreshed following the latest review.',
  timestamp: 'Yesterday, 10:25 AM',
  timelineRoute: '/doctor/patients/PT-1099/timeline'
}];
export const clinicalTasks = [{
  id: 'task-1',
  title: 'Pending Follow-Up',
  detail: 'Confirm blood pressure log review for Selam Bekele.',
  tone: 'warning',
  summaryRoute: '/doctor/patients/PT-1042'
}, {
  id: 'task-2',
  title: 'Review Labs',
  detail: 'Check CBC results and note any follow-up actions.',
  tone: 'info',
  summaryRoute: '/doctor/patients/PT-1087'
}, {
  id: 'task-3',
  title: 'Medication Review',
  detail: 'Verify current medications and adherence plan.',
  tone: 'success',
  summaryRoute: '/doctor/patients/PT-1099'
}];
