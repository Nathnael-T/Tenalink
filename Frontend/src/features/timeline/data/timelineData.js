import { ClipboardPlus, FileText, FlaskConical, Pill, Stethoscope } from 'lucide-react';
export const timelineTypeMeta = {
  'Visit Created': {
    icon: ClipboardPlus,
    tone: 'bg-blue-50 text-blue-700 ring-blue-100'
  },
  'Diagnosis Added': {
    icon: Stethoscope,
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  },
  'Prescription Issued': {
    icon: Pill,
    tone: 'bg-violet-50 text-violet-700 ring-violet-100'
  },
  'Lab Result Uploaded': {
    icon: FlaskConical,
    tone: 'bg-amber-50 text-amber-700 ring-amber-100'
  },
  'Doctor Note Added': {
    icon: FileText,
    tone: 'bg-slate-100 text-slate-700 ring-slate-200'
  }
};
export const timelineFilterOptions = ['Visit Created', 'Diagnosis Added', 'Prescription Issued', 'Lab Result Uploaded', 'Doctor Note Added'];
export const patientTimelineEvents = [{
  id: 'evt-2026-05-28-visit',
  type: 'Visit Created',
  occurredAt: '2026-05-28T09:15:00+03:00',
  title: 'Emergency outpatient visit opened',
  facility: 'Tikur Anbessa Specialized Hospital',
  clinician: 'Dr. Sara Mekonnen',
  summary: 'Patient presented with shortness of breath and elevated blood pressure.',
  details: ['Triage priority: urgent', 'Vitals captured at intake', 'Follow-up required within 14 days'],
  metadata: [{
    label: 'Priority',
    value: 'Urgent'
  }, {
    label: 'Arrival Mode',
    value: 'Emergency outpatient'
  }, {
    label: 'Disposition',
    value: 'Cardiology follow-up within 14 days'
  }],
  notes: ['Initial triage completed with elevated blood pressure and shortness of breath.', 'Patient remains under observation for cardiology review and medication reconciliation.'],
  tags: ['Emergency', 'Cardiology', 'Outpatient'],
  referenceId: 'VIS-260528-0915'
}, {
  id: 'evt-2026-05-28-diagnosis',
  type: 'Diagnosis Added',
  occurredAt: '2026-05-28T10:05:00+03:00',
  title: 'Hypertension exacerbation documented',
  facility: 'Tikur Anbessa Specialized Hospital',
  clinician: 'Dr. Sara Mekonnen',
  summary: 'Clinical diagnosis added after examination and review of prior history.',
  details: ['Primary diagnosis: hypertension exacerbation', 'No acute cardiac event suspected'],
  metadata: [{
    label: 'Diagnosis',
    value: 'Hypertension exacerbation'
  }, {
    label: 'Severity',
    value: 'Moderate'
  }, {
    label: 'Review Status',
    value: 'Confirmed after chart review'
  }],
  notes: ['No acute cardiac event suspected; chronic hypertension trend was reassessed.', 'Medication adherence and home monitoring plan discussed with the patient.'],
  tags: ['Diagnosis', 'Hypertension'],
  referenceId: 'DX-260528-1005'
}, {
  id: 'evt-2026-05-28-prescription',
  type: 'Prescription Issued',
  occurredAt: '2026-05-28T10:25:00+03:00',
  title: 'Amlodipine prescription issued',
  facility: 'Tikur Anbessa Specialized Hospital',
  clinician: 'Dr. Sara Mekonnen',
  summary: 'Medication plan updated with calcium channel blocker therapy.',
  details: ['Amlodipine 5mg once daily', 'Review blood pressure log after two weeks'],
  metadata: [{
    label: 'Medication',
    value: 'Amlodipine 5 mg'
  }, {
    label: 'Schedule',
    value: 'Once daily'
  }, {
    label: 'Monitoring',
    value: 'Blood pressure review in 2 weeks'
  }],
  notes: ['Prescription issued after confirming no known allergy to calcium channel blockers.', 'Patient advised to continue hydration and home BP readings.'],
  tags: ['Medication', 'Blood Pressure'],
  referenceId: 'RX-260528-1025'
}, {
  id: 'evt-2026-04-17-lab',
  type: 'Lab Result Uploaded',
  occurredAt: '2026-04-17T14:40:00+03:00',
  title: 'Complete blood count uploaded',
  facility: 'Nordic Medical Centre',
  clinician: 'Laboratory Services',
  summary: 'CBC result uploaded to the patient record by the hospital laboratory.',
  details: ['Hemoglobin within expected range', 'White blood cell count normal'],
  metadata: [{
    label: 'Lab Panel',
    value: 'CBC'
  }, {
    label: 'Source',
    value: 'Nordic Medical Centre Laboratory'
  }, {
    label: 'Status',
    value: 'Uploaded and reviewed'
  }],
  notes: ['CBC values are within expected range and support continued chronic care review.', 'No additional follow-up diagnostics are flagged from this upload.'],
  tags: ['Lab', 'CBC'],
  referenceId: 'LAB-260417-1440'
}, {
  id: 'evt-2026-03-03-note',
  type: 'Doctor Note Added',
  occurredAt: '2026-03-03T16:10:00+03:00',
  title: 'Follow-up note added',
  facility: 'Landmark General Hospital',
  clinician: 'Dr. Alemayehu Worku',
  summary: 'Doctor note added after routine chronic care follow-up.',
  details: ['Patient reports improved adherence', 'Lifestyle counseling reinforced'],
  metadata: [{
    label: 'Note Type',
    value: 'Chronic care follow-up'
  }, {
    label: 'Care Focus',
    value: 'Lifestyle and medication adherence'
  }, {
    label: 'Priority',
    value: 'Routine'
  }],
  notes: ['Patient reports improved medication adherence and increased comfort with home monitoring.', 'Continue routine lifestyle counseling and review blood pressure logs next visit.'],
  tags: ['Follow-up', 'Chronic Care'],
  referenceId: 'NOTE-260303-1610'
}, {
  id: 'evt-2026-01-12-visit',
  type: 'Visit Created',
  occurredAt: '2026-01-12T11:30:00+03:00',
  title: 'Primary care visit created',
  facility: 'Landmark General Hospital',
  clinician: 'Dr. Alemayehu Worku',
  summary: 'Routine primary care appointment added to longitudinal medical history.',
  details: ['Preventive screening reviewed', 'Medication list reconciled'],
  metadata: [{
    label: 'Visit Type',
    value: 'Primary care'
  }, {
    label: 'Screening',
    value: 'Preventive review completed'
  }, {
    label: 'Record Status',
    value: 'Added to longitudinal history'
  }],
  notes: ['Medication list was reconciled during the consultation.', 'Routine prevention and follow-up plan remains active in the chart.'],
  tags: ['Primary Care', 'Routine'],
  referenceId: 'VIS-260112-1130'
}];
