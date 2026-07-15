import { patientTimelineEvents } from '../timeline/data/timelineData';
export const patientHealthSnapshot = {
  welcome: 'Welcome back, Selam',
  status: 'Stable, follow-up recommended',
  activeConditions: ['Hypertension', 'Shortness of breath follow-up'],
  lastUpdated: 'Updated 2 hours ago'
};
export const patientCurrentPrescriptions = [{
  name: 'Amlodipine 5 mg',
  schedule: 'Once daily',
  note: 'Continue blood pressure monitoring at home.'
}, {
  name: 'Salbutamol inhaler',
  schedule: 'As needed',
  note: 'Use for symptom flare and review inhaler technique.'
}];
export const patientUpcomingAppointments = [{
  title: 'Cardiology review',
  when: '2026-06-12 · 10:30 AM',
  location: 'Black Lion Hospital',
  status: 'Confirmed'
}, {
  title: 'Medication adherence check-in',
  when: '2026-06-19 · 2:00 PM',
  location: 'Primary Care Clinic',
  status: 'Pending'
}];
export const patientLastMedicalEvent = patientTimelineEvents[1];
export const patientRecentMedicalActivity = patientTimelineEvents.slice(0, 4);
